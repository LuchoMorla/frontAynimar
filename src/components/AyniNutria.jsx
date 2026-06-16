import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@styles/AyniNutria.module.scss';

// ── Local State Manager — persisted in sessionStorage ─────────────────────────
const STATE_KEY = 'nutria_ctx';

const DEFAULT_CONTEXTO = {
  perfilCliente:      { nombre: null, telefono: null },
  historialIntereses: [],
  estadoCarrito:      {},
  trackingSoporte:    { ordenId: null, estado: null },
  vectorEmocional:    { inicial: null, actual: null },
};

function loadContexto() {
  if (typeof window === 'undefined') return DEFAULT_CONTEXTO;
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? { ...DEFAULT_CONTEXTO, ...JSON.parse(raw) } : DEFAULT_CONTEXTO;
  } catch (_) {
    return DEFAULT_CONTEXTO;
  }
}

function saveContexto(ctx) {
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(STATE_KEY, JSON.stringify(ctx)); } catch (_) { /* ignore */ }
}

function mergeContexto(prev, update) {
  if (!update || typeof update !== 'object') return prev;
  const next = { ...prev };

  if (update.perfilCliente) {
    next.perfilCliente = { ...prev.perfilCliente, ...update.perfilCliente };
  }
  if (Array.isArray(update.historialIntereses)) {
    const combined = [...new Set([...prev.historialIntereses, ...update.historialIntereses])];
    next.historialIntereses = combined.slice(-12);
  }
  if (update.estadoCarrito && typeof update.estadoCarrito === 'object') {
    const merged = { ...prev.estadoCarrito };
    Object.entries(update.estadoCarrito).forEach(([id, qty]) => {
      if (qty <= 0) delete merged[id];
      else merged[id] = qty;
    });
    next.estadoCarrito = merged;
  }
  if (update.trackingSoporte) {
    next.trackingSoporte = { ...prev.trackingSoporte, ...update.trackingSoporte };
  }
  if (update.vectorEmocional) {
    next.vectorEmocional = { ...prev.vectorEmocional, ...update.vectorEmocional };
  }
  return next;
}

// ── Static content ────────────────────────────────────────────────────────────
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
  text: '¡Hola, de una! Soy NutrIA 🦦. ¿En qué te ayudo, ve? Pregúntame precios, envíos, o dime qué buscas.',
};

