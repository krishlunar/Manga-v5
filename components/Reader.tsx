import React, { useState, useEffect, useCallback } from 'react';
import { MangaItem } from '../types';

interface ReaderProps {
  manga: MangaItem;
  onClose: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ manga, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-advance logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev < manga.pages.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 3000); // 3 seconds per page
    }
    return () => clearInterval(interval);
  }, [isPlaying, manga.pages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setCurrentIndex((prev) => Math.min(prev + 1, manga.pages.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        if (document.fullscreenElement) {
           document.exitFullscreen();
        } else {
           onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [manga.pages.length, onClose]);

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, manga.pages.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black overflow-hidden select-none">
      
      {/* Main Image Canvas */}
      <div 
        className="h-full w-full max-w-4xl bg-contain bg-center bg-no-repeat transition-all duration-300 ease-out"
        style={{ backgroundImage: `url('${manga.pages[currentIndex]}')` }}
        onClick={toggleControls}
      ></div>

      {/* Top Overlay */}
      <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-start transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={onClose}
          className="size-12 flex items-center justify-center rounded-lg bg-reader-dark/40 backdrop-blur-md border border-white/10 hover:bg-reader-dark/60 transition-colors text-white"
        >
          <span className="material-symbols-outlined text-2xl">home</span>
        </button>
        <button 
          onClick={toggleFullScreen}
          className="size-12 flex items-center justify-center rounded-lg bg-reader-dark/40 backdrop-blur-md border border-white/10 hover:bg-reader-dark/60 transition-colors text-white"
        >
          <span className="material-symbols-outlined text-2xl">
            {isFullScreen ? 'close_fullscreen' : 'fullscreen'}
          </span>
        </button>
      </div>

      {/* Bottom Controls */}
      <div className={`fixed bottom-10 left-0 right-0 px-6 flex flex-col items-center gap-6 transition-all duration-300 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        
        {/* Slider */}
        <div className="w-full max-w-xl flex items-center gap-4">
            <span className="text-xs text-white/50 w-8 text-right">{currentIndex + 1}</span>
            <input 
              type="range" 
              min="0" 
              max={manga.pages.length - 1} 
              value={currentIndex} 
              onChange={(e) => setCurrentIndex(Number(e.target.value))}
              className="flex-1 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-white transition-all hover:bg-white/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
            <span className="text-xs text-white/50 w-8">{manga.pages.length}</span>
        </div>

        {/* Main Buttons */}
        <div className="flex items-center gap-4 p-2 rounded-xl bg-reader-dark/60 backdrop-blur-xl border border-white/10 shadow-2xl">
          <button 
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="size-14 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-white text-3xl">chevron_left</span>
          </button>

          {/* Central Action / OCR / Auto-Play */}
          <div className="relative group">
             {/* The "Brain" button from design - mapped to OCR features later, currently just visual or toggles menu */}
             <button className="hidden sm:flex size-14 items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/80 mr-2">
                 <span className="material-symbols-outlined text-3xl">psychology</span>
             </button>

             {/* The Auto-Play Button (Primary Action) */}
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`relative size-16 flex items-center justify-center rounded-lg bg-primary text-white transition-all active:scale-95 border border-primary/50 shadow-[0_0_15px_rgba(75,43,238,0.4)] ${isPlaying ? 'bg-red-500 border-red-500/50 shadow-red-500/40' : ''}`}
            >
                <span className="material-symbols-outlined text-3xl material-symbols-filled">
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </button>
            {isPlaying && (
                <div className="absolute -top-1 -right-1 size-3 bg-green-400 rounded-full border-2 border-[#131022] animate-pulse"></div>
            )}
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIndex === manga.pages.length - 1}
            className="size-14 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-white text-3xl">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Page Info Toast */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-white/30 font-bold pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
         {manga.title} • Page {currentIndex + 1}
      </div>

    </div>
  );
};