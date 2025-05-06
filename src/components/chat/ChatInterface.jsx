import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, ThumbsUp, ThumbsDown, Ban } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';

const ChatInterface = ({ channelId }) => {
  const { 
    currentChannel, 
    messages, 
    sendMessage, 
    loadMessages, 
    isLoading, 
    blockAstrologerInChat, 
    rateAstrologerInChat 
  } = useChat();
  const { isClient, isAstrologer } = useAuth();
  
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);
  
  // Load messages when component mounts or channel changes
  useEffect(() => {
    if (channelId) {
      loadMessages(channelId);
    }
  }, [channelId, loadMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim()) return;
    
    try {
      await sendMessage(messageInput);
      setMessageInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (file.type.startsWith('image/')) {
      // Handle image upload
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          // In a real app, you would upload this to a storage service
          // and then send the URL to the backend
          const imageUrl = 'https://example.com/fake-image-url.jpg';
          await sendMessage(file.name, 'image', imageUrl);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other file types
      const fileUrl = 'https://example.com/fake-file-url.pdf';
      sendMessage(file.name, 'file', fileUrl);
    }
  };
  
  const handleBlock = async () => {
    if (!currentChannel) return;
    
    if (window.confirm('Are you sure you want to block this astrologer? They will no longer be able to interact with you.')) {
      try {
        await blockAstrologerInChat(currentChannel.astrologerHandle);
        alert('Astrologer has been blocked');
      } catch (error) {
        console.error('Error blocking astrologer:', error);
      }
    }
  };
  
  const handleRate = async (rating) => {
    if (!currentChannel) return;
    
    try {
      await rateAstrologerInChat(currentChannel.astrologerHandle, rating);
      
      const ratingText = {
        positive: 'positive',
        negative: 'negative',
        neutral: 'neutral'
      };
      
      alert(`You gave a ${ratingText[rating]} rating to the astrologer`);
    } catch (error) {
      console.error('Error rating astrologer:', error);
    }
  };
  
  if (isLoading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  if (!currentChannel) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <p>No active chat channel selected.</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {isClient() 
              ? `Astrologer: ${currentChannel.astrologerHandle}` 
              : `Client: ${currentChannel.clientHandle}`
            }
          </h3>
          
          {isClient() && (
            <div className="flex mt-1 text-sm">
              <div className="flex items-center">
                <button 
                  onClick={() => handleRate('positive')}
                  className="p-1 rounded-full text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  title="Upvote astrologer"
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => handleRate('negative')}
                  className="p-1 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors ml-1"
                  title="Downvote astrologer"
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={handleBlock}
                  className="p-1 rounded-full text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ml-2"
                  title="Block astrologer"
                >
                  <Ban className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-sm text-purple-600 dark:text-purple-400">
          <span className="font-medium">Your handle:</span> {isClient() ? currentChannel.clientHandle : currentChannel.astrologerHandle}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = 
            (isClient() && message.senderRole === 'client') ||
            (isAstrologer() && message.senderRole === 'astrologer');
          
          return (
            <div 
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] rounded-lg px-4 py-2 ${
                  isOwnMessage 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-xs opacity-75 mb-1">
                  {message.senderHandle} • {new Date(message.timestamp).toLocaleTimeString()}
                </div>
                
                {message.type === 'text' && (
                  <p>{message.content}</p>
                )}
                
                {message.type === 'image' && (
                  <div>
                    <p className="mb-2">{message.content}</p>
                    <div className="rounded overflow-hidden border border-gray-300 dark:border-gray-600">
                      {/* This would be a real image in a production app */}
                      <div className="bg-gray-100 dark:bg-gray-700 text-center py-8 px-4 text-sm text-gray-500 dark:text-gray-400">
                        [Image: {message.content}]
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'file' && (
                  <div>
                    <p className="mb-2">{message.content}</p>
                    <a 
                      href="#"
                      className="block bg-gray-100 dark:bg-gray-700 rounded p-3 text-sm flex items-center"
                    >
                      <span className="flex-grow truncate">{message.content}</span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 whitespace-nowrap">Download</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <label className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <Image className="w-5 h-5" />
            <input
              type="file"
              accept="image/*, application/pdf"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          
          <button
            type="submit"
            disabled={!messageInput.trim() || isLoading}
            className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;