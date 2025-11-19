import React from 'react';
import { AESTHETICS } from '../constants';
import { AestheticType } from '../types';
import { Coffee, Sun, Smartphone } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: AestheticType;
  onSelect: (style: AestheticType) => void;
}

const icons = {
  RUSTIC: Coffee,
  MODERN: Sun,
  SOCIAL: Smartphone
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {AESTHETICS.map((aesthetic) => {
        const Icon = icons[aesthetic.id];
        const isSelected = selectedStyle === aesthetic.id;
        return (
          <button
            key={aesthetic.id}
            onClick={() => onSelect(aesthetic.id)}
            className={`
              relative overflow-hidden p-6 rounded-xl border-2 transition-all duration-300 text-left group
              ${isSelected 
                ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
              }
            `}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                <Icon size={24} />
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-amber-100' : 'text-slate-200'}`}>
              {aesthetic.label}
            </h3>
            <p className={`text-sm ${isSelected ? 'text-amber-200/80' : 'text-slate-400'}`}>
              {aesthetic.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};
