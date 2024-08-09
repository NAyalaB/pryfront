import { IUser } from "@/src/types/IUser";
const apiUrl = process.env.NEXT_PUBLIC_API_URL  

export const fetchUserById = async (id: string, token: string): Promise<IUser> => {
    console.log(`Fetching user with ID: ${id}`);
    
    const response = await fetch(`${apiUrl}/users/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });

    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
        console.error(`Error fetching user: ${response.statusText}`);
        throw new Error(`Error: ${response.statusText}`);
    }

    const data: IUser = await response.json();
    console.log('User data fetched:', data);

    return data;
};
