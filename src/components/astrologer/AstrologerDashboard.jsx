import React, { useEffect, useState } from 'react';
import { Star, User, MessageCircle } from 'lucide-react';
import AvailableRequests from './AvailableRequests';
import { useAuth } from '../../contexts/AuthContext';
import { useRequest } from '../../contexts/RequestContext';
import ActiveRequests from './ActiveRequests';
import proxyService from '../../utils/proxyService';

const AstrologerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { currentUser } = useAuth();
  const { activeChannels } = useRequest();
  const astrologer = currentUser; // Type casting removed
  const [isLoading, setIsLoading] = useState(true);
  

   useEffect(() => {
      setIsLoading(true);
      const fetchRequests = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('currentUser')).token;
          const response = await proxyService.get(`/request/available?astrologerId=${JSON.parse(localStorage.getItem('currentUser')).user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          setRequests(response.data);
          console.log(response.data)
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      };

  
      fetchRequests();

      setIsLoading(false);
    }, []); // Empty dependency array to run only once on mount

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Astrologer Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm mb-1">Available Consultations</p>
              <h3 className="text-3xl font-bold">{isLoading?('Loading...'):(''+requests.length)}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <User className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-purple-100">
            help your clients navigate life with celestial wisdom.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm mb-1">Completed Consultations</p>
              <h3 className="text-3xl font-bold">{isLoading?('Loading...'):('0')}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            Your consultation history is growing!
          </p>
        </div>
        
        {/* Rating */}
        {/* <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm mb-1">Reputation Score</p>
              <h3 className="text-3xl font-bold">{astrologer?.reputationScore || 0}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-amber-100">
            Based on client feedback and ratings.
          </p>
        </div> */}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Astrologer Guidelines
            </h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Anonymity:</span> Your identity is protected with a unique handle for each consultation.
              </p>
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Communication:</span> All messages are end-to-end encrypted for privacy.
              </p>
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Reputation:</span> Clients can rate your consultations, affecting your reputation score.
              </p>
            </div>
          </div>
          
          {activeChannels.length > 0 && (
            <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Active Consultations
              </h3>
              <div className="space-y-3">
                {activeChannels.map(channel => (
                  <div key={channel.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {channel.clientHandle}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Your handle: {channel.astrologerHandle}
                    </p>
                    <a 
                      href={`/astrologer/chat/${channel.id}`}
                      className="block mt-2 text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Go to chat →
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          {/* <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Active Consultations
          </h2>
          <ActiveRequests /> */}
          <h2 className="text-2xl font-semibold mb-4 mt-10 text-gray-800 dark:text-white">
            Available Consultation Requests
          </h2>
          <AvailableRequests 
            requests={requests}
            setRequests={setRequests}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AstrologerDashboard;