import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { blueprintId, email } = req.body;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Marketing Blueprint',
            description: 'Your personalized 90-day marketing roadmap — PDF emailed instantly.',
          },
          unit_amount: 1999,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.VITE_APP_URL}/results?blueprintId=${blueprintId}&success=true`,
    cancel_url: `${process.env.VITE_APP_URL}/questionnaire?cancelled=true`,
    metadata: { blueprintId },
  });

  return res.status(200).json({ url: session.url });
}
