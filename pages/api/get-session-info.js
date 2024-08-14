// pages/api/get-session-info.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    try {
      // Obtén la información de la sesión de pago de Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id);
      console.log('Stripe Session:', session); // Depuración
      res.status(200).json(session);
    } catch (error) {
      console.error('Error retrieving session:', error);
      res.status(500).json({ error: 'Error retrieving session' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
