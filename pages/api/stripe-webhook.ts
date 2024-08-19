// pages/api/stripe-webhook.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const backApi = process.env.NEXT_PUBLIC_API_URL;

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    console.error('No stripe-signature header value was provided.');
    return res.status(400).send('No stripe-signature header value was provided.');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
    const sessionId = event.data.object.id as string;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.metadata) {
        const userId = session.metadata.userId;
        const eventId = session.metadata.eventId;

        if (userId && eventId) {
          const response = await fetch(`${backApi}/booking/${userId}/${eventId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error(`Failed to delete reservation: ${response.statusText}`);
          }
        } else {
          console.error('User ID or Event ID is missing in the metadata');
        }
      } else {
        console.error('Metadata is null');
      }

      res.json({ received: true });
    } catch (error) {
      console.error(`Failed to handle webhook event: ${error}`);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.json({ received: true });
  }
};

export default handler;
