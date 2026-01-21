import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PSIIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const getPsiColor = (psi: number): string => {
  if (psi < 40) return 'bg-success text-success-foreground';
  if (psi < 70) return 'bg-warning text-warning-foreground';
  return 'bg-destructive text-destructive-foreground';
};

const getPsiLabel = (psi: number): string => {
  if (psi < 40) return 'Low';
  if (psi < 70) return 'Moderate';
  return 'High';
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const PSIIndicator: React.FC<PSIIndicatorProps> = ({
  value,
  size = 'md',
  showLabel = true,
}) => {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-full font-semibold',
        getPsiColor(value),
        sizeStyles[size]
      )}
    >
      <span>{value}%</span>
      {showLabel && <span className="hidden sm:inline">({getPsiLabel(value)})</span>}
    </motion.span>
  );
};

export default PSIIndicator;
