import Head from 'next/head';
import React, { useContext, useEffect, useState } from 'react';
import AppContext from '@context/AppContext';
import Link from 'next/link';
import CheckOrderItem from '@components/CheckoutOrderItem';
import Tarjetas from '@common/paymentez/tarjetas/Tarjetas';
import CustomerProfile from '@containers/CustomerProfile';
import { useRouter } from 'next/router';
import Modal from '@common/Modal';
import Cookie from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import endPoints from '@services/api';
import PaymentezDos from '@common/PaymentezDos';
import styles from '@styles/Checkout.module.scss';
import { toast } from 'react-toastify';
import { useAuth } from '@hooks/useAuth';
import { addCustomer } from '@services/api/entities/customers';
import WalletRedeem from '@components/WalletRedeem';
import CouponInput from '@components/CouponInput';
import CheckoutTrustBadges from '@components/CheckoutTrustBadges';

const ECUADOR_PROVINCES = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi',
  'El Oro', 'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja',
  'Los Ríos', 'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza',
  'Pichincha', 'Santa Elena', 'Santo Domingo de los Tsáchilas',
  'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
];

const ECUADOR_CITIES = [
  'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Riobamba',
  'Manta', 'Portoviejo', 'Ibarra', 'Loja', 'Machala',
  'Santo Domingo', 'Latacunga', 'Esmeraldas', 'Otra ciudad',
];

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const Checkout = () => {
  const router = useRouter();
  const { state, clearCart } = useContext(AppContext);
  const auth = useAuth();

  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [email, setEmail] = useState('mail@vacio.com');
  const [open, setOpen] = useState(false);
  const [uId, setuId] = useState(0);

  // COD is the default payment method
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [creditsToApply, setCreditsToApply] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Controlled guest form state
  const [guestData, setGuestData] = useState({
    fullName: '',
    identityNumber: '',
    email: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    references: '',
  });

  // ── Auth: get email from API once logged in ──
  const getUserEmail = async (id) => {
    try {
      const { data } = await axios.get(endPoints.users.getUser(id));
      setEmail(data.email);
    } catch {
      if (auth.user?.email) setEmail(auth.user.email);
    }
  };

  useEffect(() => {
    if (!auth.user) return;
    const token = Cookie.get('token');
    if (!token) return;
    try {
      const decoded = jwt.decode(token, { complete: true });
      const userId = decoded.payload.sub;
      setuId(userId);
      getUserEmail(userId);
      if (auth.user.email) setEmail(auth.user.email);
      const guestOrderId = window.localStorage.getItem('oi');
      if (guestOrderId) associateGuestCart(token, guestOrderId);
    } catch {
      if (auth.user?.email) setEmail(auth.user.email);
    }
  }, [auth.user]);

  // ── Totals ──
  const sumTotal = () => {
    try {
      return parseFloat(
        state.cart.reduce((acc, item) => {
          if (item.price && item.OrderProduct?.amount)
            return acc + item.price * item.OrderProduct.amount;
          return acc;
        }, 0).toFixed(2)
      );
    } catch { return 0; }
  };

  const valorTotalSinIva = sumTotal();
  const subtotalAfterCoupon = Math.max(
    0,
    parseFloat((valorTotalSinIva - couponDiscount).toFixed(2))
  );
  const totalConIva = parseFloat((subtotalAfterCoupon * 1.15).toFixed(2));

  // ── Associate guest cart to a newly-logged user ──
  const associateGuestCart = async (token, guestOrderId) => {
    if (!token || !guestOrderId) return false;
    try {
      await axios.patch(
        endPoints.orders.associateOrder,
        { orderId: parseInt(guestOrderId, 10) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true;
    } catch { return false; }
  };

  // ── COD order: patch state to pendiente_envio ──
  // authToken param: pass explicitly — never rely on axios.defaults which may carry
  // a freshly-set guest-user token BEFORE the order is associated with that user.
  const processCodOrder = async (savedOrderId, authToken) => {
    if (!savedOrderId) {
      throw new Error('No se encontró el ID de la orden. Por favor recarga la página y vuelve a intentarlo.');
    }
    toast.info('Procesando tu pedido, por favor espera...');
    const token = authToken ?? Cookie.get('token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await axios.patch(
      endPoints.orders.updateOrder(savedOrderId),
      { state: 'pendiente_envio' },
      { headers }
    );
    if (response.status === 200 || response.status === 201) {
      window.localStorage.removeItem('oi');
      await clearCart();
      toast.success('¡Pedido confirmado! Te contactaremos para coordinar la entrega. 🚀');
      router.push('/mi_cuenta/orders');
    }
  };

  // ── GUEST flow: auto-register → associate cart → COD or card ──
  const handleGuestFlow = async () => {
    // Guard: the guest order must already exist in localStorage (created by ProductItem when adding to cart).
    // If it doesn't exist there's nothing to process and processCodOrder would get "Order not found".
    const guestOrderId = window.localStorage.getItem('oi');
    if (!guestOrderId) {
      toast.error('No se encontró tu carrito. Por favor agrega productos nuevamente y vuelve al checkout.');
      return;
    }

    const [firstName, ...rest] = guestData.fullName.trim().split(' ');
    const lastName = rest.join(' ') || firstName;

    try {
      toast.info('Creando tu cuenta y procesando el pedido...');

      const response = await addCustomer({
        name: firstName,
        lastName,
        identityNumber: guestData.identityNumber,
        phone: guestData.phone,
        countryOfResidence: 'Ecuador',
        province: guestData.province,
        city: guestData.city,
        streetAddress: guestData.address,
        geolocation: guestData.references,
        user: {
          email: guestData.email,
          password: generateTempPassword(),
        },
      });

      // manualSignIn is synchronous: sets Cookie AND axios.defaults.headers.Authorization immediately.
      // We capture authToken BEFORE calling it so we have it for explicit use.
      // CRITICAL: never call processCodOrder relying on axios defaults when the order
      // may not be owned by the user yet — pass the token explicitly instead.
      const authToken = response?.auth?.token;
      if (!authToken) throw new Error('No se recibió token de autenticación del servidor.');

      auth.manualSignIn(response.auth);
      window.dispatchEvent(new Event('tokenSet'));

      // Associate the guest order with the new user.
      // Some backends migrate the order to a new ID — capture the response to detect that.
      let resolvedOrderId = guestOrderId;
      try {
        const { data: assocData } = await axios.patch(
          endPoints.orders.associateOrder,
          { orderId: parseInt(guestOrderId, 10) },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        // Update localStorage if the backend returned a different orderId post-migration
        const returnedId = assocData?.id ?? assocData?.orderId ?? assocData?.newOrderId;
        if (returnedId && String(returnedId) !== guestOrderId) {
          resolvedOrderId = String(returnedId);
          window.localStorage.setItem('oi', resolvedOrderId);
        }
      } catch (assocErr) {
        // Do NOT swallow this silently. If association failed the order still belongs
        // to the guest and processCodOrder (now authenticated) would get "Order not found".
        console.error('[Checkout] associateGuestCart failed:', assocErr);
        throw new Error(
          assocErr.response?.data?.message ||
          'Error al vincular tu carrito con la cuenta. Por favor intenta de nuevo.'
        );
      }

      // Order is now owned by the authenticated user — pass authToken explicitly
      if (paymentMethod === 'cash') {
        await processCodOrder(resolvedOrderId, authToken);
        toast.info(
          '¡Creamos tu cuenta Aynimar! Revisa tu correo para activar tu contraseña y acumular puntos por reciclar. 🌿',
          { autoClose: 8000 }
        );
      } else {
        try {
          const decoded = jwt.decode(authToken, { complete: true });
          if (decoded?.payload?.sub) setuId(decoded.payload.sub);
        } catch { /* noop */ }
        if (guestData.email) setEmail(guestData.email);
        setOpen(true);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('El correo ya está registrado. Por favor inicia sesión para continuar.');
        router.push('/login');
      } else {
        toast.error(err.response?.data?.message || err.message || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    }
  };

  // ── AUTHENTICATED flow: credits → COD or card ──
  const handleAuthFlow = async () => {
    const savedOrderId = window.localStorage.getItem('oi');

    // Apply Ayni-Créditos if requested
    if (creditsToApply > 0 && savedOrderId) {
      try {
        toast.info('Aplicando Ayni-Créditos...');
        const token = Cookie.get('token');
        const { data } = await axios.post(
          endPoints.orders.checkout,
          { orderId: parseInt(savedOrderId, 10), creditsToApply },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (data.amountToPay === 0) {
          window.localStorage.removeItem('oi');
          await clearCart();
          toast.success(`¡Pedido pagado con ${data.creditsApplied} Ayni-Créditos! 🌿`);
          router.push('/mi_cuenta/orders');
          return;
        }
        toast.success(`${data.creditsApplied} crédito(s) aplicados. Resta $${data.amountToPay.toFixed(2)}.`);
      } catch (err) {
        toast.error(err.response?.data?.message || 'No se pudieron aplicar los créditos.');
        return;
      }
    }

    if (paymentMethod === 'cash') {
      await processCodOrder(savedOrderId, Cookie.get('token'));
    } else {
      setOpen(true);
    }
  };

  // ── Unified submit handler ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast.error('Debes aceptar los términos y condiciones.');
      return;
    }
    if (state.cart.length === 0) {
      toast.error('No hay productos en el carrito.');
      return;
    }

    if (!auth.user) {
      const { fullName, identityNumber, email: gEmail, phone, province, city, address, references } = guestData;
      if (
        !fullName.trim() ||
        !identityNumber.trim() ||
        !gEmail.trim() ||
        !phone.trim() ||
        !province ||
        !city ||
        !address.trim() ||
        !references.trim()
      ) {
        toast.error('Por favor completa todos los campos de envío y facturación.');
        return;
      }
    } else {
      if (!isProfileComplete) {
        toast.error('Completa y guarda tus datos de envío antes de continuar.');
        return;
      }
      if (!email || email === 'mail@vacio.com') {
        toast.error('Error al obtener tus datos. Por favor recarga la página.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (!auth.user) {
        await handleGuestFlow();
      } else {
        await handleAuthFlow();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Finaliza tu compra | Aynimar</title>
      </Head>

      <div className={styles.page}>
        {/* Progress indicator */}
        <div className={styles.progressBar} aria-label="Progreso de compra">
          <div className={styles.progressStep}>
            <span className={`${styles.dot} ${styles.dotDone}`}>✓</span>
            <span className={styles.stepLabel}>Carrito</span>
          </div>
          <div className={styles.progressLine} />
          <div className={styles.progressStep}>
            <span className={`${styles.dot} ${styles.dotActive}`}>2</span>
            <span className={`${styles.stepLabel} ${styles.stepLabelActive}`}>Datos y Pago</span>
          </div>
          <div className={styles.progressLine} />
          <div className={styles.progressStep}>
            <span className={styles.dot}>3</span>
            <span className={styles.stepLabel}>Confirmación</span>
          </div>
        </div>

        <div className={styles.grid}>

          {/* ════════ LEFT COLUMN ════════ */}
          <section className={styles.leftCol}>

            {/* Shipping data */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.sectionIcon} aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Datos de Envío
              </h2>

              {!auth.user ? (
                /* ── Guest: formulario completo de envío y facturación ── */
                <div>
                  <div className={styles.formGrid}>

                    {/* 1. Nombres y Apellidos Completos */}
                    <div className={styles.fieldFull}>
                      <label className={styles.label} htmlFor="g-fullname">
                        Nombres y Apellidos Completos <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-fullname"
                        type="text"
                        className={styles.input}
                        placeholder="Ej: María García López"
                        value={guestData.fullName}
                        onChange={e => setGuestData(d => ({ ...d, fullName: e.target.value }))}
                        autoComplete="name"
                      />
                    </div>

                    {/* 2. Cédula / RUC */}
                    <div className={styles.fieldHalf}>
                      <label className={styles.label} htmlFor="g-identity">
                        Cédula de Identidad o RUC <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-identity"
                        type="text"
                        className={styles.input}
                        placeholder="0000000000"
                        value={guestData.identityNumber}
                        onChange={e => setGuestData(d => ({ ...d, identityNumber: e.target.value }))}
                        autoComplete="off"
                        maxLength={13}
                      />
                    </div>

                    {/* 3. Celular / WhatsApp */}
                    <div className={styles.fieldHalf}>
                      <label className={styles.label} htmlFor="g-phone">
                        Celular / WhatsApp <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-phone"
                        type="tel"
                        className={styles.input}
                        placeholder="0991234567"
                        value={guestData.phone}
                        onChange={e => setGuestData(d => ({ ...d, phone: e.target.value }))}
                        autoComplete="tel"
                      />
                    </div>

                    {/* 4. Correo Electrónico */}
                    <div className={styles.fieldFull}>
                      <label className={styles.label} htmlFor="g-email">
                        Correo Electrónico <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-email"
                        type="email"
                        className={styles.input}
                        placeholder="tu@correo.com"
                        value={guestData.email}
                        onChange={e => setGuestData(d => ({ ...d, email: e.target.value }))}
                        autoComplete="email"
                      />
                    </div>

                    {/* 5. Provincia */}
                    <div className={styles.fieldHalf}>
                      <label className={styles.label} htmlFor="g-province">
                        Provincia <span className={styles.req}>*</span>
                      </label>
                      <select
                        id="g-province"
                        className={styles.input}
                        value={guestData.province}
                        onChange={e => setGuestData(d => ({ ...d, province: e.target.value }))}
                      >
                        <option value="">Selecciona tu provincia</option>
                        {ECUADOR_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>

                    {/* 6. Ciudad / Cantón */}
                    <div className={styles.fieldHalf}>
                      <label className={styles.label} htmlFor="g-city">
                        Ciudad / Cantón <span className={styles.req}>*</span>
                      </label>
                      <select
                        id="g-city"
                        className={styles.input}
                        value={guestData.city}
                        onChange={e => setGuestData(d => ({ ...d, city: e.target.value }))}
                      >
                        <option value="">Selecciona tu ciudad</option>
                        {ECUADOR_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* 7. Dirección Exacta */}
                    <div className={styles.fieldFull}>
                      <label className={styles.label} htmlFor="g-address">
                        Dirección Exacta <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-address"
                        type="text"
                        className={styles.input}
                        placeholder="Calle principal, calle secundaria y número de casa/dpto."
                        value={guestData.address}
                        onChange={e => setGuestData(d => ({ ...d, address: e.target.value }))}
                        autoComplete="street-address"
                      />
                    </div>

                    {/* 8. Referencias de la ubicación */}
                    <div className={styles.fieldFull}>
                      <label className={styles.label} htmlFor="g-references">
                        Referencias de la Ubicación <span className={styles.req}>*</span>
                      </label>
                      <input
                        id="g-references"
                        type="text"
                        className={styles.input}
                        placeholder="Color de casa, frente a qué local, señas adicionales..."
                        value={guestData.references}
                        onChange={e => setGuestData(d => ({ ...d, references: e.target.value }))}
                        autoComplete="off"
                      />
                    </div>

                  </div>

                  <p className={styles.guestHint}>
                    <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" style={{ flexShrink: 0 }} aria-hidden="true">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                    </svg>
                    Al confirmar crearemos tu cuenta Aynimar automáticamente. Recibirás tu contraseña de activación por correo para que puedas acumular Ayni-Créditos con cada reciclaje.
                  </p>
                </div>
              ) : (
                /* ── Authenticated: profile component ── */
                <CustomerProfile onProfileStatusChange={setIsProfileComplete} />
              )}
            </div>

            {/* Coupon */}
            <div className={styles.sectionCard}>
              <CouponInput
                cartTotal={valorTotalSinIva}
                onApply={({ discount }) => setCouponDiscount(discount)}
                onClear={() => setCouponDiscount(0)}
              />
            </div>

            {/* Wallet (auth only) */}
            {auth.user && (
              <div className={styles.sectionCard}>
                <WalletRedeem
                  subtotal={subtotalAfterCoupon}
                  isAuthenticated={Boolean(auth.user)}
                  onCreditsChange={setCreditsToApply}
                />
              </div>
            )}
          </section>

          {/* ════════ RIGHT COLUMN ════════ */}
          <aside className={styles.rightCol}>

            {/* Order summary */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.sectionIcon} aria-hidden="true">
                  <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM5.14 6H3V4H1v2h2l3.6 7.59L5.25 16c-.16.28-.25.61-.25.94C5 18.1 5.9 19 7 19h14v-2H7.42a.25.25 0 01-.25-.25l.03-.12.97-1.63H19c.75 0 1.41-.41 1.75-1.03L23 9.54l-1.73-1-2.25 3.86L5.14 6z"/>
                </svg>
                Resumen del Pedido
              </h2>

              <div className={styles.summaryTable}>
                {state.cart.length > 0 ? (
                  <table className={styles.itemsTable}>
                    <tbody>
                      {state.cart.map(product => (
                        <CheckOrderItem product={product} key={`orderItem-${product.id}`} />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className={styles.emptyCart}>No hay productos en el carrito.</p>
                )}
              </div>

              <div className={styles.totalRows}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${valorTotalSinIva.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className={styles.totalRow}>
                    <span>Descuento cupón</span>
                    <span className={styles.discountValue}>−${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className={styles.totalRow}>
                  <span>Envío</span>
                  <span className={styles.freeShipping}>A coordinar</span>
                </div>
                <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                  <span>Total con IVA (15%)</span>
                  <span>${totalConIva.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment method selector */}
            <div className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.sectionIcon} aria-hidden="true">
                  <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                </svg>
                Método de Pago
              </h2>

              <div className={styles.paymentCards} role="radiogroup" aria-label="Selecciona método de pago">

                {/* COD — default */}
                <label className={`${styles.paymentCard} ${paymentMethod === 'cash' ? styles.paymentCardActive : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                    className={styles.srOnly}
                  />
                  <div className={styles.paymentCardInner}>
                    <div className={styles.paymentCardLeft}>
                      <span className={styles.paymentEmoji} aria-hidden="true">💵</span>
                      <div>
                        <p className={styles.paymentCardTitle}>Pago Contra Entrega</p>
                        <p className={styles.paymentCardDesc}>Efectivo o transferencia al recibir tu pedido.</p>
                      </div>
                    </div>
                    <div className={`${styles.radioIndicator} ${paymentMethod === 'cash' ? styles.radioIndicatorActive : ''}`} aria-hidden="true" />
                  </div>
                  {paymentMethod === 'cash' && (
                    <p className={styles.codHint}>
                      ✅ Sin riesgo. El repartidor llega a tu dirección y tú pagas al momento de recibirlo.
                    </p>
                  )}
                </label>

                {/* Card */}
                <label className={`${styles.paymentCard} ${paymentMethod === 'card' ? styles.paymentCardActive : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className={styles.srOnly}
                  />
                  <div className={styles.paymentCardInner}>
                    <div className={styles.paymentCardLeft}>
                      <span className={styles.paymentEmoji} aria-hidden="true">💳</span>
                      <div>
                        <p className={styles.paymentCardTitle}>Tarjeta de Crédito / Débito</p>
                        <p className={styles.paymentCardDesc}>Visa · Mastercard — pasarela encriptada.</p>
                      </div>
                    </div>
                    <div className={`${styles.radioIndicator} ${paymentMethod === 'card' ? styles.radioIndicatorActive : ''}`} aria-hidden="true" />
                  </div>
                </label>
              </div>
            </div>

            {/* Trust badges */}
            <CheckoutTrustBadges />

            {/* Terms + CTA — this is the main form submission */}
            <form onSubmit={handleSubmit} className={styles.ctaSection}>
              <label className={styles.termsRow}>
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={e => setTermsAccepted(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.termsText}>
                  Acepto los{' '}
                  <Link href="/terminosYCondiciones">
                    <span className={styles.termsLink}>Términos y Condiciones</span>
                  </Link>{' '}
                  y las{' '}
                  <Link href="/terminosYCondiciones">
                    <span className={styles.termsLink}>Políticas de Privacidad</span>
                  </Link>{' '}
                  de Aynimar.
                </span>
              </label>

              {auth.user && !isProfileComplete ? (
                <div className={styles.profileWarning}>
                  <p>⚠️ Completa y guarda tus datos de envío para habilitar el pago.</p>
                </div>
              ) : (
                <button
                  type="submit"
                  className={styles.ctaButton}
                  disabled={isSubmitting || !termsAccepted || state.cart.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      Procesando pago seguro...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                      </svg>
                      Confirmar Compra
                    </>
                  )}
                </button>
              )}
            </form>
          </aside>
        </div>
      </div>

      {/* Card payment modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={styles.modalContentWrapper}>
          <h1 className={styles.modaltitle}>Pago con Tarjeta</h1>
          <Tarjetas userEmail={email} uId={uId} />
          <PaymentezDos key={`${email}-${uId}`} userEmail={email} uId={uId} />
        </div>
      </Modal>
    </>
  );
};

export default Checkout;
