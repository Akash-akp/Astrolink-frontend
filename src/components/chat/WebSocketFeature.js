import { Client } from '@stomp/stompjs';

let stompClient = null;

// Utility: Add log with timestamp
export const addLog = (message) => ({
  timestamp: new Date().toLocaleTimeString(),
  message,
});

// Connect to WebSocket server
export const connect = ({ onConnect, onDisconnect, onError } = {}) => {
  if (stompClient && stompClient.active) {
    console.log('WebSocket already connected.');
    return;
  }

  stompClient = new Client({
    brokerURL: 'ws://localhost:8090/ws',
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    onConnect: (frame) => {
      console.log('Connected:', frame);
      if (onConnect) onConnect(frame);
    },
    onStompError: (frame) => {
      console.error('STOMP error:', frame);
      if (onError) onError(frame);
    },
    onWebSocketClose: () => {
      console.log('WebSocket connection closed');
      if (onDisconnect) onDisconnect();
    },
  });

  stompClient.activate();
};

// Disconnect from WebSocket
export const disconnect = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('WebSocket disconnected');
  }
};

// Subscribe to chat topic
export const subscribe = (chatId, onMessageReceived) => {
  if (!stompClient || !stompClient.connected) {
    console.warn('Cannot subscribe: WebSocket not connected');
    return;
  }
  const subscription = stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
    try {
      const receivedMsg = JSON.parse(message.body);
      if (onMessageReceived) onMessageReceived(receivedMsg);
    } catch (err) {
      console.error('Failed to parse message:', err);
    }
  });
  return subscription;
};

// Unsubscribe from chat topic
export const unsubscribe = (subscription) => {
  if (subscription) {
    subscription.unsubscribe();
    console.log('Unsubscribed from topic');
  }
};

// Send message
export const sendMessage = (messageInput, senderId, chatId) => {
  if (!stompClient || !stompClient.connected || !messageInput.trim()) {
    console.warn('Cannot send message - not connected or empty message');
    return;
  }

  const message = {
    content: messageInput,
    senderId,
    timestamp: new Date().toISOString(),
  };

  console.log('Sending message:', message);

  stompClient.publish({
    destination: `/app/sendMessage/${chatId}`,
    body: JSON.stringify(message),
  });
  console.log(`Sent message to /app/sendMessage/${chatId}`);
};