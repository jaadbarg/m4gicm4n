'use client';

import MagicChat from '@/components/MagicChat';

const AGENT_ID = 'agent_01jwjae7vne90bgqjkz1tttv7w'; // Your specific agent ID

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Magical sparkles background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4 animate-pulse">
            ✨ Magic Man ✨
          </h1>
          <p className="text-xl text-purple-200">Speak with the mystical keeper of wisdom</p>
        </div>

        <MagicChat agentId={AGENT_ID} />
      </main>

      <style jsx>{`
        @keyframes sparkle {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: sparkle 10s linear infinite;
        }

        .sparkle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          animation-duration: 8s;
        }

        .sparkle:nth-child(2) {
          left: 50%;
          animation-delay: 3s;
          animation-duration: 12s;
        }

        .sparkle:nth-child(3) {
          left: 80%;
          animation-delay: 5s;
          animation-duration: 10s;
        }
      `}</style>
    </div>
  );
}