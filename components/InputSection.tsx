import React, { useState } from 'react';
import { GenerationRequest, ImageResolution, PhotoStyle } from '../types';
import { Button } from './Button';

interface InputSectionProps {
  onGenerate: (request: GenerationRequest) => void;
  isGenerating: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onGenerate, isGenerating }) => {
  const [dishDescription, setDishDescription] = useState('');
  const [style, setStyle] = useState<PhotoStyle>('Rustic/Dark');
  const [resolution, setResolution] = useState<ImageResolution>('1K');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishDescription.trim()) return;
    onGenerate({ dishDescription, style, resolution });
  };

  return (
    <div className="bg-chef-900 border border-chef-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>

      <h2 className="text-2xl font-serif font-bold mb-6 text-white flex items-center gap-2">
        <span className="text-accent-500">1.</span> Describe Your Dish
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-chef-500 mb-2">Menu Description</label>
          <textarea
            value={dishDescription}
            onChange={(e) => setDishDescription(e.target.value)}
            placeholder="e.g. A juicy gourmet cheeseburger with dripping cheddar, caramelized onions, artisan brioche bun, fresh arugula, served with truffle fries..."
            className="w-full bg-chef-800 text-white rounded-lg border border-chef-800 p-4 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none min-h-[120px] transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-chef-500 mb-2">Aesthetic Style</label>
            <div className="space-y-2">
              {(['Rustic/Dark', 'Bright/Modern', 'Social Media'] as PhotoStyle[]).map((s) => (
                <div 
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group ${
                    style === s 
                      ? 'bg-accent-500/10 border-accent-500 text-white' 
                      : 'bg-chef-800 border-transparent text-chef-500 hover:border-chef-500'
                  }`}
                >
                  <span>{s}</span>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${style === s ? 'border-accent-500' : 'border-chef-500'}`}>
                    {style === s && <div className="w-2 h-2 rounded-full bg-accent-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-chef-500 mb-2">Resolution (Pro Feature)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-2 rounded-lg text-sm font-medium transition-all ${
                    resolution === res
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-chef-800 text-chef-500 hover:text-white'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
            <p className="text-xs text-chef-500 mt-2 italic">
              * Higher resolutions use Gemini 3 Pro (Paid Key Required)
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-chef-800">
          <Button 
            type="submit" 
            isLoading={isGenerating} 
            className="w-full text-lg h-12"
            disabled={!dishDescription.trim()}
          >
            {isGenerating ? 'Cooking up magic...' : 'Generate Photography'}
          </Button>
        </div>
      </form>
    </div>
  );
};
