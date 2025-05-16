import React, { useEffect, useState } from 'react';
import { Star, Users, Shield } from 'lucide-react';
import RequestForm from './RequestForm';
import RequestList from './RequestList';
import RequestHistory from './RequestHistory';
import proxyService from '../../utils/proxyService';

const ClientDashboard = () => {
  const [activeRequests, setActiveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadRequest, setReloadRequest] = useState(false);

  // Function to fetch active requests
  const fetchActiveRequests = async () => {
    setIsLoading(true);
    try {
      const response = await proxyService.get(
        '/request/user/' + JSON.parse(localStorage.getItem('currentUser')).user.id,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`,
          },
        }
      );
      if (response.status === 200) {
        setActiveRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching active requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active requests on component mount
  useEffect(() => {
    fetchActiveRequests();
    console.log('Active Requests:', activeRequests);
  }, [reloadRequest]);

  // Function to count total active chats
  const countChats = () => {
    return activeRequests.reduce((count, request) => count + (request.acceptingAstrologersCount || 0), 0);
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Client Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm mb-1">Active Requests</p>
              <h3 className="text-3xl font-bold">{isLoading ? 'Loading...' : activeRequests.length}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-purple-100">
            Your path to solutions begins with a consultation
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Active Chats</p>
              <h3 className="text-3xl font-bold">{isLoading ? 'Loading...' : countChats()}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Shield className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-blue-100">
            All communications are end-to-end encrypted.
          </p>
        </div>

        
        {/* Rating  */}
        {/* <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg shadow-md p-6 text-white">

          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm mb-1">Ratings Given</p>
              <h3 className="text-3xl font-bold">8</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-full">
              <Star className="w-6 h-6" />
            </div>
          </div>
          <p className="mt-4 text-sm text-amber-100">
            Your feedback helps maintain quality of service.
          </p>
        </div> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RequestForm setReloadRequest={setReloadRequest} />

          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Privacy Information
            </h3>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Anonymity:</span> Your identity is protected by a system-generated handle that changes with each consultation.
              </p>
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Data Retention:</span> All chat data is automatically deleted when you close a request.
              </p>
              <p>
                <span className="font-medium text-purple-600 dark:text-purple-400">Encryption:</span> All communications are secured with end-to-end encryption.
              </p>
            </div>
          </div>
        </div>


          {/* Active Requests and History */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Your Active Requests
          </h2>
          <RequestList activeRequests={activeRequests} setActiveRequests={setActiveRequests} isLoading={isLoading} setIsLoading={setIsLoading} />
          {/* <h2 className="text-2xl font-semibold my-4 text-gray-800 dark:text-white">
            Your Requests History
          </h2>
          <RequestHistory /> */}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;