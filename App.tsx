
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from './types';
import ChatMessageList from './components/ChatMessageList';
import ChatInput from './components/ChatInput';
import Header from './components/Header';
import { createChatSession, streamMessageToAgi } from './services/geminiService';
import { UserIcon, AgiIcon, SystemIcon } from './components/Icons';
import { INITIAL_AGI_GREETING } from './constants';
import { Chat } from '@google/genai';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Global loading for send message
  const [isInitializing, setIsInitializing] = useState(true); // Specific for initial load
  const chatSessionRef = useRef<Chat | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize chat session and add initial greeting
  useEffect(() => {
    const initializeChat = async () => {
      if (isInitialized) return; // Prevent re-initialization

      const initMessageId = 'system-init-' + Date.now();
      setMessages([{
        id: initMessageId,
        text: "Initializing Aiya's consciousness... Please wait.",
        sender: 'system', // Using system for initialization message
        timestamp: new Date(),
        avatar: <AgiIcon className="w-8 h-8 text-purple-300 animate-pulse" />, // Pulsing icon
        isLoading: true, // Visually indicate loading state
      }]);
      setIsInitializing(true); // Set specific initializing state

      try {
        const session = await createChatSession();
        chatSessionRef.current = session;
        
        // Replace initializing message with Aiya's actual greeting
        setMessages([{
          id: 'initial-greeting-' + Date.now(),
          text: INITIAL_AGI_GREETING,
          sender: 'agi',
          timestamp: new Date(),
          avatar: <AgiIcon />,
        }]);
        setIsInitialized(true);
      } catch (error) {
         console.error("Failed to initialize AGI chat session:", error);
         const errorText = `Failed to initialize Aiya's consciousness. ${error instanceof Error ? error.message : 'Unknown error.'} This could be due to issues with the API key or loading Aiya's configuration schema. Please check the console for more details.`;
         setMessages([{ // Replace initializing message with error
          id: initMessageId, 
          text: errorText,
          sender: 'system',
          timestamp: new Date(),
          avatar: <SystemIcon />
         }]);
      } finally {
        setIsInitializing(false);
      }
    };
    initializeChat();
  }, [isInitialized]); // Dependency array for initialization effect

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!chatSessionRef.current || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      text: userInput,
      sender: 'user',
      timestamp: new Date(),
      avatar: <UserIcon />,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const agiPlaceholderId = 'agi-placeholder-' + Date.now();
    const agiPlaceholderMessage: ChatMessage = {
      id: agiPlaceholderId,
      text: '',
      sender: 'agi',
      timestamp: new Date(),
      avatar: <AgiIcon />,
      isLoading: true,
    };
    setMessages(prev => [...prev, agiPlaceholderMessage]);

    let fullAgiResponse = '';
    try {
      const stream = streamMessageToAgi(chatSessionRef.current, userInput, messages.map(m => ({role: m.sender === 'user' ? 'user' : 'model', parts: [{text: m.text}]})));
      for await (const chunk of stream) {
        fullAgiResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === agiPlaceholderId ? { ...msg, text: fullAgiResponse, isLoading: true } : msg
        ));
      }
    } catch (error) {
      console.error('Error streaming AGI response:', error);
      fullAgiResponse = error instanceof Error ? `Error: ${error.message}` : "An unexpected error occurred.";
    } finally {
      setMessages(prev => prev.map(msg => 
        msg.id === agiPlaceholderId ? { ...msg, text: fullAgiResponse || "...", isLoading: false, timestamp: new Date() } : msg
      ));
      setIsLoading(false);
    }
  }, [isLoading, messages]);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans antialiased">
      <Header />
      <ChatMessageList messages={messages} />
      {(isInitializing && messages.length > 0 && messages[0].sender === 'system' && messages[0].isLoading) ? (
        <div className="p-4 text-center text-purple-300">
          <AgiIcon className="w-8 h-8 text-purple-300 animate-pulse inline-block mr-2" />
          {messages[0].text}
        </div>
      ) : (
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || isInitializing || !isInitialized} />
      )}
    </div>
  );
};

export default App;
