
import React from 'react';
import { ChatMessage } from '../types';
import { AgiIcon, UserIcon, SystemIcon } from './Icons'; // Assuming you have an Icons.tsx

interface ChatMessageItemProps {
  message: ChatMessage;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAgi = message.sender === 'agi';
  const isSystem = message.sender === 'system';

  const alignment = isUser ? 'justify-end' : 'justify-start';
  const bgColor = isUser ? 'bg-sky-600' : isAgi ? 'bg-gray-700' : 'bg-yellow-600 bg-opacity-30';
  const textColor = isUser || isAgi ? 'text-gray-100' : 'text-yellow-200';
  
  const Avatar = () => {
    if (isUser) return <UserIcon className="w-8 h-8 text-sky-300 flex-shrink-0" />;
    if (isAgi) return <AgiIcon className="w-8 h-8 text-purple-300 flex-shrink-0" />;
    return <SystemIcon className="w-8 h-8 text-yellow-300 flex-shrink-0" />;
  };

  return (
    <div className={`flex ${alignment} mb-4 animate-fadeIn`}>
      <div className={`flex items-start max-w-xl md:max-w-2xl lg:max-w-3xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`p-2 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <Avatar />
        </div>
        <div className={`px-4 py-3 rounded-xl shadow-md ${bgColor} ${textColor}`}>
          <p className="whitespace-pre-wrap">{message.text}</p>
          {message.isLoading && isAgi && (
            <div className="mt-2 flex items-center text-xs text-purple-300">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Aiya is thinking...
            </div>
          )}
           <p className={`text-xs mt-1 ${isUser ? 'text-sky-200 text-right' : isAgi ? 'text-purple-200 text-left' : 'text-yellow-300 text-left'}`}>
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// Add a simple fadeIn animation to tailwind config or a style tag if needed
// For now, using a conceptual class 'animate-fadeIn'
// Actual Tailwind animation:
// In tailwind.config.js (not possible here, so we'll rely on simple rendering)
// keyframes: { fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } } },
// animation: { fadeIn: 'fadeIn 0.5s ease-out' },

export default ChatMessageItem;
