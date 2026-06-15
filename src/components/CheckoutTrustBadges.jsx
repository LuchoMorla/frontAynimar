import React from 'react';
import styles from '@styles/WalletRedeem.module.scss';

const BADGES = [
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
  {
    emoji: '🤝',
    title: 'Entrega Garantizada',
    desc: 'Tu pedido seguro y directo a tus manos.',
  },
];

const CheckoutTrustBadges = () => (
  <div className={styles.trustSection} aria-label="Garantías de compra">
    <p className={styles.trustTitle}>Tu compra protegida</p>

    {/* COD — badge destacado siempre primero */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      background: 'linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)',
      border: '2px solid #6ee7b7',
      borderRadius: '12px',
      padding: '14px 18px',
      marginBottom: '12px',
    }}>
      <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">💵</span>
      <div>
        <p style={{ margin: '0 0 2px', fontWeight: '800', fontSize: '1rem', color: '#065f46' }}>
          Pago Contra Entrega disponible
        </p>
        <p style={{ margin: 0, fontSize: '0.82rem', color: '#047857', lineHeight: '1.4' }}>
          Paga en efectivo o transferencia <strong>al momento de recibir</strong> tu producto. Sin riesgo.
        </p>
      </div>
    </div>

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
