import React, { useState, useCallback } from 'react';
import { parseMenuText, generateDishImage } from './services/geminiService';
import { Dish, AestheticType } from './types';
import { AESTHETICS } from './constants';
import { StyleSelector } from './components/StyleSelector';
import { MenuInput } from './components/MenuInput';
import { DishCard } from './components/DishCard';
import { ImageEditor } from './components/ImageEditor';
import { Camera, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<AestheticType>('RUSTIC');
  const [isParsing, setIsParsing] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const handleParseMenu = useCallback(async (text: string) => {
    setIsParsing(true);
    try {
      const parsedItems = await parseMenuText(text);
      const newDishes: Dish[] = parsedItems.map((item, index) => ({
        id: `dish-${Date.now()}-${index}`,
        name: item.name,
        description: item.description,
        isGenerating: false,
      }));
      setDishes(newDishes);
    } catch (error) {
      console.error("Failed to parse menu", error);
      alert("Could not understand the menu. Please try again with clearer text.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async (dishId: string) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish) return;

    // Update state to loading
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isGenerating: true } : d));

    try {
      const aesthetic = AESTHETICS.find(s => s.id === selectedStyle);
      const imageUrl = await generateDishImage(
        dish.name, 
        dish.description, 
        aesthetic?.promptSuffix || ''
      );
      
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, imageUrl, isGenerating: false } : d));
    } catch (error) {
      console.error("Generation failed", error);
      // Reset loading state
      setDishes(prev => prev.map(d => d.id === dishId ? { ...d, isGenerating: false } : d));
      alert(`Failed to generate image for ${dish.name}`);
    }
  }, [dishes, selectedStyle]);

  const handleUpdateImage = useCallback((id: string, newImage: string) => {
    setDishes(prev => prev.map(d => d.id === id ? { ...d, imageUrl: newImage } : d));
  }, []);

  const handleGenerateAll = () => {
    // Trigger generation for all dishes without images
    dishes.forEach(dish => {
      if (!dish.imageUrl && !dish.isGenerating) {
        handleGenerateImage(dish.id);
      }
    });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Hero / Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-orange-900/20">
              <Camera className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Lumina Feast</h1>
              <p className="text-xs text-slate-400 font-medium tracking-wider uppercase">Virtual Food Studio</p>
            </div>
          </div>
          
          {dishes.length > 0 && (
             <button
               onClick={() => setDishes([])}
               className="text-sm text-slate-400 hover:text-red-400 transition-colors px-4 py-2"
             >
               Clear All
             </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Setup Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Input */}
          <div className="lg:col-span-1 space-y-8">
             <MenuInput onParse={handleParseMenu} isLoading={isParsing} />
             
             {dishes.length > 0 && (
               <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 className="text-slate-300 font-semibold mb-2 flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-500"/> 
                    Stats
                  </h3>
                  <div className="flex justify-between text-sm text-slate-400 mb-4">
                    <span>Dishes Found:</span>
                    <span className="text-white font-mono">{dishes.length}</span>
                  </div>
                  <button 
                    onClick={handleGenerateAll}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Generate All Missing Photos
                  </button>
               </div>
             )}
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-4">Photography Style</h2>
              <StyleSelector selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
            </div>

            {dishes.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 text-slate-600">
                   <Camera size={32} />
                 </div>
                 <h3 className="text-xl font-medium text-slate-300 mb-2">Your studio is empty</h3>
                 <p className="text-slate-500 max-w-sm">
                   Input your menu items on the left to start planning your virtual photoshoot.
                 </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dishes.map(dish => (
                  <DishCard 
                    key={dish.id} 
                    dish={dish} 
                    onGenerate={handleGenerateImage}
                    onEdit={setEditingDish}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {editingDish && (
        <ImageEditor 
          dish={editingDish} 
          onClose={() => setEditingDish(null)}
          onUpdateImage={handleUpdateImage}
        />
      )}
    </div>
  );
};

export default App;
