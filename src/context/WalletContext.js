import React, {
  createContext, useContext, useState,
  useEffect, useCallback, useRef,
} from 'react';

const WalletContext = createContext(null);

export const FOREST_STAGES = [
  { key: 'seed',    forestLevel: 'Semilla',     emoji: '🌱', minXP: 0,    maxXP: 100  },
  { key: 'sprout',  forestLevel: 'Brote',       emoji: '🌿', minXP: 100,  maxXP: 300  },
  { key: 'sapling', forestLevel: 'Árbol Joven', emoji: '🌳', minXP: 300,  maxXP: 600  },
  { key: 'forest',  forestLevel: 'Bosque',      emoji: '🌲', minXP: 600,  maxXP: Infinity },
];

export function resolveForestStage(xp) {
  const idx     = FOREST_STAGES.findLastIndex((s) => xp >= s.minXP);
  const safeIdx = Math.max(0, idx);
  const current = FOREST_STAGES[safeIdx];
  const next    = FOREST_STAGES[Math.min(safeIdx + 1, FOREST_STAGES.length - 1)];
  const progress =
    current.maxXP === Infinity
      ? 100
      : Math.min(100, ((xp - current.minXP) / (current.maxXP - current.minXP)) * 100);
  return { stageIndex: safeIdx, current, next, progress };
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
const getToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('token') : null;

/** Formato mm:ss o hh:mm:ss */
function formatCountdown(ms) {
  if (ms <= 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function WalletProvider({ children }) {
  const [credit, setCredit]               = useState(0);
  const [xp, setXp]                       = useState(0);
  const [treesPlanted, setTreesPlanted]   = useState(0);
  const [impactScore, setImpactScore]     = useState(0);
  const [challenges, setChallenges]       = useState([]);
  const [pendingChest, setPendingChest]   = useState(false);
  const [chestDiscount, setChestDiscount] = useState(null); // % descuento ganado
  const [loading, setLoading]             = useState(false);

  // Countdown ticks — se recalcula cada segundo si hay challenge con deadline
  const [nowMs, setNowMs] = useState(() => Date.now());
  const tickRef = useRef(null);

  const { stageIndex, current, next, progress } = resolveForestStage(xp);

  // ── Fetch wallet ──────────────────────────────────────────
  const fetchWallet = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/v1/wallets/my-wallet`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCredit(data.credit           ?? 0);
        setXp(data.xp                   ?? 0);
        setTreesPlanted(data.treesPlanted ?? 0);
        setImpactScore(data.impactScore   ?? 0);
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  // ── Fetch challenges ──────────────────────────────────────
  const fetchChallenges = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/gamification/daily-challenges`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (_) {}
  }, []);

  // ── Tick para countdown ───────────────────────────────────
  useEffect(() => {
    const hasDeadline = challenges.some((c) => !c.completed && c.deadline);
    if (!hasDeadline) { clearInterval(tickRef.current); return; }

    tickRef.current = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(tickRef.current);
  }, [challenges]);

  useEffect(() => {
    fetchWallet();
    fetchChallenges();
  }, [fetchWallet, fetchChallenges]);

  // ── Desbloquear cofre ─────────────────────────────────────
  const triggerChest = useCallback((discountPct = null) => {
    setChestDiscount(discountPct);
    setPendingChest(true);
  }, []);

  const dismissChest = useCallback(() => {
    setPendingChest(false);
    setChestDiscount(null);
  }, []);

  // ── Completar reto desde el cliente (post-compra) ─────────
  const completeChallenge = useCallback(async (slug, orderAmountUsd = 0) => {
    const t = getToken();
    if (!t) return null;
    try {
      const res = await fetch(`${API_BASE}/api/v1/gamification/complete-challenge`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, orderAmountUsd }),
      });
      if (res.ok) {
        const result = await res.json();
        await fetchWallet();
        await fetchChallenges();
        triggerChest(result.chestDiscountPct);
        return result;
      }
    } catch (_) {}
    return null;
  }, [fetchWallet, fetchChallenges, triggerChest]);

  // ── Proximidad del carrito al threshold ───────────────────
  /**
   * Dado el total actual del carrito (USD), devuelve la info del reto
   * de compra más cercano que el usuario aún no ha completado.
   */
  const getCartProximity = useCallback((cartTotal = 0) => {
    const purchaseChallenges = challenges.filter(
      (c) => c.type === 'order' && !c.completed && c.threshold != null
    );
    if (!purchaseChallenges.length) return null;

    // El reto de menor threshold aún no alcanzado
    const target = purchaseChallenges
      .sort((a, b) => a.threshold - b.threshold)
      .find((c) => cartTotal < c.threshold);

    if (!target) return null; // todos los thresholds ya superados

    const remaining = Math.max(0, target.threshold - cartTotal);
    const pct       = Math.min(100, (cartTotal / target.threshold) * 100);
    const deadlineMs = target.deadline
      ? new Date(target.deadline).getTime() - nowMs
      : null;

    return {
      challenge:      target,
      remaining:      parseFloat(remaining.toFixed(2)),
      pct,
      deadlineMs,
      countdown:      deadlineMs != null ? formatCountdown(deadlineMs) : null,
      isExpired:      deadlineMs != null && deadlineMs <= 0,
    };
  }, [challenges, nowMs]);

  // ── Challenges enriquecidos con countdown ─────────────────
  const challengesWithCountdown = challenges.map((c) => {
    if (!c.deadline) return { ...c, countdown: null, deadlineMsLeft: null, isExpired: false };
    const msLeft = new Date(c.deadline).getTime() - nowMs;
    return {
      ...c,
      deadlineMsLeft: msLeft,
      countdown:      formatCountdown(msLeft),
      isExpired:      msLeft <= 0,
    };
  });

  return (
    <WalletContext.Provider
      value={{
        credit, xp, treesPlanted, impactScore,
        stageIndex,
        forestLevel:       current.forestLevel,
        forestEmoji:       current.emoji,
        nextForestLevel:   next.forestLevel,
        progress,
        challenges:        challengesWithCountdown,
        pendingChest,
        chestDiscount,
        triggerChest,
        dismissChest,
        completeChallenge,
        getCartProximity,
        loading,
        refetch: fetchWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet debe usarse dentro de <WalletProvider>');
  return ctx;
}
