import React from 'react';
import styles from '@styles/WalletRedeem.module.scss';

const BADGES = [
  {
    emoji: '🤝',
    title: 'Entrega Garantizada',
    desc: 'Tu pedido seguro y directo a tus manos.',
  },
  {
    emoji: '💳',
    title: 'Pago Contra Entrega',
    desc: 'Paga en efectivo o transferencia al momento de recibir tu producto.',
  },
  {
    emoji: '🌱',
    title: 'Ayudas al Medio Ambiente',
    desc: 'Cada transacción apoya la economía circular local.',
  },
  {
    emoji: '📄',
    title: 'Empresa Legalmente Constituida',
    desc: 'RUC Aynimar: 1793227194001',
  },
  {
    emoji: '✨',
    title: '100% Nuevo de Fábrica',
    desc: 'Todos los productos son completamente nuevos y directos del catálogo del proveedor.',
  },
];

const CheckoutTrustBadges = () => (
  <div className={styles.trustSection} aria-label="Garantías de compra">
    <p className={styles.trustTitle}>Tu compra protegida</p>
    <ul className={styles.badgeGrid}>
      {BADGES.map(({ emoji, title, desc }) => (
        <li key={title} className={styles.badge}>
          <span className={styles.badgeEmoji} aria-hidden="true">{emoji}</span>
          <span className={styles.badgeTitle}>{title}</span>
          <span className={styles.badgeDesc}>{desc}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default CheckoutTrustBadges;
