import React, { useState } from 'react';
import { SAMPLE_MENU } from '../constants';
import { ChefHat, Loader2, Play } from 'lucide-react';

interface MenuInputProps {
  onParse: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const MenuInput: React.FC<MenuInputProps> = ({ onParse, isLoading }) => {
  const [text, setText] = useState(SAMPLE_MENU);

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <ChefHat className="text-amber-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Input Menu</h2>
        </div>
        <button 
          onClick={() => setText(SAMPLE_MENU)}
          className="text-xs text-slate-400 hover:text-amber-400 transition-colors underline"
        >
          Reset to Sample
        </button>
      </div>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-48 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all font-mono text-sm mb-4 resize-none"
        placeholder="Paste your menu items here..."
      />

      <button
        onClick={() => onParse(text)}
        disabled={isLoading || !text.trim()}
        className="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Analyze Menu & Plan Shots</span>
          </>
        ) : (
          <>
            <Play size={20} fill="currentColor" />
            <span>Generate Photography Plan</span>
          </>
        )}
      </button>
    </div>
  );
};
