/**
 * CartRewardNudge
 *
 * Drop-in para el checkout. Muestra la barra de proximidad al threshold
 * del reto de compra activo, con countdown visible.
 *
 * Uso:
 *   <CartRewardNudge cartTotal={subtotalAfterCoupon} />
 *
 * Requiere <WalletProvider> en un ancestro.
 */
import { useWallet } from '@context/WalletContext';
import styles from '@styles/CartRewardNudge.module.scss';

export default function CartRewardNudge({ cartTotal = 0 }) {
  const { getCartProximity } = useWallet();
  const proximity = getCartProximity(cartTotal);

  if (!proximity || proximity.isExpired) return null;

  const { challenge, remaining, pct, countdown } = proximity;

  return (
    <div className={styles.nudge} role="status" aria-live="polite">
      {/* Barra de progreso */}
      <div className={styles.barWrap}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, '--pct': `${pct}%` }}
        />
      </div>

      {/* Mensaje principal */}
      <div className={styles.message}>
        {remaining > 0 ? (
          <>
            <span className={styles.chestIcon}>🎁</span>
            <span>
              Agrega{' '}
              <strong className={styles.amount}>${remaining.toFixed(2)}</strong>
              {' '}más y desbloqueas{' '}
              <strong>{challenge.rewardCredits} Aynicréditos</strong>
            </span>
          </>
        ) : (
          <>
            <span className={styles.chestIcon}>✅</span>
            <span>
              ¡Threshold alcanzado! Completa tu compra para ganar{' '}
              <strong>{challenge.rewardCredits} créditos</strong>
            </span>
          </>
        )}
      </div>

      {/* Countdown si el reto tiene TTL */}
      {countdown && (
        <div className={styles.countdown}>
          <span className={styles.countdownIcon}>⏱</span>
          <span>
            Vence en{' '}
            <strong className={styles.countdownTime}>{countdown}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
