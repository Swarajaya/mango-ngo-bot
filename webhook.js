// ============================================
// Mango NGO WhatsApp Bot - Twilio Webhook
// Deploy this on Render.com or Railway.app FREE
// ============================================

const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Your credentials
const MINDSTUDIO_API_KEY = 'sk60rFbnJlNSsowCuMwC2ycQiiIK6';
const MINDSTUDIO_AGENT_ID = '3432bcfa-97d1-4dff-bcb6-821acebfe87f';

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.Body;
  const from = req.body.From;

  console.log(`Message from ${from}: ${userMessage}`);

  try {
    // Call MindStudio API
    const response = await fetch('https://v1.mindstudio-api.com/developer/v2/agents/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINDSTUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: MINDSTUDIO_AGENT_ID,
        workflow: 'Main',
        variables: { input: userMessage }
      }),
    });

    const data = await response.json();
    const botReply = data.result || "Sorry, I couldn't process that. Please WhatsApp us at +91 9258903072";

    // Send reply back via Twilio
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${botReply}</Message>
</Response>`;

    res.type('text/xml');
    res.send(twiml);

  } catch (error) {
    console.error('Error:', error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Hello! For assistance, please WhatsApp us at +91 9258903072 🙏</Message>
</Response>`;
    res.type('text/xml');
    res.send(twiml);
  }
});

app.get('/', (req, res) => {
  res.send('Mango NGO WhatsApp Bot is running! 🥭');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Webhook running on port ${PORT}`);
});
