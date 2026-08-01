import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { strategyId, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Advertising Strategy Guide',
            description: 'Your personalized Google & Meta advertising strategy — PDF emailed instantly.',
          },
          unit_amount: 1499,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/advertising-results?strategyId=${strategyId}&success=true`,
      cancel_url: `${process.env.APP_URL}/advertising`,
      metadata: { strategyId },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
