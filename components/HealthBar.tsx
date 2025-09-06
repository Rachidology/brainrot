
import React from 'react';

interface HealthBarProps {
  health: number; // 0-100
}

export const HealthBar: React.FC<HealthBarProps> = ({ health }) => {
  const clampedHealth = Math.max(0, Math.min(100, health));
  const healthColor = clampedHealth > 70 ? 'bg-green-500' : clampedHealth > 30 ? 'bg-yellow-500' : 'bg-red-600';

  return (
    <div
      className="w-full bg-gray-800 rounded-full h-4 border-2 border-gray-600 overflow-hidden"
      role="progressbar"
      aria-valuenow={clampedHealth}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Brain health"
    >
      <div
        className={`h-full rounded-full ${healthColor} transition-all duration-1000 ease-out`}
        style={{ width: `${clampedHealth}%` }}
      ></div>
    </div>
  );
};
