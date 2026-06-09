exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ reply: 'Method not allowed' }) };

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VELORA_AI_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        system: `You are the AI assistant for Velora, a website agency based in Bowie, Maryland. Velora builds AI-powered websites for local businesses in the DMV area (Maryland, DC, Northern Virginia).

Business info:
- Owner: Alejandro | Phone: (240) 665-9426 | Email: velora.smrtco@gmail.com
- Book a free call: https://calendly.com/alejandroezpi2007/30min
- Packages: Launch $799 (one-time), Pro $1,999, Elite $3,999
- Monthly retainer from $199/mo — hosting, updates, AI maintenance, reports
- Timeline: 5–7 days to go live after strategy call
- Niches served: HVAC, nail salons, barbershops, landscaping, auto detailing, cleaning companies, restaurants, and more
- Service area: All of Maryland, Washington DC, and Northern Virginia

Rules:
- Keep every reply to 2–3 sentences max. Be conversational and human, not robotic.
- Never make up info not listed above.
- If someone seems interested, end with a nudge to book the free call.`,
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error');

    return { statusCode: 200, headers, body: JSON.stringify({ reply: data.content[0].text }) };
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: "I'm having a moment — text Alejandro directly at (240) 665-9426 or <a href='https://calendly.com/alejandroezpi2007/30min' target='_blank' style='color:var(--accent)'>book a free call here</a>." })
    };
  }
};
