"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { AgentStatus } from '../../lib/types';
import { Send, Sparkles, Loader2, Mic, Paperclip, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { agentStatus } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isDisabled = agentStatus === AgentStatus.Thinking || agentStatus === AgentStatus.Executing;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPlaceholder = () => {
    if (isDisabled) {
      return agentStatus === AgentStatus.Thinking 
        ? "AI is thinking..." 
        : "AI is executing your request...";
    }
    return "Ask me anything... I'm here to help!";
  };

  return (
    <div className="relative">
      {/* Input container with glass morphism */}
      <div className={`
        relative bg-white/90 backdrop-blur-xl border-2 rounded-2xl transition-all duration-300
        ${isFocused 
          ? 'border-blue-300 shadow-lg shadow-blue-500/10' 
          : 'border-white/20 shadow-md'
        }
        ${isDisabled ? 'opacity-60' : ''}
      `}>
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 p-4">
            {/* Attachment button */}
            <button
              type="button"
              disabled={isDisabled}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
            >
              <Paperclip size={18} />
            </button>

            {/* Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={getPlaceholder()}
                disabled={isDisabled}
                className="w-full bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 text-base leading-relaxed"
                rows={1}
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {/* Emoji button */}
              <button
                type="button"
                disabled={isDisabled}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
              >
                <Smile size={18} />
              </button>

              {/* Voice input button */}
              <button
                type="button"
                disabled={isDisabled}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
              >
                <Mic size={18} />
              </button>

              {/* Send button */}
              <button
                type="submit"
                disabled={!message.trim() || isDisabled}
                className={`
                  p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                  ${!message.trim() || isDisabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'
                  }
                `}
              >
                {isDisabled ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Status indicator */}
        {isDisabled && (
          <div className="absolute -top-2 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              {agentStatus === AgentStatus.Thinking ? 'Thinking...' : 'Executing...'}
            </div>
          </div>
        )}
      </div>

      {/* Helper text */}
      <div className="flex items-center justify-between mt-3 px-2">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>
            to send
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Shift</kbd>
            +
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd>
            for new line
          </span>
        </div>
        
        {message.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles size={14} className="text-blue-500" />
            <span>{message.length} characters</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
