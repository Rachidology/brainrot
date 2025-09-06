
import React, { useState, useEffect } from 'react';

interface GoalSetterProps {
  currentGoal: number;
  onSetGoal: (goal: number) => void;
  disabled: boolean;
}

export const GoalSetter: React.FC<GoalSetterProps> = ({ currentGoal, onSetGoal, disabled }) => {
  const [goal, setGoal] = useState<string>(currentGoal.toString());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  const handleSave = () => {
    const newGoal = parseInt(goal, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      onSetGoal(newGoal);
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white transition-colors text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        {isOpen ? 'Cancel' : 'Change Daily Goal'}
      </button>
      {isOpen && !disabled && (
        <div className="mt-4 flex items-center gap-2 p-2 bg-gray-900 border border-gray-700 rounded-lg">
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded-md border-gray-600 focus:ring-green-500 focus:border-green-500"
            min="1"
            placeholder="Minutes"
          />
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            Set
          </button>
        </div>
      )}
    </div>
  );
};
