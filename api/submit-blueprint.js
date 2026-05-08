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
      email, business_name, what_you_do, ideal_customer, main_goal,
      has_website, current_marketing, monthly_budget, who_does_marketing,
      biggest_challenge, years_in_business, success_in_90_days
    } = req.body;

    // Generate roadmap with Groq
    const prompt = `You are a marketing strategist. Based on the following business information, create a detailed 3-phase marketing roadmap.

Business: ${business_name}
What they do: ${what_you_do}
Ideal customer: ${ideal_customer}
Main goal: ${main_goal}
Has website: ${has_website}
Current marketing: ${current_marketing?.join(', ') || 'None'}
Monthly budget: ${monthly_budget}
Who does marketing: ${who_does_marketing}
Biggest challenge: ${biggest_challenge}
Years in business: ${years_in_business}
Success in 90 days: ${success_in_90_days}

Return ONLY a JSON object with this exact structure, no other text:
{
  "phase1": {
    "title": "Phase 1: Foundation",
    "timeframe": "Days 1-30",
    "focus": "one sentence describing the focus",
    "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"]
  },
  "phase2": {
    "title": "Phase 2: Growth",
    "timeframe": "Days 31-60",
    "focus": "one sentence describing the focus",
    "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"]
  },
  "phase3": {
    "title": "Phase 3: Scale",
    "timeframe": "Days 61-90",
    "focus": "one sentence describing the focus",
    "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"]
  }
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
        max_tokens: 1500
      })
    });

    if (!groqRes.ok) {
      const groqError = await groqRes.text();
      console.error('Groq error:', groqError);
      return res.status(500).json({ error: 'Groq failed', detail: groqError });
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
        email, business_name, what_you_do, ideal_customer, main_goal,
        has_website, current_marketing, monthly_budget, who_does_marketing,
        biggest_challenge, years_in_business, success_in_90_days,
        JSON.stringify(roadmap)
      ]
    );

    return res.status(200).json({ id: result.rows[0].id, roadmap });

  } catch (err) {
    console.error('submit-blueprint error:', err);
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
