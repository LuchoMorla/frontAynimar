import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { getDeunaPaymentInfo, getPaymentProofs, submitPaymentProof } from '@entities/paymentProof';
import { uploadFile } from '@firebase/storage';
import qrcode from 'qrcode-generator';

// Mismas reglas que valida el backend (Services/paymentProofImageValidation.js)
// — se repiten aquí SOLO para dar feedback inmediato al usuario antes de subir
// el archivo; la verificación real y autoritativa sigue siendo del backend.
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 8 * 1024 * 1024;

const PagoDeuna = () => {
  const router = useRouter();
  const { orderId } = router.query;

  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [proofs, setProofs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookie.get('token');

  useEffect(() => {
    if (!orderId) return;
    if (!token) {
      router.push('/login');
      return;
    }
    setLoading(true);
    Promise.all([
      getDeunaPaymentInfo(orderId, token),
      getPaymentProofs(orderId, token).catch(() => []),
    ])
      .then(([info, existingProofs]) => {
        setPaymentInfo(info);
        setProofs(Array.isArray(existingProofs) ? existingProofs : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'No se pudo cargar la información de pago de esta orden.');
      })
      .finally(() => setLoading(false));
  }, [orderId, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const latestProof = proofs[0] ?? null; // el backend ya los devuelve más reciente primero
  const hasPendingOrApproved = latestProof && (latestProof.status === 'pending' || latestProof.status === 'approved');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setError(null);
    if (!file) { setSelectedFile(null); return; }
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Solo se aceptan imágenes JPG, PNG o WebP.');
      setSelectedFile(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(`La imagen es demasiado grande (máximo ${Math.round(MAX_BYTES / (1024 * 1024))} MB).`);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    // orderId viene de router.query → es `undefined` hasta que el router está
    // listo, y podría no ser numérico. Nunca subir a payment-proofs/<orderId>
    // salvo con un id de orden válido (evita objetos huérfanos en carpetas
    // como payment-proofs/undefined/).
    const numericOrderId = Number(orderId);
    if (!selectedFile || !Number.isInteger(numericOrderId) || numericOrderId <= 0) {
      setError('No se pudo identificar el pedido. Recarga la página e intenta de nuevo.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      toast.info('Subiendo tu comprobante...');
      // 1. Sube el archivo REAL a Firebase Storage (mismo mecanismo que ya usa
      //    el dashboard para imágenes de producto) — carpeta dedicada a
      //    comprobantes de pago, requerida por la validación del backend.
      const fileUrl = await uploadFile(`payment-proofs/${numericOrderId}`, selectedFile);
      // 2. Registra la referencia en Aynimar. El backend vuelve a verificar
      //    (HEAD real) que el archivo exista y sea una imagen válida antes de
      //    aceptarlo — nunca confía únicamente en lo que el frontend afirma.
      const proof = await submitPaymentProof(orderId, fileUrl, token);
      setProofs((prev) => [proof, ...prev]);
      setSelectedFile(null);
      toast.success('¡Comprobante recibido! Tu pago queda pendiente de verificación por un administrador.');
    } catch (err) {
      const message = err.response?.data?.message || 'No se pudo subir el comprobante. Intenta de nuevo.';
      setError(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <p>Cargando información de pago...</p>
      </div>
    );
  }

  if (error && !paymentInfo) {
    return (
      <div style={styles.page}>
        <p style={styles.errorText}>{error}</p>
        <Link href="/mi_cuenta/orders"><span style={styles.link}>Ver mis pedidos</span></Link>
      </div>
    );
  }

  // QR generado 100% local (librería qrcode-generator, sin dependencias y sin
  // llamar a ningún servicio externo) a partir del link estático de DeUna que
  // devuelve el backend — nunca se envía el link/monto a un tercero.
  let qrImageSrc = null;
  if (paymentInfo?.paymentLink) {
    const qr = qrcode(0, 'M');
    qr.addData(paymentInfo.paymentLink);
    qr.make();
    qrImageSrc = qr.createDataURL(6, 8);
  }

  return (
    <>
      <Head>
        <title>Pago con DeUna | Aynimar</title>
      </Head>
      <div style={styles.page}>
        <h1 style={styles.title}>Paga con DeUna</h1>
        <p style={styles.subtitle}>Pedido #{orderId} — Referencia: {paymentInfo?.orderReference}</p>

        <div style={styles.card}>
          <p style={styles.amount}>Monto a pagar: <strong>${Number(paymentInfo?.amountToPay ?? 0).toFixed(2)}</strong></p>

          {qrImageSrc && (
            <div style={styles.qrWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrImageSrc} alt="Código QR de pago DeUna" style={{ width: 260, height: 260, imageRendering: 'pixelated' }} />
            </div>
          )}

          <a href={paymentInfo?.paymentLink} target="_blank" rel="noreferrer noopener" style={styles.deunaButton}>
            Abrir DeUna para pagar
          </a>

          <p style={styles.instructions}>{paymentInfo?.instructions}</p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Comprobante de pago</h2>

          {hasPendingOrApproved ? (
            <p style={styles.statusText}>
              {latestProof.status === 'approved'
                ? '✅ Tu pago fue verificado y aprobado. Pronto despacharemos tu pedido.'
                : '🕒 Ya recibimos tu comprobante. Está pendiente de revisión por un administrador.'}
            </p>
          ) : (
            <>
              {latestProof?.status === 'rejected' && (
                <p style={styles.rejectedText}>
                  ⚠️ Tu comprobante anterior fue rechazado{latestProof.reviewNote ? `: ${latestProof.reviewNote}` : '.'} Por favor sube uno nuevo.
                </p>
              )}
              <p style={styles.hint}>Selecciona la captura o foto de tu comprobante de pago (JPG, PNG o WebP, máx. 8MB).</p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={uploading}
                style={styles.fileInput}
              />
              {error && <p style={styles.errorText}>{error}</p>}
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                style={styles.uploadButton}
              >
                {uploading ? 'Subiendo...' : 'Subir comprobante'}
              </button>
            </>
          )}
        </div>

        <Link href="/mi_cuenta/orders"><span style={styles.link}>Ver mis pedidos</span></Link>
      </div>
    </>
  );
};

const styles = {
  page: { maxWidth: 480, margin: '0 auto', padding: '24px 16px', fontFamily: 'inherit' },
  title: { fontSize: 22, marginBottom: 4 },
  subtitle: { color: '#666', marginBottom: 20 },
  card: { background: '#fff', border: '1px solid #eee', borderRadius: 12, padding: 20, marginBottom: 16, textAlign: 'center' },
  amount: { fontSize: 18, marginBottom: 16 },
  qrWrapper: { display: 'flex', justifyContent: 'center', marginBottom: 16 },
  deunaButton: {
    display: 'inline-block', background: '#5b21b6', color: '#fff', padding: '12px 24px',
    borderRadius: 8, textDecoration: 'none', fontWeight: 600, marginBottom: 16,
  },
  instructions: { fontSize: 13, color: '#555', textAlign: 'left' },
  sectionTitle: { fontSize: 16, marginBottom: 12, textAlign: 'left' },
  hint: { fontSize: 13, color: '#555', textAlign: 'left', marginBottom: 8 },
  fileInput: { display: 'block', marginBottom: 12, width: '100%' },
  uploadButton: {
    background: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px',
    borderRadius: 8, fontWeight: 600, cursor: 'pointer', width: '100%',
  },
  statusText: { fontSize: 15 },
  rejectedText: { color: '#b91c1c', fontSize: 13, textAlign: 'left', marginBottom: 12 },
  errorText: { color: '#b91c1c', fontSize: 13, textAlign: 'left', marginBottom: 8 },
  link: { color: '#5b21b6', textDecoration: 'underline', cursor: 'pointer' },
};

export default PagoDeuna;
