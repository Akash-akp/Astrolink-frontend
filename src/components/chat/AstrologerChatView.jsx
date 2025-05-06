import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ChatInterface from './ChatInterface';
import { useChat } from '../../contexts/ChatContext';
import { useRequest } from '../../contexts/RequestContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AstrologerChatView = () => {

  const { channelId } = useParams();
  const { activeChannels, isLoading: requestLoading } = useRequest();
  const { setCurrentChannel } = useChat();
  
  // Find the channel by ID
  const channel = activeChannels.find(c => c.id === channelId);
  
  useEffect(() => {
    if (channel) {
      setCurrentChannel(channel);
    }
    
    // Clear current channel when component unmounts
    return () => {
      setCurrentChannel(null);
    };
  }, [channel, setCurrentChannel]);
  
  if (requestLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!channel) {
    return <Navigate to="/astrologer/dashboard" />;
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
        Consultation Chat
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Your anonymous handle for this consultation: <span className="font-medium text-purple-600 dark:text-purple-400">{channel.astrologerHandle}</span>
      </p>
      
      <div className="h-[600px]">
        <ChatInterface channelId={channelId || ''} />
      </div>
    </div>
  );
};

export default AstrologerChatView;