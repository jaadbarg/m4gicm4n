'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import MagicManAnimation from './MagicManAnimation';

interface MagicChatProps {
  agentId: string;
}

export default function MagicChat({ agentId }: MagicChatProps) {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMagicMan, setShowMagicMan] = useState(false);
  const [hasSpokenOnce, setHasSpokenOnce] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Magic Man');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from Magic Man');
      setIsSessionStarted(false);
      setShowMagicMan(false);
      setHasSpokenOnce(false);
    },
    onMessage: ({ message, source }: { message: string; source: 'user' | 'ai' }) => {
      console.log('Message received:', message, 'from:', source);
      
      // Show magic man when he first speaks
      if (source === 'ai' && !hasSpokenOnce) {
        setShowMagicMan(true);
        setHasSpokenOnce(true);
      }
    },
    onError: (message: string, context?: unknown) => {
      console.error('Conversation error:', message, context);
      setError(message || 'An error occurred during the conversation');
    }
  });

  const startConversation = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId: agentId });
      setIsSessionStarted(true);
      setError(null);
    } catch (err) {
      console.error('Failed to start conversation:', err);
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access to chat with Magic Man.');
      } else {
        setError('Failed to start conversation. Please try again.');
      }
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
      setIsSessionStarted(false);
      setHasSpokenOnce(false);
      setShowMagicMan(false);
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8">
      {/* Magic Man Animation - Enhanced and centered */}
      <div className="relative z-20 mb-16 transition-all duration-1000 ease-out">
        <MagicManAnimation 
          isSpeaking={conversation.isSpeaking} 
          isVisible={showMagicMan}
        />
      </div>
      
      {/* Status Indicator */}
      <div className="absolute top-8 right-8 z-30">
        <div className={`px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
          conversation.status === 'connected' 
            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300' 
            : 'bg-slate-700/20 border-slate-600/50 text-slate-400'
        }`}>
          <div className="flex items-center space-x-2 font-mono text-sm">
            <div className={`w-2 h-2 rounded-full ${
              conversation.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
            }`}></div>
            <span>{conversation.status === 'connected' ? 'CONNECTED' : 'OFFLINE'}</span>
          </div>
        </div>
      </div>

      {/* Speaking Indicator */}
      {conversation.isSpeaking && (
        <div className="absolute top-24 right-8 z-30">
          <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/50 backdrop-blur-md">
            <div className="flex items-center space-x-2 font-mono text-sm text-purple-300">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-4 bg-purple-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span>SPEAKING</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Control Interface */}
      <div className="relative z-20 flex flex-col items-center space-y-8">
        {/* Primary Action Button */}
        {!isSessionStarted ? (
          <button
            onClick={startConversation}
            className="group relative"
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse"></div>
            
            {/* Main button */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 shadow-2xl border border-purple-400/30 group-hover:scale-110 transition-all duration-300">
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-purple-400/20 to-purple-300/40"></div>
              
              {/* Icon */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🔮
                </div>
              </div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-300/50 animate-spin" style={{ animationDuration: '8s' }}></div>
            </div>
          </button>
        ) : (
          <button
            onClick={endConversation}
            className="group relative"
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/50 to-red-500/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse"></div>
            
            {/* Main button */}
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-600 via-pink-700 to-red-700 shadow-2xl border border-pink-400/30 group-hover:scale-110 transition-all duration-300">
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-pink-400/20 to-pink-300/40"></div>
              
              {/* Icon */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <div className="text-5xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  🎙️
                </div>
              </div>
              
              {/* Animated pulse */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-300/50 animate-ping"></div>
            </div>
          </button>
        )}
        
        {/* Action Text */}
        <div className="text-center space-y-2">
          <p className="font-mono text-lg text-purple-200 tracking-wider">
            {!isSessionStarted ? 'INITIATE MYSTICAL CONNECTION' : 'CONVERSATION ACTIVE'}
          </p>
          <p className="font-sans text-sm text-purple-300/70 max-w-md mx-auto leading-relaxed">
            {!isSessionStarted 
              ? 'Press the crystal orb to begin your journey with the Magic Man'
              : 'The Magic Man awaits your words. Press the orb to end the session.'
            }
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-red-500/10 backdrop-blur-md border border-red-400/30 text-red-200 px-6 py-3 rounded-xl max-w-md text-center">
            <div className="font-mono text-sm">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}