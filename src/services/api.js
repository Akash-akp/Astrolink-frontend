// This file simulates API calls to a backend server
// In a real application, these would be actual API calls to your server

// Simulated database
let users = [];
let clients = [];
let astrologers = [];
let requests = [];
let chatChannels = [];
let chatMessages = [];
let payments = [];

// Client registration
export const registerClient = async (userId) => {
  const newClient = {
    id: userId,
    role: 'client',
    createdAt: new Date().toISOString(),
    isRegistered: true,
    activeRequests: [],
    blockedAstrologers: []
  };
  
  clients.push(newClient);
  return newClient;
};

// Astrologer registration
export const registerAstrologer = async (userId) => {
  const newAstrologer = {
    id: userId,
    role: 'astrologer',
    createdAt: new Date().toISOString(),
    isRegistered: true,
    reputationScore: 0,
    activeConsultations: 0,
    maxConsultations: 3
  };
  
  astrologers.push(newAstrologer);
  return newAstrologer;
};

// Create a new consultation request
export const createRequest = async (
  clientId, 
  title, 
  birthDetails
) => {
  const client = clients.find(c => c.id === clientId);
  if (!client) {
    throw new Error('Client not found');
  }
  
  if (client.activeRequests.length >= 3) {
    throw new Error('Maximum active requests reached (3)');
  }
  
  const newRequest = {
    id: generateRequestId(),
    clientId,
    clientHandle: generateUserHandle('client'),
    title,
    birthDetails,
    isActive: true,
    createdAt: new Date().toISOString(),
    astrologers: []
  };
  
  requests.push(newRequest);
  client.activeRequests.push(newRequest);
  
  return newRequest;
};

// Get all active requests
export const getActiveRequests = async (clientId) => {
  return requests.filter(r => r.clientId === clientId && r.isActive);
};

// Get available requests for astrologers
export const getAvailableRequests = async (astrologerId) => {
  // Return empty array if astrologerId is not provided
  if (!astrologerId) {
    return [];
  }
  
  const astrologer = astrologers.find(a => a.id === astrologerId);
  // Return empty array instead of throwing error if astrologer not found
  if (!astrologer) {
    return [];
  }
  
  // Filter out requests from clients who have blocked this astrologer
  const availableRequests = requests.filter(request => {
    const client = clients.find(c => c.id === request.clientId);
    if (!client) return false;
    
    return request.isActive && 
           !client.blockedAstrologers.includes(astrologerId) &&
           request.astrologers.length < 3;
  });
  
  return availableRequests;
};

// Accept a request (for astrologers)
export const acceptRequest = async (
  astrologerId, 
  requestId
) => {
  const astrologer = astrologers.find(a => a.id === astrologerId);
  if (!astrologer) {
    throw new Error('Astrologer not found');
  }
  
  if (astrologer.activeConsultations >= astrologer.maxConsultations) {
    throw new Error('Maximum active consultations reached');
  }
  
  const request = requests.find(r => r.id === requestId && r.isActive);
  if (!request) {
    throw new Error('Request not found or inactive');
  }
  
  if (request.astrologers.length >= 3) {
    throw new Error('Maximum astrologers for this request reached (3)');
  }
  
  // Create a new chat channel
  const newChannel = {
    id: `chan_${Math.random().toString(36).substring(2, 9)}`,
    requestId,
    astrologerId,
    astrologerHandle: generateUserHandle('astrologer'),
    clientId: request.clientId,
    clientHandle: request.clientHandle,
    messages: [],
    isActive: true
  };
  
  chatChannels.push(newChannel);
  request.astrologers.push(astrologerId);
  astrologer.activeConsultations += 1;
  
  return newChannel;
};

