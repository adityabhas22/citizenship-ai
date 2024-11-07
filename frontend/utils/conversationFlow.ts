import { UserDataField, UserData } from '../types';

export const QUESTIONS: Record<UserDataField, string> = {
    name: "What is your name?",
    age: "What is your age?",
    income: "What is your annual income?",
    gender: "What is your gender? (male/female/other)",
    residence: "Do you live in a rural or urban area?",
    disability: "Do you have any disabilities? (If none, type 'none')",
    family_status: "What is your family status? (single/married/widowed/divorced)",
    education: "What is your education level? (primary/secondary/higher/none)"
};

export const FIELD_ORDER: UserDataField[] = [
    'name',
    'age',
    'income',
    'gender',
    'residence',
    'disability',
    'family_status',
    'education'
];

export function validateInput(field: UserDataField, value: string): { isValid: boolean; message?: string } {
    switch (field) {
        case 'age':
            const age = parseInt(value);
            if (isNaN(age) || age < 0 || age > 120) {
                return { isValid: false, message: "Please enter a valid age between 0 and 120" };
            }
            break;
        case 'income':
            const income = parseInt(value);
            if (isNaN(income) || income < 0) {
                return { isValid: false, message: "Please enter a valid income" };
            }
            break;
        case 'gender':
            if (!['male', 'female', 'other'].includes(value.toLowerCase())) {
                return { isValid: false, message: "Please enter 'male', 'female', or 'other'" };
            }
            break;
        case 'residence':
            if (!['rural', 'urban'].includes(value.toLowerCase())) {
                return { isValid: false, message: "Please enter 'rural' or 'urban'" };
            }
            break;
        case 'family_status':
            if (!['single', 'married', 'widowed', 'divorced'].includes(value.toLowerCase())) {
                return { isValid: false, message: "Please enter 'single', 'married', 'widowed', or 'divorced'" };
            }
            break;
        case 'education':
            if (!['primary', 'secondary', 'higher', 'none'].includes(value.toLowerCase())) {
                return { isValid: false, message: "Please enter 'primary', 'secondary', 'higher', or 'none'" };
            }
            break;
    }
    return { isValid: true };
} 