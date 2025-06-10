
import React, { useState } from 'react';
import { SendIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700 flex items-center sticky bottom-0">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Chat with Aiya..."
        className="flex-grow p-3 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        rows={1}
        disabled={isLoading}
        style={{ maxHeight: '120px' }} // prevent excessive growth
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="ml-3 p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded-lg text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
        aria-label="Send message"
      >
        {isLoading ? (
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <SendIcon className="w-6 h-6" />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
