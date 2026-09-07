var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var activeClients = /* @__PURE__ */ new Map();
function broadcast(event, data, excludeId) {
  const payload = `event: ${event}
data: ${JSON.stringify(data)}

`;
  for (const [id, client] of activeClients.entries()) {
    if (excludeId && id === excludeId) continue;
    if (client.res && !client.res.writableEnded) {
      try {
        client.res.write(payload);
      } catch {
      }
    }
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", liveUsers: activeClients.size });
  });
  app.get("/api/presence/stream", (req, res) => {
    const userId = req.query.userId || `guest-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const name = req.query.name || `Visitor #${userId.slice(-4)}`;
    const color = req.query.color || "#FACC15";
    const country = req.query.country || "Bangladesh";
    const flag = req.query.flag || "\u{1F1E7}\u{1F1E9}";
    const page = req.query.page || "home";
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders?.();
    const newUser = {
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
      connectedAt: Date.now()
    };
    activeClients.set(userId, { user: newUser, res });
    const otherUsers = Array.from(activeClients.values()).filter((c) => c.user.id !== userId).map((c) => c.user);
    const initPayload = `event: init
data: ${JSON.stringify({
      selfId: userId,
      users: otherUsers,
      count: activeClients.size
    })}

`;
    res.write(initPayload);
    broadcast("user_joined", { user: newUser, count: activeClients.size }, userId);
    const keepAliveTimer = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(keepAliveTimer);
        return;
      }
      res.write(": keepalive\n\n");
    }, 15e3);
    req.on("close", () => {
      clearInterval(keepAliveTimer);
      activeClients.delete(userId);
      broadcast("user_left", { userId, count: activeClients.size });
    });
  });
  app.post("/api/presence/cursor", (req, res) => {
    const { userId, xRatio, yRatio, x, y, page, clicking, emoji } = req.body;
    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }
    const client = activeClients.get(userId);
    if (client) {
      client.user.xRatio = typeof xRatio === "number" ? xRatio : client.user.xRatio;
      client.user.yRatio = typeof yRatio === "number" ? yRatio : client.user.yRatio;
      client.user.x = typeof x === "number" ? x : client.user.x;
      client.user.y = typeof y === "number" ? y : client.user.y;
      if (page) client.user.page = page;
      client.user.clicking = Boolean(clicking);
      if (emoji !== void 0) client.user.emoji = emoji;
      client.user.lastActive = Date.now();
      broadcast(
        "cursor_update",
        {
          userId,
          xRatio: client.user.xRatio,
          yRatio: client.user.yRatio,
          x: client.user.x,
          y: client.user.y,
          page: client.user.page,
          clicking: client.user.clicking,
          emoji
        },
        userId
      );
    }
    res.json({ ok: true });
  });
  app.post("/api/presence/profile", (req, res) => {
    const { userId, name, color } = req.body;
    const client = activeClients.get(userId);
    if (client) {
      if (name) client.user.name = String(name).slice(0, 30);
      if (color) client.user.color = String(color);
      broadcast("profile_updated", { userId, name: client.user.name, color: client.user.color }, userId);
    }
    res.json({ ok: true });
  });
  app.get("/api/presence/users", (req, res) => {
    const now = Date.now();
    for (const [id, c] of activeClients.entries()) {
      if (now - c.user.lastActive > 45e3 || c.res?.writableEnded) {
        activeClients.delete(id);
        broadcast("user_left", { userId: id, count: activeClients.size });
      }
    }
    const users = Array.from(activeClients.values()).map((c) => c.user);
    res.json({
      count: users.length,
      users
    });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Real-Time Full-Stack Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
