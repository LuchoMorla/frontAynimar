import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import styles from '@styles/Tracking.module.scss';

// ── Stepper config ────────────────────────────────────────────────────────────

const STEPS = [
  {
    icon:  '🛒',
    label: 'Pedido Recibido',
    desc:  'Tu pedido fue registrado exitosamente.',
    states: [
      'comprado_pendiente_pago',
      'comprado_pendiente_negocio',
      'aprobado',
      'en_preparacion',
      'en_transito',
      'enviado',
      'entregado',
    ],
  },
  {
    icon:  '📦',
    label: 'Preparando Despacho',
    desc:  'Estamos preparando tu paquete.',
    states: ['aprobado', 'en_preparacion', 'en_transito', 'enviado', 'entregado'],
  },
  {
    icon:  '🚚',
    label: 'En Camino',
    desc:  'Tu pedido está en ruta hacia ti.',
    states: ['en_transito', 'enviado', 'entregado'],
  },
  {
    icon:  '🎉',
    label: 'Entregado',
    desc:  '¡Tu pedido llegó a su destino!',
    states: ['entregado'],
  },
];

const CANCELLED_STATES = ['cancelado', 'devuelto', 'por_devolver'];
const ERROR_STATES     = ['error_api_proveedor', 'en_controversia', 'controversia_escalada'];

function getStepStatus(stepIndex, stateOrder) {
  const activeIndex = STEPS.reduce((acc, step, i) =>
    step.states.includes(stateOrder) ? i : acc, -1);

  if (stepIndex < activeIndex)  return 'done';
  if (stepIndex === activeIndex) return 'active';
  return 'pending';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('es-EC', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TrackingPage({ order, error }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!order?.trackingNumber) return;
    await navigator.clipboard.writeText(order.trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (error || !order) {
    return (
      <>
        <Head><title>Pedido no encontrado — Aynimar</title></Head>
        <div className={styles.page}>
          <header className={styles.header}>
            <p className={styles.brand}>Aynimar</p>
          </header>
          <div className={styles.notFound}>
            <div className={styles.notFoundIcon}>🔍</div>
            <h1 className={styles.notFoundTitle}>Pedido no encontrado</h1>
            <p className={styles.notFoundText}>
              {error ?? 'No pudimos encontrar información para este número de pedido.'}
            </p>
            <Link href="/store" className={styles.btnPrimary}>Ir a la tienda</Link>
          </div>
        </div>
      </>
    );
  }

  const isCancelled = CANCELLED_STATES.includes(order.stateOrder);
  const isError     = ERROR_STATES.includes(order.stateOrder);
  const showStepper = !isCancelled && !isError;

  return (
    <>
      <Head>
        <title>Rastreo #{order.id} — Aynimar</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className={styles.page}>
        <header className={styles.header}>
          <p className={styles.brand}>Aynimar</p>
          <p className={styles.subtitle}>Rastreo de Pedido</p>
        </header>

        <div className={styles.card}>
          {/* ── Order meta ── */}
          <div className={styles.orderMeta}>
            <p className={styles.orderId}>Pedido #{order.id}</p>
            {order.customerName && (
              <p className={styles.customerGreeting}>Hola, {order.customerName} 👋</p>
            )}
            <p className={styles.orderDate}>Realizado el {formatDate(order.createdAt)}</p>
          </div>

          {/* ── Cancelled / error alert ── */}
          {isCancelled && (
            <div className={styles.alertBox}>
              ❌ Este pedido fue cancelado o devuelto. Contáctanos si tienes dudas.
            </div>
          )}
          {isError && (
            <div className={styles.alertBox}>
              ⚠️ Hubo un problema procesando tu pedido. Nuestro equipo ya está trabajando en ello.
            </div>
          )}

          {/* ── Progress stepper ── */}
          {showStepper && (
            <div className={styles.stepper}>
              {STEPS.map((step, i) => {
                const status = getStepStatus(i, order.stateOrder);
                return (
                  <div key={step.label} className={`${styles.step} ${styles[status]}`}>
                    <div className={styles.stepBubble}>{step.icon}</div>
                    <div className={styles.stepContent}>
                      <p className={styles.stepLabel}>{step.label}</p>
                      {status === 'active' && (
                        <p className={styles.stepDesc}>{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Tracking info box ── */}
          {order.trackingNumber && (
            <div className={styles.trackingBox}>
              <p className={styles.trackingTitle}>📬 Información de Envío</p>
              {order.carrierName && (
                <div className={styles.trackingRow}>
                  <span className={styles.trackingKey}>Transportadora</span>
                  <span className={styles.trackingValue}>{order.carrierName}</span>
                </div>
              )}
              <div className={styles.trackingRow}>
                <span className={styles.trackingKey}>Número de Guía</span>
                <span className={styles.trackingValue}>{order.trackingNumber}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
              >
                {copied ? '✓ Copiado' : '📋 Copiar número de guía'}
              </button>
            </div>
          )}

          {/* ── Action buttons ── */}
          <div className={styles.actions}>
            <Link href="/mi_cuenta/orders" className={styles.btnPrimary}>
              Ver mis pedidos
            </Link>
            <Link href="/store" className={styles.btnSecondary}>
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// ── SSR data fetch ────────────────────────────────────────────────────────────

export async function getServerSideProps(ctx) {
  const { orderId } = ctx.params;

  const API     = process.env.NEXT_PUBLIC_API_URL;
  const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

  try {
    const { data } = await axios.get(
      `${API}/api/${VERSION}/orders/track/${orderId}`,
      { timeout: 8000 }
    );
    return { props: { order: data, error: null } };
  } catch (err) {
    const status = err.response?.status;
    if (status === 404) {
      return { props: { order: null, error: 'Número de pedido no encontrado.' } };
    }
    return { props: { order: null, error: 'No pudimos cargar el pedido. Intenta de nuevo.' } };
  }
}
