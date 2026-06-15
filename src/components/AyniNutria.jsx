import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

const ABANDONED_CART_MESSAGE =
  '¡Hola! Veo que dejaste algunos productos guardados. ¿Quieres retomar tu pedido ahora mismo? 🦦🛒';

const WELCOME_MSG = {
  sender: 'nutria',
  text: '¡Hola, de una! Soy NutrIA 🦦. ¿En qué te ayudo, ve? Pregúntame sobre envíos, pagos o tus Ayni-Créditos.',
};

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const AyniNutria = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const [hasAbandonedCart, setHasAbandonedCart] = useState(false);

  const [activeTab, setActiveTab] = useState('faq');
  const [messages, setMessages] = useState([WELCOME_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const historyRef = useRef(null);
  const inputRef = useRef(null);

  const isCheckout = router.pathname === '/checkout';
  const isRecycling = router.pathname.startsWith('/recycl');

  useEffect(() => {
    const oi = window.localStorage.getItem('oi');
    setHasAbandonedCart(!!oi && !isCheckout);
  }, [router.pathname, isCheckout]);

  const getTips = useCallback(
    () => (isRecycling ? RECYCLE_TIPS : STORE_TIPS),
    [isRecycling]
  );

  useEffect(() => {
    if (isCheckout || hasAbandonedCart) return;
    const tips = getTips();
    const id = setInterval(
      () => setTipIndex((i) => (i + 1) % tips.length),
      8000
    );
    return () => clearInterval(id);
  }, [isCheckout, hasAbandonedCart, getTips]);

  useEffect(() => {
    setShowBubble(true);
    setIsOpen(false);
    setTipIndex(0);
  }, [router.pathname]);

  // Scroll chat to bottom whenever messages update or tab switches to chat
  useEffect(() => {
    if (activeTab === 'chat' && historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  // Focus input when switching to chat tab
  useEffect(() => {
    if (activeTab === 'chat' && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab, isOpen]);

  const getMessage = () => {
    if (isCheckout) return CHECKOUT_MESSAGE;
    if (hasAbandonedCart) return ABANDONED_CART_MESSAGE;
    return getTips()[tipIndex];
  };

  const handleAvatarClick = () => {
    setIsOpen((o) => !o);
    setShowBubble(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { sender: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send last 6 messages as context (skip the static welcome)
      const history = newMessages
        .slice(1)
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      const res = await fetch(`${API_BASE}/api/v1/ai/nutria/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error('network');
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: 'nutria', text: data.reply || 'Ups, no pude responder. ¡Inténtalo de nuevo!' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'nutria', text: 'Tuve un problemita técnico. Inténtalo en un momentito 🦦.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
          <p>{getMessage()}</p>

          {hasAbandonedCart && (
            <Link href="/checkout" className={styles.recoveryCta}>
              Completar Compra →
            </Link>
          )}
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

          {/* Tab bar */}
          <div className={styles.tabBar} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'faq'}
              className={`${styles.tab} ${activeTab === 'faq' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              Ayuda
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'chat'}
              className={`${styles.tab} ${activeTab === 'chat' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat con NutrIA 🤖
            </button>
          </div>

          {/* FAQ tab */}
          {activeTab === 'faq' && (
            <>
              {hasAbandonedCart && (
                <div className={styles.recoveryBanner}>
                  <p>Tienes un pedido sin finalizar.</p>
                  <Link href="/checkout" className={styles.recoveryBannerCta}>
                    Ir al Checkout →
                  </Link>
                </div>
              )}
              <div className={styles.faqList}>
                {FAQ.map(({ q, a }) => (
                  <details key={q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>{q}</summary>
                    <p className={styles.faqA}>{a}</p>
                  </details>
                ))}
              </div>
            </>
          )}

          {/* Chat tab */}
          {activeTab === 'chat' && (
            <div className={styles.chatArea}>
              <div className={styles.chatHistory} ref={historyRef}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.sender === 'nutria' ? styles.msgNutria : styles.msgUser
                    }
                  >
                    {msg.sender === 'nutria' && (
                      <span className={styles.msgAvatar}>🦦</span>
                    )}
                    <span className={styles.msgBubble}>{msg.text}</span>
                  </div>
                ))}
                {isLoading && (
                  <div className={styles.msgNutria}>
                    <span className={styles.msgAvatar}>🦦</span>
                    <span className={`${styles.msgBubble} ${styles.thinking}`}>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.chatFooter}>
                <input
                  ref={inputRef}
                  type="text"
                  className={styles.chatInput}
                  placeholder="Escribe tu pregunta…"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                  maxLength={500}
                  aria-label="Mensaje para NutrIA"
                />
                <button
                  type="button"
                  className={styles.chatSend}
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  aria-label="Enviar mensaje"
                >
                  ➤
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className={`${styles.avatar} ${hasAbandonedCart ? styles.avatarPulse : ''}`}
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
