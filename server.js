import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import pkg from 'pg';
import { Resend } from 'resend';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';

const { Pool } = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());

// Raw body for Stripe webhooks
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use('/api/advertising-webhook', express.raw({ type: 'application/json' }));
app.use('/api/website-webhook', express.raw({ type: 'application/json' }));
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'dist')));

// ─── BLUEPRINT ROUTES ───────────────────────────────────────────────

// POST /api/submit-blueprint
app.post('/api/submit-blueprint', async (req, res) => {
  try {
    const {
      business_name, email, what_you_do, business_type, industry,
      team_size, years_in_business, website_status, online_presence,
      current_marketing, ideal_customer, biggest_challenges,
      primary_goal, monthly_budget, success_in_90_days
    } = req.body;

    const isLocalService = business_type === 'service_local';
    const isBrickMortar = business_type === 'product_physical';
    const isOnlineStore = business_type === 'product_digital' || (business_type === 'product_physical' && industry === 'Retail & E-commerce');
    const isOnlineService = business_type === 'service_online';

    const bizContext = isLocalService ? 'local service business' :
      isBrickMortar ? 'brick and mortar retail or restaurant business' :
      isOnlineStore ? 'online store or e-commerce business' :
      isOnlineService ? 'online service, coaching, or consulting business' :
      'hybrid business selling both services and products';

    const websiteNote = website_status === 'none' ? 'They have NO website yet.' :
      website_status === 'poor' ? 'They have a website but it needs significant work.' :
      website_status === 'okay' ? 'They have a decent website but not converting well.' :
      website_status === 'good' ? 'They have a good converting website.' :
      'Their website is currently being built.';

    const presenceNote = online_presence?.length > 0 ? `Currently active on: ${Array.isArray(online_presence) ? online_presence.join(', ') : online_presence}` : 'Not active on any platforms.';
    const marketingNote = current_marketing?.length > 0 ? `Currently doing: ${Array.isArray(current_marketing) ? current_marketing.join(', ') : current_marketing}` : 'Not doing any marketing.';
    const challengeNote = biggest_challenges?.length > 0 ? (Array.isArray(biggest_challenges) ? biggest_challenges.join(', ') : biggest_challenges) : 'No specific challenges identified.';

    const prompt = `You are an expert marketing strategist. Generate a comprehensive 90-day marketing blueprint for this ${bizContext}.

BUSINESS PROFILE:
Business Name: ${business_name}
Industry: ${industry}
What They Do: ${what_you_do || 'Not specified'}
Team Size: ${team_size || 'Not specified'}
Years in Business: ${years_in_business || 'Not specified'}
Ideal Customer: ${ideal_customer || 'Not specified'}
Website Status: ${websiteNote}
Online Presence: ${presenceNote}
Current Marketing: ${marketingNote}
Biggest Challenges: ${challengeNote}
Primary Goal: ${primary_goal || 'Get more leads'}
Monthly Budget: ${monthly_budget || 'Not specified'}
Success in 90 Days: ${success_in_90_days || 'Not specified'}

Return ONLY valid JSON:
{
  "business_category": "${isLocalService ? 'local_service' : isBrickMortar ? 'brick_mortar' : isOnlineStore ? 'online_store' : isOnlineService ? 'online_service' : 'hybrid'}",
  "hub_channels": ["ch1","ch2","ch3","ch4","ch5","ch6","ch7","ch8"],
  "priorities": [
    {"number":1,"title":"priority title","timing":"Do first","detail":"specific detail for this business"},
    {"number":2,"title":"priority title","timing":"Do first","detail":"detail"},
    {"number":3,"title":"priority title","timing":"Week 2","detail":"detail"},
    {"number":4,"title":"priority title","timing":"Week 2","detail":"detail"},
    {"number":5,"title":"priority title","timing":"Month 1","detail":"detail"},
    {"number":6,"title":"priority title","timing":"Month 2","detail":"detail"},
    {"number":7,"title":"priority title","timing":"Month 2","detail":"detail"},
    {"number":8,"title":"priority title","timing":"Month 3","detail":"detail"}
  ],
  "phase1": {"title":"Phase 1 — Foundation","time":"Days 1–30","focus":"focus sentence","seo_note":"SEO instructions for web designer","actions":["action1","action2","action3","action4","action5"]},
  "phase2": {"title":"Phase 2 — Growth","time":"Days 31–60","focus":"focus sentence","blog_note":"blog/content strategy","actions":["action1","action2","action3","action4","action5"]},
  "phase3": {"title":"Phase 3 — Scale","time":"Days 61–90","focus":"focus sentence","actions":["action1","action2","action3","action4","action5"]},
  "weeks": [
    {"label":"Wk 1–2","items":"item1\\nitem2\\nitem3"},
    {"label":"Wk 3–4","items":"item1\\nitem2"},
    {"label":"Wk 5–6","items":"item1\\nitem2"},
    {"label":"Wk 7–8","items":"item1\\nitem2"},
    {"label":"Wk 9–10","items":"item1\\nitem2"},
    {"label":"Wk 11–12","items":"item1\\nitem2"}
  ],
  "hcols": [
    {"label":"Days 1–30","items":"item1\\nitem2\\nitem3\\nitem4\\nitem5"},
    {"label":"Days 31–60","items":"item1\\nitem2\\nitem3\\nitem4\\nitem5"},
    {"label":"Days 61–90","items":"item1\\nitem2\\nitem3\\nitem4\\nitem5"}
  ]
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 4000 })
    });

    const groqData = await groqRes.json();
    const rawText = groqData.choices[0].message.content;
    let roadmap;
    try { roadmap = JSON.parse(rawText.replace(/```json|```/g, '').trim()); }
    catch { return res.status(500).json({ error: 'Failed to parse roadmap', detail: rawText }); }

    const result = await pool.query(
      `INSERT INTO blueprints (email, business_name, what_you_do, ideal_customer, main_goal, has_website, current_marketing, monthly_budget, who_does_marketing, biggest_challenge, years_in_business, success_in_90_days, roadmap)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [email, business_name, what_you_do || '', ideal_customer || '', primary_goal || '', website_status || '',
       Array.isArray(current_marketing) ? current_marketing : [],
       monthly_budget || '', team_size || '', challengeNote, years_in_business || '', success_in_90_days || '', JSON.stringify(roadmap)]
    );

    return res.status(200).json({ id: result.rows[0].id, roadmap });
  } catch (err) {
    console.error('submit-blueprint error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/create-payment
app.post('/api/create-payment', async (req, res) => {
  try {
    const { blueprintId, email } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Marketing Blueprint', description: 'Your personalized 90-day marketing roadmap — PDF emailed instantly.' }, unit_amount: 1999 }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/results?blueprintId=${blueprintId}&success=true`,
      cancel_url: `${process.env.APP_URL}/questionnaire`,
      metadata: { blueprintId },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/get-blueprint
app.get('/api/get-blueprint', async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const result = await pool.query('SELECT * FROM blueprints WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/webhook (blueprint)
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const blueprintId = session.metadata?.blueprintId;
    if (blueprintId) {
      await pool.query(`UPDATE blueprints SET payment_status = 'paid' WHERE id = $1`, [blueprintId]);
      try {
        const result = await pool.query('SELECT * FROM blueprints WHERE id = $1', [blueprintId]);
        if (result.rows.length > 0) {
          await sendBlueprintEmail(result.rows[0]);
        }
      } catch (e) { console.error('Email error:', e); }
    }
  }
  return res.status(200).json({ received: true });
});

// POST /api/send-blueprint-email
app.post('/api/send-blueprint-email', async (req, res) => {
  try {
    const { blueprintId } = req.body;
    const result = await pool.query('SELECT * FROM blueprints WHERE id = $1', [blueprintId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    await sendBlueprintEmail(result.rows[0]);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

async function sendBlueprintEmail(blueprint) {
  const roadmap = typeof blueprint.roadmap === 'string' ? JSON.parse(blueprint.roadmap) : blueprint.roadmap;
  const html = `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f3f4f6;margin:0;padding:0;">
<div style="max-width:600px;margin:0 auto;padding:24px 16px;">
  <div style="background:linear-gradient(135deg,#7C3AED,#2563EB);border-radius:12px;padding:32px;margin-bottom:20px;color:white;text-align:center;">
    <h1 style="margin:0 0 8px;font-size:24px;">Welcome to Your Digital Business Consultant</h1>
    <p style="margin:0;opacity:.8;font-size:14px;">Your personalized 90-day marketing blueprint for ${blueprint.business_name} is ready.</p>
  </div>
  <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;">
    <h2 style="color:#7C3AED;margin:0 0 16px;font-size:16px;">Your 90-Day Blueprint Summary</h2>
    ${roadmap?.phase1 ? `<div style="border-left:3px solid #7C3AED;padding:12px 16px;margin-bottom:12px;background:#f9fafb;border-radius:0 8px 8px 0;">
      <p style="font-weight:600;color:#111827;margin:0 0 6px;">${roadmap.phase1.title} — ${roadmap.phase1.time}</p>
      <p style="font-size:13px;color:#6b7280;margin:0;">${roadmap.phase1.focus}</p>
    </div>` : ''}
    ${roadmap?.phase2 ? `<div style="border-left:3px solid #2563EB;padding:12px 16px;margin-bottom:12px;background:#f9fafb;border-radius:0 8px 8px 0;">
      <p style="font-weight:600;color:#111827;margin:0 0 6px;">${roadmap.phase2.title} — ${roadmap.phase2.time}</p>
      <p style="font-size:13px;color:#6b7280;margin:0;">${roadmap.phase2.focus}</p>
    </div>` : ''}
    ${roadmap?.phase3 ? `<div style="border-left:3px solid #059669;padding:12px 16px;margin-bottom:12px;background:#f9fafb;border-radius:0 8px 8px 0;">
      <p style="font-weight:600;color:#111827;margin:0 0 6px;">${roadmap.phase3.title} — ${roadmap.phase3.time}</p>
      <p style="font-size:13px;color:#6b7280;margin:0;">${roadmap.phase3.focus}</p>
    </div>` : ''}
  </div>
  <div style="background:#EFF6FF;border-radius:12px;padding:24px;margin-bottom:16px;text-align:center;">
    <h2 style="color:#1E40AF;margin:0 0 8px;font-size:16px;">🔥 Ready to build your ad campaigns?</h2>
    <p style="color:#374151;font-size:13px;margin:0 0 16px;">Your blueprint tells you what to do first. The Fire-Works AI Campaign Builder generates your actual Google and Meta ad campaigns.</p>
    <div style="margin-bottom:12px;">
      <span style="font-size:12px;background:white;border:1px solid #e5e7eb;border-radius:4px;padding:3px 8px;margin:2px;">Google Ads — $9.99</span>
      <span style="font-size:12px;background:white;border:1px solid #e5e7eb;border-radius:4px;padding:3px 8px;margin:2px;">Meta Ads — $9.99</span>
      <span style="font-size:12px;background:white;border:1px solid #e5e7eb;border-radius:4px;padding:3px 8px;margin:2px;">Google + Meta — $16.99</span>
    </div>
    <a href="https://www.fireworks-campaignbuilder.com" style="display:inline-block;background:linear-gradient(135deg,#2563EB,#4F46E5);color:white;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none;">Build My Ad Campaigns →</a>
  </div>
  <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;text-align:center;">
    <p style="color:#374151;font-size:13px;margin:0 0 12px;">View your full interactive blueprint online:</p>
    <a href="${process.env.APP_URL}/results?blueprintId=${blueprint.id}&success=true" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#2563EB);color:white;font-weight:600;font-size:13px;padding:10px 24px;border-radius:8px;text-decoration:none;">View My Full Blueprint →</a>
  </div>
  <div style="text-align:center;padding:16px 0;">
    <p style="color:#9ca3af;font-size:11px;margin:0;">Fire-Works Business Blueprint · A Colonna Media tool · fireworks-businessblueprint.com</p>
  </div>
</div>
</body></html>`;

  await resend.emails.send({
    from: 'Fire-Works Blueprint <onboarding@resend.dev>',
    to: blueprint.email,
    subject: `🔥 Your 90-Day Marketing Blueprint for ${blueprint.business_name} is Ready`,
    html,
  });

  await pool.query(`UPDATE blueprints SET email_sent = true WHERE id = $1`, [blueprint.id]);
}

// ─── ADVERTISING ROUTES ──────────────────────────────────────────────

app.post('/api/submit-advertising', async (req, res) => {
  try {
    const { business_name, email, what_you_sell, ideal_customer, business_type, website_status, pixel_status, current_ads, ad_goal, monthly_budget, biggest_competitor, success_goal } = req.body;

    const websiteNote = website_status === 'none' ? 'No website yet.' : website_status === 'poor' ? 'Website needs work.' : website_status === 'okay' ? 'Decent but not converting.' : 'Good converting website.';
    const pixelNote = pixel_status === 'both' ? 'Both Google Tag and Meta Pixel installed.' : pixel_status === 'none' ? 'NO tracking pixels installed — must set up before ads.' : `Partial tracking: ${pixel_status}`;

    const prompt = `You are an expert digital advertising strategist. Generate a comprehensive advertising strategy for this business.

Business: ${business_name} | Type: ${business_type} | Sells: ${what_you_sell} | Customer: ${ideal_customer}
Competitor: ${biggest_competitor || 'None'} | Website: ${websiteNote} | Tracking: ${pixelNote}
Current Ads: ${current_ads} | Goal: ${ad_goal} | Budget: ${monthly_budget} | Success: ${success_goal}

Return ONLY valid JSON:
{
  "platform_recommendation": {"primary":"Google or Meta","primary_reason":"reason","secondary":"secondary platform","secondary_reason":"reason","skip":null},
  "google_strategy": {"use":true,"campaign_type":"Search/Local/Shopping","campaign_type_reason":"reason","targeting":"specific targeting","budget_allocation":"allocation","example_keywords":["kw1","kw2","kw3","kw4","kw5"],"setup_priority":"when to set up","pro_tip":"specific tip"},
  "meta_strategy": {"use":true,"objective":"Leads/Sales/Traffic","objective_reason":"reason","audience":"specific audience","creative_type":"image/video/carousel","budget_allocation":"allocation","setup_priority":"when","pro_tip":"tip"},
  "retargeting_strategy": {"ready_to_retarget":true,"why":"explanation","sequence":[{"step":1,"trigger":"trigger","ad_type":"type","message":"message","platform":"platform","timing":"timing"},{"step":2,"trigger":"trigger","ad_type":"type","message":"message with stronger offer","platform":"platform","timing":"timing"},{"step":3,"trigger":"trigger","ad_type":"type","message":"final strongest offer","platform":"platform","timing":"timing"}],"setup_instructions":"instructions"},
  "budget_plan": {"total":"${monthly_budget}","breakdown":[{"platform":"platform","amount":"amount","reason":"reason"},{"platform":"platform","amount":"amount","reason":"reason"}],"minimum_test_period":"timeframe","expected_results":"realistic expectation"},
  "action_plan": {"before_ads":["prerequisite1","prerequisite2"],"week1_2":["action1","action2","action3"],"week3_4":["action1","action2","action3"],"month2_plus":["action1","action2","action3"]},
  "competitor_strategy": ${biggest_competitor ? `"strategy for competing against ${biggest_competitor}"` : 'null'},
  "biggest_mistake": "most common mistake for this business type",
  "success_metrics": ["metric1","metric2","metric3"]
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 3000 })
    });

    const groqData = await groqRes.json();
    let strategy;
    try { strategy = JSON.parse(groqData.choices[0].message.content.replace(/```json|```/g, '').trim()); }
    catch { return res.status(500).json({ error: 'Parse failed' }); }

    await pool.query(`CREATE TABLE IF NOT EXISTS advertising_strategies (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT, business_name TEXT, what_you_sell TEXT, ideal_customer TEXT, business_type TEXT, website_status TEXT, pixel_status TEXT, current_ads TEXT, ad_goal TEXT, monthly_budget TEXT, biggest_competitor TEXT, success_goal TEXT, strategy JSONB, payment_status TEXT DEFAULT 'unpaid', email_sent BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`);

    const result = await pool.query(
      `INSERT INTO advertising_strategies (email, business_name, what_you_sell, ideal_customer, business_type, website_status, pixel_status, current_ads, ad_goal, monthly_budget, biggest_competitor, success_goal, strategy) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [email, business_name, what_you_sell, ideal_customer, business_type, website_status, pixel_status, current_ads, ad_goal, monthly_budget, biggest_competitor, success_goal, JSON.stringify(strategy)]
    );

    return res.status(200).json({ id: result.rows[0].id, strategy });
  } catch (err) {
    console.error('submit-advertising error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/create-advertising-payment', async (req, res) => {
  try {
    const { strategyId, email } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Advertising Strategy Guide', description: 'Your personalized Google & Meta advertising strategy — PDF emailed instantly.' }, unit_amount: 1499 }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/advertising-results?strategyId=${strategyId}&success=true`,
      cancel_url: `${process.env.APP_URL}/advertising`,
      metadata: { strategyId },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/get-advertising-strategy', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await pool.query('SELECT * FROM advertising_strategies WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/advertising-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ADVERTISING_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const strategyId = event.data.object.metadata?.strategyId;
    if (strategyId) {
      await pool.query(`UPDATE advertising_strategies SET payment_status = 'paid' WHERE id = $1`, [strategyId]);
    }
  }
  return res.status(200).json({ received: true });
});

// ─── WEBSITE BLUEPRINT ROUTES ────────────────────────────────────────

app.post('/api/submit-website-blueprint', async (req, res) => {
  try {
    const { business_name, email, business_type, industry_note, website_status, builder, primary_goal, primary_cta, takes_reservations, sells_online, has_portfolio, emergency_service, specific_notes } = req.body;

    const prompt = `You are an expert web designer. Generate personalized website structure insights for this ${business_type} business: ${business_name}.
Builder: ${builder} | Goal: ${primary_goal} | CTA: ${primary_cta} | Emergency: ${emergency_service || 'no'} | Reservations: ${takes_reservations || 'no'} | Notes: ${specific_notes || 'none'}

Return ONLY valid JSON:
{
  "headline_recommendation": "suggested homepage headline",
  "meta_description": "150-160 char meta description",
  "builder_tip": "specific tip for their builder/situation",
  "section_insights": {"1":"insight","2":"insight","3":"insight","4":"insight","5":"insight","6":"insight","7":"insight","8":"insight"},
  "top_3_priorities": ["priority1","priority2","priority3"],
  "common_mistake": "most common mistake for this business type"
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: JSON.stringify({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 2000 })
    });

    const groqData = await groqRes.json();
    let aiInsights;
    try { aiInsights = JSON.parse(groqData.choices[0].message.content.replace(/```json|```/g, '').trim()); }
    catch { aiInsights = {}; }

    const STRUCTURES = {
      restaurant: { label: "Restaurant / Cafe / Bar", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"Full-width food/atmosphere photo. Headline capturing your vibe. Two CTAs: View Menu and Reserve a Table. Hours visible.", tips:["Use professional food photos — not stock","Make CTA buttons large and impossible to miss","Show hours immediately — people check right away"] },
        { order:2, name:"Menu", priority:"Critical", desc:"Full menu as actual text — not a PDF. Google indexes text menus. Organize by category with prices.", tips:["Never use a PDF menu — Google cannot read it","Include prices — hiding them loses trust","Add Featured Dishes callout for your best items"] },
        { order:3, name:"Online Ordering / Reservations", priority:"High", desc:"Embed your ordering and reservation system directly on the page — not just a link.", tips:["Connect reservation system to Google Business Profile","If no reservations, state your walk-in policy clearly","Online ordering should be as visible as the menu"] },
        { order:4, name:"Location, Hours & Directions", priority:"Critical", desc:"Embedded Google Map with Get Directions button. Full address, phone, and hours for every day.", tips:["Embed a live Google Map — not just an address","List hours for every day of the week","Add parking info if relevant"] },
        { order:5, name:"About / Story", priority:"Medium", desc:"Short genuine story about your restaurant. Who started it, why, what makes it special.", tips:["Keep it to 3-4 sentences","Include a photo of the owner or team","Mention your neighborhood — good for local SEO"] },
        { order:6, name:"Events & Specials", priority:"Medium", desc:"Weekly specials, live music, trivia nights, happy hour. Keep updated and link to Facebook Events.", tips:["Update regularly — stale content hurts credibility","Add email signup for event notifications","Highlight recurring events so people plan ahead"] },
        { order:7, name:"Reviews / Social Proof", priority:"High", desc:"Pull in your best Google or Yelp reviews. Show star rating. Include direct review link.", tips:["Display overall star rating prominently","Include 3-5 specific quotes from real reviews","Add a Leave us a review button"] },
        { order:8, name:"Contact / Footer", priority:"High", desc:"Phone (tap-to-call), email, address, social media, hours repeated.", tips:["Make phone number a clickable link on mobile","Include all social media links","Repeat address and hours for easy access"] },
      ]},
      local_service: { label: "Local Service Business", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"Bold headline with what you do and where. Phone number large at top. CTA: Get a Free Quote / Call Now. Emergency button if 24/7.", tips:["Your phone number should be the biggest element","If 24/7 — add red Emergency Service badge at very top","Use photos of your team or truck — not stock photos"] },
        { order:2, name:"Services", priority:"Critical", desc:"Every service with description. Link each to a dedicated service page for SEO.", tips:["Create a separate page for each major service — huge for local SEO","List emergency and high-ticket services first","Add pricing ranges if comfortable — filters leads"] },
        { order:3, name:"Get a Quote / Contact Form", priority:"Critical", desc:"Simple form high on the page. Name, phone, email, service needed.", tips:["Fewer fields = more submissions. Name + phone is often enough","Add We respond within 2 hours to set expectations","Consider a chat widget if you respond quickly"] },
        { order:4, name:"Why Choose Us / Trust Signals", priority:"High", desc:"Years in business, licenses, certifications, insurance badges, awards.", tips:["Include your license number — builds massive trust","Add BBB rating, Google rating, or awards","Show before/after photos of your work"] },
        { order:5, name:"Service Area", priority:"High", desc:"List every city and neighborhood you serve. Critical for local SEO.", tips:["List every city you serve — even if it feels repetitive","Each city is a potential SEO keyword","Consider a service area map graphic"] },
        { order:6, name:"Reviews / Testimonials", priority:"High", desc:"Google review rating and 3-5 specific quotes. Direct link to leave a review.", tips:["Real reviews with customer names perform better","Include the service they used in context","Respond to your reviews — shows you care"] },
        { order:7, name:"FAQ", priority:"Medium", desc:"Top 5-8 questions customers ask before hiring. Pricing, process, what to expect.", tips:["Use actual questions you get asked","FAQ content is great for Google People Also Ask","Keep answers concise — 2-4 sentences"] },
        { order:8, name:"Contact / Footer", priority:"High", desc:"Phone, email, address, service area, hours, license number.", tips:["Repeat your phone number in the footer","Include license and insurance info","Add a map if you have a physical office"] },
      ]},
      gym_fitness: { label: "Gym / Fitness Studio", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"High-energy photo or video of classes in action. Bold headline. CTA: Start Your Free Trial / View Schedule.", tips:["Video backgrounds perform extremely well for gyms","Show real members — not stock fitness photos","Free trial CTA converts better than Join Now for first-time visitors"] },
        { order:2, name:"Class Types / What We Offer", priority:"Critical", desc:"Cards for each class type. Name, description, who it's for, difficulty level.", tips:["Show 3-4 class types prominently","Include beginners welcome messaging","Add class duration and what to bring"] },
        { order:3, name:"Class Schedule", priority:"Critical", desc:"Embedded scheduling software directly on the page.", tips:["Embed your scheduling software — don't link away","Show today's classes prominently","Make it easy to book from the schedule"] },
        { order:4, name:"Free Trial / Lead Capture", priority:"Critical", desc:"Dedicated section promoting free trial. Simple form: name, email, phone.", tips:["Free trial should appear within first two scrolls","Add social proof: Join 200+ members","Follow up immediately after form submission"] },
        { order:5, name:"Coaches / Instructors", priority:"High", desc:"Profile cards for each coach — photo, name, certifications, specialty.", tips:["Real photos of coaches","Include certifications and years of experience","Add personal quote or training philosophy"] },
        { order:6, name:"Pricing / Memberships", priority:"High", desc:"Clear membership options with pricing. 3 tiers: Drop-in, Monthly, Annual.", tips:["Don't hide pricing — builds trust","Highlight your most popular plan","Add First class free or trial option"] },
        { order:7, name:"Testimonials / Transformations", priority:"High", desc:"Member success stories with photos. Video testimonials perform best.", tips:["Ask members for testimonials after first month","Include name, how long member, what achieved","Video testimonials are gold"] },
        { order:8, name:"Location & Contact", priority:"High", desc:"Address with Google Map, parking info, hours, phone, email.", tips:["Show parking options prominently","Include public transit info if relevant","Add photos of facility exterior and interior"] },
      ]},
      consultant_coach: { label: "Consultant / Coach", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"Clear specific headline about what you do and who you help. Professional photo. CTA: Book a Free Discovery Call linked to calendar.", tips:["Be specific — I help X do Y outperforms generic claims","Your photo builds trust immediately","Booking CTA should be above the fold on every device"] },
        { order:2, name:"Booking Calendar", priority:"Critical", desc:"Embed calendar (Calendly, Acuity) directly on the homepage.", tips:["Embed calendar on homepage — not just Contact page","Set clear availability","Send automatic confirmation after booking"] },
        { order:3, name:"What I Do / Services", priority:"Critical", desc:"Clear descriptions of each service. Who it's for, what's included, the outcome.", tips:["Lead with outcomes not features","Each service should have its own dedicated page","Include Not sure which? Book a call CTA"] },
        { order:4, name:"Who It's For", priority:"High", desc:"Describe your ideal client in detail. Include who it's NOT for.", tips:["Get specific about your ideal client profile","Include 3-5 bullet points","Add This is NOT for you if to pre-qualify leads"] },
        { order:5, name:"Results / Case Studies", priority:"Critical", desc:"Specific client results with numbers. Video testimonials.", tips:["Specific numbers perform far better than vague praise","Include client name, business, and industry","Video testimonials from real clients are worth 10x written ones"] },
        { order:6, name:"About / My Story", priority:"High", desc:"Your background and credentials. Personal story focused on how it benefits clients.", tips:["Connect your experience to client outcomes","Include credentials and certifications","Show personality — people hire people they like"] },
        { order:7, name:"FAQ", priority:"Medium", desc:"Answer objections before they're raised: pricing, process, timeline.", tips:["Answer How much does it cost even if just a range","Include What happens after I book a call","Add Is this right for me as a question"] },
        { order:8, name:"Contact / Footer", priority:"High", desc:"Email, secondary booking CTA, social media especially LinkedIn.", tips:["Add secondary Book a call button in footer","Include LinkedIn profile prominently","Add simple contact form for people not ready to book"] },
      ]},
      photographer: { label: "Photographer / Creative", sections: [
        { order:1, name:"Hero / Portfolio Gallery", priority:"Critical", desc:"Your absolute best work — full-width stunning images. Let your work speak first.", tips:["Use your top 5-10 images — not entire portfolio","Full-width slideshow or masonry grid both work","Compress images without losing quality"] },
        { order:2, name:"Specialties / What You Shoot", priority:"Critical", desc:"Cards for each photography type: weddings, portraits, events, commercial.", tips:["Create a separate page for each specialty","Include starting prices if possible","Add Now booking with available dates"] },
        { order:3, name:"Portfolio by Category", priority:"Critical", desc:"Separate gallery pages for each specialty. Curate ruthlessly.", tips:["Only show your best 15-25 images per category","Name gallery files with relevant keywords","Add client names/locations as captions with permission"] },
        { order:4, name:"Inquiry / Contact Form", priority:"Critical", desc:"Specific inquiry form for each shoot type with relevant fields.", tips:["Separate forms for different shoot types get more completions","Ask for date and location upfront","Add Tell me about your vision open field"] },
        { order:5, name:"Pricing", priority:"High", desc:"At minimum show starting prices or packages.", tips:["Starting at $X is better than no price","Bundle packages with clear inclusions","Add FAQ answering Do you offer payment plans"] },
        { order:6, name:"About / Your Story", priority:"High", desc:"Who you are, your style, your approach. Include natural photo.", tips:["Be personal and warm — clients choose photographers they feel comfortable with","Mention your shooting style","Include years shooting and notable work"] },
        { order:7, name:"Reviews / Testimonials", priority:"High", desc:"Client quotes about the experience and results. Video testimonials are powerful.", tips:["Include client name and shoot type","Pull from Google reviews with direct link","Video testimonials of couples talking convert extremely well"] },
        { order:8, name:"Contact / Footer", priority:"High", desc:"Email, phone optional, Instagram link, location, inquiry form CTA.", tips:["Instagram is often #1 discovery channel — link prominently","List all cities/regions you serve","Add Destination photographer available worldwide if relevant"] },
      ]},
      online_store: { label: "Online Store / E-commerce", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"Lifestyle photo of best product. Compelling headline. CTA: Shop Now / View New Arrivals.", tips:["Show products on people or in use","Announce sales or promotions prominently","Consider countdown timer for limited offers"] },
        { order:2, name:"Announcement Bar / Promotions", priority:"High", desc:"Thin bar at top for free shipping threshold, current sales, discount codes.", tips:["Free shipping over $X consistently increases average order","Keep it to one key message","Rotate 2-3 messages if your platform supports it"] },
        { order:3, name:"Featured / New Arrivals", priority:"Critical", desc:"Newest products or bestsellers below hero. 4-8 products in clean grid.", tips:["Show New Arrival or Best Seller badges","Include quick-add to cart button","Update this section regularly — returning visitors need newness"] },
        { order:4, name:"Collections / Categories", priority:"Critical", desc:"Visual collection grid. Each major category gets a card with lifestyle photo.", tips:["Use lifestyle images for collection thumbnails","Keep collection names simple and obvious","Feature a Sale or Under $X collection prominently"] },
        { order:5, name:"Brand Story / About", priority:"Medium", desc:"Short section on what makes your brand different. Values, sourcing, why you started.", tips:["Woman-owned or Sustainable materials builds connection","Keep to 3-4 sentences with lifestyle image","Link to full About page"] },
        { order:6, name:"Social Proof / Reviews", priority:"High", desc:"Overall star rating and specific review quotes.", tips:["Show review count prominently: 2400+ 5-star reviews","Include photos from customer reviews","Add link to see all reviews"] },
        { order:7, name:"Instagram / UGC Feed", priority:"Medium", desc:"Shoppable Instagram feed or customer photos grid.", tips:["Tag products in Instagram posts for shop functionality","Ask customers to tag you for a feature","UGC converts better than branded photography"] },
        { order:8, name:"Email Signup / Newsletter", priority:"High", desc:"Offer discount for email signup: 10-15% off first order.", tips:["Get 15% off your first order outperforms Sign up for newsletter","Place mid-page AND in footer","Connect to Klaviyo or Mailchimp for automated welcome series"] },
      ]},
      contractor: { label: "Contractor / Trades", sections: [
        { order:1, name:"Hero Section", priority:"Critical", desc:"Photo of best completed project or team at work. Phone number large. CTA: Get a Free Quote.", tips:["Show your actual work — not stock photos","Phone number should be clickable on mobile","Add license and insurance badges near the hero"] },
        { order:2, name:"Services", priority:"Critical", desc:"Every service with photo, description, and Get a Quote CTA. Create dedicated pages for each.", tips:["Each service page should target service + city as keyword","Include project examples for each service","Add rough pricing ranges or starting at"] },
        { order:3, name:"Get a Quote Form", priority:"Critical", desc:"Simple form: name, phone, email, project type, budget, timeline.", tips:["Phone number more important than email for contractors","Add We respond within 24 hours","Consider two-step form: contact info first then details"] },
        { order:4, name:"Project Portfolio / Past Work", priority:"Critical", desc:"Photo gallery organized by project type. Before/after photos are extremely powerful.", tips:["Before/after sliders convert better than standard galleries","Label each project: what was done, materials, timeline","Ask clients for permission to photograph finished work"] },
        { order:5, name:"Trust & Credentials", priority:"High", desc:"License number, insurance, years in business, awards, certifications.", tips:["Display contractor license number prominently","Show Fully insured and what that means for homeowner","Include manufacturer or product certifications"] },
        { order:6, name:"Service Area", priority:"High", desc:"Every city and neighborhood you serve. Critical for local SEO.", tips:["List 20-30 specific areas you serve","Create landing pages for top service areas","Add Serving city for X years to each area page"] },
        { order:7, name:"Reviews / Testimonials", priority:"High", desc:"Google review rating, client quotes with project type.", tips:["Include project type in each testimonial","Video testimonials showing finished projects are incredibly powerful","Ask for reviews immediately after project completion"] },
        { order:8, name:"Contact / Footer", priority:"High", desc:"Phone, email, address if showroom, service area, hours, license number.", tips:["Repeat phone number in footer","Include license and insurance badges","Add link to Google Business Profile"] },
      ]},
    };

    const structure = STRUCTURES[business_type] || STRUCTURES.local_service;
    const blueprint = { structure, aiInsights, business_type };

    await pool.query(`CREATE TABLE IF NOT EXISTS website_blueprints (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT, business_name TEXT, business_type TEXT, website_status TEXT, builder TEXT, primary_goal TEXT, primary_cta TEXT, takes_reservations TEXT, sells_online TEXT, has_portfolio TEXT, emergency_service TEXT, specific_notes TEXT, blueprint JSONB, payment_status TEXT DEFAULT 'unpaid', email_sent BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`);

    const result = await pool.query(
      `INSERT INTO website_blueprints (email, business_name, business_type, website_status, builder, primary_goal, primary_cta, takes_reservations, sells_online, has_portfolio, emergency_service, specific_notes, blueprint) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [email, business_name, business_type, website_status, builder, primary_goal, primary_cta, takes_reservations, sells_online, has_portfolio, emergency_service, specific_notes, JSON.stringify(blueprint)]
    );

    return res.status(200).json({ id: result.rows[0].id, blueprint });
  } catch (err) {
    console.error('submit-website-blueprint error:', err);
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/create-website-payment', async (req, res) => {
  try {
    const { blueprintId, email } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [{ price_data: { currency: 'usd', product_data: { name: 'Website Blueprint', description: 'Your personalized page-by-page website structure guide — PDF emailed instantly.' }, unit_amount: 999 }, quantity: 1 }],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/website-results?blueprintId=${blueprintId}&success=true`,
      cancel_url: `${process.env.APP_URL}/website-blueprint`,
      metadata: { blueprintId },
    });
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/api/get-website-blueprint', async (req, res) => {
  try {
    const { id } = req.query;
    const result = await pool.query('SELECT * FROM website_blueprints WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/website-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try { event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBSITE_WEBHOOK_SECRET); }
  catch (err) { return res.status(400).send(`Webhook Error: ${err.message}`); }
  if (event.type === 'checkout.session.completed') {
    const blueprintId = event.data.object.metadata?.blueprintId;
    if (blueprintId) {
      await pool.query(`UPDATE website_blueprints SET payment_status = 'paid' WHERE id = $1`, [blueprintId]);
    }
  }
  return res.status(200).json({ received: true });
});

// ─── CONTACT / EMAIL ROUTE ───────────────────────────────────────────

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    await resend.emails.send({
      from: 'Fire-Works Blueprint <onboarding@resend.dev>',
      to: 'colonnamedia@gmail.com',
      subject: `New contact from ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// ─── ADMIN AUTH MIDDLEWARE ────────────────────────────────────────────

function adminAuth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// POST /api/admin/create (one-time setup)
app.post('/api/admin/create', async (req, res) => {
  try {
    const { email, password, setup_key } = req.body;
    if (setup_key !== process.env.ADMIN_SETUP_KEY) return res.status(403).json({ error: 'Invalid setup key' });
    const existing = await pool.query('SELECT id FROM admin_users');
    if (existing.rows.length > 0) return res.status(403).json({ error: 'Admin already exists' });
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)', [email, hash]);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const admin = result.rows[0];
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    if (admin.totp_enabled) {
      const tempToken = jwt.sign({ id: admin.id, email: admin.email, requires2fa: true }, process.env.ADMIN_JWT_SECRET, { expiresIn: '5m' });
      return res.status(200).json({ requires2fa: true, tempToken });
    }
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.ADMIN_JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, admin: { email: admin.email, totp_enabled: admin.totp_enabled } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/verify-2fa
app.post('/api/admin/verify-2fa', async (req, res) => {
  try {
    const { tempToken, code } = req.body;
    let decoded;
    try { decoded = jwt.verify(tempToken, process.env.ADMIN_JWT_SECRET); }
    catch { return res.status(401).json({ error: 'Token expired' }); }
    const result = await pool.query('SELECT * FROM admin_users WHERE id = $1', [decoded.id]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Not found' });
    const admin = result.rows[0];
    const valid = authenticator.verify({ token: code, secret: admin.totp_secret });
    if (!valid) return res.status(401).json({ error: 'Invalid code' });
    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.ADMIN_JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, admin: { email: admin.email } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/setup-2fa
app.post('/api/admin/setup-2fa', adminAuth, async (req, res) => {
  try {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(req.admin.email, 'Fire-Works Blueprint', secret);
    await pool.query('UPDATE admin_users SET totp_secret = $1 WHERE id = $2', [secret, req.admin.id]);
    return res.status(200).json({ secret, otpauth });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/admin/confirm-2fa
app.post('/api/admin/confirm-2fa', adminAuth, async (req, res) => {
  try {
    const { code } = req.body;
    const result = await pool.query('SELECT totp_secret FROM admin_users WHERE id = $1', [req.admin.id]);
    const valid = authenticator.verify({ token: code, secret: result.rows[0].totp_secret });
    if (!valid) return res.status(401).json({ error: 'Invalid code' });
    await pool.query('UPDATE admin_users SET totp_enabled = true WHERE id = $1', [req.admin.id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/analytics
app.get('/api/admin/analytics', adminAuth, async (req, res) => {
  try {
    const [blueprints, advertising, website] = await Promise.all([
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER (WHERE payment_status='paid') paid, SUM(CASE WHEN payment_status='paid' THEN 1999 ELSE 0 END) revenue FROM blueprints`),
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER (WHERE payment_status='paid') paid, SUM(CASE WHEN payment_status='paid' THEN 1499 ELSE 0 END) revenue FROM advertising_strategies`),
      pool.query(`SELECT COUNT(*) total, COUNT(*) FILTER (WHERE payment_status='paid') paid, SUM(CASE WHEN payment_status='paid' THEN 999 ELSE 0 END) revenue FROM website_blueprints`),
    ]);
    const dailyBlueprints = await pool.query(`SELECT DATE(created_at) date, COUNT(*) count FROM blueprints WHERE created_at > NOW() - INTERVAL '30 days' GROUP BY DATE(created_at) ORDER BY date ASC`);
    const totalRevenue = (parseInt(blueprints.rows[0].revenue)||0) + (parseInt(advertising.rows[0].revenue)||0) + (parseInt(website.rows[0].revenue)||0);
    const totalPaid = (parseInt(blueprints.rows[0].paid)||0) + (parseInt(advertising.rows[0].paid)||0) + (parseInt(website.rows[0].paid)||0);
    const totalSubmissions = (parseInt(blueprints.rows[0].total)||0) + (parseInt(advertising.rows[0].total)||0) + (parseInt(website.rows[0].total)||0);
    return res.status(200).json({
      total_revenue: totalRevenue, total_paid: totalPaid, total_submissions: totalSubmissions,
      conversion_rate: totalSubmissions > 0 ? ((totalPaid / totalSubmissions) * 100).toFixed(1) : 0,
      products: { blueprint: blueprints.rows[0], advertising: advertising.rows[0], website: website.rows[0] },
      daily_chart: dailyBlueprints.rows,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/clients
app.get('/api/admin/clients', adminAuth, async (req, res) => {
  try {
    const { product, status, search, page = 1 } = req.query;
    const limit = 25;
    const offset = (page - 1) * limit;
    const blueprintQ = `SELECT id, email, business_name, 'blueprint' as product, payment_status, created_at, 1999 as price FROM blueprints`;
    const advQ = `SELECT id, email, business_name, 'advertising' as product, payment_status, created_at, 1499 as price FROM advertising_strategies`;
    const webQ = `SELECT id, email, business_name, 'website' as product, payment_status, created_at, 999 as price FROM website_blueprints`;
    let combined = `SELECT * FROM (${blueprintQ} UNION ALL ${advQ} UNION ALL ${webQ}) all_clients WHERE 1=1`;
    const params = [];
    let pIdx = 1;
    if (product && product !== 'all') { combined += ` AND product = $${pIdx++}`; params.push(product); }
    if (status && status !== 'all') { combined += ` AND payment_status = $${pIdx++}`; params.push(status); }
    if (search) { combined += ` AND (email ILIKE $${pIdx} OR business_name ILIKE $${pIdx})`; params.push(`%${search}%`); pIdx++; }
    combined += ` ORDER BY created_at DESC LIMIT $${pIdx++} OFFSET $${pIdx++}`;
    params.push(limit, offset);
    const result = await pool.query(combined, params);
    return res.status(200).json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/client/:product/:id
app.get('/api/admin/client/:product/:id', adminAuth, async (req, res) => {
  try {
    const { product, id } = req.params;
    const table = product === 'blueprint' ? 'blueprints' : product === 'advertising' ? 'advertising_strategies' : 'website_blueprints';
    const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/abandoned
app.get('/api/admin/abandoned', adminAuth, async (req, res) => {
  try {
    const blueprintAbandoned = await pool.query(`SELECT id, email, business_name, 'blueprint' as product, created_at FROM blueprints WHERE payment_status = 'unpaid' ORDER BY created_at DESC LIMIT 100`);
    const advAbandoned = await pool.query(`SELECT id, email, business_name, 'advertising' as product, created_at FROM advertising_strategies WHERE payment_status = 'unpaid' ORDER BY created_at DESC LIMIT 50`);
    const webAbandoned = await pool.query(`SELECT id, email, business_name, 'website' as product, created_at FROM website_blueprints WHERE payment_status = 'unpaid' ORDER BY created_at DESC LIMIT 50`);
    const all = [...blueprintAbandoned.rows, ...advAbandoned.rows, ...webAbandoned.rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.status(200).json(all);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/revenue
app.get('/api/admin/revenue', adminAuth, async (req, res) => {
  try {
    const blueprints = await pool.query(`SELECT id, email, business_name, 'Business Blueprint' as product, 1999 as amount_cents, created_at FROM blueprints WHERE payment_status = 'paid' ORDER BY created_at DESC`);
    const advertising = await pool.query(`SELECT id, email, business_name, 'Advertising Strategy' as product, 1499 as amount_cents, created_at FROM advertising_strategies WHERE payment_status = 'paid' ORDER BY created_at DESC`);
    const website = await pool.query(`SELECT id, email, business_name, 'Website Blueprint' as product, 999 as amount_cents, created_at FROM website_blueprints WHERE payment_status = 'paid' ORDER BY created_at DESC`);
    const all = [...blueprints.rows, ...advertising.rows, ...website.rows].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return res.status(200).json(all);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
// ─── SPA FALLBACK ────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
