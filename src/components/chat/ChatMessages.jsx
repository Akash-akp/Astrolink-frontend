import React, { useState, useEffect } from 'react';
import proxyService from '../../utils/proxyService';
import LoadingSpinner from '../common/LoadingSpinner';
import MessageList from './MessageList';
import { connect, subscribe, disconnect } from './WebSocketFeature';

const ChatMessages = ({ chatId, currentUserId , isFileUploadOpen , setFileUploadOpen }) => {
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setChatLoading(true);
      try {
        const response = await proxyService.get(`/chats/${currentUserId}/${chatId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`,
          },
        });
        setMessages(response.data.messages); // Set the initial messages from the API response
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setChatLoading(false);
      }
    };

    if (chatId) {
      fetchMessages();
    }
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (chatId) {
      // Connect to WebSocket and subscribe to the chat topic
      connect(chatId, () => {
        const handleNewMessage = (message) => {
          setMessages((prevMessages) => [...prevMessages, message]); // Add the new message to the state
        };

        subscribe(chatId, handleNewMessage);
      });

      return () => {
        disconnect(); // Disconnect WebSocket on component unmount
      };
    }
  }, [chatId]); 

  if (chatLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return <MessageList messages={messages} currentUserId={currentUserId} isFileUploadOpen={isFileUploadOpen} setFileUploadOpen={setFileUploadOpen} />;
};

export default ChatMessages;