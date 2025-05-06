import React from 'react';
import { Calendar, Users, MessageCircle, X } from 'lucide-react';

const mockRequests = [
  {
    id: 1,
    title: 'Career Guidance',
    birthDate: '1990-01-01',
    birthTime: '10:00 AM',
    birthPlace: 'New York, USA',
    paymentStatus: 'PENDING',
    createdAt: '2025-05-04T13:25:12.998Z',
    acceptingAstrologersCount: 1,
    openForAll: true,
  },
  {
    id: 2,
    title: 'Relationship Advice',
    birthDate: '1985-07-15',
    birthTime: '2:00 PM',
    birthPlace: 'London, UK',
    paymentStatus: 'PENDING',
    createdAt: '2025-05-05T14:30:00.000Z',
    acceptingAstrologersCount: 0,
    openForAll: false,
  },
  {
    id: 3,
    title: 'Financial Planning',
    birthDate: '1995-03-10',
    birthTime: '4:00 PM',
    birthPlace: 'Mumbai, India',
    paymentStatus: 'PENDING',
    createdAt: '2025-05-06T10:15:00.000Z',
    acceptingAstrologersCount: 2,
    openForAll: true,
  },
];

const ActiveRequests = () => {
  const handleViewChat = (id) => {
    console.log(`View chat for request ID: ${id}`);
  };

  const handleCloseRequest = (id) => {
    console.log(`Close request ID: ${id}`);
  };

  return (
    <div className="space-y-8">
      {/* Active Requests Section */}
      <div>
        {mockRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any active consultation requests.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {request.title}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewChat(request.id)}
                        className="p-1.5 rounded-full text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                        title="View chats"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleCloseRequest(request.id)}
                        className="p-1.5 rounded-full text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        title="Close request"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Users className="w-4 h-4 mr-2" />
                      <span>
                        Astrologers: {request.acceptingAstrologersCount}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                      <span>Open for all: {request.openForAll ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  {request.birthDate && request.birthTime && request.birthPlace && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Birth Details:
                      </p>
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Date: {request.birthDate}</p>
                        <p>Time: {request.birthTime}</p>
                        <p>Place: {request.birthPlace}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-5 py-3 bg-purple-50 dark:bg-purple-900/20 border-t border-purple-100 dark:border-purple-800/30">
                  <button
                    onClick={() => handleViewChat(request.id)}
                    className="w-full py-2 text-center text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                  >
                    View Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRequests;