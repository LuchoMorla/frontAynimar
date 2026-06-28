/**
 * RewardChestModal
 *
 * Modal de celebración que aparece cuando triggerChest() se activa.
 * Muestra el descuento ganado (entre 5–15 %) con animación de apertura.
 *
 * Uso: montar una vez en _app.js o en el layout raíz:
 *   <RewardChestModal />
 *
 * Se autogestiona con WalletContext — no requiere props.
 */
import { useEffect, useRef } from 'react';
import { useWallet } from '@context/WalletContext';
import styles from '@styles/RewardChestModal.module.scss';

export default function RewardChestModal() {
  const { pendingChest, chestDiscount, dismissChest } = useWallet();
  const overlayRef = useRef(null);

  // Cerrar con Escape
  useEffect(() => {
    if (!pendingChest) return;
    const handler = (e) => { if (e.key === 'Escape') dismissChest(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [pendingChest, dismissChest]);

  // Bloquear scroll del body mientras está abierto
  useEffect(() => {
    document.body.style.overflow = pendingChest ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [pendingChest]);

  if (!pendingChest) return null;

  const discount = chestDiscount ?? 10;

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) dismissChest(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chest-title"
    >
      <div className={styles.modal}>
        {/* Partículas de celebración */}
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={styles.confetti}
            aria-hidden
            style={{
              '--x':     `${Math.random() * 100}%`,
              '--delay': `${i * 0.08}s`,
              '--color': ['#4900E4','#a2ce92','#ff8f00','#ffffff'][i % 4],
            }}
          />
        ))}

        {/* Cofre */}
        <div className={styles.chestWrap} aria-hidden>
          <span className={styles.chest}>🎁</span>
          <span className={styles.sparkleRing} />
        </div>

        {/* Contenido */}
        <h2 id="chest-title" className={styles.title}>
          ¡Cofre desbloqueado!
        </h2>
        <p className={styles.subtitle}>
          Completaste un reto y ganaste:
        </p>

        <div className={styles.discountBadge}>
          <span className={styles.discountNum}>{discount}%</span>
          <span className={styles.discountLabel}>de descuento en tu próxima compra</span>
        </div>

        <p className={styles.fine}>
          El cupón se aplica automáticamente en tu siguiente checkout. Válido 7 días.
        </p>

        <button className={styles.cta} onClick={dismissChest}>
          ¡Entendido, a seguir sembrando!
        </button>
      </div>
    </div>
  );
}
