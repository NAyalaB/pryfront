// pages/api/create-checkout-session.js
import Stripe from "stripe";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

const apiBack = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, price, description, quantity, userId, eventsId, email } = req.body;

      if (!quantity || quantity < 1) {
        res.status(400).json({ error: "Invalid quantity" });
        return;
      }

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
            quantity: quantity,
          },
        ],
        mode: 'payment',



        success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url: `${frontendUrl}/experience`,
        metadata: {
          eventId: eventsId,
          userId: userId,
          email: email
        }
      });

      setTimeout(async () => {
        try {

          const response = await fetch(`${apiBack}/booking/${userId}/${eventsId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const result = await response.json();
        } catch (error) {
        }
      }, 60000);


      console.log('Checkout session created:', session);

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