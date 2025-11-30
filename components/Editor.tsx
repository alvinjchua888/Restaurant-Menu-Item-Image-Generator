import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { Button } from './Button';
import { editFoodPhoto } from '../services/geminiService';

interface EditorProps {
  image: GeneratedImage;
  onClose: () => void;
  onUpdate: (newImage: GeneratedImage) => void;
}

export const Editor: React.FC<EditorProps> = ({ image, onClose, onUpdate }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(image.url);
  const [history, setHistory] = useState<string[]>([image.url]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    
    setIsEditing(true);
    try {
      const newImageUrl = await editFoodPhoto(currentUrl, editPrompt);
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newImageUrl);
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentUrl(newImageUrl);
      
      // Notify parent to save to gallery permanently if desired
      onUpdate({ ...image, url: newImageUrl, id: Date.now().toString() });
      
      setEditPrompt('');
    } catch (error) {
      alert("Failed to edit image. Please try again.");
    } finally {
      setIsEditing(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-chef-900 w-full max-w-5xl h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-chef-800">
        
        {/* Preview Area */}
        <div className="flex-1 bg-black relative flex items-center justify-center p-4">
          <img 
            src={currentUrl} 
            alt="Editing Preview" 
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl" 
          />
          <div className="absolute top-4 left-4">
             <Button variant="secondary" onClick={onClose} className="bg-black/50 hover:bg-black/80 backdrop-blur">
                ← Back
             </Button>
          </div>
          {historyIndex > 0 && (
            <div className="absolute top-4 right-4">
              <Button variant="secondary" onClick={handleUndo} className="bg-black/50 hover:bg-black/80 backdrop-blur text-sm">
                Undo Change
              </Button>
            </div>
          )}
        </div>

        {/* Controls Area */}
        <div className="w-full md:w-96 bg-chef-900 p-6 flex flex-col border-l border-chef-800">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Magic Editor</h2>
          <p className="text-chef-500 text-sm mb-6">Powered by Gemini 2.5 Flash</p>

          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-sm font-medium text-chef-500 mb-2">What would you like to change?</label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. Add a rustic napkin, make the lighting warmer, remove the fork, add steam rising..."
                className="w-full bg-chef-800 text-white rounded-lg border border-chef-800 p-3 focus:ring-2 focus:ring-accent-500 outline-none h-32"
              />
            </div>

            <div className="bg-chef-800 rounded-lg p-4">
              <h3 className="text-xs font-bold text-chef-500 uppercase tracking-wider mb-3">Suggested Edits</h3>
              <div className="flex flex-wrap gap-2">
                {['Add steam', 'Vintage filter', 'Remove clutter', 'Brighter lighting', 'Add herbs'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setEditPrompt(suggestion)}
                    className="text-xs bg-chef-900 hover:bg-chef-500 text-chef-100 px-3 py-1.5 rounded-full border border-chef-500 transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-chef-800">
            <Button 
              onClick={handleEdit} 
              isLoading={isEditing} 
              disabled={!editPrompt.trim()} 
              className="w-full"
            >
              Generate Edits
            </Button>
            <p className="text-xs text-center text-chef-500 mt-3">
              Edits may take a few seconds to process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
