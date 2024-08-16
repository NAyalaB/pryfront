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
const apiUrl = process.env.NEXT_PUBLIC_API_URL

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            console.error('Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event.type === 'payment_intent.payment_failed' || event.type === 'checkout.session.expired') {
            const session = event.data.object;
            const eventId = session.metadata.eventId;
            const userId = session.metadata.userId;

            // Aquí haces la solicitud para eliminar la reserva
            await fetch(`${apiUrl}/booking/${userId}/${eventId}`, {
                method: 'DELETE',
            });

            console.log(`Reserva eliminada para usuario ${userId} y evento ${eventId}`);
        }

        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