const FAQ = [
  { q: '¿A qué ciudades entregan?', a: 'Quito, Guayaquil, Cuenca y principales ciudades del Ecuador. Coordinamos la entrega contigo por WhatsApp.' },
  { q: '¿Cómo funciona el pago contra entrega?', a: 'El repartidor llega a tu dirección y pagas en efectivo o transferencia al recibirlo. Sin riesgo ni adelantos.' },
  { q: '¿Cuánto tarda el envío?', a: 'Dentro de Quito: 1–3 días hábiles. Otras ciudades: 3–7 días hábiles según la transportista.' },
  { q: '¿Qué son los Ayni-Créditos?', a: '1 Ayni-Crédito = $1 de descuento. Los acumulas reciclando o comprando y puedes usarlos en cualquier pedido.' },
  { q: '¿Cómo reciclo con Aynimar?', a: 'Lleva tus residuos a puntos autorizados, registra el peso con el operador y los créditos se acreditan automáticamente.' },
  { q: '¿Puedo rastrear mi pedido?', a: 'Sí. Recibirás el número de guía por WhatsApp. También puedes consultarlo en "Mis Pedidos" en tu cuenta.' },
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ── Component ─────────────────────────────────────────────────────────────────
const AyniNutria = () => {
  const router = useRouter();
  const [isOpen, setIsOpen]                     = useState(false);
  const [showBubble, setShowBubble]             = useState(true);
  const [tipIndex, setTipIndex]                 = useState(0);
  const [hasAbandonedCart, setHasAbandonedCart] = useState(false);
  const [activeTab, setActiveTab]               = useState('faq');
  const [messages, setMessages]                 = useState([WELCOME_MSG]);
  const [input, setInput]                       = useState('');
  const [isLoading, setIsLoading]               = useState(false);
  const [contexto, setContexto]                 = useState(DEFAULT_CONTEXTO);
  const [cardStates, setCardStates]             = useState({});

  const historyRef    = useRef(null);
  const loadingRef    = useRef(new Set());
  const inputRef      = useRef(null);
  const messagesRef   = useRef(messages);
  const prevIsOpenRef = useRef(false);

  const isCheckout  = router.pathname === '/checkout';
  const isRecycling = router.pathname.startsWith('/recycl');

  // Hydrate state manager from sessionStorage on mount
  useEffect(() => { setContexto(loadContexto()); }, []);

  // Persist state manager whenever it changes
  useEffect(() => { saveContexto(contexto); }, [contexto]);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  useEffect(() => {
    const oi = typeof window !== 'undefined' ? localStorage.getItem('oi') : null;
    setHasAbandonedCart(!!oi && !isCheckout);
    if (oi) {
      setContexto((prev) => ({
        ...prev,
        trackingSoporte: { ...prev.trackingSoporte, ordenId: Number(oi) },
      }));
    }
  }, [router.pathname, isCheckout]);

  const getTips = useCallback(
    () => (isRecycling ? RECYCLE_TIPS : STORE_TIPS),
    [isRecycling]
  );

  useEffect(() => {
    if (isCheckout || hasAbandonedCart) return;
    const tips = getTips();
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 8000);
    return () => clearInterval(id);
  }, [isCheckout, hasAbandonedCart, getTips]);

  useEffect(() => {
    setShowBubble(true);
    setIsOpen(false);
    setTipIndex(0);
  }, [router.pathname]);

  // Emotional analytics report when panel closes (if chat was used)
  useEffect(() => {
    if (prevIsOpenRef.current && !isOpen && messagesRef.current.length > 2) {
      const sessionHistory = messagesRef.current.map((m) => ({
        role:    m.sender === 'user' ? 'user' : 'assistant',
        content: m.text || '',
      }));
      fetch(`${API_BASE}/api/v1/ai/nutria/session-close`, {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        body:      JSON.stringify({ history: sessionHistory }),
        keepalive: true,
      }).catch(() => {});
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeTab === 'chat' && historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  useEffect(() => {
    if (activeTab === 'chat' && isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeTab, isOpen]);

  const getMessage = () => {
    if (isCheckout)      return CHECKOUT_MESSAGE;
    if (hasAbandonedCart) return ABANDONED_CART_MESSAGE;
    return getTips()[tipIndex];
  };

  const handleAvatarClick = () => {
    setIsOpen((o) => !o);
    setShowBubble(false);
  };

  // Execute client-side actions returned by the autonomous agent
  const handleActions = useCallback(
    async (actions) => {
      for (const action of actions) {
        try {
          if (action.type === 'redirect') {
            router.push(action.to);

          } else if (action.type === 'add_to_cart') {
            let oi = localStorage.getItem('oi');
            if (!oi) {
              const orderRes = await fetch(`${API_BASE}/api/v1/orders/guest-order`, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
              });
              const newOrder = await orderRes.json();
              oi = String(newOrder.id);
              localStorage.setItem('oi', oi);
            }
            await fetch(`${API_BASE}/api/v1/orders/add-item-guest`, {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                orderId:   Number(oi),
                productId: action.productoId,
                amount:    action.cantidad,
              }),
            });
            // Optimistic state update
            setContexto((prev) => mergeContexto(prev, {
              estadoCarrito: { [action.productoId]: action.cantidad },
            }));

          } else if (action.type === 'remove_from_cart') {
            const oi = localStorage.getItem('oi');
            if (oi) {
              const orderRes = await fetch(`${API_BASE}/api/v1/orders/guest-order/${oi}`);
              if (orderRes.ok) {
                const order = await orderRes.json();
                const item  = (order.items ?? []).find((i) => i.id === action.productoId);
                if (item?.OrderProduct?.id) {
                  await fetch(`${API_BASE}/api/v1/orders/item-guest/${item.OrderProduct.id}`, {
                    method: 'DELETE',
                  });
                }
              }
            }
            // Optimistic state update
            setContexto((prev) => mergeContexto(prev, {
              estadoCarrito: { [action.productoId]: 0 },
            }));
          }
          // show_products is handled inline in sendMessage
        } catch (actionErr) {
          console.error('[NutrIA] Action error:', action.type, actionErr.message);
        }
      }
    },
    [router]
  );

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Add the user message to the chat immediately
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsLoading(true);

    // Set initial emotion on the very first user message
    if (messages.length === 1) {
      setContexto((prev) => mergeContexto(prev, {
        vectorEmocional: { inicial: 'neutral', actual: 'neutral' },
      }));
    }

    try {
      // Build history from the CURRENT messages state (captured before we called
      // setMessages to append the new user turn). This means the current message
      // is NOT included in history — the backend appends it separately, so there
      // is zero duplication in the Groq conversation array.
      const history = messages
        .slice(1)    // skip the static hardcoded welcome message
        .slice(-10)  // keep last 10 turns for conversational continuity
        .map((m) => ({
          role:    m.sender === 'user' ? 'user' : 'assistant',
          content: m.text || '',
        }));

      const res = await fetch(`${API_BASE}/api/v1/ai/nutria/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ message: text, history, contexto }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Error ${res.status}`);
      }

      const data = await res.json();

      // Separate product-card action from navigation/cart actions
      const productsAction = (data.actions || []).find((a) => a.type === 'show_products');
      const otherActions   = (data.actions || []).filter((a) => a.type !== 'show_products');

      // Append NutrIA reply with optional product cards
      setMessages((prev) => [
        ...prev,
        {
          sender:   'nutria',
          text:     data.reply || 'Ups, no pude responder. ¡Inténtalo de nuevo!',
          products: productsAction?.productos ?? null,
        },
      ]);

      // Merge server-computed state updates (profile extraction, tracking, interests)
      if (data.estadoActualizado) {
        setContexto((prev) => mergeContexto(prev, data.estadoActualizado));
      }

      // Execute navigation / cart mutations
      if (otherActions.length > 0) {
        await handleActions(otherActions);
      }
    } catch (err) {
      console.error('[NutrIA] Chat error:', err.message);
      setMessages((prev) => [
        ...prev,
        { sender: 'nutria', text: err.message || 'Tuve un problemita técnico. Inténtalo en un momentito 🦦.' },
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

  // Quick-add from product cards — async with per-card loading/success feedback
  const quickAddProduct = useCallback(async (productoId) => {
    if (loadingRef.current.has(productoId)) return;
    loadingRef.current.add(productoId);
    setCardStates((prev) => ({ ...prev, [productoId]: 'loading' }));
    try {
      await handleActions([{ type: 'add_to_cart', productoId, cantidad: 1 }]);
      setCardStates((prev) => ({ ...prev, [productoId]: 'added' }));
      setTimeout(() => {
        setCardStates((prev) => ({ ...prev, [productoId]: 'idle' }));
        loadingRef.current.delete(productoId);
      }, 2500);
    } catch (_) {
      setCardStates((prev) => ({ ...prev, [productoId]: 'idle' }));
      loadingRef.current.delete(productoId);
    }
  }, [handleActions]);

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

          {activeTab === 'chat' && (
            <div className={styles.chatArea}>
              <div className={styles.chatHistory} ref={historyRef}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={msg.sender === 'nutria' ? styles.msgNutria : styles.msgUser}
                  >
                    {msg.sender === 'nutria' && <span className={styles.msgAvatar}>🦦</span>}
                    <div className={styles.msgContent}>
                      <span className={styles.msgBubble}>{msg.text}</span>

                      {msg.sender === 'nutria' && msg.products && msg.products.length > 0 && (
                        <div className={styles.productCards}>
                          {msg.products.map((p) => (
                            <div key={p.id} className={styles.productCard}>
                              <div className={styles.productCardInfo}>
                                <Link
                                  href={`/store/${p.id}`}
                                  className={styles.productCardLink}
                                >
                                  {p.nombre}
                                </Link>
                                <span className={styles.productCardPrice}>${p.precio}</span>
                              </div>
                              <button
                                type="button"
                                className={`${styles.productCardAdd}${cardStates[p.id] === 'added' ? ` ${styles.productCardAdded}` : ''}`}
                                onClick={() => quickAddProduct(p.id)}
                                disabled={cardStates[p.id] === 'loading' || cardStates[p.id] === 'added'}
                                aria-label={`Agregar ${p.nombre} al carrito`}
                              >
                                {cardStates[p.id] === 'loading' ? '…' : cardStates[p.id] === 'added' ? '✓' : '+ Agregar'}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className={styles.msgNutria}>
                    <span className={styles.msgAvatar}>🦦</span>
                    <div className={styles.msgContent}>
                      <span className={`${styles.msgBubble} ${styles.thinking}`}>
                        <span /><span /><span />
                      </span>
                    </div>
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
