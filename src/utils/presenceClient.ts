// Real-Time Multi-User Presence Client
// Communicates via Server-Sent Events (SSE), HTTP cursor heartbeats,
// and local BroadcastChannel for zero-latency multi-tab sync.

export interface RemoteUser {
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
}

export interface PresenceState {
  selfId: string;
  selfName: string;
  selfColor: string;
  onlineCount: number;
  remoteUsers: Map<string, RemoteUser>;
  isConnected: boolean;
}

type Listener = (state: PresenceState) => void;

const FUN_NAMES = [
  'Padma Navigator',
  'Dhaka Wanderer',
  'Biryani Specialist',
  'Chaos Observer',
  'Bug Hunter',
  'Pixel Artisan',
  'Retro Hacker',
  'Chittagong Voyager',
  'Cyber Ninja',
  'Matrix Glitcher',
];

const COLORS = [
  '#FACC15', // Yellow
  '#22D3EE', // Cyan
  '#4ADE80', // Green
  '#F472B6', // Pink
  '#A78BFA', // Purple
  '#FB923C', // Orange
];

class RealTimePresenceManager {
  private selfId: string;
  private selfName: string;
  private selfColor: string;
  private selfCountry: string = 'Bangladesh';
  private selfFlag: string = '🇧🇩';
  private onlineCount: number = 1;
  private remoteUsers = new Map<string, RemoteUser>();
  private isConnected: boolean = false;
  private listeners = new Set<Listener>();

  private eventSource: EventSource | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private lastCursorPost: number = 0;
  private throttleMs: number = 40;
  private currentPage: string = 'home';
  private pingInterval: number | null = null;

