export interface UserData {
    name: string;
    income: number;
    gender: 'male' | 'female' | 'other';
    age: number;
    residence: 'rural' | 'urban';
    disability: string;
    family_status: 'single' | 'married' | 'widowed' | 'divorced';
    education: 'primary' | 'secondary' | 'higher' | 'none';
}

export interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    expectingInput?: UserDataField;
}

export type UserDataField = keyof UserData;