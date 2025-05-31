# Magic Man Chat App 🎩✨

A mystical conversational AI chat application powered by ElevenLabs Conversational AI.

## Features

- 🔮 Real-time voice conversation with the Magic Man
- ✨ Beautiful magical UI with animated effects
- 🎙️ WebSocket-based audio streaming
- 💬 Voice-to-text transcription display
- 🎨 Gradient purple/blue mystical theme
- 🎭 Animated pixel art Magic Man character that moves his mouth when speaking
- 💨 Poof animation when Magic Man appears/disappears
- 🎪 Character only appears after first response

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   The `.env.local` file has already been created with your API key.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. Click the glowing orb (🔮) to start a conversation with the Magic Man
2. Allow microphone access when prompted by your browser
3. The orb will pulse and show a microphone (🎙️) while the conversation is active
4. Speak naturally - the Magic Man will listen and respond in real-time
5. Click the orb again to end the conversation
6. Your conversation transcript will appear in the chat window above

## Technical Details

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS with custom magical animations
- **API Integration:** ElevenLabs Conversational AI
- **Real-time Communication:** WebSocket for audio streaming

## Note

Make sure to allow microphone permissions when prompted by your browser!