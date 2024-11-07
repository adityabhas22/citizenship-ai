'use client';

import { ChatMessage as ChatMessageType, UserDataField } from '../../types';
import { useState } from 'react';
import { useChat } from '../../context/ChatContext';

interface Props {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
    const [input, setInput] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const { handleUserInput } = useChat();
    
    if (!message) return null;

    const handleSubmit = (value: string) => {
        if (!value.trim()) return;
        handleUserInput(value.trim());
        setInput('');
        setIsAnswered(true);
    };

    try {
        const fieldOptions: Record<string, string[]> = {
            gender: ['male', 'female', 'other'],
            residence: ['rural', 'urban'],
            family_status: ['single', 'married', 'widowed', 'divorced'],
            education: ['primary', 'secondary', 'higher', 'none'],
            disability: ['none', 'physical', 'mental', 'both']
        };

        const showOptions = message.role === 'assistant' && message.expectingInput && !isAnswered;
        const expectingInput = message.expectingInput || '';

        return (
            <div className={`p-4 rounded-lg max-w-2xl mx-auto ${
                message.role === 'assistant' 
                    ? 'bg-white shadow-sm text-black' 
                    : 'bg-blue-500 text-white ml-auto'
            }`}>
                <p className="mb-3 font-bold text-lg">{message.content}</p>
                {showOptions && fieldOptions[expectingInput] && fieldOptions[expectingInput].length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {fieldOptions[expectingInput].map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSubmit(option)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors font-bold text-black"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {showOptions && ['age', 'income', 'name'].includes(expectingInput) && (
                    <input
                        type={['age', 'income'].includes(expectingInput) ? 'number' : 'text'}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-black"
                        placeholder={`Enter your ${expectingInput}`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleSubmit(input);
                            }
                        }}
                        autoFocus
                    />
                )}
            </div>
        );
    } catch (error) {
        console.error('Error rendering message:', error);
        return (
            <div className="p-4 text-red-500 font-bold">
                Error displaying message. Please refresh the page.
            </div>
        );
    }
}