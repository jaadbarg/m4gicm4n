'use client';

import MagicChat from '@/components/MagicChat';

const AGENT_ID = 'agent_01jwjae7vne90bgqjkz1tttv7w';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Enhanced Background Layers */}
      <div className="absolute inset-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 via-slate-900 to-black"></div>
        
        {/* Secondary overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-purple-900/30"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Particle Effects */}
      <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning={true}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
            suppressHydrationWarning={true}
          />
        ))}
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 overflow-hidden" suppressHydrationWarning={true}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300/60 animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${0.5 + Math.random() * 1}rem`,
            }}
            suppressHydrationWarning={true}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Main Title Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-8 md:p-12 lg:p-16">
        <div className="text-center">
          <h1 className="font-display text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-purple-300 bg-clip-text text-transparent mb-4 tracking-wider drop-shadow-2xl">
            MAGIC MAN
          </h1>
          <div className="flex items-center justify-center space-x-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400"></div>
            <p className="font-mono text-purple-300/80 text-sm tracking-[0.3em] uppercase">
              Mystical AI Companion
            </p>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <MagicChat agentId={AGENT_ID} />

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0.3;
          }
          25% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 1;
          }
          75% {
            opacity: 0.6;
          }
        }
        
        @keyframes sparkle {
          0%, 100% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1) rotate(180deg);
            opacity: 1;
          }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}