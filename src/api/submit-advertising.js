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
      business_name, email, what_you_sell, ideal_customer,
      business_type, website_status, pixel_status,
      current_ads, ad_goal, monthly_budget, biggest_competitor,
      success_goal
    } = req.body;

    const isLocalService = business_type === 'local_service';
    const isBrickMortar = business_type === 'brick_mortar';
    const isOnlineStore = business_type === 'online_store';
    const isOnlineService = business_type === 'online_service';

    const websiteNote = website_status === 'none' ? 'They have NO website yet.' :
      website_status === 'poor' ? 'They have a website but it needs significant work.' :
      website_status === 'okay' ? 'They have a decent website but not converting well.' :
      'They have a good converting website.';

    const pixelNote = pixel_status === 'both' ? 'Both Google Tag and Meta Pixel are installed — retargeting is ready to activate.' :
      pixel_status === 'google_only' ? 'Only Google Tag installed — Meta Pixel needs to be added before running Meta Ads.' :
      pixel_status === 'meta_only' ? 'Only Meta Pixel installed — Google Tag needs to be added before running Google Ads.' :
      pixel_status === 'none' ? 'NO tracking pixels installed — this must be set up before running any paid ads.' :
      'Not sure if tracking is installed — needs to be verified before launching ads.';

    const prompt = `You are an expert digital advertising strategist specializing in small and medium businesses. Generate a comprehensive, highly specific advertising strategy guide for this business.

BUSINESS PROFILE:
Business Name: ${business_name}
Business Type: ${business_type} (${isLocalService ? 'local service' : isBrickMortar ? 'brick & mortar/restaurant' : isOnlineStore ? 'online store/e-commerce' : isOnlineService ? 'online service/consulting' : 'hybrid'})
What They Sell: ${what_you_sell || 'Not specified'}
Ideal Customer: ${ideal_customer || 'Not specified'}
Biggest Competitor: ${biggest_competitor || 'None specified'}
Website Status: ${websiteNote}
Pixel/Tracking Status: ${pixelNote}
Currently Running Ads: ${current_ads}
Primary Ad Goal: ${ad_goal}
Monthly Budget: ${monthly_budget}
Success Definition: ${success_goal || 'Not specified'}

CRITICAL INSTRUCTIONS:
1. Make EVERY recommendation specific to this exact business type and what they sell
2. For local service businesses: Google is the primary platform — people search for services. Meta is secondary for brand and retargeting.
3. For online stores/e-commerce: Meta product ads and retargeting are primary. Google Shopping is secondary.
4. For brick & mortar/restaurants: Google Local and Meta awareness ads work together. Location targeting is critical.
5. For online services: Meta Lead Gen Ads and Google branded search work best. LinkedIn if B2B.
6. Include specific retargeting sequences with realistic examples for their business
7. If they have no pixels, the first action item must be installing tracking before spending a dollar
8. If they have no website, address this before ad recommendations
9. Be specific about budget allocation based on their stated budget
10. Include competitor strategy if a competitor was named

Return ONLY valid JSON with no markdown:
{
  "platform_recommendation": {
    "primary": "Google Ads or Meta Ads or Both — which is primary for this business",
    "primary_reason": "2-3 sentence explanation specific to their business type and what they sell",
    "secondary": "the secondary platform",
    "secondary_reason": "why this is secondary",
    "skip": "any platform to skip and why, or null if both should be used"
  },
  "google_strategy": {
    "use": true or false,
    "campaign_type": "Search / Local Services / Shopping / Display — which type for this business",
    "campaign_type_reason": "why this campaign type",
    "targeting": "specific targeting recommendation — keywords, location, radius for this business",
    "budget_allocation": "what percentage of their budget to put here and why",
    "example_keywords": ["keyword 1 specific to their business", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
    "setup_priority": "first or after Meta or after pixels installed — and why",
    "pro_tip": "one specific tip for this business on Google Ads"
  },
  "meta_strategy": {
    "use": true or false,
    "objective": "Leads / Sales / Traffic / Awareness — which Meta objective for this business",
    "objective_reason": "why this objective",
    "audience": "specific audience description for this business — age, interests, behaviors, location",
    "creative_type": "image / video / carousel — which and why for this business",
    "budget_allocation": "what percentage of budget here",
    "setup_priority": "first or after Google or after pixels — and why",
    "pro_tip": "one specific tip for this business on Meta Ads"
  },
  "retargeting_strategy": {
    "ready_to_retarget": true or false,
    "why": "explanation based on their pixel status and website traffic",
    "sequence": [
      {
        "step": 1,
        "trigger": "what triggers this ad — e.g. visited website, viewed product, added to cart",
        "ad_type": "what kind of ad to show",
        "message": "what the ad should say or offer",
        "platform": "Google or Meta or both",
        "timing": "how soon after the trigger — e.g. within 24 hours, 3-7 days later"
      },
      {
        "step": 2,
        "trigger": "second trigger",
        "ad_type": "ad type",
        "message": "message or offer — escalate the offer if step 1 didn't convert, e.g. add a discount",
        "platform": "platform",
        "timing": "timing"
      },
      {
        "step": 3,
        "trigger": "third trigger",
        "ad_type": "ad type",
        "message": "final offer — strongest incentive",
        "platform": "platform",
        "timing": "timing"
      }
    ],
    "setup_instructions": "specific instructions to set up retargeting for this business — what audiences to create"
  },
  "budget_plan": {
    "total": "${monthly_budget}",
    "breakdown": [
      {"platform": "platform name", "amount": "dollar amount or percentage", "reason": "why this allocation"},
      {"platform": "platform name", "amount": "dollar amount or percentage", "reason": "why this allocation"}
    ],
    "minimum_test_period": "how long to run before evaluating results",
    "expected_results": "realistic expectation for this budget and business type"
  },
  "action_plan": {
    "before_ads": [
      "prerequisite action 1 — e.g. install Meta Pixel if not installed",
      "prerequisite action 2",
      "prerequisite action 3"
    ],
    "week1_2": [
      "first action to take",
      "second action",
      "third action"
    ],
    "week3_4": [
      "action after launch",
      "action 2",
      "action 3"
    ],
    "month2_plus": [
      "scaling action",
      "optimization action",
      "expansion action"
    ]
  },
  "competitor_strategy": "${biggest_competitor ? `Specific strategy for competing against ${biggest_competitor}` : null}",
  "biggest_mistake": "the single most common advertising mistake businesses like this make — specific to their type",
  "success_metrics": [
    "metric 1 to track — specific to their goal",
    "metric 2",
    "metric 3"
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
      return res.status(500).json({ error: 'Groq failed', detail: err });
    }

    const groqData = await groqRes.json();
    const rawText = groqData.choices[0].message.content;

    let strategy;
    try {
      strategy = JSON.parse(rawText.replace(/```json|```/g, '').trim());
    } catch (e) {
      return res.status(500).json({ error: 'Failed to parse strategy', detail: rawText });
    }

    // Create advertising_strategies table if not exists and insert
    await pool.query(`
      CREATE TABLE IF NOT EXISTS advertising_strategies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT,
        business_name TEXT,
        what_you_sell TEXT,
        ideal_customer TEXT,
        business_type TEXT,
        website_status TEXT,
        pixel_status TEXT,
        current_ads TEXT,
        ad_goal TEXT,
        monthly_budget TEXT,
        biggest_competitor TEXT,
        success_goal TEXT,
        strategy JSONB,
        payment_status TEXT DEFAULT 'unpaid',
        email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const result = await pool.query(
      `INSERT INTO advertising_strategies (
        email, business_name, what_you_sell, ideal_customer, business_type,
        website_status, pixel_status, current_ads, ad_goal, monthly_budget,
        biggest_competitor, success_goal, strategy
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [email, business_name, what_you_sell, ideal_customer, business_type,
       website_status, pixel_status, current_ads, ad_goal, monthly_budget,
       biggest_competitor, success_goal, JSON.stringify(strategy)]
    );

    return res.status(200).json({ id: result.rows[0].id, strategy });

  } catch (err) {
    console.error('submit-advertising error:', err);
    return res.status(500).json({ error: err.message });
  }
}
