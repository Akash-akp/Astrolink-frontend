import React, { createContext, useState, useContext } from 'react';
import { sendChatMessage, getChatMessages, blockAstrologer, rateAstrologer } from '../services/api';
import { useAuth } from './AuthContext';

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages for a chat channel
  const loadMessages = async (channelId) => {
    setIsLoading(true);
    try {
      const channelMessages = await getChatMessages(channelId);
      setMessages(channelMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message in the current channel
  const sendMessage = async (
    content, 
    type = 'text',
    fileUrl
  ) => {
    if (!currentUser || !currentChannel) {
      throw new Error('User not logged in or no active channel');
    }

    setIsLoading(true);
    try {
      const message = await sendChatMessage(
        currentChannel.id,
        currentUser.id,
        currentUser.role,
        content,
        type,
        fileUrl
      );
      
      setMessages(prev => [...prev, message]);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Block an astrologer (client only)
  const blockAstrologerInChat = async (astrologerHandle) => {
    if (!currentUser || currentUser.role !== 'client') {
      throw new Error('Only clients can block astrologers');
    }

    setIsLoading(true);
    try {
      await blockAstrologer(currentUser.id, astrologerHandle);
      // In a real app, we would update the UI to reflect the blocked status
    } catch (error) {
      console.error('Error blocking astrologer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Rate an astrologer (client only)
  const rateAstrologerInChat = async (
    astrologerHandle, 
    rating
  ) => {
    if (!currentUser || currentUser.role !== 'client') {
      throw new Error('Only clients can rate astrologers');
    }

    setIsLoading(true);
    try {
      await rateAstrologer(currentUser.id, astrologerHandle, rating);
      // In a real app, we would update the UI to reflect the new rating
    } catch (error) {
      console.error('Error rating astrologer:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        currentChannel,
        messages,
        isLoading,
        setCurrentChannel,
        sendMessage,
        loadMessages,
        blockAstrologerInChat,
        rateAstrologerInChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};