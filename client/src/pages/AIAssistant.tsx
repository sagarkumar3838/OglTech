import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AdminLayout } from '../components/AdminLayout';
import api from '../services/api';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Zap
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

const AIAssistant = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai-chat', {
        message: userMessage.content,
        userId: user?.id,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
        provider: response.data.provider,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error.response?.data?.details || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const suggestedPrompts = [
    'Explain React hooks in simple terms',
    'How do I prepare for a technical interview?',
    'What are the best practices for writing clean code?',
    'Help me understand async/await in JavaScript',
  ];

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-20rem)] flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 px-6 py-4 shadow-sm rounded-t-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Multi-Provider (OpenAI, Groq, DeepSeek)
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Chat
            </button>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                How can I help you today?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Ask me anything about programming, career advice, technical concepts, or get help with your learning journey.
              </p>

              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt)}
                    className="p-4 text-left bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-500 mt-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {prompt}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-3xl rounded-2xl px-6 py-4 shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                      : 'bg-white/90 backdrop-blur-sm text-gray-900 border border-gray-200'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200/30">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {message.provider && (
                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium">
                          {message.provider}
                        </span>
                      )}
                    </div>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() =>
                          copyToClipboard(message.content, message.id)
                        }
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {copiedId === message.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}

          {loading && (
            <div className="flex gap-4 justify-start">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200/50 px-4 py-4 shadow-lg">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full px-6 py-4 pr-12 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                style={{
                  minHeight: '56px',
                  maxHeight: '200px',
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
    </AdminLayout>
  );
};

export default AIAssistant;
