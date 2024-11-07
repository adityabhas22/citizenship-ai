'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ChatMessage, UserData, UserDataField } from '../types';

interface ChatContextType {
    messages: ChatMessage[];
    addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
    userData: Partial<UserData>;
    handleUserInput: (input: string) => void;
    isComplete: boolean;
    schemes: string | null;
    error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userData, setUserData] = useState<Partial<UserData>>({});
    const [currentField, setCurrentField] = useState<UserDataField>('name');
    const [isComplete, setIsComplete] = useState(false);
    const [schemes, setSchemes] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (messages.length === 0) {
            addMessage({
                content: "Hello! I'll help you find suitable government schemes. What's your name?",
                role: 'assistant',
                expectingInput: 'name'
            });
        }
    }, []);

    const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        try {
            const newMessage = {
                ...message,
                id: `${Date.now()}-${Math.random()}`, // Ensures unique id
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Error adding message:', error);
            setError('Failed to add message');
        }
    };

    const handleUserInput = async (input: string) => {
        try {
            addMessage({
                content: input,
                role: 'user'
            });

            const updatedUserData = {
                ...userData,
                [currentField]: input
            };
            setUserData(updatedUserData);

            const fields: UserDataField[] = [
                'name', 'age', 'income', 'gender', 
                'residence', 'disability', 'family_status', 'education'
            ];
            
            const currentIndex = fields.indexOf(currentField);
            
            if (currentIndex < fields.length - 1) {
                const nextField = fields[currentIndex + 1];
                setCurrentField(nextField);
                
                const questions: Record<UserDataField, string> = {
                    name: "What's your name?",
                    age: "What's your age?",
                    income: "What's your monthly income?",
                    gender: "What's your gender? (male/female/other)",
                    residence: "Do you live in a rural or urban area?",
                    disability: "Do you have any disabilities? (none/physical/mental/both)",
                    family_status: "What's your family status? (single/married/widowed/divorced)",
                    education: "What's your education level? (primary/secondary/higher/none)"
                };
                
                addMessage({
                    content: questions[nextField],
                    role: 'assistant',
                    expectingInput: nextField
                });
            } else {
                setIsComplete(true);
                addMessage({
                    content: "Thank you! Saving your information and searching for matching schemes...",
                    role: 'assistant'
                });

                try {
                    const response = await fetch('http://localhost:3001/save-user', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedUserData)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to save user data');
                    }

                    const data = await response.json();
                    setSchemes(data.schemes);
                    
                    addMessage({
                        content: "Here are the schemes that match your profile:",
                        role: 'assistant'
                    });
                } catch (error) {
                    console.error('Error saving user data:', error);
                    setError('Failed to save user data and fetch schemes');
                    addMessage({
                        content: "Sorry, I encountered an error while processing your information. Please try again later.",
                        role: 'assistant'
                    });
                }
            }
        } catch (error) {
            console.error('Error handling user input:', error);
            setError('Failed to process user input');
        }
    };

    return (
        <ChatContext.Provider value={{
            messages,
            addMessage,
            userData,
            handleUserInput,
            isComplete,
            schemes,
            error
        }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};