import React from 'react';
import { useHeaderScramble } from '../hooks/useHeaderScramble';

interface ScrambledHeaderProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
  className?: string;
  enabled?: boolean;
}

export const ScrambledHeader: React.FC<ScrambledHeaderProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  enabled = true,
}) => {
  const scrambled = useHeaderScramble(text, 2400, enabled);
  return <Component className={className}>{scrambled}</Component>;
};