  constructor() {
    // Generate unique tab identity via sessionStorage
    let storedId = sessionStorage.getItem('real_presence_id');
    if (!storedId) {
      storedId = `u_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      sessionStorage.setItem('real_presence_id', storedId);
    }
    this.selfId = storedId;

    let storedName = localStorage.getItem('real_presence_name');
    if (!storedName) {
      const base = FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)];
      storedName = `${base} #${this.selfId.slice(-3)}`;
    }
    this.selfName = storedName;

    const colorIndex = Math.abs(
      this.selfId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % COLORS.length;
    this.selfColor = COLORS[colorIndex];

    this.initBroadcastChannel();
    this.connectSSE();
    this.bindWindowEvents();
  }

  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('real_live_presence');
        this.broadcastChannel.onmessage = (e) => {
          const msg = e.data;
          if (!msg || msg.senderId === this.selfId) return;

          if (msg.type === 'cursor') {
            this.handleRemoteCursor(msg.payload);
          } else if (msg.type === 'tab_hello') {
            // Respond with self
            this.broadcastChannel?.postMessage({
              type: 'tab_welcome',
              senderId: this.selfId,
              payload: this.getSelfUser(),
            });
            this.handleRemoteUserJoin(msg.payload);
          } else if (msg.type === 'tab_welcome') {
            this.handleRemoteUserJoin(msg.payload);
          } else if (msg.type === 'tab_bye') {
            this.handleRemoteUserLeave(msg.senderId);
          }
        };

        // Announce tab presence to other tabs
        this.broadcastChannel.postMessage({
          type: 'tab_hello',
          senderId: this.selfId,
          payload: this.getSelfUser(),
        });
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  private connectSSE() {
    if (typeof window === 'undefined') return;

    try {
      const params = new URLSearchParams({
        userId: this.selfId,
        name: this.selfName,
        color: this.selfColor,
        country: this.selfCountry,
        flag: this.selfFlag,
        page: this.currentPage,
      });

      this.eventSource = new EventSource(`/api/presence/stream?${params.toString()}`);

      this.eventSource.addEventListener('init', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          this.isConnected = true;
          this.onlineCount = Math.max(1, data.count || 1);
          this.remoteUsers.clear();

          if (Array.isArray(data.users)) {
            data.users.forEach((u: RemoteUser) => {
              if (u.id !== this.selfId) {
                this.remoteUsers.set(u.id, u);
              }
            });
          }
          this.notify();
        } catch (err) {
          console.error('Failed to parse init presence:', err);
        }
      });

      this.eventSource.addEventListener('user_joined', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          this.onlineCount = Math.max(1, data.count || this.remoteUsers.size + 1);
          if (data.user && data.user.id !== this.selfId) {
            this.remoteUsers.set(data.user.id, data.user);
          }
          this.notify();
        } catch (err) {
          console.error('Failed to parse user_joined:', err);
        }
      });

      this.eventSource.addEventListener('user_left', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          this.onlineCount = Math.max(1, data.count || 1);
          if (data.userId) {
            this.remoteUsers.delete(data.userId);
          }
          this.notify();
        } catch (err) {
          console.error('Failed to parse user_left:', err);
        }
      });

      this.eventSource.addEventListener('cursor_update', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          if (data.userId && data.userId !== this.selfId) {
            this.handleRemoteCursor(data);
          }
        } catch (err) {
          console.error('Failed to parse cursor_update:', err);
        }
      });

      this.eventSource.addEventListener('profile_updated', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const existing = this.remoteUsers.get(data.userId);
          if (existing) {
            if (data.name) existing.name = data.name;
            if (data.color) existing.color = data.color;
            this.notify();
          }
        } catch (err) {
          console.error('Failed to parse profile_updated:', err);
        }
      });

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.notify();
      };
    } catch (err) {
      console.warn('SSE connection failed, running on tab broadcast:', err);
    }
  }

  private getSelfUser(): RemoteUser {
    return {
      id: this.selfId,
      name: this.selfName,
      color: this.selfColor,
      flag: this.selfFlag,
      country: this.selfCountry,
      xRatio: 0.5,
      yRatio: 0.5,
      x: 0,
      y: 0,
      page: this.currentPage,
      lastActive: Date.now(),
      clicking: false,
    };
  }

  private handleRemoteCursor(data: any) {
    let user = this.remoteUsers.get(data.userId);
    if (!user) {
      user = {
        id: data.userId,
        name: data.name || `User #${data.userId.slice(-4)}`,
        color: data.color || '#22D3EE',
        flag: data.flag || '🇧🇩',
        country: data.country || 'Bangladesh',
        xRatio: data.xRatio ?? 0.5,
        yRatio: data.yRatio ?? 0.5,
        x: data.x ?? 0,
        y: data.y ?? 0,
        page: data.page || 'home',
        lastActive: Date.now(),
        clicking: Boolean(data.clicking),
        emoji: data.emoji,
      };
      this.remoteUsers.set(data.userId, user);
      this.onlineCount = Math.max(this.onlineCount, this.remoteUsers.size + 1);
    } else {
      if (typeof data.xRatio === 'number') user.xRatio = data.xRatio;
      if (typeof data.yRatio === 'number') user.yRatio = data.yRatio;
      if (typeof data.x === 'number') user.x = data.x;
      if (typeof data.y === 'number') user.y = data.y;
      if (data.page) user.page = data.page;
      user.clicking = Boolean(data.clicking);
      if (data.emoji !== undefined) user.emoji = data.emoji;
      user.lastActive = Date.now();
    }
    this.notify();
  }

  private handleRemoteUserJoin(user: RemoteUser) {
    if (!user || user.id === this.selfId) return;
    this.remoteUsers.set(user.id, user);
    this.onlineCount = Math.max(this.onlineCount, this.remoteUsers.size + 1);
    this.notify();
  }

  private handleRemoteUserLeave(userId: string) {
    this.remoteUsers.delete(userId);
    this.onlineCount = Math.max(1, this.remoteUsers.size + 1);
    this.notify();
  }

  private bindWindowEvents() {
    if (typeof window === 'undefined') return;

    // Track mouse move on current window
    window.addEventListener('pointermove', (e) => {
      this.sendCursorPosition(e.clientX, e.clientY, false);
    });

    window.addEventListener('pointerdown', (e) => {
      this.sendCursorPosition(e.clientX, e.clientY, true);
    });

    window.addEventListener('pointerup', (e) => {
      this.sendCursorPosition(e.clientX, e.clientY, false);
    });

    window.addEventListener('beforeunload', () => {
      this.broadcastChannel?.postMessage({
        type: 'tab_bye',
        senderId: this.selfId,
      });
      if (this.eventSource) {
        this.eventSource.close();
      }
    });
  }

  public sendCursorPosition(clientX: number, clientY: number, clicking: boolean, emoji?: string) {
    const now = Date.now();
    if (!clicking && now - this.lastCursorPost < this.throttleMs) {
      return;
    }
    this.lastCursorPost = now;

    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 800;
    const xRatio = Math.max(0, Math.min(1, clientX / w));
    const yRatio = Math.max(0, Math.min(1, clientY / h));

    const payload = {
      userId: this.selfId,
      name: this.selfName,
      color: this.selfColor,
      xRatio,
      yRatio,
      x: clientX,
      y: clientY,
      page: this.currentPage,
      clicking,
      emoji,
    };

    // Broadcast to local tabs instantly
    this.broadcastChannel?.postMessage({
      type: 'cursor',
      senderId: this.selfId,
      payload,
    });

    // Send to backend server for cross-device/network peers
    if (navigator.onLine) {
      fetch('/api/presence/cursor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // network transient
      });
    }
  }

  public setPage(page: string) {
    this.currentPage = page;
  }

  public setNickname(name: string) {
    const clean = name.trim().slice(0, 24);
    if (!clean) return;
    this.selfName = clean;
    localStorage.setItem('real_presence_name', clean);

    fetch('/api/presence/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: this.selfId, name: clean }),
    }).catch(() => {});

    this.notify();
  }

  public blastEmoji(emoji: string) {
    this.sendCursorPosition(window.innerWidth / 2, window.innerHeight / 2, true, emoji);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): PresenceState {
    return {
      selfId: this.selfId,
      selfName: this.selfName,
      selfColor: this.selfColor,
      onlineCount: this.onlineCount,
      remoteUsers: new Map(this.remoteUsers),
      isConnected: this.isConnected,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }
}

export const presenceManager = new RealTimePresenceManager();
