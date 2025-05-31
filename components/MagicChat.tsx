'use client';

import { useState, useRef } from 'react';
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
  const [showHangupMessage, setShowHangupMessage] = useState(false);
  
  // Use refs to avoid closure issues in callbacks
  const userInitiatedEndRef = useRef(false);
  const hasSpokenOnceRef = useRef(false);
  const isSessionStartedRef = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      setError(null);
      isSessionStartedRef.current = true;
    },
    onDisconnect: () => {
      // Check if this was agent-initiated (Magic Man hung up)
      if (!userInitiatedEndRef.current && hasSpokenOnceRef.current) {
        setShowHangupMessage(true);
        setTimeout(() => setShowHangupMessage(false), 4000);
      }
      
      // Reset everything
      setIsSessionStarted(false);
      setShowMagicMan(false);
      setHasSpokenOnce(false);
      isSessionStartedRef.current = false;
      hasSpokenOnceRef.current = false;
      userInitiatedEndRef.current = false;
    },
    onMessage: ({ message, source }: { message: string; source: 'user' | 'ai' }) => {
      // Check for dismissive/hangup messages from the agent
      const dismissiveWords = ['goodbye', 'bye', 'done', 'ending', 'can\'t', 'won\'t', 'don\'t want', 'boring', 'waste'];
      const isDismissive = dismissiveWords.some(word => message.toLowerCase().includes(word));
      
      if (source === 'ai') {
        if (!hasSpokenOnce) {
          setShowMagicMan(true);
          setHasSpokenOnce(true);
          hasSpokenOnceRef.current = true;
        }
        
        // If the message seems dismissive, prepare for potential hangup
        if (isDismissive) {
          setTimeout(() => {
            if (!isSessionStartedRef.current && hasSpokenOnceRef.current && !userInitiatedEndRef.current) {
              setShowHangupMessage(true);
              setTimeout(() => setShowHangupMessage(false), 4000);
            }
          }, 1000);
        }
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
      isSessionStartedRef.current = true;
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
      userInitiatedEndRef.current = true;
      await conversation.endSession();
      setIsSessionStarted(false);
      setHasSpokenOnce(false);
      setShowMagicMan(false);
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 md:p-16 lg:p-24">
      {/* Magic Man Animation - Enhanced and centered */}
      <div className="relative z-20 mb-16 md:mb-20 lg:mb-24 transition-all duration-1000 ease-out">
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
      <div className="relative z-20 flex flex-col items-center space-y-8 md:space-y-12">
        {/* Primary Action Button */}
        {!isSessionStarted ? (
          <button
            onClick={startConversation}
            className="group relative"
          >
            {/* Outer glow ring */}
            <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse"></div>
            
            {/* Main button */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 shadow-2xl border border-purple-400/30 group-hover:scale-110 transition-all duration-300">
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-purple-400/20 to-purple-300/40"></div>
              
              {/* Professional Power Icon */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg 
                  className="w-8 h-8 md:w-12 md:h-12 text-white filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z"/>
                </svg>
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
            <div className="absolute -inset-3 md:-inset-4 bg-gradient-to-r from-pink-500/50 to-red-500/50 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse"></div>
            
            {/* Main button */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-600 via-pink-700 to-red-700 shadow-2xl border border-pink-400/30 group-hover:scale-110 transition-all duration-300">
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent via-pink-400/20 to-pink-300/40"></div>
              
              {/* Professional Stop Icon */}
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <svg 
                  className="w-6 h-6 md:w-8 md:h-8 text-white filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <rect x="6" y="6" width="12" height="12" rx="2"/>
                </svg>
              </div>
              
              {/* Animated pulse */}
              <div className="absolute inset-0 rounded-full border-4 border-pink-300/50 animate-ping"></div>
            </div>
          </button>
        )}
        
        {/* Action Text */}
        <div className="text-center space-y-2 px-4">
          <p className="font-mono text-base md:text-lg text-purple-200 tracking-wider">
            {!isSessionStarted ? 'INITIATE CONNECTION' : 'CONVERSATION ACTIVE'}
          </p>
          <p className="font-sans text-sm md:text-base text-purple-300/70 max-w-sm md:max-w-md mx-auto leading-relaxed">
            {!isSessionStarted 
              ? 'Press to begin your conversation with the Magic Man'
              : 'Speaking with the Magic Man. Press to end session.'
            }
          </p>
        </div>
      </div>

      {/* Hangup Message */}
      {showHangupMessage && (
        <div 
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 animate-fade-in-out px-4"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-xl border-2 border-red-400/60 text-red-100 px-12 py-8 rounded-3xl shadow-2xl max-w-2xl text-center">
            <div className="font-mono text-3xl md:text-4xl font-bold mb-4 tracking-wider">
              DISMISSED!
            </div>
            <div className="font-sans text-xl md:text-2xl font-medium">
              The Magic Man hung up on your ass
            </div>
          </div>
        </div>
      )}

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