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
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {showOptions && ['age', 'income'].includes(expectingInput) && (
                    <input
                        type="number"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={`Enter your ${expectingInput}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value) {
                                    onOptionSelect?.(target.value);
                                }
                            }
                        }}
                    />
                )}
                {showOptions && expectingInput === 'name' && (
                    <input
                        type="text"
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter your name"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const target = e.target as HTMLInputElement;
                                if (target.value) {
                                    onOptionSelect?.(target.value);
                                }
                            }
                        }}
                    />
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