import React, { useState } from 'react';
import { Menu, Settings, MessageSquare, Users, Moon, Sun, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockUsers, mockChats, mockMessages } from '../../data/mockData';
import { MdBlockFlipped } from "react-icons/md";
import { FaPaperclip } from "react-icons/fa6";
import { FaFileAlt, FaCamera, FaImage } from 'react-icons/fa';

const ChatLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
    const [messageInput, setMessageInput] = useState('');
  const [paperPin, setPaperPin] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [isSidebarLoading, setSidebarLoading] = useState(true); // New state for sidebar loading

  const paperPinHandler = () => {
    setPaperPin(!paperPin);
  };
  const { logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'currentUser',
      text: messageInput,
      timestamp: new Date().toISOString()
    };

    mockMessages[selectedChat.id] = [...(mockMessages[selectedChat.id] || []), newMessage];
    setMessageInput('');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Filter chats based on the search query
  const filteredChats = mockChats.filter(chat => {
    const otherUser = mockUsers.find(user => chat.participants.includes(user.id));
    return otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
  });


  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
              <MessageSquare className="w-6 h-6 mr-2" />
              Messages
            </h2>
            <div className="mt-4 relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery} // Bind input value to searchQuery state
                onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery state on input change
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map(chat => { // Use filteredChats instead of mockChats
              const otherUser = mockUsers.find(
                user => chat.participants.includes(user.id)
              );
              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full p-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedChat.id === chat.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={otherUser.avatar}
                      alt={otherUser.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                      otherUser.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage.text}
                    </p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{chat.unreadCount}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
        
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
              <div className="flex items-center space-x-4">
                <img
                  src={mockUsers.find(user => selectedChat.participants.includes(user.id)).avatar}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {mockUsers.find(user => selectedChat.participants.includes(user.id)).name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mockUsers.find(user => selectedChat.participants.includes(user.id)).status === 'online' 
                      ? 'Online' 
                      : 'Offline'}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className='flex'>
              {/* Block Button  */}
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Logout"
            >
              <MdBlockFlipped />
              <span className="ml-2 hidden sm:inline">Block</span>
            </button>

            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="ml-2 hidden sm:inline">Close</span>
            </button>

          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedChat && mockMessages[selectedChat.id].map(message => (
            <div 
              key={message.id}
              className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`rounded-lg p-3 max-w-[70%] shadow ${
                  message.senderId === 'currentUser'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <p className={`text-sm mb-1 ${
                  message.senderId === 'currentUser'
                    ? 'text-blue-100'
                    : 'text-gray-600 dark:text-gray-300'
                }`}>
                  {message.senderId === 'currentUser' 
                    ? 'You' 
                    : mockUsers.find(user => user.id === message.senderId).name}
                </p>
                <p className={message.senderId === 'currentUser' ? 'text-white' : 'text-gray-800 dark:text-white'}>
                  {message.text}
                </p>
                <p className={`text-xs mt-1 ${
                  message.senderId === 'currentUser'
                    ? 'text-blue-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
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
                  <FaFileAlt className="text-gray-700 transition-colors duration-300 group-hover:text-white" title="Document" />
                </button>
                <button
                  className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
                    paperPin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                >
                  <FaCamera className="text-gray-700 transition-colors duration-300 group-hover:text-white" title="Document" />
                </button>
                <button
                  className={`transition-all duration-300 transform bg-white p-2 rounded-full shadow hover:bg-gray-500 group ${
                    paperPin ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                >
                  <FaImage className="text-gray-700 transition-colors duration-300 group-hover:text-white" title="Document" />
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
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default ChatLayout;