import { Client } from '@stomp/stompjs';

const stompClient = { current: null };

export const addLog = (message) => {
  const timestamp = new Date().toLocaleTimeString();
  return { timestamp, message };
};

// Connect to WebSocket server
export const connect = (chatId, onConnectCallback) => {
  const client = new Client({
    brokerURL: 'ws://localhost:8090/ws',
    debug: (str) => {
      console.log(str);
    },
    onConnect: (frame) => {
      console.log('Connected: ' + frame);

      // Call the onConnectCallback if provided
      if (onConnectCallback) {
        onConnectCallback();
      }
    },
    onStompError: (frame) => {
      console.log(`Error: ${frame.headers.message}`);
      console.error('STOMP error', frame);
    },
    onWebSocketClose: () => {
      console.log('Connection closed');
    },
  });

  client.activate();
  stompClient.current = client;
};

// Disconnect from WebSocket
export const disconnect = () => {
  if (stompClient.current) {
    stompClient.current.deactivate();
    stompClient.current = null;
  }
};

// Subscribe to chat topic
export const subscribe = (chatId, onMessageReceived) => {
  if (!stompClient.current || !stompClient.current.connected) {
    console.log('Not connected');
    return;
  }

  console.log(`Subscribing to /topic/chat/${chatId}`);
  stompClient.current.subscribe(`/topic/chat/${chatId}`, (message) => {
    console.log(`Received message: ${message.body}`);
    const receivedMsg = JSON.parse(message.body);

    // Call the callback with the new message
    if (onMessageReceived) {
      onMessageReceived(receivedMsg);
    }
  });
};

// Send message
export const sendMessage = (messageInput, id, chatId) => {
  if (!stompClient.current || !stompClient.current.connected || !messageInput.trim()) {
    addLog('Cannot send message - not connected or empty message');
    return;
  }

  const timestamp = new Date().toLocaleTimeString();

  const message = {
    content: messageInput,
    senderId: id, // Should be dynamic in production
    timestamp: timestamp,
  };

  addLog(`Sending message to /app/sendMessage/${chatId}`);
  stompClient.current.publish({
    destination: `/app/sendMessage/${chatId}`,
    body: JSON.stringify(message),
  });
};