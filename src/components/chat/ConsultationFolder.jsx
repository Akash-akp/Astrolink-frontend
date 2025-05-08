import React, { useState } from 'react';

const ConsultationFolder = ({ consultation, selectedChat, setSelectedChat,isOpenState=false }) => {
  const [isOpen, setIsOpen] = useState(isOpenState);

  const toggleFolder = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Folder Header */}
      <button
        onClick={toggleFolder}
        className={`w-full p-4 flex justify-between items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${isOpen?('border-y-2'):(' ')}`}
      >
        <span className="text-gray-800 dark:text-white font-medium">{consultation.issue}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>

      {/* Chats in Folder */}
      {isOpen && (
        <div className="pl-4">
          {consultation.chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-2 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <span className="text-gray-800 dark:text-white">{chat.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationFolder;