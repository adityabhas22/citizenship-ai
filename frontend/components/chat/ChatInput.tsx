'use client';

import { useState } from 'react';
import { useChat } from '../../context/ChatContext';

export default function ChatInput() {
    const [input, setInput] = useState('');
    const { handleUserInput, isComplete } = useChat();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isComplete) return;

        handleUserInput(input.trim());
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder={isComplete ? "Chat complete" : "Type your answer..."}
                disabled={isComplete}
            />
        </form>
    );
} 