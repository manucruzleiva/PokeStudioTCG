const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

const POKEMONTCG_API_KEY = 'f05f0a9f-e3db-4a8b-9ffa-446054f3410b';

app.use(express.static('public'));

app.get('/api/cardsearch', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing query' });

    const url = `https://api.pokemontcg.io/v2/cards?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'X-Api-Key': POKEMONTCG_API_KEY }
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: 'Error connecting to pokemontcg.io' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor iniciado en puerto', PORT);
});