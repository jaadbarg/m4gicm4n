'use client';

import { useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import MagicManAnimation from './MagicManAnimation';

interface MagicChatProps {
  agentId: string;
}

export default function MagicChat({ agentId }: MagicChatProps) {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'agent', content: string }>>([]);
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
      // Hide magic man with poof animation when disconnected
      setShowMagicMan(false);
    },
    onMessage: ({ message, source }: { message: string; source: 'user' | 'ai' }) => {
      console.log('Message received:', message, 'from:', source);
      
      // Handle messages based on source
      if (source === 'user') {
        setMessages(prev => [...prev, { role: 'user', content: message }]);
      } else if (source === 'ai') {
        setMessages(prev => [...prev, { role: 'agent', content: message }]);
        // Show magic man when he first speaks
        if (!hasSpokenOnce) {
          setShowMagicMan(true);
          setHasSpokenOnce(true);
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
      // Request microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start the conversation session
      await conversation.startSession({
        agentId: agentId
      });
      
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
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center">
        {/* Magic Man Animation - Centered above chat */}
        <div className="mb-8">
          <MagicManAnimation 
            isSpeaking={conversation.isSpeaking} 
            isVisible={showMagicMan}
          />
        </div>
        
        {/* Chat Interface */}
        <div className="w-full max-w-2xl">
          {/* Messages */}
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 mb-6 h-64 overflow-y-auto border border-purple-500/20">
            {messages.length === 0 ? (
              <p className="text-purple-200 text-center opacity-70">Click the orb below to speak with the Magic Man...</p>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-purple-600/80 text-white' 
                        : 'bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connection Status */}
          <div className="text-center mb-6">
            <div className="text-purple-200 text-sm">
              Status: {conversation.status === 'connected' ? '✅ Connected' : '❌ Disconnected'}
              {conversation.isSpeaking && ' 🗣️ Magic Man is speaking...'}
            </div>
          </div>

          {/* Magic Orb Button */}
          <div className="flex flex-col items-center">
            {!isSessionStarted ? (
              <button
                onClick={startConversation}
                className="relative w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg shadow-purple-500/50 transition-all transform hover:scale-110 hover:shadow-purple-500/70"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
                <div className="relative z-10 text-white text-3xl">🔮</div>
              </button>
            ) : (
              <button
                onClick={endConversation}
                className="relative w-28 h-28 rounded-full bg-gradient-to-br from-pink-600 to-purple-600 shadow-lg shadow-purple-500/70 transition-all transform hover:scale-110"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20"></div>
                <div className="relative z-10 text-white text-3xl">🎙️</div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
              </button>
            )}
            
            <p className="text-purple-200 text-sm mt-3 opacity-80">
              {!isSessionStarted ? 'Press to start conversation' : 'Speaking... Press to end'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-2 rounded-lg text-center text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}