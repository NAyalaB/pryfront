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

                    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

                    const eventId = parseInt(sessionData.metadata.eventId, 10);
                    const userId = parseInt(sessionData.metadata.userId, 10);

                    console.log('Session Data:', sessionData); // Depuración

                    if (!sessionData || !sessionData.metadata) {
                        throw new Error('Invalid session data');
                    }

                    const bookingResponse = await fetch(`${apiUrl}/booking`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            transactionNumber: transactionNumber,
                            quantity: 1,
                            paid: sessionData.amount_total / 100,
                            date: futureDate,
                            eventsId: eventId,
                            userId: userId,
                        }),
                    });

                    console.log('Booking Response Status:', bookingResponse.status); // Depuración
                    const bookingResponseData = await bookingResponse.json();
                    console.log('Booking Response Data:', bookingResponseData); // Depuración

                    if (!bookingResponse.ok) {
                        throw new Error('Failed to save booking');
                    }

                    // Redirige a una página de confirmación o al perfil del usuario
                    router.push('/home');
                } catch (error) {
                    console.error('Error saving booking:', error);
                    // Puedes mostrar un mensaje de error al usuario aquí
                }
            }
        };

        handlePostPayment();
    }, [sessionId, router]);

    return (
        <div className='border-s-2 text-green-700'>
            Thank you for your purchase! Your reservation is being processed.
        </div>
    );
};

export default Success;
