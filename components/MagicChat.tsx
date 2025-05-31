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

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to Magic Man');
      setError(null);
    },
    onDisconnect: () => {
      console.log('Disconnected from Magic Man');
      setIsSessionStarted(false);
    },
    onMessage: (message: { type: string; text?: string }) => {
      console.log('Message received:', message);
      
      // Handle different message types
      if (message.type === 'user_transcript' && message.text) {
        setMessages(prev => [...prev, { role: 'user', content: message.text! }]);
      } else if (message.type === 'agent_response' && message.text) {
        setMessages(prev => [...prev, { role: 'agent', content: message.text! }]);
      }
    },
    onError: (error: Error) => {
      console.error('Conversation error:', error);
      setError('An error occurred during the conversation');
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
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Magic Man Animation */}
        <div className="flex justify-center lg:justify-end">
          <MagicManAnimation isSpeaking={conversation.isSpeaking} />
        </div>
        
        {/* Chat Interface */}
        <div className="w-full">
          {/* Messages */}
          <div className="bg-black/30 backdrop-blur-md rounded-lg p-6 mb-6 h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-purple-200 text-center">Click the orb below to speak with the Magic Man...</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
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
            <div className="mb-4 text-purple-200">
              Status: {conversation.status === 'connected' ? '✅ Connected' : '❌ Disconnected'}
              {conversation.isSpeaking && ' 🗣️ Magic Man is speaking...'}
            </div>
          </div>

          {/* Magic Orb Button */}
          <div className="flex flex-col items-center">
            {!isSessionStarted ? (
              <button
                onClick={startConversation}
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg shadow-purple-500/30 transition-all transform hover:scale-110"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                <div className="relative z-10 text-white text-4xl">🔮</div>
              </button>
            ) : (
              <button
                onClick={endConversation}
                className="relative w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 animate-pulse shadow-lg shadow-purple-500/50 transition-all transform hover:scale-110"
              >
                <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
                <div className="relative z-10 text-white text-4xl">🎙️</div>
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>
              </button>
            )}
            
            <p className="text-purple-200 text-sm mt-4">
              {!isSessionStarted ? 'Press to start conversation' : 'Speaking... Press to end'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-500/20 border border-red-400 text-red-200 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}