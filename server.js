const express = require('express');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

const POKEMONTCG_API_KEY = 'f05f0a9f-e3db-4a8b-9ffa-446054f3410b';

// Configurar middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/obs', express.static(path.join(__dirname, 'obs')));

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

// Rutas
app.get('/overlay', function(req, res) {
    res.sendFile(path.join(__dirname, 'obs', 'overlay.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Nuevo cliente WebSocket conectado');
      ws.on('message', (message) => {
        console.log('Mensaje recibido:', message.toString());
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Servidor iniciado en puerto', PORT);
    console.log('Overlay disponible en http://localhost:' + PORT + '/overlay');
});