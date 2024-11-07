'use client';

import { useChat } from '../../context/ChatContext';
import ChatMessage from './ChatMessage';
import SchemeResults from './SchemeResults';
import { useRef, useEffect } from 'react';

export default function ChatInterface() {
    const { messages, isComplete, schemes, error } = useChat();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="max-w-3xl mx-auto h-screen flex flex-col px-4">
            <div className="flex-1 overflow-y-auto py-8 space-y-4">
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
                    <div className="p-4 bg-red-100 text-red-600 rounded-lg font-bold">
                        Error: {error}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}