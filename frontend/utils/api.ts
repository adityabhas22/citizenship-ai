const API_BASE_URL = 'http://localhost:5000';

export async function saveUserAndGetSchemes(userData: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/save-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save user data and get schemes');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
} 