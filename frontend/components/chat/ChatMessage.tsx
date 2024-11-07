'use client';

import { ChatMessage as ChatMessageType } from '../../types';

interface Props {
    message: ChatMessageType;
    onOptionSelect?: (value: string) => void;
}

export default function ChatMessage({ message, onOptionSelect }: Props) {
    if (!message) {
        return null;
    }

    try {
        const fieldOptions: Record<string, string[]> = {
            gender: ['male', 'female', 'other'],
            residence: ['rural', 'urban'],
            family_status: ['single', 'married', 'widowed', 'divorced'],
            education: ['primary', 'secondary', 'higher', 'none'],
            disability: ['none', 'physical', 'mental', 'both']
        };

        const showOptions = message.role === 'assistant' && message.expectingInput;
        const expectingInput = message.expectingInput || '';

        return (
            <div className={`p-4 rounded-lg ${
                message.role === 'assistant' 
                    ? 'bg-white shadow-sm ml-4' 
                    : 'bg-blue-500 text-white mr-4'
            }`}>
                <p className="mb-3">{message.content}</p>
                {showOptions && expectingInput && fieldOptions[expectingInput] && (
                    <div className="flex flex-wrap gap-2">
                        {fieldOptions[expectingInput].map((option) => (
                            <button
                                key={option}
                                onClick={() => onOptionSelect?.(option)}
                                className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {showOptions && ['age', 'income'].includes(expectingInput) && (
                    <div className="mt-2">
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            placeholder={`Enter your ${expectingInput}`}
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                    const target = e.currentTarget;
                                    if (target.value) {
                                        onOptionSelect?.(target.value);
                                    }
                                }
                            }}
                        />
                    </div>
                )}
                {showOptions && expectingInput === 'name' && (
                    <div className="mt-2">
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Enter your name"
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                    const target = e.currentTarget;
                                    if (target.value) {
                                        onOptionSelect?.(target.value);
                                    }
                                }
                            }}
                        />
                    </div>
                )}
            </div>
        );
    } catch (error) {
        console.error('Error rendering message:', error);
        return (
            <div className="p-4 text-red-500">
                Error displaying message. Please refresh the page.
            </div>
        );
    }
}