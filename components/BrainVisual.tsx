
import React from 'react';
import { BrainState } from '../types';

interface BrainVisualProps {
    state: BrainState;
}

const BaseBrain: React.FC<{ children: React.ReactNode; glowColor: string }> = ({ children, glowColor }) => (
    <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
        <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${glowColor} transition-all duration-1000`}></div>
        <svg viewBox="0 0 100 100" className="relative w-full h-full z-10 transition-all duration-1000">
            {children}
        </svg>
    </div>
);

const HealthyBrain: React.FC = () => (
    <BaseBrain glowColor="bg-green-500">
        <defs>
            <filter id="healthy-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path d="M50 10 C 25 10, 10 30, 10 50 C 10 70, 25 90, 50 90 C 75 90, 90 70, 90 50 C 90 30, 75 10, 50 10 Z" fill="none" stroke="#34d399" strokeWidth="3" filter="url(#healthy-glow)" />
        <path d="M50 10 V 90" stroke="#34d399" strokeWidth="1.5" />
        <path d="M30 30 Q 40 20, 50 30 T 70 30" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
        <path d="M30 50 Q 40 40, 50 50 T 70 50" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
        <path d="M30 70 Q 40 60, 50 70 T 70 70" fill="none" stroke="#6ee7b7" strokeWidth="1.5" />
    </BaseBrain>
);

const AverageBrain: React.FC = () => (
    <BaseBrain glowColor="bg-yellow-500">
        <path d="M50 10 C 25 10, 10 30, 10 50 C 10 70, 25 90, 50 90 C 75 90, 90 70, 90 50 C 90 30, 75 10, 50 10 Z" fill="none" stroke="#facc15" strokeWidth="2.5" />
        <path d="M50 10 V 90" stroke="#facc15" strokeWidth="1" />
        <path d="M35 40 Q 45 45, 50 40 T 65 40" fill="none" stroke="#fde047" strokeWidth="1" />
        <path d="M35 60 Q 45 65, 50 60 T 65 60" fill="none" stroke="#fde047" strokeWidth="1" />
    </BaseBrain>
);

const RottenBrain: React.FC = () => (
    <BaseBrain glowColor="bg-red-600">
        <path d="M50 12 C 28 12, 12 33, 15 50 C 18 70, 25 88, 50 88 C 72 88, 88 67, 85 50 C 82 30, 75 12, 50 12 Z" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M50 12 V 88" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M40 30 L 60 50 M 60 30 L 40 50" stroke="#f87171" strokeWidth="1" />
        <path d="M40 60 L 60 80 M 60 60 L 40 80" stroke="#f87171" strokeWidth="1" />
    </BaseBrain>
);


export const BrainVisual: React.FC<BrainVisualProps> = ({ state }) => {
    const renderBrain = () => {
        switch (state) {
            case BrainState.Healthy:
                return <HealthyBrain />;
            case BrainState.Average:
                return <AverageBrain />;
            case BrainState.Rotten:
                return <RottenBrain />;
            default:
                return <AverageBrain />;
        }
    };

    return <div className="my-4">{renderBrain()}</div>;
};
