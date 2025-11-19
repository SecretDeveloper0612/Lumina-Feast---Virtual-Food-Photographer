
import React, { useRef } from 'react';
import { Dish } from '../types';
import { Loader2, ImagePlus, Edit, Download, Upload } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onGenerate: (id: string) => void;
  onEdit: (dish: Dish) => void;
  onUpload: (id: string, image: string) => void;
  defaultAspectRatio?: string;
}

export const DishCard: React.FC<DishCardProps> = ({ dish, onGenerate, onEdit, onUpload, defaultAspectRatio = '4:3' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Determine aspect ratio class
  // Use the dish's specific ratio if available, otherwise fallback to the default context (App state)
  const ratioToUse = dish.aspectRatio || defaultAspectRatio;
  
  const getAspectRatioClass = (ratio: string) => {
    switch(ratio) {
      case '1:1': return 'aspect-square';
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16]';
      case '4:3': 
      default: return 'aspect-[4/3]';
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.imageUrl) return;

    const link = document.createElement('a');
    link.href = dish.imageUrl;
    // Create a filename based on the dish name
    const filename = `lumina-feast-${dish.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.jpg`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpload(dish.id, base64String);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again if needed
    if (e.target) e.target.value = '';
  };

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col group hover:border-slate-600 transition-all">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />

      {/* Image Area */}
      <div className={`relative ${getAspectRatioClass(ratioToUse)} bg-slate-900 overflow-hidden transition-all duration-500`}>
        {dish.imageUrl ? (
          <>
            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
               <button
                onClick={() => onEdit(dish)}
                className="px-3 py-2 bg-white/10 hover:bg-amber-500 hover:text-white backdrop-blur-md rounded-lg text-white font-medium flex items-center gap-2 transition-all border border-white/20"
                title="Magic Edit with AI"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
              
              <button
                onClick={handleDownload}
                className="p-2 bg-white/10 hover:bg-emerald-600 hover:text-white backdrop-blur-md rounded-lg text-white transition-all border border-white/20"
                title="Download Image"
              >
                <Download size={18} />
              </button>

              <button
                onClick={handleUploadClick}
                className="p-2 bg-white/10 hover:bg-slate-600 hover:text-white backdrop-blur-md rounded-lg text-white transition-all border border-white/20"
                title="Upload Custom Photo"
              >
                <Upload size={18} />
              </button>

              <button
                onClick={() => onGenerate(dish.id)}
                className="p-2 bg-white/10 hover:bg-blue-600 hover:text-white backdrop-blur-md rounded-lg text-white transition-all border border-white/20"
                title="Regenerate"
              >
                <ImagePlus size={18} />
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
          <div className="flex gap-2">
            <button
              onClick={() => onGenerate(dish.id)}
              className="flex-1 py-2 bg-slate-700 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ImagePlus size={16} />
              Generate
            </button>
            <button
              onClick={handleUploadClick}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
              title="Upload your own photo"
            >
              <Upload size={16} />
            </button>
          </div>
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
