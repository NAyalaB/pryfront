// pages/api/webhook.js
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            console.error('Fallo en la verificación de la firma del webhook:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Manejo del evento
        if (event.type === 'payment_intent.payment_failed' || event.type === 'checkout.session.expired') {
            const session = event.data.object;
            const eventId =  session.metadata.eventId;
            const userId =  session.metadata.userId;

            console.log('Intentando eliminar la reserva para el usuario:', userId, 'y evento:', eventId);

            try {
                const response = await fetch(`${apiUrl}/booking/${userId}/${eventId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error(`Error al eliminar la reserva: ${response.statusText}`);
                }

                console.log(`Reserva eliminada para el usuario ${userId} y el evento ${eventId}`);
            } catch (error) {
                console.error('Error al eliminar la reserva:', error);
            }
        }

        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Método no permitido');
    }
}
