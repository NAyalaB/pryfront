import Stripe from 'stripe';
import { buffer } from '../../src/helpers/buffer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      // La biblioteca de Stripe maneja la firma del webhook y el cuerpo como una cadena
      const buf = await buffer(req);
      event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Maneja el evento
    switch (event.type) {
      case 'checkout.session.expired':
      case 'payment_intent.payment_failed':
        const sessionId = event.data.object.id;

        try {
          // Recupera la sesión de Stripe usando el sessionId
          const session = await stripe.checkout.sessions.retrieve(sessionId);
          const userId = session.metadata.userId;
          const eventId = session.metadata.eventId;

          // Llama a tu endpoint DELETE para eliminar la reserva
          const response = await fetch(`${apiUrl}/booking/${userId}/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, eventId }),
          });

          if (!response.ok) {
            console.error(`Failed to delete reservation: ${response.statusText}`);
          } else {
            console.log(`Reservation for user ${userId} and event ${eventId} has been deleted.`);
          }
        } catch (error) {
          console.error(`Failed to handle webhook event: ${error}`);
          res.status(500).send('Internal Server Error');
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
