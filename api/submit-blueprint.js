import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const {
      business_name, email, what_you_do, business_type, industry,
      team_size, years_in_business, website_status, online_presence,
      current_marketing, ideal_customer, biggest_challenges,
      primary_goal, monthly_budget, success_in_90_days
    } = req.body;

    // Determine business category for tailored output
    const isLocalService = business_type === 'service_local';
    const isBrickMortar = business_type === 'product_physical';
    const isOnlineStore = business_type === 'product_digital' || (business_type === 'product_physical' && industry === 'Retail & E-commerce');
    const isOnlineService = business_type === 'service_online';
    const isHybrid = business_type === 'hybrid';

    const bizContext = isLocalService ? 'local service business (plumber, contractor, gym, salon, clinic, etc.)' :
      isBrickMortar ? 'brick and mortar retail or restaurant business' :
      isOnlineStore ? 'online store or e-commerce business' :
      isOnlineService ? 'online service, coaching, or consulting business' :
      'hybrid business selling both services and products';

    const websiteNote = website_status === 'none' ? 'They have NO website yet — building one is the top priority.' :
      website_status === 'poor' ? 'They have a website but it needs significant work and is likely hurting conversions.' :
      website_status === 'okay' ? 'They have a decent website but it is not converting visitors well.' :
      website_status === 'good' ? 'They have a good converting website.' :
      'Their website is currently being built.';

    const presenceNote = online_presence?.length > 0
      ? `Currently active on: ${online_presence.join(', ')}`
      : 'Not currently active on any online platforms.';

    const marketingNote = current_marketing?.length > 0
      ? `Currently doing: ${current_marketing.join(', ')}`
      : 'Not currently doing any paid or organic marketing.';

    const challengeNote = biggest_challenges?.length > 0
      ? biggest_challenges.join(', ')
      : 'No specific challenges identified.';

    const prompt = `You are an expert marketing strategist specializing in small and medium businesses. Generate a comprehensive, highly specific 90-day marketing blueprint for this business.

BUSINESS PROFILE:
Business Name: ${business_name}
Business Type: ${bizContext}
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

CRITICAL INSTRUCTIONS:
1. Make EVERY recommendation specific to this exact business type (${bizContext}), industry (${industry}), and their current situation
2. The priority order must reflect what actually matters FIRST for their specific business type
3. For local service businesses: Google Business Profile and website with local SEO come before any paid ads
4. For brick and mortar/restaurants: Google Business Profile is #1, menu online is #2, then social
5. For online stores: website UX and product photography come first, then social storefronts, then live selling channels like TikTok Live and Whatnot if relevant
6. For online services: website with booking calendar first, then LinkedIn, then email list
7. ALWAYS include an SEO note for Phase 1 tied to website building
8. ALWAYS include a blog/content strategy recommendation in Phase 2 appropriate to their business type
9. Reference their specific industry, what they do, and their ideal customer in the action items
10. If they have no website, make building it the absolute first action item in Phase 1
11. Include specific platform recommendations relevant to their industry

Return ONLY a valid JSON object with NO markdown, no backticks, no extra text:
{
  "business_category": "${isLocalService ? 'local_service' : isBrickMortar ? 'brick_mortar' : isOnlineStore ? 'online_store' : isOnlineService ? 'online_service' : 'hybrid'}",
  "hub_channels": [
    "channel 1 most important for this biz type",
    "channel 2",
    "channel 3",
    "channel 4",
    "channel 5",
    "channel 6",
    "channel 7",
    "channel 8"
  ],
  "priorities": [
    {
      "number": 1,
      "title": "specific priority title for this business",
      "timing": "Do first",
      "detail": "2-3 sentence specific explanation for this exact business including their industry and what they do"
    },
    {
      "number": 2,
      "title": "priority 2",
      "timing": "Do first",
      "detail": "specific detail"
    },
    {
      "number": 3,
      "title": "priority 3",
      "timing": "Week 2",
      "detail": "specific detail"
    },
    {
      "number": 4,
      "title": "priority 4",
      "timing": "Week 2",
      "detail": "specific detail"
    },
    {
      "number": 5,
      "title": "priority 5",
      "timing": "Month 1",
      "detail": "specific detail"
    },
    {
      "number": 6,
      "title": "priority 6",
      "timing": "Month 2",
      "detail": "specific detail"
    },
    {
      "number": 7,
      "title": "priority 7",
      "timing": "Month 2",
      "detail": "specific detail"
    },
    {
      "number": 8,
      "title": "priority 8",
      "timing": "Month 3",
      "detail": "specific detail"
    }
  ],
  "phase1": {
    "title": "Phase 1 — Foundation",
    "time": "Days 1–30",
    "focus": "one sentence describing the foundation focus for this specific business",
    "seo_note": "specific SEO instructions for their web designer tailored to their business type and industry — include what title tags should say, what keywords to target, what schema markup to use",
    "actions": [
      "specific action 1 for this business",
      "specific action 2",
      "specific action 3",
      "specific action 4",
      "specific action 5"
    ]
  },
  "phase2": {
    "title": "Phase 2 — Growth",
    "time": "Days 31–60",
    "focus": "one sentence describing the growth focus",
    "blog_note": "specific blog or content strategy recommendation for their business type and industry — include example topic ideas relevant to what they do",
    "actions": [
      "specific action 1",
      "specific action 2",
      "specific action 3",
      "specific action 4",
      "specific action 5"
    ]
  },
  "phase3": {
    "title": "Phase 3 — Scale",
    "time": "Days 61–90",
    "focus": "one sentence describing the scale focus",
    "actions": [
      "specific action 1",
      "specific action 2",
      "specific action 3",
      "specific action 4",
      "specific action 5"
    ]
  },
  "weeks": [
    {"label": "Wk 1–2", "items": "item1\\nitem2\\nitem3"},
    {"label": "Wk 3–4", "items": "item1\\nitem2\\nitem3"},
    {"label": "Wk 5–6", "items": "item1\\nitem2\\nitem3"},
    {"label": "Wk 7–8", "items": "item1\\nitem2\\nitem3"},
    {"label": "Wk 9–10", "items": "item1\\nitem2\\nitem3"},
    {"label": "Wk 11–12", "items": "item1\\nitem2\\nitem3"}
  ],
  "hcols": [
    {"label": "Days 1–30", "items": "item1\\nitem2\\nitem3\\nitem4\\nitem5"},
    {"label": "Days 31–60", "items": "item1\\nitem2\\nitem3\\nitem4\\nitem5"},
    {"label": "Days 61–90", "items": "item1\\nitem2\\nitem3\\nitem4\\nitem5"}
  ]
}`;

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!groqRes.ok) {
      const err = await groqRes.text();
      console.error('Groq error:', err);
      return res.status(500).json({ error: 'Groq failed', detail: err });
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices[0].message.content;

    let roadmap;
    try {
      roadmap = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    } catch (parseErr) {
      console.error('JSON parse error:', rawText);
      return res.status(500).json({ error: 'Failed to parse roadmap', detail: rawText });
    }

    // Save to Neon
    const result = await pool.query(
      `INSERT INTO blueprints (
        email, business_name, what_you_do, ideal_customer, main_goal,
        has_website, current_marketing, monthly_budget, who_does_marketing,
        biggest_challenge, years_in_business, success_in_90_days, roadmap
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [
        email,
        business_name,
        what_you_do || '',
        ideal_customer || '',
        primary_goal || '',
        website_status || '',
        Array.isArray(current_marketing) ? current_marketing.join(', ') : (current_marketing || ''),
        monthly_budget || '',
        team_size || '',
        challengeNote,
        years_in_business || '',
        success_in_90_days || '',
        JSON.stringify(roadmap)
      ]
    );

    return res.status(200).json({ id: result.rows[0].id, roadmap });

  } catch (err) {
    console.error('submit-blueprint error:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
