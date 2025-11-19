
import React from 'react';
import { ASPECT_RATIOS } from '../constants';
import { AspectRatioType } from '../types';
import { Square, Monitor, RectangleHorizontal, Smartphone } from 'lucide-react';

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatioType;
  onSelect: (ratio: AspectRatioType) => void;
}

const icons = {
  '1:1': Square,
  '4:3': RectangleHorizontal,
  '16:9': Monitor,
  '9:16': Smartphone
};

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelect }) => {
  return (
    <div className="flex gap-3 flex-wrap mb-6">
      {ASPECT_RATIOS.map((ratio) => {
        const Icon = icons[ratio.id as keyof typeof icons] || RectangleHorizontal;
        const isSelected = selectedRatio === ratio.id;
        return (
          <button
            key={ratio.id}
            onClick={() => onSelect(ratio.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
              ${isSelected 
                ? 'bg-slate-700 border-amber-500 text-white shadow-lg shadow-amber-500/10' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300'
              }
            `}
          >
            <Icon size={16} className={isSelected ? 'text-amber-400' : 'text-slate-500'} />
            {ratio.label}
          </button>
        );
      })}
    </div>
  );
};
