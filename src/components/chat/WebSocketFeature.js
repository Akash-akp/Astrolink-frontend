import { Client } from '@stomp/stompjs';

let stompClient = null;
let connectionStatus = 'disconnected'; // 'disconnected', 'connecting', 'connected'

// Utility: Add log with timestamp
export const addLog = (message) => ({
  timestamp: new Date().toLocaleTimeString(),
  message,
});

// Check if connection is active
export const isConnected = () => {
  return connectionStatus === 'connected' && stompClient && stompClient.connected;
};

// Connect to WebSocket server with JWT authentication
export const connect = (chatId,subscription) => {
  const onConnect = null;
  const onDisconnect = null;
  const onError = null;
  if (isConnected()) {
    console.log('WebSocket already connected.');
    if (onConnect) onConnect();
    return;
  }

  // If already trying to connect, don't start another connection attempt
  if (connectionStatus === 'connecting') {
    console.log('WebSocket connection already in progress.');
    return;
  }

  connectionStatus = 'connecting';
  console.log('Initiating WebSocket connection...');

  // Get JWT token from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const token = currentUser?.token;

  if (!token) {
    console.error('No authentication token found');
    connectionStatus = 'disconnected';
    if (onError) onError({ message: 'Authentication token missing' });
    return;
  }

  try {
    // Cleanup any existing client
    if (stompClient) {
      stompClient.deactivate();
      stompClient = null;
    }

    // Create connection options
    stompClient = new Client({
      brokerURL: 'ws://localhost:8090/ws?token=' + token, // Append token to URL for initial connection
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log(str),

      // Add token to STOMP CONNECT frame headers
      connectHeaders: {
        'Authorization': `Bearer ${token}`
      },

      onConnect: (frame = {}) => {
        console.log('Connected:', frame || {});
        connectionStatus = 'connected';
        if (onConnect) onConnect(frame || {});
        subscription();
      },

      onStompError: (frame = {}) => {
        console.error('STOMP error:', frame || {});
        connectionStatus = 'disconnected';
        if (onError) onError(frame || {});
      },

      onWebSocketClose: () => {
        console.log('WebSocket connection closed');
        connectionStatus = 'disconnected';
        if (onDisconnect) onDisconnect();
      },

      // Handle connection errors
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        connectionStatus = 'disconnected';
        if (onError) onError(event);
      }
    });

    stompClient.activate();
    console.log('WebSocket activation initiated');

  } catch (error) {
    console.error('Error during WebSocket connection setup:', error);
    connectionStatus = 'disconnected';
    if (onError) onError(error);
  }
};

// Disconnect from WebSocket
export const disconnect = () => {
  if (stompClient) {
    try {
      stompClient.deactivate();
      console.log('WebSocket disconnected');
    } catch (error) {
      console.error('Error during disconnect:', error);
    } finally {
      stompClient = null;
      connectionStatus = 'disconnected';
    }
  }
};

// Subscribe to chat topic
export const subscribe = (chatId, onMessageReceived) => {
  if (!isConnected()) {
    console.warn('Cannot subscribe: WebSocket not connected');
    return null;
  }
  
  try {
    // Add token to subscription headers as well
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser?.token;
    
    const subscription = stompClient.subscribe(
      `/topic/chat/${chatId}`, // Append token to topic URL
      (message) => {
        try {
          const receivedMsg = JSON.parse(message.body);
          if (onMessageReceived){ 
            onMessageReceived(receivedMsg)
            console.log('Received message:', receivedMsg);
          }
        } catch (err) {
          console.error('Failed to parse message:', err);
        }
      },
      // Include token in subscription headers
      token ? { 'Authorization': `Bearer ${token}` } : {}
    );
    
    console.log(`Subscribed to /topic/chat/${chatId}`);
    return subscription;
  } catch (error) {
    console.error('Error during subscription:', error);
    return null;
  }
};

// Unsubscribe from chat topic
export const unsubscribe = (subscription) => {
  if (subscription) {
    try {
      subscription.unsubscribe();
      console.log('Unsubscribed from topic');
    } catch (error) {
      console.error('Error during unsubscribe:', error);
    }
  }
};

// Send message
export const sendMessage = (messageInput, senderId, chatId) => {
  if (!isConnected()) {
    console.warn('Cannot send message: WebSocket not connected');
    return false;
  }

  if (!messageInput || !messageInput.trim()) {
    console.warn('Cannot send empty message');
    return false;
  }

  try {
    const message = {
      content: messageInput,
      senderId,
      timestamp: new Date().toISOString(),
    };

    console.log('Sending message:', message);
    
    // Get token for message headers
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser?.token;
    
    stompClient.publish({
      destination: `/app/sendMessage/${chatId}`,
      body: JSON.stringify(message),
      // Include token in message headers
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    
    console.log(`Sent message to /app/sendMessage/${chatId}`);
    return true;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
};

// Reconnect function that can be called when connection is lost
export const reconnect = (callbacks = {}) => {
  disconnect();
  setTimeout(() => {
    connect(callbacks);
  }, 1000); // Wait a second before reconnecting
};