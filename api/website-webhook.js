import Stripe from 'stripe';
import pkg from 'pg';
const { Pool } = pkg;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const pool = new Pool({ connectionString: process.env.NEON_DATABASE_URL, ssl: { rejectUnauthorized: false } });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBSITE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const blueprintId = session.metadata?.blueprintId;
    if (blueprintId) {
      await pool.query(`UPDATE website_blueprints SET payment_status = 'paid' WHERE id = $1`, [blueprintId]);
      try {
        await fetch(`${process.env.APP_URL}/api/send-website-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ blueprintId }),
        });
      } catch (e) { console.error('Email error:', e); }
    }
  }
  return res.status(200).json({ received: true });
}
