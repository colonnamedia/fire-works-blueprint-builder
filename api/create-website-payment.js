import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { blueprintId, email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Website Blueprint',
            description: 'Your personalized page-by-page website structure guide — PDF emailed instantly.',
          },
          unit_amount: 999,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/website-results?blueprintId=${blueprintId}&success=true`,
      cancel_url: `${process.env.APP_URL}/website-blueprint`,
      metadata: { blueprintId },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
