import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getActiveRequests, 
  createRequest, 
  getAvailableRequests,
  acceptRequest,
  closeRequest
} from '../services/api';
import { useAuth } from './AuthContext';

const RequestContext = createContext(undefined);

export const RequestProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeRequests, setActiveRequests] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [activeChannels, setActiveChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch requests when user changes
  useEffect(() => {
    if (currentUser?.id && currentUser?.role) {
      refreshRequests();
    } else {
      setActiveRequests([]);
      setAvailableRequests([]);
      setActiveChannels([]);
    }
  }, [currentUser?.id, currentUser?.role]);

  // Create a new consultation request
  const createNewRequest = async (
    title, 
    birthDetails
  ) => {
    if (!currentUser || currentUser.role !== 'client') {
      throw new Error('Only clients can create requests');
    }

    setIsLoading(true);
    try {
      const newRequest = await createRequest(currentUser.id, title, birthDetails);
      setActiveRequests(prev => [...prev, newRequest]);
      return newRequest;
    } finally {
      setIsLoading(false);
    }
  };

  // Accept a consultation request (astrologer only)
  const acceptConsultationRequest = async (requestId) => {
    if (!currentUser || currentUser.role !== 'astrologer') {
      throw new Error('Only astrologers can accept requests');
    }

    setIsLoading(true);
    try {
      const channel = await acceptRequest(currentUser.id, requestId);
      setActiveChannels(prev => [...prev, channel]);
      
      // Update available requests
      setAvailableRequests(prev => 
        prev.filter(r => r.id !== requestId || r.astrologers.length < 3)
      );
      
      return channel;
    } finally {
      setIsLoading(false);
    }
  };

  // Close a consultation request (client only)
  const closeConsultationRequest = async (requestId) => {
    if (!currentUser || currentUser.role !== 'client') {
      throw new Error('Only clients can close requests');
    }

    setIsLoading(true);
    try {
      await closeRequest(currentUser.id, requestId);
      
      // Update state
      setActiveRequests(prev => prev.filter(r => r.id !== requestId));
      setActiveChannels(prev => prev.filter(c => c.requestId !== requestId));
      
      return;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh requests data
  const refreshRequests = async () => {
    if (!currentUser?.id || !currentUser?.role) return;

    setIsLoading(true);
    try {
      if (currentUser.role === 'client') {
        const requests = await getActiveRequests(currentUser.id);
        setActiveRequests(requests);
      } else if (currentUser.role === 'astrologer') {
        const requests = await getAvailableRequests(currentUser.id);
        setAvailableRequests(requests);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RequestContext.Provider
      value={{
        activeRequests,
        availableRequests,
        activeChannels,
        isLoading,
        createNewRequest,
        acceptConsultationRequest,
        closeConsultationRequest,
        refreshRequests
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
};