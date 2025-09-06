
import React from 'react';

interface TimerDisplayProps {
  seconds: number;
}

const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedHours = String(hours).padStart(2, '0');
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(seconds).padStart(2, '0');
  
  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  }
  return `${paddedMinutes}:${paddedSeconds}`;
};

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds }) => {
  return (
    <div className="my-4">
      <p className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tighter text-gray-100">
        {formatTime(seconds)}
      </p>
      <p className="text-sm text-gray-500 uppercase tracking-widest">Focus Session</p>
    </div>
  );
};
