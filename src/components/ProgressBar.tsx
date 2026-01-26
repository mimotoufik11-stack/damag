import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'emerald' | 'amber' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'emerald',
  size = 'md',
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      case 'blue': return 'bg-blue-500';
      default: return 'bg-emerald-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-1.5';
      case 'md': return 'h-2.5';
      case 'lg': return 'h-4';
      default: return 'h-2.5';
    }
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="space-y-1">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-400">{label}</span>}
          {showPercentage && (
            <span className="text-slate-300 font-medium">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColorClasses()} transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
