
import React, { useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import ChatMessageItem from './ChatMessageItem';

interface ChatMessageListProps {
  messages: ChatMessage[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex-grow p-6 space-y-6 overflow-y-auto">
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
