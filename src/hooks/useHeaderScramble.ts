import { useState, useEffect } from 'react';

// Similar-looking character substitution map
const CHAR_MAP: Record<string, string[]> = {
  'o': ['0', 'ö', 'ø', 'Q', '()'],
  'O': ['0', 'Ø', '()', '8'],
  'e': ['3', '€', 'ë', 'ê'],
  'E': ['3', '€', '£'],
  'a': ['4', '@', 'ä', '/\\'],
  'A': ['4', '@', '/\\', 'Д'],
  'i': ['1', '!', '|', 'í'],
  'I': ['1', '!', '|', 'l'],
  'l': ['1', '|', 'I'],
  's': ['5', '$', '§', 'z'],
  'S': ['5', '$', '§', '5'],
  't': ['7', '+', '†'],
  'T': ['7', '+', '†'],
  'b': ['8', '6', '|3'],
  'B': ['8', '13', 'ß'],
  'g': ['9', 'q', '&'],
  'G': ['9', '6', 'C'],
  'c': ['(', '<', '¢', '{'],
  'C': ['(', '<', '©', '['],
  'r': ['г', '®', 'r'],
  'R': ['®', 'Я', 'R'],
};

/**
 * Scrambles characters in a string with visually similar characters
 */
export function scrambleHeader(text: string, intensity: number = 0.35): string {
  return text
    .split('')
    .map((char) => {
      if (Math.random() < intensity && CHAR_MAP[char]) {
        const replacements = CHAR_MAP[char];
        return replacements[Math.floor(Math.random() * replacements.length)];
      }
      return char;
    })
    .join('');
}

/**
 * React hook that periodically scrambles letters in text with similar characters
 */
export function useHeaderScramble(
  originalText: string,
  intervalMs: number = 2200,
  enabled: boolean = true
): string {
  const [scrambled, setScrambled] = useState<string>(() =>
    enabled ? scrambleHeader(originalText, 0.35) : originalText
  );

  useEffect(() => {
    if (!enabled) {
      setScrambled(originalText);
      return;
    }

    setScrambled(scrambleHeader(originalText, 0.35));

    const timer = setInterval(() => {
      setScrambled(scrambleHeader(originalText, 0.3 + Math.random() * 0.25));
    }, intervalMs);

    return () => clearInterval(timer);
  }, [originalText, intervalMs, enabled]);

  return scrambled;
}
