import { useWallet, FOREST_STAGES } from '@context/WalletContext';
import styles from '@styles/ImpactTreeWidget.module.scss';

/* ── SVG trees por etapa ─────────────────────────────────── */

const TREE_SVGS = {
  seed: (
    <svg viewBox="0 0 120 120" className={styles.treeSvg} aria-label="Semilla">
      {/* tierra */}
      <ellipse cx="60" cy="100" rx="40" ry="8" fill="#8B6914" opacity="0.35" />
      {/* tallo */}
      <line x1="60" y1="100" x2="60" y2="74" stroke="#6B8E23" strokeWidth="4" strokeLinecap="round" />
      {/* hoja izquierda */}
      <ellipse cx="50" cy="68" rx="11" ry="6" fill="#4CAF50" transform="rotate(-30 50 68)" className={styles.leafL} />
      {/* hoja derecha */}
      <ellipse cx="70" cy="68" rx="11" ry="6" fill="#66BB6A" transform="rotate(30 70 68)" className={styles.leafR} />
      {/* brote central */}
      <ellipse cx="60" cy="62" rx="7" ry="10" fill="#81C784" />
    </svg>
  ),

  sprout: (
    <svg viewBox="0 0 120 120" className={styles.treeSvg} aria-label="Brote">
      <ellipse cx="60" cy="104" rx="44" ry="9" fill="#8B6914" opacity="0.3" />
      {/* tronco */}
      <rect x="57" y="72" width="6" height="34" rx="3" fill="#795548" />
      {/* copa inferior */}
      <ellipse cx="60" cy="80" rx="24" ry="14" fill="#388E3C" />
      {/* copa media */}
      <ellipse cx="60" cy="66" rx="19" ry="13" fill="#43A047" />
      {/* copa superior */}
      <ellipse cx="60" cy="54" rx="14" ry="11" fill="#66BB6A" />
    </svg>
  ),

  sapling: (
    <svg viewBox="0 0 120 120" className={styles.treeSvg} aria-label="Árbol Joven">
      <ellipse cx="60" cy="108" rx="46" ry="8" fill="#8B6914" opacity="0.28" />
      {/* tronco */}
      <rect x="55" y="68" width="10" height="42" rx="4" fill="#6D4C41" />
      {/* copa base */}
      <ellipse cx="60" cy="80" rx="30" ry="16" fill="#2E7D32" />
      {/* copa media */}
      <ellipse cx="60" cy="64" rx="25" ry="16" fill="#388E3C" />
      {/* copa superior */}
      <ellipse cx="60" cy="48" rx="20" ry="16" fill="#43A047" />
      {/* punta */}
      <ellipse cx="60" cy="35" rx="12" ry="12" fill="#66BB6A" />
    </svg>
  ),

  forest: (
    <svg viewBox="0 0 120 120" className={styles.treeSvg} aria-label="Bosque">
      <ellipse cx="60" cy="110" rx="50" ry="7" fill="#8B6914" opacity="0.25" />
      {/* árbol izquierdo (pequeño) */}
      <rect x="20" y="84" width="6" height="24" rx="3" fill="#5D4037" />
      <ellipse cx="23" cy="86" rx="13" ry="9" fill="#2E7D32" />
      <ellipse cx="23" cy="76" rx="10" ry="8" fill="#388E3C" />
      {/* árbol derecho (pequeño) */}
      <rect x="94" y="84" width="6" height="24" rx="3" fill="#5D4037" />
      <ellipse cx="97" cy="86" rx="13" ry="9" fill="#1B5E20" />
      <ellipse cx="97" cy="76" rx="10" ry="8" fill="#2E7D32" />
      {/* árbol central (grande) */}
      <rect x="55" y="62" width="10" height="46" rx="4" fill="#4E342E" />
      <ellipse cx="60" cy="78" rx="30" ry="16" fill="#1B5E20" />
      <ellipse cx="60" cy="62" rx="25" ry="16" fill="#2E7D32" />
      <ellipse cx="60" cy="46" rx="20" ry="16" fill="#388E3C" />
      <ellipse cx="60" cy="33" rx="14" ry="13" fill="#43A047" />
      {/* destellos */}
      <circle cx="42" cy="36" r="2.5" fill="#A5D6A7" className={styles.sparkle} />
      <circle cx="78" cy="28" r="2"   fill="#C8E6C9" className={styles.sparkle} style={{ animationDelay: '0.4s' }} />
      <circle cx="60" cy="20" r="3"   fill="#E8F5E9" className={styles.sparkle} style={{ animationDelay: '0.8s' }} />
    </svg>
  ),
};

