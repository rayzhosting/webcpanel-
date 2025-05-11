require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/create-panel', async (req, res) => {
  const { domain, provider, ram } = req.body;

  let apiUrl, apiKey;
  if (provider === 'plta') {
    apiUrl = process.env.PLTA_API_URL;
    apiKey = process.env.PLTA_API_KEY;
  } else if (provider === 'pltc') {
    apiUrl = process.env.PLTC_API_URL;
    apiKey = process.env.PLTC_API_KEY;
  } else {
    return res.status(400).json({ error: 'Provider tidak valid.' });
  }

  try {
    const response = await fetch(\`\${apiUrl}/create-panel\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        ram: parseInt(ram)
      })
    });

    const result = await response.json();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal membuat panel.', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server berjalan di http://localhost:\${PORT}\`);
});
