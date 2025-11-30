import React from 'react';
import { GeneratedImage } from '../types';
import { Button } from './Button';

interface GalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, onSelect }) => {
  if (images.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-chef-500 p-12 border-2 border-dashed border-chef-800 rounded-xl">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <p className="text-lg">Your generated masterpieces will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
        <span className="text-accent-500">2.</span> Your Gallery
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative bg-chef-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:-translate-y-1">
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 gap-3">
              <p className="text-white text-xs text-center line-clamp-2 px-2">{img.prompt}</p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => onSelect(img)} 
                  variant="primary" 
                  className="!py-1 !px-4 text-sm"
                >
                  Edit Image
                </Button>
                <a 
                  href={img.url} 
                  download={`gourmet-lens-${img.id}.png`}
                  className="bg-white text-black hover:bg-gray-200 px-4 py-1 rounded-lg text-sm font-medium flex items-center"
                >
                  Save
                </a>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
              {img.resolution}
            </div>
             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
              {img.style}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
