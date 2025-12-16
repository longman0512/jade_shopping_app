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
      text: "Hi there! I'm Jade. How can I help you find what you're looking for today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
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
        // Error handling
    } finally {
        setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[60] w-full max-w-[380px] h-[600px] bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-10 fade-in duration-300 font-sans">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-jade-100 flex items-center justify-center">
            <Sparkles size={18} className="text-jade-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Jade Assistant</h3>
            <p className="text-xs text-jade-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-jade-500 rounded-full"></span> Online
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-50 to-jade-50 flex-shrink-0 flex items-center justify-center mt-1">
                    <Bot size={16} className="text-jade-600" />
                </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-jade-600 text-white rounded-tr-sm' 
                : 'bg-[#f1f3f4] text-gray-800 rounded-tl-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center mt-1">
               <Bot size={16} className="text-jade-600" />
            </div>
            <div className="bg-[#f1f3f4] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 w-fit">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></span>
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white">
        <div className="flex items-center bg-[#f1f3f4] rounded-full px-2 py-2 pr-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message Jade..."
            className="flex-grow bg-transparent text-[15px] focus:outline-none text-gray-900 placeholder-gray-500 px-4"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-jade-600 hover:bg-jade-700 disabled:opacity-50 disabled:hover:bg-jade-600 text-white rounded-full flex items-center justify-center transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;