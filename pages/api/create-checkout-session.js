// pages/api/create-checkout-session.js
import Stripe from "stripe";

const urlHome = process.env.NEXT_PUBLIC_URL_FRONT

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});
 


export default async function handler(req, res) {
  console.log(`Received request with method: ${req.method}`); // Log el método recibido
  if (req.method === 'POST') {
    try {
      const { title, price, description, userId, eventId} = req.body;
      console.log('Request body:', req.body); // Log el cuerpo de la solicitud
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: title,
                description: description,
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${urlHome}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${urlHome}/experience`,
        metadata: {
          userId,
          eventId
        }
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
