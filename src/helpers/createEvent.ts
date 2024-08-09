import { IEventProps } from "../types/IEventProps";

const apiUrl = process.env.NEXT_PUBLIC_API_URL  

export async function createEvent(eventData: IEventProps) {

    const keepData = {
        ...eventData,
        price: Number(eventData.price),
    maxseats: Number(eventData.maxseats),

    }
    try {
        console.log(keepData);
        const res = await fetch (`${apiUrl}/events`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'
            },
            body: JSON.stringify(keepData)

        })
        if (res.ok){
            return res.json()
        } else { 
            const errorData = await res.json();
          /*   alert ("error creating new event") */
            throw new Error(errorData.message || "error creating new event");
        }

    } catch (error: any) {
        throw new Error(error)
    }
} 

    