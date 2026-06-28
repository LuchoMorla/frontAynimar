import { useWallet } from '@context/WalletContext';
import styles from '@styles/CircularGameWidget.module.scss';

const SVG_SIZE   = 100;
const RADIUS     = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Umbrales de recompensa (en créditos Ayni)
const REWARD_TIERS = [
  { at: 50,  label: '10% Descuento',    icon: '🎟️' },
  { at: 100, label: 'Envío Gratis',     icon: '🚚' },
  { at: 200, label: 'Cofre Sorpresa',   icon: '🎁' },
  { at: 500, label: 'Embajador Verde',  icon: '🌿' },
];

function nextReward(credit) {
  return REWARD_TIERS.find((t) => t.at > credit) ?? REWARD_TIERS[REWARD_TIERS.length - 1];
}

export default function CircularGameWidget({ compact = false }) {
  const { credit, bottlesRecycled, oilLiters, pendingChest, dismissChest, challenges } =
    useWallet();

  const reward        = nextReward(credit);
  const progressPct   = Math.min(100, (credit / reward.at) * 100);
  const dashOffset    = CIRCUMFERENCE * (1 - progressPct / 100);
  const activeMission = challenges.find((c) => !c.completed);

  return (
    <div className={`${styles.widget} ${compact ? styles.compact : ''}`}>

      {/* ── Anillo de progreso ── */}
      <div className={styles.ringWrap} aria-label={`${progressPct.toFixed(0)}% hacia ${reward.label}`}>
        <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className={styles.svg}>
          <circle className={styles.track} cx="50" cy="50" r={RADIUS} />
          <circle
            className={styles.fill}
            cx="50" cy="50" r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            style={{ '--dash-offset': dashOffset }}
          />
        </svg>
        <div className={styles.ringCenter}>
          <span className={styles.creditAmount}>{credit}</span>
          <span className={styles.creditLabel}>Aynicréditos</span>
        </div>
      </div>

      {/* ── Próxima recompensa ── */}
      <div className={styles.rewardHint}>
        <span className={styles.rewardIcon}>{reward.icon}</span>
        <div className={styles.rewardText}>
          <span className={styles.rewardName}>{reward.label}</span>
          <span className={styles.rewardLeft}>
            Te faltan <strong>{Math.max(0, reward.at - credit)}</strong> créditos
          </span>
        </div>
      </div>

      {/* ── Métricas de impacto ambiental ── */}
      {!compact && (
        <div className={styles.impactRow}>
          <div className={styles.impactChip}>
            <span className={styles.impactEmoji}>🍶</span>
            <span className={styles.impactValue}>{bottlesRecycled ?? 0}</span>
            <span className={styles.impactUnit}>botellas</span>
          </div>
          <div className={styles.impactChip}>
            <span className={styles.impactEmoji}>🛢️</span>
            <span className={styles.impactValue}>{oilLiters ?? 0}L</span>
            <span className={styles.impactUnit}>aceite</span>
          </div>
        </div>
      )}

      {/* ── Misión activa ── */}
      {activeMission && !compact && (
        <div className={styles.missionBanner}>
          <span className={styles.missionPulse} aria-hidden />
          <div className={styles.missionBody}>
            <span className={styles.missionTitle}>{activeMission.title}</span>
            <span className={styles.missionReward}>+{activeMission.rewardCredits} créditos</span>
          </div>
        </div>
      )}

      {/* ── Cofre desbloqueado ── */}
      {pendingChest && (
        <button className={styles.chestBanner} onClick={dismissChest} aria-live="polite">
          <span className={styles.chestShake} aria-hidden>🎁</span>
          <div>
            <strong>¡Recompensa desbloqueada!</strong>
            <span>Toca para reclamar</span>
          </div>
        </button>
      )}
    </div>
  );
}
