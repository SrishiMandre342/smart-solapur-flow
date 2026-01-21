import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrafficBadgeProps {
  level: 'low' | 'moderate' | 'high';
  size?: 'sm' | 'md' | 'lg';
}

const levelStyles = {
  low: 'bg-success text-success-foreground',
  moderate: 'bg-warning text-warning-foreground',
  high: 'bg-destructive text-destructive-foreground',
};

const levelLabels = {
  low: 'Low',
  moderate: 'Moderate',
  high: 'High',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

const TrafficBadge: React.FC<TrafficBadgeProps> = ({ level, size = 'md' }) => {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold',
        levelStyles[level],
        sizeStyles[size]
      )}
    >
      {levelLabels[level]}
    </motion.span>
  );
};

export default TrafficBadge;
