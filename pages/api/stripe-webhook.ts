import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const backApi = process.env.NEXT_PUBLIC_API_URL;

export const config = {
  api: {
    bodyParser: false,  // Desactiva el bodyParser para esta ruta
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;

    try {
      // Lee el cuerpo como un buffer
      const buf = await buffer(req);
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Manejar el evento
    switch (event.type) {
      case 'payment_intent.payment_failed':
        console.log('Handling payment_intent.payment_failed event');
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata.userId;
        const eventId = paymentIntent.metadata.eventId;

        try {
          // Llama a tu endpoint DELETE para eliminar la reserva
          console.log(`Deleting reservation for user ${userId} and event ${eventId}`);
          await fetch(`${backApi}/booking/${userId}/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, eventId }),
          });

          console.log(`Reservation for user ${userId} and event ${eventId} has been deleted.`);
        } catch (error) {
          console.error('Error deleting reservation:', error);
          return res.status(500).send('Error deleting reservation');
        }
        break;
      // Maneja otros eventos según sea necesario
      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
