import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected }) => {
  const [loading, setLoading] = useState(true);
  const [hasKey, setHasKey] = useState(false);

  const checkKey = async () => {
    try {
      // Use type assertion to avoid conflicts with global types
      const aistudio = (window as any).aistudio;
      if (aistudio && aistudio.hasSelectedApiKey) {
        const selected = await aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      }
    } catch (e) {
      console.error("Error checking API key state", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkKey();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio && aistudio.openSelectKey) {
        // Assume success after opening dialog as per instructions to avoid race conditions
        await aistudio.openSelectKey();
        setHasKey(true);
        onKeySelected();
    }
  };

  if (loading) return null; // Or a spinner
  if (hasKey) return null; // Don't show if we have a key

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4">
      <div className="bg-chef-900 border border-chef-800 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center">
        <div className="w-16 h-16 bg-accent-500/20 text-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
           </svg>
        </div>
        <h2 className="text-2xl font-serif font-bold text-white mb-3">Unlock Pro Features</h2>
        <p className="text-chef-100 mb-6 leading-relaxed">
          GourmetLens AI uses the high-definition <b>Gemini 3 Pro</b> model for generating restaurant-quality imagery. This requires a paid Google Cloud API key.
        </p>
        
        <Button onClick={handleSelectKey} className="w-full mb-4">
          Select Paid API Key
        </Button>
        
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-chef-500 hover:text-accent-500 underline decoration-dotted"
        >
          Read Billing Documentation
        </a>
      </div>
    </div>
  );
};