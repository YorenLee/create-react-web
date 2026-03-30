import React from 'react';
import { useChat } from './useChat';
import { ChatUI } from './ChatUI';

const Chat: React.FC = () => {
    useChat();
    return <ChatUI />;
};

export default Chat;
