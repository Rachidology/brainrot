
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrainVisual } from './components/BrainVisual';
import { HealthBar } from './components/HealthBar';
import { TimerDisplay } from './components/TimerDisplay';
import { GoalSetter } from './components/GoalSetter';
import { generateFocusTip } from './services/geminiService';
import { BrainState } from './types';

const getTodayStorageKey = () => {
  const today = new Date();
  return `focusData_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const SESSION_START_TIME_KEY = 'sessionStartTime';

const App: React.FC = () => {
  const [dailyGoalInMinutes, setDailyGoalInMinutes] = useState<number>(() => {
    const savedGoal = localStorage.getItem('dailyGoalInMinutes');
    return savedGoal ? parseInt(savedGoal, 10) : 60;
  });

  const [totalFocusSecondsToday, setTotalFocusSecondsToday] = useState<number>(() => {
    const savedFocus = localStorage.getItem(getTodayStorageKey());
    return savedFocus ? parseInt(savedFocus, 10) : 0;
  });

  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [motivationalTip, setMotivationalTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState<boolean>(false);

  useEffect(() => {
    const savedStartTime = localStorage.getItem(SESSION_START_TIME_KEY);
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedSeconds > 0) {
        setSessionSeconds(elapsedSeconds);
        setIsTimerRunning(true);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyGoalInMinutes', dailyGoalInMinutes.toString());
  }, [dailyGoalInMinutes]);

  useEffect(() => {
    localStorage.setItem(getTodayStorageKey(), totalFocusSecondsToday.toString());
  }, [totalFocusSecondsToday]);
  
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning) {
      // FIX: The `setInterval` function was returning a NodeJS.Timeout object, which is not assignable to a number.
      // Explicitly using `window.setInterval` ensures we use the browser's implementation which returns a number.
      interval = window.setInterval(() => {
        setSessionSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    return () => {
      // FIX: Use `window.clearInterval` to match the `window.setInterval` call.
      if (interval) window.clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleStartStop = useCallback(() => {
    setIsTimerRunning(prevIsRunning => {
      const isStarting = !prevIsRunning;
      if (isStarting) {
        setSessionSeconds(0); 
        localStorage.setItem(SESSION_START_TIME_KEY, Date.now().toString());
      } else {
        const startTimeStr = localStorage.getItem(SESSION_START_TIME_KEY);
        if (startTimeStr) {
          const startTime = parseInt(startTimeStr, 10);
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          setTotalFocusSecondsToday(currentTotal => currentTotal + elapsedSeconds);
          localStorage.removeItem(SESSION_START_TIME_KEY);
        }
        setSessionSeconds(0);
      }
      return isStarting;
    });
  }, []);

  const handleSetGoal = (newGoal: number) => {
    if (newGoal > 0) {
      setDailyGoalInMinutes(newGoal);
    }
  };

  const handleGetTip = async () => {
    setIsLoadingTip(true);
    setMotivationalTip(null);
    try {
      const tip = await generateFocusTip();
      setMotivationalTip(tip);
    } catch (error) {
      console.error("Failed to get tip:", error);
      setMotivationalTip("Could not fetch a tip. Stay focused, you've got this!");
    } finally {
      setIsLoadingTip(false);
    }
  };

  const brainHealthPercent = useMemo(() => {
    const goalInSeconds = dailyGoalInMinutes * 60;
    if (goalInSeconds === 0) return 100;
    const health = Math.min(((totalFocusSecondsToday + (isTimerRunning ? sessionSeconds : 0)) / goalInSeconds) * 100, 100);
    return health;
  }, [totalFocusSecondsToday, dailyGoalInMinutes, isTimerRunning, sessionSeconds]);

  const brainState = useMemo((): BrainState => {
    if (brainHealthPercent >= 80) return BrainState.Healthy;
    if (brainHealthPercent >= 40) return BrainState.Average;
    return BrainState.Rotten;
  }, [brainHealthPercent]);
  
  const statusText = useMemo(() => {
    switch(brainState) {
        case BrainState.Healthy: return "OPTIMAL PERFORMANCE";
        case BrainState.Average: return "STAYING SHARP";
        case BrainState.Rotten: return "BRAINROT ALERT";
        default: return "CHECKING STATUS";
    }
  }, [brainState]);

  const statusColor = useMemo(() => {
    switch(brainState) {
        case BrainState.Healthy: return "text-green-400";
        case BrainState.Average: return "text-yellow-400";
        case BrainState.Rotten: return "text-red-500";
        default: return "text-gray-400";
    }
  }, [brainState]);

  return (
    <div className="bg-black min-h-screen text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-green-500 selection:text-black">
      <main className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-6">
        <header className="w-full">
          <h1 className={`text-2xl font-bold tracking-widest uppercase ${statusColor}`}>{statusText}</h1>
          <p className="text-gray-400 text-sm">Today's Focus Time Goal: {dailyGoalInMinutes} min</p>
        </header>

        <BrainVisual state={brainState} />
        
        <div className="w-full space-y-2">
            <HealthBar health={brainHealthPercent} />
            <p className="text-sm font-medium text-green-300">{brainHealthPercent.toFixed(0)}% HEALTHY</p>
        </div>

        <TimerDisplay seconds={sessionSeconds} />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <button
                onClick={handleStartStop}
                className="w-full sm:w-auto text-lg bg-green-500 text-black font-bold py-4 px-10 rounded-full uppercase tracking-wider transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-500/50 shadow-[0_0_20px_rgba(52,211,153,0.5)]"
            >
                {isTimerRunning ? 'Stop Session' : 'Start Focus'}
            </button>
        </div>

        <GoalSetter currentGoal={dailyGoalInMinutes} onSetGoal={handleSetGoal} disabled={isTimerRunning} />

        <div className="w-full pt-4">
            <button 
              onClick={handleGetTip}
              disabled={isLoadingTip}
              className="w-full text-green-400 border border-green-700 bg-green-900/20 py-3 px-6 rounded-lg hover:bg-green-900/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingTip ? 'Thinking...' : 'Get a Focus Tip'}
            </button>
            {motivationalTip && (
              <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg text-center">
                <p className="text-gray-300 italic">"{motivationalTip}"</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;