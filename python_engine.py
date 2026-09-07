#!/usr/bin/env python3
"""
Python Image Effects Engine for Guinness Agony OS
Architect: Yasir Abed Rabbu
Pure Python 3.10 standard library implementation with zero external dependencies (no pip required)
Supports: Halftone, CMYK Pop-Art, 8-Bit CRT, Noir, Cyberpunk, Thermal FLIR, Blueprint, ASCII, Sobel Neon, Risograph, Crosshatch, Dither
"""

import sys
import json
import base64
import math
import struct
import time
import random

def create_bmp(width, height, rgb_pixels):
    """
    Creates a standard 24-bit uncompressed Windows BMP file in pure Python.
    rgb_pixels: bytearray or bytes of length width * height * 3 (BGR order for BMP)
    """
    row_bytes = width * 3
    padding = (4 - (row_bytes % 4)) % 4
    image_size = (row_bytes + padding) * height
    file_size = 54 + image_size
    
    # BMP Header (14 bytes)
    header = struct.pack('<2sIHHI', b'BM', file_size, 0, 0, 54)
    # DIB Header (BITMAPINFOHEADER - 40 bytes)
    dib = struct.pack('<IIIHHIIIIII', 40, width, height, 1, 24, 0, image_size, 2835, 2835, 0, 0)
    
    # Pixels in BMP are stored bottom-up
    rows = []
    pad_bytes = b'\x00' * padding
    for y in range(height - 1, -1, -1):
        start = y * width * 3
        row = rgb_pixels[start:start + width * 3]
        rows.append(row + pad_bytes)
        
    return header + dib + b''.join(rows)

def process_effect(data):
    start_time = time.time()
    effect = data.get('effect', 'halftone-dots')
    width = int(data.get('width', 200))
    height = int(data.get('height', 200))
    params = data.get('params', {})
    
    dot_pitch = max(4, int(params.get('dotPitch', 10)))
    contrast = float(params.get('contrast', 1.2))
    brightness = float(params.get('brightness', 1.0))
    grain_intensity = float(params.get('grainIntensity', 20))
    angle_deg = float(params.get('angle', 45))
    palette_name = params.get('palette', 'default')
    invert = bool(params.get('invert', False))
    vignette = float(params.get('vignette', 0.0))
    
    # Read input raw RGBA buffer (base64)
    raw_b64 = data.get('pixels_rgba_b64', '')
    if raw_b64:
        raw_rgba = base64.b64decode(raw_b64)
    else:
        # Fallback generated test gradient pattern
        raw_rgba = bytearray(width * height * 4)
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                raw_rgba[idx] = int((x / width) * 255)
                raw_rgba[idx+1] = int((y / height) * 255)
                raw_rgba[idx+2] = int(((x + y) / (width + height)) * 255)
                raw_rgba[idx+3] = 255

    # Output 24-bit BGR buffer for BMP output
    out_bgr = bytearray(width * height * 3)
    
    # Helper for luminance with contrast and brightness
    def get_lum(r, g, b):
        r_adj = r * brightness
        g_adj = g * brightness
        b_adj = b * brightness
        if contrast != 1.0:
            r_adj = ((r_adj / 255.0 - 0.5) * contrast + 0.5) * 255.0
            g_adj = ((g_adj / 255.0 - 0.5) * contrast + 0.5) * 255.0
            b_adj = ((b_adj / 255.0 - 0.5) * contrast + 0.5) * 255.0
        r_adj = max(0.0, min(255.0, r_adj))
        g_adj = max(0.0, min(255.0, g_adj))
        b_adj = max(0.0, min(255.0, b_adj))
        lum = 0.299 * r_adj + 0.587 * g_adj + 0.114 * b_adj
        if invert:
            lum = 255.0 - lum
        return lum, int(r_adj), int(g_adj), int(b_adj)

    # 1. Newspaper Halftone Dots
    if effect == 'halftone-dots':
        step = dot_pitch
        rad_angle = math.radians(angle_deg)
        cos_a = math.cos(rad_angle)
        sin_a = math.sin(rad_angle)
        
        # Initialize canvas background with dark vintage gray/charcoal
        for i in range(0, len(out_bgr), 3):
            out_bgr[i] = 16
            out_bgr[i+1] = 16
            out_bgr[i+2] = 16
            
        for y_center in range(step // 2, height, step):
            for x_center in range(step // 2, width, step):
                # Sample block average
                total_lum = 0.0
                samples = 0
                half_s = step // 2
                for sy in range(max(0, y_center - half_s), min(height, y_center + half_s)):
                    for sx in range(max(0, x_center - half_s), min(width, x_center + half_s)):
                        p_idx = (sy * width + sx) * 4
                        lum, _, _, _ = get_lum(raw_rgba[p_idx], raw_rgba[p_idx+1], raw_rgba[p_idx+2])
                        total_lum += lum
                        samples += 1
                avg_lum = total_lum / max(1, samples)
                
                # Inverted dot radius: darker areas get bigger dots
                norm_lum = avg_lum / 255.0
                radius = (1.0 - norm_lum) * (step / 1.7)
                r_sq = radius * radius
                
                if radius > 0.6:
                    for dy in range(-int(radius + 1), int(radius + 2)):
                        py = y_center + dy
                        if py < 0 or py >= height: continue
                        for dx in range(-int(radius + 1), int(radius + 2)):
                            px = x_center + dx
                            if px < 0 or px >= width: continue
                            if (dx * dx + dy * dy) <= r_sq:
                                out_idx = (py * width + px) * 3
                                if palette_name == 'gameboy':
                                    out_bgr[out_idx] = 20
                                    out_bgr[out_idx+1] = 172
                                    out_bgr[out_idx+2] = 139
                                elif palette_name == 'amber':
                                    out_bgr[out_idx] = 0
                                    out_bgr[out_idx+1] = 176
                                    out_bgr[out_idx+2] = 255
                                elif palette_name == 'matrix':
                                    out_bgr[out_idx] = 30
                                    out_bgr[out_idx+1] = 255
                                    out_bgr[out_idx+2] = 20
                                else:
                                    out_bgr[out_idx] = 245
                                    out_bgr[out_idx+1] = 245
                                    out_bgr[out_idx+2] = 245

    # 2. Pop-Art CMYK Split
    elif effect == 'comic-cmyk':
        step = max(5, dot_pitch)
        for i in range(0, len(out_bgr), 3):
            out_bgr[i] = 250
            out_bgr[i+1] = 250
            out_bgr[i+2] = 250
            
        for y_center in range(step // 2, height, step):
            for x_center in range(step // 2, width, step):
                idx = (y_center * width + x_center) * 4
                _, r, g, b = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                c = (255 - r) / 255.0
                m = (255 - g) / 255.0
                y_col = (255 - b) / 255.0
                
                rad_c = c * (step / 2.2)
                rad_m = m * (step / 2.2)
                rad_y = y_col * (step / 2.2)
                
                # Draw cyan dot
                for dy in range(-int(rad_c + 1), int(rad_c + 2)):
                    py = y_center + dy
                    if py < 0 or py >= height: continue
                    for dx in range(-int(rad_c + 1), int(rad_c + 2)):
                        px = x_center + dx - 1
                        if px < 0 or px >= width: continue
                        if (dx*dx + dy*dy) <= (rad_c*rad_c):
                            oi = (py * width + px) * 3
                            out_bgr[oi] = 240
                            out_bgr[oi+1] = 180
                            out_bgr[oi+2] = 0
                            
                # Draw magenta dot
                for dy in range(-int(rad_m + 1), int(rad_m + 2)):
                    py = y_center + dy
                    if py < 0 or py >= height: continue
                    for dx in range(-int(rad_m + 1), int(rad_m + 2)):
                        px = x_center + dx + 1
                        if px < 0 or px >= width: continue
                        if (dx*dx + dy*dy) <= (rad_m*rad_m):
                            oi = (py * width + px) * 3
                            out_bgr[oi] = 180
                            out_bgr[oi+1] = 20
                            out_bgr[oi+2] = 240

    # 3. 8-Bit Retro CRT
    elif effect == 'retro-8bit':
        psize = max(2, dot_pitch // 2)
        for y in range(0, height, psize):
            for x in range(0, width, psize):
                idx = (y * width + x) * 4
                _, r, g, b = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                # 8-level quantization
                r = (r // 32) * 32
                g = (g // 32) * 32
                b = (b // 32) * 32
                for dy in range(psize):
                    py = y + dy
                    if py >= height: break
                    # Scanline dimming
                    scanline_dim = 0.65 if (py % 3 == 0) else 1.0
                    for dx in range(psize):
                        px = x + dx
                        if px >= width: break
                        oi = (py * width + px) * 3
                        out_bgr[oi] = int(b * scanline_dim)
                        out_bgr[oi+1] = int(g * scanline_dim)
                        out_bgr[oi+2] = int(r * scanline_dim)

    # 4. 35mm Film Noir
    elif effect == 'cinematic-noir':
        for y in range(height):
            # Letterbox anamorphic bars (8% top & bottom)
            is_bar = (y < height * 0.08) or (y > height * 0.92)
            for x in range(width):
                oi = (y * width + x) * 3
                if is_bar:
                    out_bgr[oi] = 0
                    out_bgr[oi+1] = 0
                    out_bgr[oi+2] = 0
                    continue
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                # Add pseudo-random film grain
                noise = (random.random() - 0.5) * grain_intensity * 2.0
                final_val = max(0, min(255, int(lum + noise)))
                # Silver-halide subtle cool tone
                out_bgr[oi] = min(255, int(final_val * 1.05))
                out_bgr[oi+1] = final_val
                out_bgr[oi+2] = int(final_val * 0.95)

    # 5. Cyberpunk Matrix Glitch
    elif effect == 'cyber-glitch':
        chroma_offset = max(2, dot_pitch // 3)
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                idx_r = (y * width + max(0, x - chroma_offset)) * 4
                idx_b = (y * width + min(width - 1, x + chroma_offset)) * 4
                
                _, r, _, _ = get_lum(raw_rgba[idx_r], raw_rgba[idx_r+1], raw_rgba[idx_r+2])
                _, _, g, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                _, _, _, b = get_lum(raw_rgba[idx_b], raw_rgba[idx_b+1], raw_rgba[idx_b+2])
                
                # Scanline
                dim = 0.8 if (y % 4 == 0) else 1.0
                oi = (y * width + x) * 3
                out_bgr[oi] = min(255, int(b * 1.2 * dim))
                out_bgr[oi+1] = int(g * dim)
                out_bgr[oi+2] = min(255, int(r * 1.1 * dim))

    # 6. Thermal FLIR Night Vision Heatmap
    elif effect == 'thermal-flir':
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                t = lum / 255.0
                # Ironbow Heatmap gradient
                if t < 0.2:
                    # Black to dark purple/blue
                    f = t / 0.2
                    r, g, b = int(30 * f), 0, int(120 * f)
                elif t < 0.4:
                    # Purple/blue to cyan/teal
                    f = (t - 0.2) / 0.2
                    r, g, b = int(30 + 10 * f), int(180 * f), int(120 + 135 * f)
                elif t < 0.65:
                    # Teal to bright yellow/orange
                    f = (t - 0.4) / 0.25
                    r, g, b = int(40 + 215 * f), int(180 + 40 * f), int(255 * (1 - f))
                elif t < 0.85:
                    # Yellow to bright red
                    f = (t - 0.65) / 0.2
                    r, g, b = 255, int(220 * (1 - f)), 0
                else:
                    # Red to white hot
                    f = (t - 0.85) / 0.15
                    r, g, b = 255, int(255 * f), int(255 * f)
                oi = (y * width + x) * 3
                out_bgr[oi] = b
                out_bgr[oi+1] = g
                out_bgr[oi+2] = r

    # 7. Blueprint / Cyanotype Draft
    elif effect == 'blueprint-cyan':
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                grid = (x % 20 == 0) or (y % 20 == 0)
                grid_bonus = 35 if grid else 0
                val = lum / 255.0
                # Prussian Blue background with white/cyan ink
                b = min(255, int(90 + val * 165 + grid_bonus))
                g = min(255, int(40 + val * 215 + grid_bonus))
                r = min(255, int(15 + val * 240 + grid_bonus))
                oi = (y * width + x) * 3
                out_bgr[oi] = b
                out_bgr[oi+1] = g
                out_bgr[oi+2] = r

    # 8. ASCII Art Matrix Green
    elif effect == 'ascii-matrix':
        block = max(6, dot_pitch)
        for y in range(0, height, block):
            for x in range(0, width, block):
                tot = 0
                for by in range(y, min(height, y + block)):
                    for bx in range(x, min(width, x + block)):
                        idx = (by * width + bx) * 4
                        l, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                        tot += l
                avg = tot / (block * block)
                for by in range(y, min(height, y + block)):
                    for bx in range(x, min(width, x + block)):
                        oi = (by * width + bx) * 3
                        # Simulated phosphor pixel char brightness
                        char_mask = 1 if ((bx + by) % 2 == 0 and avg > 80) or avg > 180 else 0.2
                        out_bgr[oi] = 0
                        out_bgr[oi+1] = int(min(255, avg * 1.15 * char_mask))
                        out_bgr[oi+2] = int(min(255, avg * 0.15 * char_mask))

    # 9. Sobel Edge Neon Contour Glow
    elif effect == 'sobel-neon':
        for y in range(1, height - 1):
            for x in range(1, width - 1):
                # Sobel operator
                gx = 0.0
                gy = 0.0
                for dy, row_w in [(-1, -1), (0, 0), (1, 1)]:
                    for dx, col_w in [(-1, -1), (0, 0), (1, 1)]:
                        idx = ((y + dy) * width + (x + dx)) * 4
                        l, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                        weight_x = [-1, 0, 1][dx + 1] * (2 if dy == 0 else 1)
                        weight_y = [-1, 0, 1][dy + 1] * (2 if dx == 0 else 1)
                        gx += l * weight_x
                        gy += l * weight_y
                edge = math.sqrt(gx * gx + gy * gy) * (contrast * 0.7)
                edge = min(255, int(edge))
                oi = (y * width + x) * 3
                # Electric Neon Cyan/Magenta edges
                out_bgr[oi] = min(255, int(edge * 1.2)) # Blue
                out_bgr[oi+1] = int(edge * 0.9)         # Green
                out_bgr[oi+2] = int(edge * 0.3)         # Red

    # 10. Risograph Fluorescent Duotone
    elif effect == 'risograph-duo':
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                norm = lum / 255.0
                # Ink 1: Fluorescent Pink (255, 30, 120), Ink 2: Cornflower Navy (15, 30, 100)
                r = int(norm * 255 + (1 - norm) * 20)
                g = int(norm * 40 + (1 - norm) * 40)
                b = int(norm * 140 + (1 - norm) * 120)
                oi = (y * width + x) * 3
                out_bgr[oi] = b
                out_bgr[oi+1] = g
                out_bgr[oi+2] = r

    # 11. Vintage Crosshatch Engraving
    elif effect == 'crosshatch-engraving':
        step = max(4, dot_pitch)
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                oi = (y * width + x) * 3
                # Engraving hatching logic
                ink = False
                if lum < 210 and ((x + y) % step == 0):
                    ink = True
                if lum < 150 and ((x - y) % step == 0):
                    ink = True
                if lum < 90 and (x % step == 0):
                    ink = True
                if lum < 45 and (y % step == 0):
                    ink = True
                if ink:
                    out_bgr[oi] = 30
                    out_bgr[oi+1] = 30
                    out_bgr[oi+2] = 40
                else:
                    out_bgr[oi] = 230
                    out_bgr[oi+1] = 240
                    out_bgr[oi+2] = 245

    # 12. Bayer 8x8 Ordered Dithering
    else: # 'bayer-dither'
        bayer8 = [
            [ 0, 32,  8, 40,  2, 34, 10, 42],
            [48, 16, 56, 24, 50, 18, 58, 26],
            [12, 44,  4, 36, 14, 46,  6, 38],
            [60, 28, 52, 20, 62, 30, 54, 22],
            [ 3, 35, 11, 43,  1, 33,  9, 41],
            [51, 19, 59, 27, 49, 17, 57, 25],
            [15, 47,  7, 39, 13, 45,  5, 37],
            [63, 31, 55, 23, 61, 29, 53, 21]
        ]
        for y in range(height):
            for x in range(width):
                idx = (y * width + x) * 4
                lum, _, _, _ = get_lum(raw_rgba[idx], raw_rgba[idx+1], raw_rgba[idx+2])
                threshold = (bayer8[y % 8][x % 8] / 64.0) * 255.0
                pixel_val = 255 if lum > threshold else 0
                oi = (y * width + x) * 3
                out_bgr[oi] = pixel_val
                out_bgr[oi+1] = pixel_val
                out_bgr[oi+2] = pixel_val

    # Apply Vignette if enabled
    if vignette > 0:
        cx = width / 2.0
        cy = height / 2.0
        max_dist = math.sqrt(cx * cx + cy * cy)
        for y in range(height):
            for x in range(width):
                dx = x - cx
                dy = y - cy
                dist = math.sqrt(dx * dx + dy * dy) / max_dist
                v_factor = 1.0 - math.pow(dist, 2) * vignette
                v_factor = max(0.0, min(1.0, v_factor))
                oi = (y * width + x) * 3
                out_bgr[oi] = int(out_bgr[oi] * v_factor)
                out_bgr[oi+1] = int(out_bgr[oi+1] * v_factor)
                out_bgr[oi+2] = int(out_bgr[oi+2] * v_factor)

    # Encode to BMP and then base64
    bmp_bytes = create_bmp(width, height, out_bgr)
    bmp_b64 = base64.b64encode(bmp_bytes).decode('ascii')
    
    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    return {
        'status': 'success',
        'effect': effect,
        'width': width,
        'height': height,
        'execution_time_ms': elapsed_ms,
        'pixels_processed': width * height,
        'bmp_data_url': f"data:image/bmp;base64,{bmp_b64}",
        'python_version': f"Python {sys.version.split()[0]}",
        'algorithm': f"Yasir Abed Rabbu Mathematical Kernel ({effect})"
    }

if __name__ == '__main__':
    try:
        input_json = sys.stdin.read()
        if not input_json.strip():
            # Test run
            result = process_effect({'effect': 'halftone-dots', 'width': 100, 'height': 100})
            print(json.dumps(result))
        else:
            payload = json.loads(input_json)
            res = process_effect(payload)
            print(json.dumps(res))
    except Exception as e:
        err_res = {'status': 'error', 'message': str(e)}
        print(json.dumps(err_res))
