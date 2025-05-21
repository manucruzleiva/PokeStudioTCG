const express = require('express');
const fetch = require('node-fetch');
const WebSocket = require('ws');
const path = require('path');

// Crear dos aplicaciones Express separadas
const dashboardApp = express();
const overlayApp = express();

// Crear dos servidores HTTP
const dashboardServer = require('http').createServer(dashboardApp);
const overlayServer = require('http').createServer(overlayApp);

// Configurar WebSocket en el servidor del overlay
const wss = new WebSocket.Server({ server: overlayServer });

const POKEMONTCG_API_KEY = 'f05f0a9f-e3db-4a8b-9ffa-446054f3410b';

// Configurar middleware para el dashboard
dashboardApp.use(express.json());
dashboardApp.use(express.static(path.join(__dirname, 'public')));

// Configurar middleware para el overlay
overlayApp.use(express.static(path.join(__dirname, 'obs')));

dashboardApp.get('/api/cardsearch', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: 'Missing query' });
    
    console.log('Búsqueda:', query);
    const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(query)}* OR text:${encodeURIComponent(query)}*`;
    console.log('URL:', url);
    
    const response = await fetch(url, {
      headers: { 'X-Api-Key': POKEMONTCG_API_KEY }
    });

    if (!response.ok) {
      console.error('Error en Pokemon TCG API:', response.status);
      const errorText = await response.text();
      console.error('Detalle:', errorText);
      return res.status(response.status).json({ error: 'Error accessing Pokemon TCG API' });
    }

    const data = await response.json();
    console.log('Cartas encontradas:', data.data?.length || 0);
    res.json(data);
  } catch (e) {
    console.error('Error en búsqueda:', e);
    res.status(500).json({ error: 'Error connecting to pokemontcg.io: ' + e.message });
  }
});

// Rutas del dashboard
dashboardApp.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas del overlay
overlayApp.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'obs', 'overlay.html'));
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

const DASHBOARD_PORT = process.env.DASHBOARD_PORT || 3000;
const OVERLAY_PORT = process.env.OVERLAY_PORT || 3001;

// Iniciar servidor del dashboard
dashboardServer.listen(DASHBOARD_PORT, () => {
    console.log('Dashboard disponible en http://localhost:' + DASHBOARD_PORT);
});

// Iniciar servidor del overlay
overlayServer.listen(OVERLAY_PORT, () => {
    console.log('Overlay disponible en http://localhost:' + OVERLAY_PORT);
    console.log('WebSocket server ejecutándose en puerto', OVERLAY_PORT);
});