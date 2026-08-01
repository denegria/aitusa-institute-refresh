export function createMemoryFunnelLedgerRepository() {
  const events = new Map();
  const inserts = [];
  return {
    inserts,
    events,
    async insert(event) {
      const existing = events.get(event.idempotencyKey);
      if (existing) return { event: existing, replayed: true };
      const stored = { ...event };
      events.set(event.idempotencyKey, stored);
      inserts.push(stored);
      return { event: stored, replayed: false };
    },
    async purgeExpired({ now, limit }) {
      let deleted = 0;
      for (const [key, event] of events) {
        if (deleted >= limit) break;
        if (new Date(event.expiresAt) <= now) { events.delete(key); deleted += 1; }
      }
      return { deleted, limit };
    },
  };
}
