'use client';

import { useState, useEffect, useRef } from 'react';
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
  
  const poofTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const poofIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const prevIsVisible = useRef(isVisible);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (poofTimeoutRef.current) clearTimeout(poofTimeoutRef.current);
      if (poofIntervalRef.current) clearInterval(poofIntervalRef.current);
    };
  }, []);
  
  // Handle visibility changes with poof animation
  useEffect(() => {
    // Clear any existing timeouts
    if (poofTimeoutRef.current) clearTimeout(poofTimeoutRef.current);
    if (poofIntervalRef.current) clearInterval(poofIntervalRef.current);
    
    if (isVisible && !prevIsVisible.current) {
      // Appearing: Show poof then character
      console.log('Magic Man appearing...');
      setShowCharacter(false);
      setShowPoof(true);
      setPoofFrame(0);
      
      let currentPoofFrame = 0;
      poofIntervalRef.current = setInterval(() => {
        currentPoofFrame++;
        setPoofFrame(currentPoofFrame);
        
        if (currentPoofFrame >= POOF_FRAMES.length - 1) {
          if (poofIntervalRef.current) clearInterval(poofIntervalRef.current);
          
          // After poof finishes, show character and hide poof
          poofTimeoutRef.current = setTimeout(() => {
            setShowPoof(false);
            setShowCharacter(true);
            if (onPoofComplete) onPoofComplete();
          }, 300);
        }
      }, 200);
      
    } else if (!isVisible && prevIsVisible.current && showCharacter) {
      // Disappearing: Just hide immediately (no poof when user ends conversation)
      console.log('Magic Man disappearing...');
      setShowCharacter(false);
      setShowPoof(false);
      if (onPoofComplete) onPoofComplete();
    }
    
    prevIsVisible.current = isVisible;
  }, [isVisible, showCharacter, onPoofComplete]);
  
  // Idle animation (mouth closed)
  useEffect(() => {
    if (!isSpeaking && showCharacter) {
      const interval = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % MOUTH_CLOSED_FRAMES.length);
      }, 1200);
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking, showCharacter]);
  
  // Speaking animation (mouth open)
  useEffect(() => {
    if (isSpeaking && showCharacter) {
      const interval = setInterval(() => {
        setMouthOpenFrame((prev) => (prev + 1) % MOUTH_OPEN_FRAMES.length);
      }, 120);
      
      return () => clearInterval(interval);
    }
  }, [isSpeaking, showCharacter]);
  
  const currentImage = showCharacter 
    ? (isSpeaking ? MOUTH_OPEN_FRAMES[mouthOpenFrame] : MOUTH_CLOSED_FRAMES[currentFrame])
    : null;
  
  // Don't render anything if not visible and not showing poof
  if (!isVisible && !showCharacter && !showPoof) {
    return null;
  }
  
  return (
    <div className="relative w-96 h-96 md:w-[480px] md:h-[480px]">
      {/* Enhanced glow effect */}
      {showCharacter && (
        <>
          <div className="absolute inset-0 bg-purple-500/30 blur-[60px] rounded-full animate-pulse"></div>
          <div className="absolute inset-0 bg-pink-500/20 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </>
      )}
      
      {/* Poof animation */}
      {showPoof && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="relative">
            <Image
              src={POOF_FRAMES[Math.min(poofFrame, POOF_FRAMES.length - 1)]}
              alt="Poof effect"
              width={400}
              height={400}
              className="pixelated"
              unoptimized
            />
            {/* Sparkle effect during poof */}
            <div className="absolute inset-0" suppressHydrationWarning={true}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-ping"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Character image */}
      {showCharacter && currentImage && (
        <div className="relative z-10 w-full h-full">
          {/* Character Image - Full Size */}
          <div className="relative w-full h-full">
            <Image
              src={currentImage}
              alt="Magic Man"
              fill
              className="object-contain pixelated drop-shadow-2xl"
              priority
              unoptimized
            />
          </div>
          
          {/* Premium AAA Border Frame - Overlaid on top with more space */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Outer border frame */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/25 via-pink-400/15 to-blue-400/25 p-1 shadow-2xl">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-yellow-300/8 via-transparent to-purple-300/8 animate-pulse"></div>
              <div className="relative rounded-2xl border-2 border-purple-300/40 bg-transparent backdrop-blur-[2px]">
                <div className="w-full h-full rounded-2xl"></div>
                {/* Ultra-subtle glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] via-transparent to-purple-100/[0.03] rounded-2xl"></div>
              </div>
            </div>
            
            {/* Corner accent gems - positioned outside the border */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full shadow-lg animate-pulse border-2 border-yellow-200/50"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-pink-300 to-pink-500 rounded-full shadow-lg animate-pulse border-2 border-pink-200/50" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full shadow-lg animate-pulse border-2 border-blue-200/50" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full shadow-lg animate-pulse border-2 border-purple-200/50" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      )}
      
      {/* Enhanced speech indicator */}
      {isSpeaking && showCharacter && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-lg"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}