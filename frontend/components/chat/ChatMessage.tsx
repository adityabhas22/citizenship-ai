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
        const fieldOptions: { [key: string]: string[] } = {
            gender: ['male', 'female', 'other'],
            residence: ['rural', 'urban'],
            family_status: ['single', 'married', 'widowed', 'divorced'],
            education: ['primary', 'secondary', 'higher', 'none'],
            disability: ['none', 'physical', 'mental', 'both']
        };

        const showOptions = message.role === 'assistant' && message.expectingInput;

        return (
            <div>
                <p>{message.content}</p>
                {showOptions && 
                 message.expectingInput && 
                 message.expectingInput in fieldOptions && ( // Ensure expectingInput is a valid key
                    <div>
                        {fieldOptions[message.expectingInput].map((option: string) => ( // Explicitly define `option` as string
                            <button
                                key={option}
                                onClick={() => onOptionSelect?.(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
                {showOptions && ['age', 'income'].includes(message.expectingInput || '') && (
                    <input
                        type="number"
                        placeholder={`Enter your ${message.expectingInput}`}
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
                {showOptions && message.expectingInput === 'name' && (
                    <input
                        type="text"
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
                Error displaying message. Try refreshing or contact support if the issue persists.
            </div>
        );
    }
}