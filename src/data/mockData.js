export const mockUsers = [
  {
    id: 'user1',
    name: 'John Smith',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'online'
  },
  {
    id: 'user2',
    name: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'offline'
  },
  {
    id: 'user3',
    name: 'Michael Brown',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'online'
  }
];

export const mockChats = [
  {
    id: 'chat1',
    participants: ['user1', 'currentUser'],
    unreadCount: 3,
    lastMessage: {
      id: 'msg1',
      senderId: 'user1',
      text: 'Hey, how are you doing?',
      timestamp: '2024-03-10T10:30:00Z'
    }
  },
  {
    id: 'chat2',
    participants: ['user2', 'currentUser'],
    unreadCount: 0,
    lastMessage: {
      id: 'msg2',
      senderId: 'currentUser',
      text: 'The project is coming along nicely!',
      timestamp: '2024-03-10T09:15:00Z'
    }
  },
  {
    id: 'chat3',
    participants: ['user3', 'currentUser'],
    unreadCount: 1,
    lastMessage: {
      id: 'msg3',
      senderId: 'user3',
      text: 'Can we schedule a meeting?',
      timestamp: '2024-03-09T18:45:00Z'
    }
  }
];

export const mockMessages = {
  'chat1': [
    {
      id: 'msg1_1',
      senderId: 'user1',
      text: 'Hey there!',
      timestamp: '2024-03-10T10:00:00Z'
    },
    {
      id: 'msg1_2',
      senderId: 'currentUser',
      text: 'Hi! How are you?',
      timestamp: '2024-03-10T10:15:00Z'
    },
    {
      id: 'msg1_3',
      senderId: 'user1',
      text: "I'm doing great, thanks! How about you?",
      timestamp: '2024-03-10T10:30:00Z'
    }
  ],
  'chat2': [
    {
      id: 'msg2_1',
      senderId: 'currentUser',
      text: "How's the project going?",
      timestamp: '2024-03-10T09:00:00Z'
    },
    {
      id: 'msg2_2',
      senderId: 'user2',
      text: 'Making good progress!',
      timestamp: '2024-03-10T09:10:00Z'
    },
    {
      id: 'msg2_3',
      senderId: 'currentUser',
      text: 'The project is coming along nicely!',
      timestamp: '2024-03-10T09:15:00Z'
    }
  ],
  'chat3': [
    {
      id: 'msg3_1',
      senderId: 'user3',
      text: 'Hello, are you available?',
      timestamp: '2024-03-09T18:30:00Z'
    },
    {
      id: 'msg3_2',
      senderId: 'currentUser',
      text: "Yes, what's up?",
      timestamp: '2024-03-09T18:40:00Z'
    },
    {
      id: 'msg3_3',
      senderId: 'user3',
      text: 'Can we schedule a meeting?',
      timestamp: '2024-03-09T18:45:00Z'
    }
  ]
};