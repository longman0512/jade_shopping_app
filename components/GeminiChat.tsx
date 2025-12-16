import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, Bot } from 'lucide-react';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface GeminiChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const GeminiChat: React.FC<GeminiChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! I'm Jade, your personal style assistant. Looking for the perfect outfit, a gift idea, or home decor tips? I'm here to help!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Keep chat session in ref to persist across re-renders but not cause them
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
        // Initialize chat session only once when opened
        chatSessionRef.current = createChatSession();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatSessionRef.current) {
            chatSessionRef.current = createChatSession();
        }
        const responseText = await sendMessageToGemini(chatSessionRef.current, userMsg.text);
        
        const modelMsg: ChatMessage = { 
            role: 'model', 
            text: responseText, 
            timestamp: new Date() 
        };
        setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
        // Error handling is inside service, but double safety
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-full max-w-[360px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-jade-700 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Sparkles size={16} className="text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Ask Jade</h3>
            <p className="text-[10px] text-jade-100">AI Personal Stylist</p>
          </div>
        </div>
        <button onClick={onClose} className="text-jade-100 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-gray-200' : 'bg-jade-100'}`}>
              {msg.role === 'user' ? <User size={14} className="text-gray-500" /> : <Bot size={14} className="text-jade-700" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-jade-600 text-white rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <span className={`text-[10px] block mt-1 opacity-70 ${msg.role === 'user' ? 'text-jade-100' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-jade-100 flex items-center justify-center">
               <Bot size={14} className="text-jade-700" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 border border-gray-100 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask for advice..."
            className="flex-grow bg-transparent text-sm focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="text-jade-600 hover:text-jade-800 disabled:opacity-50 ml-2 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">Powered by Gemini. AI can make mistakes.</p>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;
