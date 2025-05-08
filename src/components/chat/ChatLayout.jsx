import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams for URL parameters
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockConsultations } from './mockData'; // Mock data for consultations
import ConsultationFolder from './ConsultationFolder';
import { FaPaperclip } from 'react-icons/fa6';
import { FaFileAlt, FaCamera, FaImage } from 'react-icons/fa';

const ChatLayout = () => {
  const { consultationId, chatId } = useParams(); // Extract consultationId and chatId from URL
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null); // Selected chat
  const [selectedConsultation, setSelectedConsultation] = useState(null); // Selected consultation
  const [paperPin, setPaperPin] = useState(false);
  const [messageInput, setMessageInput] = useState(''); // Added missing state for message input

  useEffect(() => {
    // Automatically open the consultation folder and chat if params are provided
    if (consultationId) {
      const consultation = mockConsultations.find((c) => c.id === consultationId);
      setSelectedConsultation(consultation);

      if (chatId && consultation) {
        const chat = consultation.chats.find((c) => c.id === chatId);
        setSelectedChat(chat);
      }
    }
  }, [consultationId, chatId]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const paperPinHandler = () => {
    setPaperPin(!paperPin);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // Logic to send a message (can be extended as needed)
      console.log('Message sent:', messageInput);
      setMessageInput(''); // Clear input after sending
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-80 bg-gradient-to-b from-purple-600 to-purple-800 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-purple-500 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center">
              Consultations
            </h2>
          </div>

          {/* Consultation Folders */}
          <div className="flex-1 overflow-y-auto space-y-2 p-2">
            {mockConsultations.map((consultation) => (
              <ConsultationFolder
                key={consultation.id}
                consultation={consultation}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                isOpenState={consultation.id === consultationId} // Open folder if it matches the param
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            {selectedChat && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Chat with Astrologer
                </h2>
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChat ? (
            selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg p-3 max-w-[70%] shadow ${
                    message.senderId === 'currentUser'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800'
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Select a chat to start messaging.</p>
          )}
        </div>

        {/* Chat Input */}
        {selectedChat && (
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2 relative">
              <div className="relative flex items-end justify-end p-4">
                {/* Radial Menu */}
                <div className="absolute bottom-[70px] right-5 flex flex-col items-end space-y-2 transition-all duration-300">
                  <button
                    className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
                      paperPin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                  >
                    <FaFileAlt
                      className="text-gray-700 transition-colors duration-300 group-hover:text-white"
                      title="Document"
                    />
                  </button>
                  <button
                    className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
                      paperPin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                  >
                    <FaCamera
                      className="text-gray-700 transition-colors duration-300 group-hover:text-white"
                      title="Camera"
                    />
                  </button>
                  <button
                    className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
                      paperPin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                    }`}
                  >
                    <FaImage
                      className="text-gray-700 transition-colors duration-300 group-hover:text-white"
                      title="Image"
                    />
                  </button>
                </div>

                {/* Paperclip Button */}
                <button
                  className="bg-white p-3 rounded-full shadow hover:bg-gray-100 transition"
                  onClick={paperPinHandler}
                >
                  <FaPaperclip className="text-gray-700" />
                </button>
              </div>
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;