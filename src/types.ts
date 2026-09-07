export type PageType = 'home' | 'halftone' | 'viral' | 'shop' | 'support' | 'unsubscribe' | 'records' | 'pinterest';

export interface PopupAd {
  id: string;
  title: string;
  content: string;
  imageAlt?: string;
  top: number;
  left: number;
  zIndex: number;
  type: 'iphone' | 'ram' | 'singles' | 'antivirus' | 'crypto';
}

export interface FrustrationStats {
  clicks: number;
  rageClicks: number;
  attempts: number;
  timeSpentSeconds: number;
  frustrationScore: number;
}
