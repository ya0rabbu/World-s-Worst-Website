import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface PresenceUser {
  id: string;
  name: string;
  color: string;
  flag: string;
  country: string;
  xRatio: number;
  yRatio: number;
  x: number;
  y: number;
  page: string;
  lastActive: number;
  clicking: boolean;
  emoji?: string;
  connectedAt: number;
}

const activeClients = new Map<
  string,
  {
    user: PresenceUser;
    res?: express.Response;
  }
>();

function broadcast(event: string, data: unknown, excludeId?: string) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [id, client] of activeClients.entries()) {
    if (excludeId && id === excludeId) continue;
    if (client.res && !client.res.writableEnded) {
      try {
        client.res.write(payload);
      } catch {
        // Socket error, handled on close
      }
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', liveUsers: activeClients.size });
  });

  // Real-Time Server-Sent Events (SSE) stream for live user presence & cursors
  app.get('/api/presence/stream', (req, res) => {
    const userId = (req.query.userId as string) || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const name = (req.query.name as string) || `Visitor #${userId.slice(-4)}`;
    const color = (req.query.color as string) || '#FACC15';
    const country = (req.query.country as string) || 'Bangladesh';
    const flag = (req.query.flag as string) || '🇧🇩';
    const page = (req.query.page as string) || 'home';

    // Set SSE headers (with X-Accel-Buffering: no for Cloud Run/nginx)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders?.();

    const newUser: PresenceUser = {
      id: userId,
      name,
      color,
      flag,
      country,
      xRatio: 0.5,
      yRatio: 0.5,
      x: 0,
      y: 0,
      page,
      lastActive: Date.now(),
      clicking: false,
      connectedAt: Date.now(),
    };

    activeClients.set(userId, { user: newUser, res });

    // Send initial list of all OTHER currently connected real users
    const otherUsers = Array.from(activeClients.values())
      .filter((c) => c.user.id !== userId)
      .map((c) => c.user);

    const initPayload = `event: init\ndata: ${JSON.stringify({
      selfId: userId,
      users: otherUsers,
      count: activeClients.size,
    })}\n\n`;
    res.write(initPayload);

    // Broadcast user_joined to all other clients
    broadcast('user_joined', { user: newUser, count: activeClients.size }, userId);

    // Keep-alive ping interval to prevent idle timeouts through proxies
    const keepAliveTimer = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(keepAliveTimer);
        return;
      }
      res.write(': keepalive\n\n');
    }, 15000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(keepAliveTimer);
      activeClients.delete(userId);
      broadcast('user_left', { userId, count: activeClients.size });
    });
  });

  // Client updates its cursor coordinates and interaction state
  app.post('/api/presence/cursor', (req, res) => {
    const { userId, xRatio, yRatio, x, y, page, clicking, emoji } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const client = activeClients.get(userId);
    if (client) {
      client.user.xRatio = typeof xRatio === 'number' ? xRatio : client.user.xRatio;
      client.user.yRatio = typeof yRatio === 'number' ? yRatio : client.user.yRatio;
      client.user.x = typeof x === 'number' ? x : client.user.x;
      client.user.y = typeof y === 'number' ? y : client.user.y;
      if (page) client.user.page = page;
      client.user.clicking = Boolean(clicking);
      if (emoji !== undefined) client.user.emoji = emoji;
      client.user.lastActive = Date.now();

      // Broadcast cursor update to all other connected clients
      broadcast(
        'cursor_update',
        {
          userId,
          xRatio: client.user.xRatio,
          yRatio: client.user.yRatio,
          x: client.user.x,
          y: client.user.y,
          page: client.user.page,
          clicking: client.user.clicking,
          emoji,
        },
        userId
      );
    }

    res.json({ ok: true });
  });

  // Client updates its profile (custom name or color)
  app.post('/api/presence/profile', (req, res) => {
    const { userId, name, color } = req.body;
    const client = activeClients.get(userId);
    if (client) {
      if (name) client.user.name = String(name).slice(0, 30);
      if (color) client.user.color = String(color);
      broadcast('profile_updated', { userId, name: client.user.name, color: client.user.color }, userId);
    }
    res.json({ ok: true });
  });

  // Current real active users query
  app.get('/api/presence/users', (req, res) => {
    const now = Date.now();
    // Prune dead sessions inactive for more than 45s
    for (const [id, c] of activeClients.entries()) {
      if (now - c.user.lastActive > 45000 || c.res?.writableEnded) {
        activeClients.delete(id);
        broadcast('user_left', { userId: id, count: activeClients.size });
      }
    }

    const users = Array.from(activeClients.values()).map((c) => c.user);
    res.json({
      count: users.length,
      users,
    });
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Real-Time Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
