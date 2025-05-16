import React, { useEffect, useState } from 'react';
import proxyService from '../utils/proxyService';
import { toast } from 'react-toast';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  // Fetch pending notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('currentUser')).token;
        const userId = JSON.parse(localStorage.getItem('currentUser')).user.id;
        const response = await proxyService.get(`/request/waiting-requests/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle accept request
  const handleAcceptRequest = async (requestId,astroId) => {
    try {
      const token = JSON.parse(localStorage.getItem('currentUser')).token;
      const response = await proxyService.post(`/chats/start?astrologerId=${astroId}&consultationRequestId=${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`,
        },
      });

      if (response.status === 200) {
        toast.success('Request accepted successfully!', { position: 'top' });
        setNotifications((prev) => prev.filter((notification) => notification.id !== requestId));
      }else if(response.status == 208){
        toast.error('You have already accepted this request!', { position: 'top' });
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept the request.', { position: 'top' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No new notifications.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{notification.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created: {new Date(notification.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Payment Status: {notification.paymentStatus}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open for All: {notification.openForAll ? 'Yes' : 'No'}
              </p>

              {/* Separator for Birth Information */}
              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Birth Information</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Birth Date: {notification.birthDate || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Birth Time: {notification.birthTime || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Birth Place: {notification.birthPlace || 'N/A'}
              </p>

              {/* Separator for Astrologer Details */}
              <hr className="my-4 border-gray-200 dark:border-gray-700" />

              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Astrologer Details</h4>
              {notification.astrologerDetails.length > 0 ? (
                <div className="space-y-4">
                  {notification.astrologerDetails.map((astro, index) => (
                    <div
                      key={astro.astrologerId}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
                    >
                      <p className="text-sm text-gray-800 dark:text-white font-medium">
                        Astrologer{astro.astrologerId.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Rating: {astro.astrologerRating}
                      </p>
                      <button
                        onClick={() => handleAcceptRequest(notification.id,astro.astrologerId)}
                        className="mt-2 py-1 px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Accept Request
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">No astrologers assigned yet.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPage;