import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from '@styles/AyniNutria.module.scss';

const STORE_TIPS = [
  '¿Sabías que cada compra apoya la economía circular en Ecuador? 🌿',
  'Recicla y acumula Ayni-Créditos para descontar en tu próxima compra. ♻️',
  'Todos los productos son nuevos e importados con garantía de calidad. ✨',
  'El pago contra entrega es 100% seguro — pagas cuando recibes tu pedido. 💵',
  'Con tus Ayni-Créditos puedes cubrir hasta el 100% del valor de tu compra. 🎁',
];

const RECYCLE_TIPS = [
  '¡Cada kilo reciclado suma puntos Ayni-Crédito a tu cuenta! 🌱',
  'Separa plástico, vidrio, papel y cartón — cada material suma diferente. ♻️',
  'Lleva tus residuos a puntos autorizados Aynimar y gana descuentos reales. 📦',
  '¿Primera vez reciclando con Aynimar? ¡Regístrate y empieza a ganar hoy! 🎉',
  'Tus créditos no expiran — úsalos cuando quieras en la tienda circular. 🛍️',
];

const CHECKOUT_MESSAGE =
  '¡Hola! Si tienes dudas con tus referencias o el pago contra entrega, yo te ayudo aquí mismo. 🦦';

const FAQ = [
  {
    q: '¿A qué ciudades entregan?',
    a: 'Quito, Guayaquil, Cuenca y principales ciudades del Ecuador. Coordinamos la entrega contigo por WhatsApp.',
  },
  {
    q: '¿Cómo funciona el pago contra entrega?',
    a: 'El repartidor llega a tu dirección y pagas en efectivo o transferencia al recibirlo. Sin riesgo ni adelantos.',
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Dentro de Quito: 1–3 días hábiles. Otras ciudades: 3–7 días hábiles según la transportista.',
  },
  {
    q: '¿Qué son los Ayni-Créditos?',
    a: '1 Ayni-Crédito = $1 de descuento. Los acumulas reciclando o comprando y puedes usarlos en cualquier pedido.',
  },
  {
    q: '¿Cómo reciclo con Aynimar?',
    a: 'Lleva tus residuos a puntos autorizados, registra el peso con el operador y los créditos se acreditan automáticamente.',
  },
  {
    q: '¿Puedo rastrear mi pedido?',
    a: 'Sí. Recibirás el número de guía por WhatsApp. También puedes consultarlo en "Mis Pedidos" en tu cuenta.',
  },
];

const AyniNutria = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);

  const isCheckout = router.pathname === '/checkout';
  const isRecycling = router.pathname.startsWith('/recycl');

  const getTips = useCallback(
    () => (isRecycling ? RECYCLE_TIPS : STORE_TIPS),
    [isRecycling]
  );

  useEffect(() => {
    if (isCheckout) return;
    const tips = getTips();
    const id = setInterval(
      () => setTipIndex(i => (i + 1) % tips.length),
      8000
    );
    return () => clearInterval(id);
  }, [isCheckout, getTips]);

  // Reset bubble when route changes
  useEffect(() => {
    setShowBubble(true);
    setIsOpen(false);
    setTipIndex(0);
  }, [router.pathname]);

  const message = isCheckout ? CHECKOUT_MESSAGE : getTips()[tipIndex];

  const handleAvatarClick = () => {
    setIsOpen(o => !o);
    setShowBubble(false);
  };

  return (
    <div className={styles.wrapper}>
      {showBubble && !isOpen && (
        <div className={styles.bubble}>
          <button
            type="button"
            className={styles.closeBubble}
            onClick={() => setShowBubble(false)}
            aria-label="Cerrar sugerencia"
          >
            ✕
          </button>
          <p>{message}</p>
        </div>
      )}

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Asistente AyniNutria">
          <div className={styles.panelHeader}>
            <span>🦦 AyniNutria</span>
            <button
              type="button"
              className={styles.closePanel}
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar panel"
            >
              ✕
            </button>
          </div>
          <div className={styles.faqList}>
            {FAQ.map(({ q, a }) => (
              <details key={q} className={styles.faqItem}>
                <summary className={styles.faqQ}>{q}</summary>
                <p className={styles.faqA}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.avatar}
        onClick={handleAvatarClick}
        aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente AyniNutria'}
        title="AyniNutria — Asistente Aynimar"
      >
        🦦
      </button>
    </div>
  );
};

export default AyniNutria;
