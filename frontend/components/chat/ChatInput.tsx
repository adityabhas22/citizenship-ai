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
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder={isComplete ? "Chat complete" : "Type your answer..."}
                    disabled={isComplete}
                />
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                    disabled={isComplete || !input.trim()}
                >
                    Send
                </button>
            </div>
        </form>
    );
}