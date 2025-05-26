import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import CommonBtn from '../../utils/CommonBtn';

const RequestHistory = ({mockRequestHistory=[]}) => {

  const [requestHistory, setRequestHistory] = useState(mockRequestHistory); // Use mock data for request history
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [currentRequestId, setCurrentRequestId] = useState(null); // Track the current request being reviewed
  const [reviewMessage, setReviewMessage] = useState(''); // Message input state

  // Handler to open the modal
  const openModal = (requestId) => {
    setCurrentRequestId(requestId);
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentRequestId(null);
    setReviewMessage('');
  };

  // Handler to submit the review
  const handleSubmitReview = () => {
    setRequestHistory((prevHistory) =>
      prevHistory.map((request) =>
        request.id === currentRequestId
          ? { ...request, requestStatus: 'Reviewed' } // Update requestStatus to "Reviewed"
          : request
      )
    );
    closeModal(); // Close the modal after submission
  };

  return (
    <div>
      {/* Request History Section */}

      {requestHistory.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any request history.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requestHistory.map((request) => (
            <div
              key={request.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
            >
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {request.title}
                    </h3>
                    <div className="mt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                  </div>
                  <div className='flex flex-col items-end space-y-2'>
                    <span
                      className={`text-sm font-medium px-2 py-1 rounded ${
                        request.requestStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                          : request.requestStatus === 'DONE'
                          ? 'bg-gray-100 text-gray-600 dark:bg-gray-900/30'
                          : request.requestStatus === 'Waiting to be Reviewed'
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30'
                      }`}
                    >
                      {request.requestStatus}
                    </span>
                  {/* Review Button for "Waiting to be Reviewed" */}
                  {request.requestStatus === 'Waiting to be Reviewed' && (
                    <CommonBtn title={'Review'} func={openModal} />
                  )}
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Review Request
            </h3>
            <textarea
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              placeholder="Enter your review message..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-4"
              rows="4"
            ></textarea>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <CommonBtn
                title={'Submit Review'}
                func={handleSubmitReview} 
                />
                
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestHistory;