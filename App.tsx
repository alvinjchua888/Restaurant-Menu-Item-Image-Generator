import React, { useState } from 'react';
import { ApiKeySelector } from './components/ApiKeySelector';
import { InputSection } from './components/InputSection';
import { Gallery } from './components/Gallery';
import { Editor } from './components/Editor';
import { GeneratedImage, GenerationRequest } from './types';
import { generateFoodPhoto } from './services/geminiService';

const App: React.FC = () => {
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async (request: GenerationRequest) => {
    setIsGenerating(true);
    try {
      const imageUrl = await generateFoodPhoto(request);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: request.dishDescription,
        style: request.style,
        resolution: request.resolution,
        createdAt: Date.now()
      };

      setImages(prev => [newImage, ...prev]);
    } catch (error) {
      alert("Something went wrong while generating the image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateImage = (newImage: GeneratedImage) => {
    setImages(prev => [newImage, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-200 font-sans selection:bg-accent-500 selection:text-white">
      <ApiKeySelector onKeySelected={() => setApiKeyReady(true)} />

      <header className="bg-chef-900 border-b border-chef-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-accent-600 to-accent-500 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-serif font-bold text-white tracking-wide">
              Gourmet<span className="text-accent-500">Lens</span> AI
            </h1>
          </div>
          {apiKeyReady && <span className="text-xs font-mono text-green-500 border border-green-500/30 px-2 py-1 rounded">PRO ACCESS ACTIVE</span>}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!apiKeyReady ? (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-lg mx-auto">
             <div className="animate-pulse w-16 h-16 bg-chef-800 rounded-full mb-4"></div>
             <h2 className="text-xl text-chef-500">Waiting for API Access...</h2>
             <p className="text-chef-500 text-sm mt-2">Please select your Google Cloud Project to begin.</p>
           </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Input Section - Sticky on large screens */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="lg:sticky lg:top-24">
                <InputSection onGenerate={handleGenerate} isGenerating={isGenerating} />
                
                <div className="mt-8 bg-chef-900/50 rounded-xl p-6 border border-chef-800/50">
                  <h3 className="font-serif font-bold text-white mb-2">Pro Tips</h3>
                  <ul className="text-sm text-chef-500 space-y-2 list-disc list-inside">
                    <li>Mention specific ingredients (e.g. "heirloom tomatoes").</li>
                    <li>Describe lighting (e.g. "golden hour", "candlelight").</li>
                    <li>Specify plating style (e.g. "minimalist", "family style").</li>
                    <li>Use 2K/4K for print menus.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="w-full lg:w-2/3">
              <Gallery 
                images={images} 
                onSelect={setEditingImage} 
              />
            </div>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {editingImage && (
        <Editor 
          image={editingImage} 
          onClose={() => setEditingImage(null)} 
          onUpdate={handleUpdateImage}
        />
      )}
    </div>
  );
};

export default App;
