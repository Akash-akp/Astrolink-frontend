import React, { useState } from 'react';
import { FaPaperclip, FaFileAlt, FaCamera, FaImage } from 'react-icons/fa';
import { sendMessage } from './WebSocketFeature';
import { useParams } from 'react-router-dom';

const RadialMenu = ({ isOpen, onToggle,isFileUploadOpen, setFileUploadOpen}) => {
    

    const openUpload = () => {
        onToggle();
        setFileUploadOpen(true);
    }

    const closeUpload = () => {
        setFileUploadOpen(false);
    }

  return (
    <div className="relative flex items-end justify-end p-4">
      {/* Radial Menu */}
      <div className="absolute bottom-[70px] right-5 flex flex-col items-end space-y-2 transition-all duration-300">
        <button onClick={openUpload}
          className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          aria-label="Attach Document"
        >
          <FaFileAlt className="text-gray-700 transition-colors duration-300 group-hover:text-white" />
        </button>
        <button onClick={openUpload}
          className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          aria-label="Attach Camera"
        >
          <FaCamera className="text-gray-700 transition-colors duration-300 group-hover:text-white" />
        </button>
        <button onClick={openUpload}
          className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
          aria-label="Attach Image"
        >
          <FaImage className="text-gray-700 transition-colors duration-300 group-hover:text-white" />
        </button>
      </div>

      {/* Paperclip Button */}
      <button
        className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
        onClick={onToggle}
        aria-label="Toggle Attachments"
      >
        <FaPaperclip className="text-gray-700" />
      </button>
    </div>
  );
};

const MessageList = ({ messages, currentUserId,isFileUploadOpen, setFileUploadOpen }) => {
    const {chatId} = useParams();
  const [messageInput, setMessageInput] = useState('');
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (messageInput.trim()) {
      setMessageInput(''); // Clear the input field
    }
    sendMessage(messageInput,JSON.parse(localStorage.getItem('currentUser')).user.id,chatId); // Send the message through WebSocket
  };

  const toggleRadialMenu = () => {
    setIsRadialMenuOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] justify-between overflow-hidden relative">
      {/* Messages */}
      <div className="h-[calc(100vh-230px)] overflow-y-auto p-4 space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-[70%] shadow ${
                  message.senderId === currentUserId
                    ? 'bg-purple-500/50 text-white'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No messages found.</p>
        )}
      </div>

      {/* Message Input */}
      <div className="absolute w-full bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <RadialMenu isOpen={isRadialMenuOpen} onToggle={toggleRadialMenu} isFileUploadOpen={isFileUploadOpen} setFileUploadOpen={setFileUploadOpen} />
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageList;