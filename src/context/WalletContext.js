import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WalletContext = createContext(null);

// Fases de crecimiento del bosque — mapeadas sobre XP acumulado
export const FOREST_STAGES = [
  {
    key: 'seed',
    forestLevel: 'Semilla',
    description: 'Tu primera semilla está en la tierra.',
    emoji: '🌱',
    minXP: 0,
    maxXP: 100,
  },
  {
    key: 'sprout',
    forestLevel: 'Brote',
    description: 'Tus acciones ya se ven: el brote emerge.',
    emoji: '🌿',
    minXP: 100,
    maxXP: 300,
  },
  {
    key: 'sapling',
    forestLevel: 'Árbol Joven',
    description: 'Estás construyendo un árbol de verdad.',
    emoji: '🌳',
    minXP: 300,
    maxXP: 600,
  },
  {
    key: 'forest',
    forestLevel: 'Bosque',
    description: 'Tu impacto ya es un bosque. Eres guardián del planeta.',
    emoji: '🌲🌲',
    minXP: 600,
    maxXP: Infinity,
  },
];

export function resolveForestStage(xp) {
  const idx = FOREST_STAGES.findLastIndex((s) => xp >= s.minXP);
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

export function WalletProvider({ children }) {
  const [credit, setCredit]             = useState(0);
  const [xp, setXp]                     = useState(0);
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [impactScore, setImpactScore]   = useState(0);
  const [challenges, setChallenges]     = useState([]);
  const [pendingChest, setPendingChest] = useState(false);
  const [loading, setLoading]           = useState(false);

  const { stageIndex, current, next, progress } = resolveForestStage(xp);

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
        setCredit(data.credit       ?? 0);
        setXp(data.xp               ?? 0);
        setTreesPlanted(data.treesPlanted ?? 0);
        setImpactScore(data.impactScore   ?? 0);
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  const fetchChallenges = useCallback(async () => {
    const t = getToken();
    if (!t) return;
    try {
      const res = await fetch(`${API_BASE}/api/v1/gamification/daily-challenges`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) setChallenges(await res.json());
    } catch (_) {}
  }, []);

  const triggerChest = useCallback(() => setPendingChest(true),  []);
  const dismissChest = useCallback(() => setPendingChest(false), []);

  useEffect(() => {
    fetchWallet();
    fetchChallenges();
  }, [fetchWallet, fetchChallenges]);

  return (
    <WalletContext.Provider
      value={{
        credit,
        xp,
        treesPlanted,
        impactScore,
        // Forest stage
        stageIndex,
        forestLevel: current.forestLevel,
        forestEmoji: current.emoji,
        forestDescription: current.description,
        nextForestLevel: next.forestLevel,
        progress,
        challenges,
        pendingChest,
        triggerChest,
        dismissChest,
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
