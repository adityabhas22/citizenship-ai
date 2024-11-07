'use client';

import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SchemeResults from './SchemeResults';
import { useEffect } from 'react';

export default function ChatInterface() {
    const { messages, isComplete, schemes, error } = useChat();

    useEffect(() => {
        if (error) {
            console.error('Chat error:', error);
        }
    }, [error]);

    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {messages && messages.map((message) => (
                    <ChatMessage 
                        key={message.id || Date.now()} 
                        message={message} 
                    />
                ))}
                {isComplete && schemes && (
                    <SchemeResults schemes={schemes} />
                )}
                {error && (
                    <div className="p-4 text-red-500">
                        Error: {error}
                    </div>
                )}
            </div>
            <ChatInput />
        </div>
    );
} 