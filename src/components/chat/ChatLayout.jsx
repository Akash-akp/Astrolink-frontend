import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ConsultationFolder from './ConsultationFolder';
import proxyService from '../../utils/proxyService';
import LoadingSpinner from '../common/LoadingSpinner';
import ChatMessages from './ChatMessages';
import CommonBtn from '../../utils/CommonBtn';
import FirebaseImageUpload from '../firebase/FirebaseImageUpload';


const ChatLayout = () => {
  const { consultationId, chatId } = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [mockConsultations, setMockConsultations] = useState([]);
  const [chatSidebarLoading, setChatSidebarLoading] = useState(true);
  const [isFileUploadOpen, setFileUploadOpen] = useState(false);
  const navgiate = useNavigate();

  useEffect(() => {
    const fetchConsultations = async () => {
      setChatSidebarLoading(true);
      const token = JSON.parse(localStorage.getItem('currentUser')).token;
      const role = JSON.parse(localStorage.getItem('currentUser')).role;

      try {
        const response = await proxyService.get(
          role === 'astrologer'
            ? `/chats/astrologer/${JSON.parse(localStorage.getItem('currentUser')).user.id}`
            : `/chats/${JSON.parse(localStorage.getItem('currentUser')).user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const consultations = response.data.reduce((acc, chat) => {
          const { consultationId, chatId, chatName, issue } = chat;
          let consultation = acc.find((c) => c.id === consultationId);

          if (!consultation) {
            consultation = { id: consultationId, issue, chats: [] };
            acc.push(consultation);
          }

          consultation.chats.push({ id: chatId, title: chatName, messages: [] });
          return acc;
        }, []);

        setMockConsultations(consultations);

        // Automatically open the consultation folder and chat if params are provided
        if (consultationId) {
          const consultation = consultations.find((c) => c.id === consultationId);
          setSelectedConsultation(consultation);
        }

        if (chatId) {
          consultations.forEach((consultation) => {
            const chat = consultation.chats.find((c) => c.id === chatId);
            if (chat) {
              setSelectedConsultation(consultation);
              setSelectedChat(chat);
            }
          });
        }
        console.log('Consultations:', consultations);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setChatSidebarLoading(false);
      }
    };

    fetchConsultations();

  }, [consultationId, chatId]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const clearChat = async () => {
    if (!chatId) return;

    const token = JSON.parse(localStorage.getItem('currentUser')).token;
    const userId = JSON.parse(localStorage.getItem('currentUser')).user.id;
    try {
      await proxyService.delete(`/chats/${userId}/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // setSelectedChat(null);
      // setSelectedConsultation(null);
      // setMockConsultations((prev) =>
      //   prev.map((consultation) => ({
      //     ...consultation,
      //     chats: consultation.chats.filter((chat) => chat.id !== chatId),
      //   }))
      // );
      navgiate('/chat');
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] flex bg-gray-100 dark:bg-gray-900">
      {
        isFileUploadOpen && (
          <FirebaseImageUpload isFileUploadOpen={isFileUploadOpen} setFileUploadOpen={setFileUploadOpen} />
        )
      }
      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-80 bg-gradient-to-b from-purple-600 to-purple-800 dark:from-gray-800 dark:to-gray-900 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between p-4 border-b border-purple-500 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-white">Consultations</h2>
            <button className='block md:hidden' onClick={()=> setSidebarOpen(false)}> close </button>
          </div>

          {chatSidebarLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 p-2">
              {mockConsultations.map((consultation) => (
                <ConsultationFolder
                  key={consultation.id}
                  consultation={consultation}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                  isOpenState={consultation.id === selectedConsultation?.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mr-2"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            {chatId && (
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Chat with {(JSON.parse(localStorage.getItem("currentUser")).role === 'astrologer' ? 'Client' : 'Astrologer')}
                </h2>
            )}
          </div>
          {chatId && (
              <button
                onClick={() => clearChat()}
                className="bg-red-500/50 text-white rounded-lg px-4 py-2 hover:bg-red-600 transition-colors"
                >
                Clear Chat
              </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {chatId ? (
            <div>
                <ChatMessages chatId={chatId} currentUserId={JSON.parse(localStorage.getItem('currentUser')).user.id} isFileUploadOpen={isFileUploadOpen} setFileUploadOpen={setFileUploadOpen}/>
        </div>      
          ) : (
            <div className='h-full w-full flex items-center justify-center'>
              <p className="text-[50px] text-gray-500 dark:text-gray-400 relative bottom-8">Select a chat to start messaging.</p>
            </div> 
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;