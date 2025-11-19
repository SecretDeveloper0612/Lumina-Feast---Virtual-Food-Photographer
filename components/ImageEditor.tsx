import React, { useState } from 'react';
import { X, Wand2, Loader2, Save, RefreshCcw } from 'lucide-react';
import { Dish } from '../types';
import { editDishImage } from '../services/geminiService';

interface ImageEditorProps {
  dish: Dish;
  onClose: () => void;
  onUpdateImage: (id: string, newImage: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ dish, onClose, onUpdateImage }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState(dish.imageUrl || '');
  const [originalImage] = useState(dish.imageUrl || ''); // Keep track to revert if needed
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim() || !currentImage) return;

    setIsEditing(true);
    setError(null);
    try {
      const newImage = await editDishImage(currentImage, prompt);
      setCurrentImage(newImage);
      setPrompt(''); // Clear prompt on success
    } catch (err) {
      setError("Failed to edit image. Please try a different instruction.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    onUpdateImage(dish.id, currentImage);
    onClose();
  };

  const handleRevert = () => {
    setCurrentImage(originalImage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-700 shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">Edit Photo: {dish.name}</h3>
            <p className="text-slate-400 text-sm">Use natural language to adjust the image</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col md:flex-row gap-6 h-full">
            
            {/* Image Area */}
            <div className="flex-1 flex items-center justify-center bg-black/40 rounded-xl overflow-hidden relative group min-h-[300px]">
              {currentImage ? (
                <img 
                  src={currentImage} 
                  alt={dish.name} 
                  className="max-w-full max-h-[50vh] object-contain shadow-2xl" 
                />
              ) : (
                <div className="text-slate-500">No Image Available</div>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center flex-col gap-3">
                  <Loader2 className="animate-spin text-amber-500" size={48} />
                  <p className="text-white font-medium animate-pulse">Applying magic...</p>
                </div>
              )}
            </div>

            {/* Controls Area */}
            <div className="w-full md:w-80 flex flex-col gap-4">
              
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                 <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Magic Edit</h4>
                 <div className="relative">
                   <textarea
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                     placeholder='e.g. "Add a vintage filter", "Make it steaming hot", "Remove the spoon"'
                     className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm min-h-[100px] resize-none"
                   />
                   <div className="absolute bottom-3 right-3">
                     <Wand2 size={16} className="text-slate-500" />
                   </div>
                 </div>
                 
                 {error && (
                   <p className="text-red-400 text-xs mt-2">{error}</p>
                 )}

                 <button
                   onClick={handleEdit}
                   disabled={isEditing || !prompt.trim()}
                   className="w-full mt-3 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {isEditing ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                   Generate Edit
                 </button>
              </div>

              <div className="mt-auto flex flex-col gap-2">
                {currentImage !== originalImage && (
                   <button 
                    onClick={handleRevert}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <RefreshCcw size={18} />
                    Revert to Original
                  </button>
                )}
                <button 
                  onClick={handleSave}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
