'use client';

import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SchemeResults from './SchemeResults';
import { useEffect } from 'react';

export default function ChatInterface() {
    const { messages, isComplete, schemes, error, handleUserInput } = useChat();

    useEffect(() => {
        if (error) {
            console.error('Chat error:', error);
        }
    }, [error]);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.map((message) => (
                    <ChatMessage 
                        key={message.id || Date.now()} 
                        message={message}
                        onOptionSelect={handleUserInput}
                    />
                ))}
                {isComplete && schemes && (
                    <SchemeResults schemes={schemes} />
                )}
                {error && (
                    <div className="p-4 bg-red-100 text-red-600 rounded-lg">
                        Error: {error}
                    </div>
                )}
            </div>
            <ChatInput />
        </div>
    );
}