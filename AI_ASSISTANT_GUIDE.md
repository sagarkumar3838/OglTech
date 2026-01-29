# AI Assistant - DeepSeek Integration Guide

## Overview
The AI Assistant is a chat interface powered by DeepSeek AI that allows users to ask any questions about programming, career development, and technical topics.

## Features
- 💬 Real-time chat interface
- 🤖 Powered by DeepSeek AI
- 📝 Message history
- 📋 Copy responses
- 🎨 Beautiful gradient UI
- 📱 Fully responsive design
- ⚡ Fast responses

## Setup

### 1. DeepSeek API Key
Make sure you have your DeepSeek API key in your `.env` file:

```env
DEEPSEEK_API_KEY=sk-your-deepseek-api-key-here
DEEPSEEK_MODEL=deepseek-chat
```

Get your API key from: https://platform.deepseek.com/api_keys

### 2. Start the Server
```bash
cd server
npm run dev
```

### 3. Start the Client
```bash
cd client
npm run dev
```

### 4. Access the AI Assistant
Navigate to: http://localhost:3000/ai-assistant

## API Endpoint

### POST /api/ai-chat
Send a message to the AI assistant.

**Request Body:**
```json
{
  "message": "Your question here",
  "userId": "user-id-optional"
}
```

**Response:**
```json
{
  "response": "AI response here",
  "timestamp": "2024-01-23T10:30:00.000Z"
}
```

## Usage Examples

### Programming Questions
- "Explain React hooks in simple terms"
- "How do I use async/await in JavaScript?"
- "What's the difference between let and const?"

### Career Advice
- "How do I prepare for a technical interview?"
- "What skills should I learn as a frontend developer?"
- "How can I improve my coding skills?"

### Technical Concepts
- "Explain REST API design principles"
- "What are design patterns?"
- "How does authentication work?"

## Features in Detail

### Chat Interface
- Clean, modern design with gradient backgrounds
- Message bubbles for user and AI
- Timestamps for each message
- Copy button for AI responses

### Suggested Prompts
When you first open the chat, you'll see suggested prompts to get started:
- Explain React hooks in simple terms
- How do I prepare for a technical interview?
- What are the best practices for writing clean code?
- Help me understand async/await in JavaScript

### Message Management
- Clear chat button to start fresh
- Automatic scrolling to latest message
- Message history persists during session

## Technical Details

### Frontend
- **Location:** `client/src/pages/AIAssistant.tsx`
- **Framework:** React + TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

### Backend
- **Location:** `server/src/routes/aiChat.ts`
- **API:** DeepSeek Chat Completions
- **Model:** deepseek-chat
- **Temperature:** 0.7
- **Max Tokens:** 2000

### System Prompt
The AI is configured with a specialized system prompt:
```
You are a helpful AI assistant specialized in programming, career development, 
and technical education. You provide clear, accurate, and friendly responses. 
Format your responses in a readable way with proper spacing and structure.
Be encouraging and supportive while maintaining technical accuracy.
```

## Cost Information
DeepSeek is very affordable:
- **Price:** $0.14 per 1M tokens (input)
- **Price:** $0.28 per 1M tokens (output)
- Much cheaper than GPT-4 or Claude

## Troubleshooting

### Error: "Failed to get AI response"
- Check that your DEEPSEEK_API_KEY is set correctly in `.env`
- Verify the server is running on port 5001
- Check the browser console for detailed error messages

### Messages not sending
- Ensure you're logged in (protected route)
- Check network tab for API call failures
- Verify the API URL is correct in `client/.env`

### Slow responses
- DeepSeek is generally fast, but response time depends on:
  - Message length
  - Server load
  - Network connection

## Future Enhancements
- [ ] Conversation history persistence
- [ ] Multiple conversation threads
- [ ] Code syntax highlighting in responses
- [ ] Voice input/output
- [ ] File upload for context
- [ ] Export conversation as PDF
- [ ] Share conversations
- [ ] Custom system prompts

## Security Notes
- All requests require authentication
- User ID is tracked for analytics
- API key is stored securely on server
- No sensitive data is logged

## Support
For issues or questions, check:
- Server logs: `server/` directory
- Browser console: Developer Tools
- Network tab: Check API calls
