'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MagicManAnimationProps {
  isSpeaking: boolean;
}

// Frame paths
const MOUTH_CLOSED_FRAMES = [
  '/MouthClosedAnimationFrames/ChatGPT Image May 31, 2025, 02_03_43 PM.png',
  '/MouthClosedAnimationFrames/ChatGPT Image May 31, 2025, 02_03_48 PM.png',
];

const MOUTH_OPEN_FRAMES = [
  '/MouthOpenAnimationFrames/ChatGPT Image May 31, 2025, 02_03_50 PM.png',
  '/MouthOpenAnimationFrames/ChatGPT Image May 31, 2025, 02_03_53 PM.png',
  '/MouthOpenAnimationFrames/ChatGPT Image May 31, 2025, 02_03_55 PM.png',
  '/MouthOpenAnimationFrames/ChatGPT Image May 31, 2025, 02_04_01 PM.png',
];

export default function MagicManAnimation({ isSpeaking }: MagicManAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [mouthOpenFrame, setMouthOpenFrame] = useState(0);
  
  // Idle animation (mouth closed)
  useEffect(() => {
    if (!isSpeaking) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % MOUTH_CLOSED_FRAMES.length);
      }, 800); // Slower for idle breathing effect
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);
  
  // Speaking animation (mouth open)
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setMouthOpenFrame((prev) => (prev + 1) % MOUTH_OPEN_FRAMES.length);
      }, 150); // Faster for talking animation
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);
  
  const currentImage = isSpeaking 
    ? MOUTH_OPEN_FRAMES[mouthOpenFrame]
    : MOUTH_CLOSED_FRAMES[currentFrame];
  
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Glow effect behind the character */}
      <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full animate-pulse"></div>
      
      {/* Character image */}
      <div className="relative z-10 w-full h-full">
        <Image
          src={currentImage}
          alt="Magic Man"
          fill
          className="object-contain pixelated"
          priority
          unoptimized // To preserve pixel art quality
        />
      </div>
      
      {/* Speech indicator */}
      {isSpeaking && (
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}