const venom = require('venom-bot');
const express = require('express');

const app = express();
app.use(express.json());

let savedClient = null;

venom
  .create({
    session: 'my-session',
    multidevice: false
  })
  .then((client) => {
    savedClient = client;
    start(client);
  })
  .catch((err) => console.error('Venom init error:', err));

function start(client) {
  console.log('✅ Bot started');

  client.onMessage(async (message) => {
    try {
      if (!message.isGroup && message.body) {
        const text = message.body.toLowerCase();

        if (text === 'hi' || text === 'hello') {
          await client.sendText(message.from, 'Hello 👋! I am your Venom bot.\nType "help" to see commands.');
          return;
        }

        if (text === 'help') {
          await client.sendText(
            message.from,
            'Available commands:\n\n1️⃣ hi / hello → Greeting\n2️⃣ help → Show commands\n3️⃣ media → Send image\n4️⃣ buttons → Show menu'
          );
          return;
        }

        if (text === 'media') {
          await client.sendImage(message.from, './assets/sample.jpg', 'sample.jpg', 'Here is an image for you 📷');
          return;
        }

        if (text === 'buttons') {
          const buttons = [
            { id: 'btn_1', text: 'Option 1' },
            { id: 'btn_2', text: 'Option 2' }
          ];
          await client.sendButtons(message.from, 'Choose one 👇', buttons, 'Menu', 'Pick an option');
          return;
        }

        await client.sendText(message.from, `You said: ${message.body}`);
      }
    } catch (err) {
      console.error('Message error:', err);
    }
  });
}

// Optional REST API to send messages externally
app.post('/send', async (req, res) => {
  const { to, message } = req.body;
  if (!savedClient) return res.status(500).send('❌ Client not ready');
  try {
    await savedClient.sendText(`${to}@c.us`, message);
    res.send('✅ Message sent');
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => console.log('🚀 REST API running on http://localhost:3000/send'));
