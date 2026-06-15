import React from 'react';
import Link from 'next/link';
import styles from '@styles/HowItWorks.module.scss';

const STEPS = [
  {
    number: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM5.14 6H3V4H1v2h2l3.6 7.59L5.25 16c-.16.28-.25.61-.25.94C5 18.1 5.9 19 7 19h14v-2H7.42a.25.25 0 01-.25-.25l.03-.12.97-1.63H19c.75 0 1.41-.41 1.75-1.03L23 9.54l-1.73-1-2.25 3.86L5.14 6zM11 9h2V6h3V4h-3V1h-2v3H8v2h3v3z"/>
      </svg>
    ),
    tag: 'Compra Inteligente',
    title: 'Elige lo que necesitas',
    description:
      'Explora nuestro catálogo de productos 100% nuevos, importados y de dropshipping. Desde tecnología hasta fitness, con Pago Contra Entrega en Quito.',
    accentColor: '#4900E4',
    bgColor: '#f0ebfd',
    borderColor: '#c4b5f4',
    tagColor: '#4900E4',
  },
  {
    number: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
      </svg>
    ),
    tag: 'Cierre de Ciclo',
    title: 'Recicla y Acumula',
    description:
      'No botes tus residuos. Entrega tu aceite de cocina usado, botellas o aparatos electrónicos a nuestros repartidores cuando recibas tu pedido o llévalos a nuestros puntos aliados.',
    accentColor: '#065f46',
    bgColor: '#ecfdf5',
    borderColor: '#6ee7b7',
    tagColor: '#065f46',
  },
  {
    number: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.34 8-7 8-11.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-4h-2c0-3.25 3-3 3-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 2.75-3 5z"/>
      </svg>
    ),
    tag: 'Ayni-Créditos',
    title: '¡Gana Saldo para tu Bolsillo!',
    description:
      'Cada residuo que entregas se convierte en Ayni-Créditos directos en tu cuenta. Usa ese saldo acumulado como dinero real para pagar tus siguientes compras. ¡Cuidar el planeta te sale más barato!',
    accentColor: '#92400e',
    bgColor: '#fffbeb',
    borderColor: '#fcd34d',
    tagColor: '#b45309',
  },
];

const ArrowRight = () => (
  <div className={styles.connector} aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const HowItWorks = () => (
  <div className={styles.page}>
    {/* Hero */}
    <section className={styles.hero}>
      <p className={styles.heroEyebrow}>Economía Circular Inteligente</p>
      <h1 className={styles.heroTitle}>¿Cómo funciona Aynimar?</h1>
      <p className={styles.heroSub}>
        En 3 simples pasos unes el consumo inteligente con el reciclaje — y tu bolsillo lo nota.
      </p>
    </section>

    {/* Steps */}
    <section className={styles.stepsSection}>
      <div className={styles.stepsGrid}>
        {STEPS.map((step, i) => (
          <React.Fragment key={step.number}>
            <article
              className={styles.stepCard}
              style={{ borderTopColor: step.accentColor }}
            >
              {/* Number */}
              <span className={styles.stepNumber} style={{ color: step.accentColor }}>
                {step.number}
              </span>

              {/* Icon */}
              <div
                className={styles.iconWrap}
                style={{ background: step.bgColor, color: step.accentColor, borderColor: step.borderColor }}
              >
                {step.icon}
              </div>

              {/* Tag */}
              <span
                className={styles.stepTag}
                style={{ background: step.bgColor, color: step.tagColor, borderColor: step.borderColor }}
              >
                {step.tag}
              </span>

              {/* Text */}
              <h2 className={styles.stepTitle}>{step.title}</h2>
              <p className={styles.stepDesc}>{step.description}</p>
            </article>

            {i < STEPS.length - 1 && <ArrowRight />}
          </React.Fragment>
        ))}
      </div>
    </section>

    {/* Ayni-Créditos callout */}
    <section className={styles.creditsSection}>
      <div className={styles.creditsInner}>
        <div className={styles.creditsIcon}>♻️</div>
        <div>
          <h3 className={styles.creditsTitle}>Los Ayni-Créditos ya están activos</h3>
          <p className={styles.creditsDesc}>
            Cada vez que entregas residuos reciclables, Aynimar convierte ese peso en créditos reales.
            Los verás reflejados en tu cuenta y los podrás descontar directamente en el checkout.
          </p>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>¿Listo para empezar?</h2>
      <p className={styles.ctaSub}>Compra, recicla y acumula saldo — todo desde Aynimar.</p>
      <a href="/" className={styles.ctaButton}>
        <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.1rem', height: '1.1rem', flexShrink: 0 }}>
          <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM5.14 6H3V4H1v2h2l3.6 7.59L5.25 16c-.16.28-.25.61-.25.94C5 18.1 5.9 19 7 19h14v-2H7.42a.25.25 0 01-.25-.25l.03-.12.97-1.63H19c.75 0 1.41-.41 1.75-1.03L23 9.54l-1.73-1-2.25 3.86L5.14 6z"/>
        </svg>
        Ir al Catálogo de Productos
      </a>
    </section>
  </div>
);

export default HowItWorks;