// Send a chat message
export const sendChatMessage = async (
  channelId,
  senderId,
  senderRole,
  content,
  type = 'text',
  fileUrl
) => {
  const channel = chatChannels.find(c => c.id === channelId && c.isActive);
  if (!channel) {
    throw new Error('Chat channel not found or inactive');
  }
  
  const newMessage = {
    id: `msg_${Math.random().toString(36).substring(2, 9)}`,
    requestId: channel.requestId,
    senderId,
    senderHandle: senderRole === 'client' ? channel.clientHandle : channel.astrologerHandle,
    senderRole,
    content,
    timestamp: new Date().toISOString(),
    type,
    fileUrl
  };
  
  channel.messages.push(newMessage);
  chatMessages.push(newMessage);
  
  return newMessage;
};

// Get chat messages for a channel
export const getChatMessages = async (channelId) => {
  const channel = chatChannels.find(c => c.id === channelId);
  if (!channel) {
    throw new Error('Chat channel not found');
  }
  
  return channel.messages;
};

// Close a request (client only)
export const closeRequest = async (clientId, requestId) => {
  const request = requests.find(r => r.id === requestId && r.clientId === clientId);
  if (!request) {
    throw new Error('Request not found or unauthorized');
  }
  
  // Update request
  request.isActive = false;
  
  // Update channels
  chatChannels.forEach(channel => {
    if (channel.requestId === requestId) {
      channel.isActive = false;
    }
  });
  
  // Update client's active requests
  const client = clients.find(c => c.id === clientId);
  client.activeRequests = client.activeRequests.filter(r => r.id !== requestId);
  
  // Update astrologers' active consultations
  request.astrologers.forEach(astrologerId => {
    const astrologer = astrologers.find(a => a.id === astrologerId);
    if (astrologer) {
      astrologer.activeConsultations -= 1;
    }
  });
  
  // In a real application, this would trigger a data deletion process
  console.log(`Request ${requestId} closed and scheduled for deletion`);
};

// Block an astrologer
export const blockAstrologer = async (
  clientId, 
  astrologerHandle
) => {
  // Find the real astrologer ID based on handle
  // In a real app, this would be stored in a database
  const channel = chatChannels.find(
    c => c.clientId === clientId && c.astrologerHandle === astrologerHandle
  );
  
  if (!channel) {
    throw new Error('Astrologer not found');
  }
  
  const client = clients.find(c => c.id === clientId);
  if (!client) {
    throw new Error('Client not found');
  }
  
  // Add to blocklist
  if (!client.blockedAstrologers.includes(channel.astrologerId)) {
    client.blockedAstrologers.push(channel.astrologerId);
  }
  
  // Reduce astrologer's reputation score
  const astrologer = astrologers.find(a => a.id === channel.astrologerId);
  if (astrologer) {
    astrologer.reputationScore -= 1;
  }
};

// Rate an astrologer
export const rateAstrologer = async (
  clientId,
  astrologerHandle,
  rating
) => {
  // Find the real astrologer ID based on handle
  const channel = chatChannels.find(
    c => c.clientId === clientId && c.astrologerHandle === astrologerHandle
  );
  
  if (!channel) {
    throw new Error('Astrologer not found');
  }
  
  const astrologer = astrologers.find(a => a.id === channel.astrologerId);
  if (!astrologer) {
    throw new Error('Astrologer not found');
  }
  
  // Update reputation score
  if (rating === 'positive' || rating === 'neutral') {
    astrologer.reputationScore += 1;
  } else if (rating === 'negative') {
    astrologer.reputationScore -= 1;
  }
};

// Simulate payment processing
export const processPayment = async (
  userId,
  amount,
  purpose
) => {
  const payment = {
    id: `pay_${Math.random().toString(36).substring(2, 9)}`,
    userId,
    amount,
    purpose,
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  // Simulate payment processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update payment status
  payment.status = 'completed';
  payments.push(payment);
  
  // If payment is for additional astrologers, update the request
  if (purpose === 'additional_astrologers') {
    // In a real app, this would update the maximum number of astrologers for a specific request
    console.log(`Additional astrologers unlocked for user ${userId}`);
  }
  
  return payment;
};

// Helper function to generate user handle
const generateUserHandle = (role) => {
  const prefix = role === 'client' ? 'Client' : 'Astrologer';
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}#${randomChars}`;
};

// Helper function to generate request ID
const generateRequestId = () => {
  return `Request#${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
};