'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface MagicManAnimationProps {
  isSpeaking: boolean;
  isVisible: boolean;
  onPoofComplete?: () => void;
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

const POOF_FRAMES = [
  '/Poof/poof1.png',
  '/Poof/poof2.png',
];

export default function MagicManAnimation({ isSpeaking, isVisible, onPoofComplete }: MagicManAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [mouthOpenFrame, setMouthOpenFrame] = useState(0);
  const [showPoof, setShowPoof] = useState(false);
  const [poofFrame, setPoofFrame] = useState(0);
  const [showCharacter, setShowCharacter] = useState(false);
  
  // Handle visibility changes with poof animation
  useEffect(() => {
    if (isVisible && !showCharacter) {
      // Show poof animation when appearing
      setShowPoof(true);
      setPoofFrame(0);
      
      // Animate through poof frames
      const poofInterval = setInterval(() => {
        setPoofFrame(prev => {
          if (prev >= POOF_FRAMES.length - 1) {
            clearInterval(poofInterval);
            setShowPoof(false);
            setShowCharacter(true);
            if (onPoofComplete) onPoofComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      
      return () => clearInterval(poofInterval);
    } else if (!isVisible && showCharacter) {
      // Show poof animation when disappearing
      setShowPoof(true);
      setPoofFrame(0);
      setShowCharacter(false);
      
      // Animate through poof frames
      const poofInterval = setInterval(() => {
        setPoofFrame(prev => {
          if (prev >= POOF_FRAMES.length - 1) {
            clearInterval(poofInterval);
            setShowPoof(false);
            if (onPoofComplete) onPoofComplete();
            return prev;
          }
          return prev + 1;
        });
      }, 150);
      
      return () => clearInterval(poofInterval);
    }
  }, [isVisible, showCharacter, onPoofComplete]);
  
  // Idle animation (mouth closed)
  useEffect(() => {
    if (!isSpeaking && showCharacter) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % MOUTH_CLOSED_FRAMES.length);
      }, 800); // Slower for idle breathing effect
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking, showCharacter]);
  
  // Speaking animation (mouth open)
  useEffect(() => {
    if (isSpeaking && showCharacter) {
      const interval = setInterval(() => {
        setMouthOpenFrame((prev) => (prev + 1) % MOUTH_OPEN_FRAMES.length);
      }, 150); // Faster for talking animation
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking, showCharacter]);
  
  const currentImage = showCharacter 
    ? (isSpeaking ? MOUTH_OPEN_FRAMES[mouthOpenFrame] : MOUTH_CLOSED_FRAMES[currentFrame])
    : null;
  
  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Glow effect behind the character */}
      {showCharacter && (
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>
      )}
      
      {/* Poof animation */}
      {showPoof && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <Image
            src={POOF_FRAMES[poofFrame]}
            alt="Poof effect"
            width={320}
            height={320}
            className="pixelated"
            unoptimized
          />
        </div>
      )}
      
      {/* Character image */}
      {showCharacter && currentImage && (
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
      )}
      
      {/* Speech indicator */}
      {isSpeaking && showCharacter && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  );
}