/* ── Barra de progreso de XP ─────────────────────────────── */

function ProgressBar({ pct, nextLabel }) {
  return (
    <div className={styles.progressWrap}>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${pct}%`, '--pct': `${pct}%` }}
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {pct < 100 && (
        <span className={styles.progressLabel}>
          Próxima fase: <strong>{nextLabel}</strong>
        </span>
      )}
    </div>
  );
}

/* ── Misión activa con countdown ─────────────────────────── */

function ActiveMission({ mission }) {
  if (!mission) return null;
  const hasCountdown = mission.countdown && !mission.isExpired;

  return (
    <div className={`${styles.mission} ${mission.isExpired ? styles.missionExpired : ''}`}>
      <span className={styles.missionDot} aria-hidden />
      <div className={styles.missionBody}>
        <p className={styles.missionTitle}>{mission.title}</p>
        <p className={styles.missionReward}>+{mission.rewardCredits} créditos</p>
        {hasCountdown && (
          <p className={styles.missionCountdown} aria-live="polite">
            ⏱ <strong>{mission.countdown}</strong>
          </p>
        )}
        {mission.isExpired && (
          <p className={styles.missionExpiredLabel}>Reto vencido</p>
        )}
      </div>
    </div>
  );
}

/* ── Cofre de recompensa ─────────────────────────────────── */

function RewardChest({ onDismiss }) {
  return (
    <button className={styles.chest} onClick={onDismiss} aria-live="assertive">
      <span className={styles.chestIcon} aria-hidden>🎁</span>
      <div className={styles.chestText}>
        <strong>¡Siembra desbloqueada!</strong>
        <span>Toca para reclamar tu recompensa</span>
      </div>
    </button>
  );
}

/* ── Widget principal ────────────────────────────────────── */

export default function ImpactTreeWidget({ compact = false }) {
  const {
    treesPlanted,
    impactScore,
    stageIndex,
    forestLevel,
    forestDescription,
    nextForestLevel,
    progress,
    challenges,
    pendingChest,
    dismissChest,
  } = useWallet();

  const stageKey    = FOREST_STAGES[stageIndex]?.key ?? 'seed';
  const treeSvg     = TREE_SVGS[stageKey];
  const activeMission = challenges.find((c) => !c.completed);

  return (
    <div
      className={`${styles.widget} ${styles[`stage_${stageKey}`]} ${compact ? styles.compact : ''}`}
      role="region"
      aria-label="Tu impacto ambiental"
    >
      {/* Árbol animado */}
      <div className={styles.treeWrap}>
        {treeSvg}
        {/* Partículas de siembra */}
        <span className={styles.particle} aria-hidden style={{ '--x': '20%', '--d': '0s' }}>✨</span>
        <span className={styles.particle} aria-hidden style={{ '--x': '70%', '--d': '1.2s' }}>🌱</span>
        <span className={styles.particle} aria-hidden style={{ '--x': '45%', '--d': '2.1s' }}>✨</span>
      </div>

      {/* Fase actual */}
      <div className={styles.stageLabel}>
        <span className={styles.forestLevel}>{forestLevel}</span>
        {!compact && <p className={styles.stageDesc}>{forestDescription}</p>}
      </div>

      {/* Métrica principal — árboles sembrados */}
      <div className={styles.treesCounter}>
        <span className={styles.treesNumber}>{treesPlanted}</span>
        <span className={styles.treesLabel}>
          {treesPlanted === 1 ? 'árbol sembrado' : 'árboles sembrados'}
        </span>
      </div>

      {/* Progreso hacia siguiente fase */}
      <ProgressBar pct={progress} nextLabel={nextForestLevel} />

      {/* Impacto score */}
      {!compact && (
        <div className={styles.impactScore}>
          <span className={styles.impactIcon}>🌍</span>
          <span className={styles.impactValue}>{impactScore}</span>
          <span className={styles.impactUnit}>pts de impacto</span>
        </div>
      )}

      {/* Misión activa */}
      {!compact && <ActiveMission mission={activeMission} />}

      {/* Cofre */}
      {pendingChest && <RewardChest onDismiss={dismissChest} />}
    </div>
  );
}
