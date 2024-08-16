"use client"
// app/success/page.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Success = () => {
    const router = useRouter();
    const [sessionId, setSessionId] = useState(null);
    const generateNumericId = () => Math.floor(Math.random() * 1000000000);
    const transactionNumber = generateNumericId().toString();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const urlHome = process.env.NEXT_PUBLIC_URL_FRONT

    useEffect(() => {
        // Solo se accede a window.location.search después de que el componente se haya montado
        const searchParams = new URLSearchParams(window.location.search);
        const session_id = searchParams.get('session_id');
        setSessionId(session_id);
    }, []);


    useEffect(() => {
        const handlePostPayment = async () => {
            if (sessionId) {
                try {
                    // Obtén la información de la sesión de pago
                    const response = await fetch(`/api/get-session-info?session_id=${sessionId}`);
                    const sessionData = await response.json();



                    const eventId = parseInt(sessionData.metadata.eventId, 10);
                    const userId = parseInt(sessionData.metadata.userId, 10);

                    if (!sessionData || !sessionData.metadata) {
                        throw new Error('Invalid session data');
                    }


                    const patchResponse = await fetch(`${apiUrl}/booking/${userId}/${eventId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            TransactionNumber: transactionNumber,

                        }),
                    })

                    if (!patchResponse.ok) {
                        throw new Error('Failed to update booking with transaction number')
                    }
                    console.log('Booking updated successfully with transaction number:', transactionNumber);

                    router.push(`${urlHome}/home`);


                } catch (error) {
                    console.error('Error saving booking:', error);

                }


            }
        };

        handlePostPayment();
    }, [sessionId, router, quantity, transactionNumber, apiUrl]);

    return (
        <div className='border-s-2 text-green-700'>
            Thank you for your purchase! Your reservation is being processed.
        </div>
    );
};

export default Success;
