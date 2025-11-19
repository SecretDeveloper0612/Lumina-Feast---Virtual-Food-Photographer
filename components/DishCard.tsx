import React from 'react';
import { Dish } from '../types';
import { Loader2, ImagePlus, Edit } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onGenerate: (id: string) => void;
  onEdit: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onGenerate, onEdit }) => {
  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col group hover:border-slate-600 transition-all">
      
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
        {dish.imageUrl ? (
          <>
            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
               <button
                onClick={() => onEdit(dish)}
                className="px-4 py-2 bg-white/10 hover:bg-amber-500 hover:text-white backdrop-blur-md rounded-lg text-white font-medium flex items-center gap-2 transition-all border border-white/20"
              >
                <Edit size={16} />
                Magic Edit
              </button>
              <button
                onClick={() => onGenerate(dish.id)}
                className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-all border border-white/20"
                title="Regenerate"
              >
                <ImagePlus size={16} />
              </button>
            </div>
          </>
        ) : dish.isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-500 gap-3">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-xs font-medium text-amber-500/80 tracking-wider animate-pulse">DEVELOPING PHOTO</span>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2">
            <ImagePlus size={32} />
            <span className="text-sm font-medium">Ready to shoot</span>
          </div>
        )}
      </div>

      {/* Text Area */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{dish.name}</h3>
        <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">{dish.description}</p>
        
        {!dish.imageUrl && !dish.isGenerating && (
          <button
            onClick={() => onGenerate(dish.id)}
            className="w-full py-2 bg-slate-700 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ImagePlus size={16} />
            Generate Photo
          </button>
        )}
        
        {dish.imageUrl && (
          <div className="flex gap-2 mt-auto">
            <button 
              onClick={() => onEdit(dish)}
              className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 text-amber-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={14} />
              Tweak
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
