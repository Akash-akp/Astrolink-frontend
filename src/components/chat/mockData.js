export const mockConsultations = [
    {
      id: 'consultation_1',
      issue: 'Career Guidance',
      chats: [
        {
          id: 'chat_1',
          title: 'Astrologer1',
          messages: [
            { id: 'msg_1', senderId: 'astrologer', text: 'Hello, how can I help you?' },
            { id: 'msg_2', senderId: 'currentUser', text: 'I need guidance on my career.' },
          ],
        },
        {
            id: 'chat_2',
            title: 'Astrologer2',
            messages: [
              { id: 'msg_1', senderId: 'astrologer', text: 'Hello, how can I help you?' },
              { id: 'msg_2', senderId: 'currentUser', text: 'I need guidance on my career.' },
            ],
          },
      ],
    },
    {
      id: 'consultation_2',
      issue: 'Marriage Compatibility',
      chats: [
        {
          id: 'chat_2',
          title: 'Chat with Astrologer B',
          messages: [
            { id: 'msg_1', senderId: 'astrologer', text: 'Let’s discuss your compatibility.' },
          ],
        },
      ],
    },
  ];