/**
 * Checkout Guest-First Integration Test Plan (Fase B)
 *
 * Cubre el funnel completo add-to-cart → registro → asociación → confirm-cod,
 * + idempotencia (CP6), autorización (CP7) y stock insuficiente (CP8).
 *
 * ⚠️  `await import('/src/lib/...')` SÓLO funciona con `next dev` (que sirve los
 * fuentes). En un build de producción (staging) NO existe esa ruta.
 *
 * CÓMO EJECUTAR CONTRA STAGING (recomendado):
 *   1. En local, en frontAynimar/.env.local:
 *        NEXT_PUBLIC_API_URL=https://<backend-staging>.up.railway.app
 *        NEXT_PUBLIC_API_VERSION=v1
 *   2. `npm run dev` → abrir http://localhost:3000/checkout
 *   3. En la consola del navegador:
 *        const t = await import('/src/lib/checkoutIntegrationTest.js');
 *        await t.runCheckoutTests({ productId: <ID_PRODUCTO_DROPI_STOCK_ALTO> });
 *        await t.checkpoint8_codInsufficientStock(<ID_PRODUCTO_STOCK_1>);
 *   El backend de staging (y su BD) es lo que se está probando.
 *
 * REQUISITO: el backend de staging debe tener DROPI_MOCK=true.
 */

const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

/* ─────────────────────────────────────────────────────────
   Checkpoint helpers
───────────────────────────────────────────────────────── */

const results = [];

function assert(label, condition, detail = '') {
  const status = condition ? 'PASS' : 'FAIL';
  results.push({ status, label, detail });
  const icon = condition ? '✅' : '❌';
  console.log(`${icon} [${status}] ${label}${detail ? ` — ${detail}` : ''}`);
  return condition;
}

function assertDefined(label, value) {
  return assert(label, value !== null && value !== undefined && value !== '', `got: ${JSON.stringify(value)}`);
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 1: Guest order creation on "Add to Cart"

   Simulates what ProductItem.submitHandler does.
   Verifies that 'oi' is stored in localStorage BEFORE checkout.
───────────────────────────────────────────────────────── */
async function checkpoint1_guestOrderCreation(productId = 1) {
  console.group('CHECKPOINT 1 — Guest Order Creation');

  // Clear any existing session
  window.localStorage.removeItem('oi');

  try {
    // Step A: Create guest order
    const orderRes = await fetch(`${API}/api/${VERSION}/orders/guest-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    assert('POST /orders/guest-order responds 201', orderRes.status === 201,
      `status: ${orderRes.status}`);

    const orderData = await orderRes.json();
    assertDefined('Response contains order.id', orderData?.id);

    const orderId = orderData.id;
    window.localStorage.setItem('oi', String(orderId));
    assert('localStorage["oi"] is set correctly', window.localStorage.getItem('oi') === String(orderId));

    // Step B: Add product to guest order
    const itemRes = await fetch(`${API}/api/${VERSION}/orders/add-item-guest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, productId, amount: 1 }),
    });
    assert('POST /orders/add-item-guest responds 201', itemRes.status === 201,
      `status: ${itemRes.status}`);

    const itemData = await itemRes.json();
    assertDefined('Response contains item.id (OrderProduct.id)', itemData?.id);
    assertDefined('Response contains item.orderId', itemData?.orderId);
    assert('item.orderId matches created order', String(itemData.orderId) === String(orderId));

    console.log('✅ CHECKPOINT 1 PASSED — order created, item added, oi in localStorage');
    console.groupEnd();
    return { orderId, itemId: itemData.id };
  } catch (err) {
    console.error('CHECKPOINT 1 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
    return null;
  }
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 2: Cart Drawer opens with COD strip visible

   Manual-only check — verifies UI state after CP1.
   Document assertion for E2E (Playwright).
───────────────────────────────────────────────────────── */
function checkpoint2_drawerCodStrip() {
  console.group('CHECKPOINT 2 — Cart Drawer COD Strip');

  const drawerEl = document.querySelector('[aria-label="Carrito de compras"]');
  assert('Cart drawer is rendered in DOM', !!drawerEl);

  if (drawerEl) {
    const codText = drawerEl.innerText;
    assert('COD strip text visible', codText.includes('Contra Entrega'),
      `drawer text includes "Contra Entrega"`);
  }

  const ctaBtn = document.querySelector('[aria-label="Finalizar compra segura"], a[href="/checkout"]');
  assert('Drawer CTA button/link exists', !!ctaBtn);

  console.groupEnd();
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 3: Guest registration + association handshake

   This is the CRITICAL checkpoint that catches "Order not found".
   Verifies the sequence:
     addCustomer → get token → associateOrder → resolve orderId
───────────────────────────────────────────────────────── */
async function checkpoint3_guestRegistrationAndAssociation({ orderId, testEmail }) {
  console.group('CHECKPOINT 3 — Registration + Association Handshake');

  if (!orderId) {
    assert('Precondition: orderId from CP1 is available', false, 'skipping — run CP1 first');
    console.groupEnd();
    return null;
  }

  const email = testEmail || `test_guest_${Date.now()}@aynimar-test.com`;

  try {
    // Step A: Register the guest account
    const regRes = await fetch(`${API}/api/${VERSION}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test',
        lastName: 'Invitado',
        identityNumber: '0000000000',
        phone: '0991234567',
        countryOfResidence: 'Ecuador',
        province: 'Quito',
        city: 'Quito',
        streetAddress: 'Calle Falsa 123',
        user: { email, password: 'TestPass123!' },
      }),
    });

    assert('POST /customers responds 201', regRes.status === 201,
      `status: ${regRes.status}`);

    const regData = await regRes.json();
    assertDefined('Response.auth exists', regData?.auth);
    assertDefined('Response.auth.token exists', regData?.auth?.token);
    assertDefined('Response.auth.user exists', regData?.auth?.user);

    const authToken = regData?.auth?.token;
    if (!authToken) {
      assert('Auth token extracted', false, 'Cannot continue without token');
      console.groupEnd();
      return null;
    }

    // Step B: Associate the guest order with the new user
    const assocRes = await fetch(`${API}/api/${VERSION}/orders/associate-order`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ orderId: parseInt(orderId, 10) }),
    });

    assert('PATCH /orders/associate-order responds 2xx',
      assocRes.status >= 200 && assocRes.status < 300,
      `status: ${assocRes.status}`);

    const assocData = await assocRes.json();

    // Detect if the backend returned a DIFFERENT orderId post-migration
    const returnedId = assocData?.id ?? assocData?.orderId ?? assocData?.newOrderId;
    const resolvedOrderId = (returnedId && String(returnedId) !== String(orderId))
      ? String(returnedId)
      : String(orderId);

    if (String(returnedId) !== String(orderId)) {
      console.warn(`⚠️  Backend migrated order: ${orderId} → ${returnedId}. localStorage updated.`);
      window.localStorage.setItem('oi', resolvedOrderId);
    }

    assert('Resolved orderId is valid (not null)', !!resolvedOrderId);

    // Step C: The critical check — can we READ the order as the authenticated user?
    // (Fase A: los clientes ya no pueden PATCH /orders/:id — la lectura sirve
    // igual para detectar "Order not found" tras la asociación, sin efectos.)
    const readRes = await fetch(`${API}/api/${VERSION}/orders/${resolvedOrderId}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });

    assert(
      'GET /orders/:id as authenticated user responds 2xx (order ownership confirmed)',
      readRes.status >= 200 && readRes.status < 300,
      `status: ${readRes.status} — if 404 here, the association didn't transfer ownership`
    );

    if (readRes.status === 404) {
      console.error('🔴 ROOT CAUSE CONFIRMED: Order not found after association.');
      console.error('   The associateOrder endpoint did not transfer ownership correctly.');
      console.error('   Check backend: does PATCH /orders/associate-order actually reassign the order?');
    }

    console.log(`ℹ️  Resolved orderId for COD processing: ${resolvedOrderId}`);
    console.groupEnd();
    return { authToken, resolvedOrderId };

  } catch (err) {
    console.error('CHECKPOINT 3 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
    return null;
  }
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 4: COD order confirmation

   Fase A: POST /orders/:id/confirm-cod (reemplaza el viejo
   PATCH /orders/:id {state:'pendiente_envio'}). El backend valida
   propiedad + carrito + stock, persiste totales y despacha.
   ⚠️  Despacha a Dropi de verdad — correr sólo con DROPI_MOCK=true
   o contra datos de prueba.
   No debe producir "Order not found".
───────────────────────────────────────────────────────── */
async function checkpoint4_codConfirmation({ resolvedOrderId, authToken }) {
  console.group('CHECKPOINT 4 — COD Order Confirmation (confirm-cod)');

  if (!resolvedOrderId || !authToken) {
    assert('Precondition: resolvedOrderId and authToken from CP3', false, 'skipping');
    console.groupEnd();
    return;
  }

  try {
    const codRes = await fetch(`${API}/api/${VERSION}/orders/${resolvedOrderId}/confirm-cod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({}),
    });

    assert('POST /orders/:id/confirm-cod responds 200',
      codRes.status === 200,
      `status: ${codRes.status}`);

    if (codRes.status === 404) {
      console.error('🔴 "Order not found" reproduced at CP4.');
      console.error('   This means processCodOrder gets 404 even after association.');
    }

    const codData = await codRes.json();
    assert('Response confirms state = pendiente_envio',
      codData?.state === 'pendiente_envio',
      `state: ${codData?.state}`);
    assert('Response marks payment_method = cod',
      codData?.paymentMethod === 'cod',
      `paymentMethod: ${codData?.paymentMethod}`);
    assert('Response marks payment_status = pending (COD cobra al entregar)',
      codData?.paymentStatus === 'pending',
      `paymentStatus: ${codData?.paymentStatus}`);
    assertDefined('Response contains persisted total', codData?.total);

    // Idempotencia: un segundo confirm-cod debe fallar (409), no re-despachar.
    const dupRes = await fetch(`${API}/api/${VERSION}/orders/${resolvedOrderId}/confirm-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({}),
    });
    assert('Segundo confirm-cod es rechazado (no re-despacha)',
      dupRes.status === 409,
      `status: ${dupRes.status} — esperado 409 conflict`);

    // Cleanup: remove from localStorage (mirrors what processCodOrder does)
    window.localStorage.removeItem('oi');
    assert('localStorage["oi"] cleaned up after COD', !window.localStorage.getItem('oi'));

    console.groupEnd();
  } catch (err) {
    console.error('CHECKPOINT 4 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
  }
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 5: Terms checkbox gates the CTA button

   Manual DOM check — verifies legal compliance requirement.
───────────────────────────────────────────────────────── */
function checkpoint5_termsGate() {
  console.group('CHECKPOINT 5 — Terms & Conditions Gate');

  const checkbox = document.querySelector('input[type="checkbox"]');
  const ctaButton = document.querySelector('button[type="submit"]');

  assert('Terms checkbox exists on page', !!checkbox);
  assert('CTA submit button exists on page', !!ctaButton);

  if (checkbox && ctaButton) {
    const wasChecked = checkbox.checked;

    // Ensure unchecked
    if (checkbox.checked) checkbox.click();
    assert('Button is disabled when terms unchecked',
      ctaButton.disabled,
      `disabled: ${ctaButton.disabled}`);

    // Check it
    checkbox.click();
    assert('Button is enabled when terms checked',
      !ctaButton.disabled,
      `disabled: ${ctaButton.disabled}`);

    // Restore original state
    if (!wasChecked) checkbox.click();
  }

  console.groupEnd();
}

/* ─────────────────────────────────────────────────────────
   Helper: crea una orden confirmable (guest → registro → asociación)
───────────────────────────────────────────────────────── */
async function _setupConfirmableOrder(productId = 1) {
  window.localStorage.removeItem('oi');
  const orderRes = await fetch(`${API}/api/${VERSION}/orders/guest-order`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
  });
  const { id: orderId } = await orderRes.json();
  await fetch(`${API}/api/${VERSION}/orders/add-item-guest`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, productId, amount: 1 }),
  });
  const email = `test_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@aynimar-test.com`;
  const regRes = await fetch(`${API}/api/${VERSION}/customers`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test', lastName: 'Concurrencia', identityNumber: '0000000000',
      phone: '0991234567', countryOfResidence: 'Ecuador', province: 'Pichincha',
      city: 'Quito', streetAddress: 'Calle Falsa 123',
      user: { email, password: 'TestPass123!' },
    }),
  });
  const { auth } = await regRes.json();
  const authToken = auth?.token;
  if (!authToken) {
    throw new Error(`_setupConfirmableOrder: registro falló (${regRes.status}) — no hay token`);
  }
  await fetch(`${API}/api/${VERSION}/orders/associate-order`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
    body: JSON.stringify({ orderId: parseInt(orderId, 10) }),
  });
  return { orderId, authToken, email };
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 6: confirm-cod concurrente — sin doble despacho (B3)

   ⚠️  Despacha a Dropi de verdad — correr con DROPI_MOCK=true.
───────────────────────────────────────────────────────── */
async function checkpoint6_codConcurrency(productId = 1) {
  console.group('CHECKPOINT 6 — confirm-cod concurrente (idempotencia B3)');
  try {
    const { orderId, authToken } = await _setupConfirmableOrder(productId);
    const url = `${API}/api/${VERSION}/orders/${orderId}/confirm-cod`;
    const opts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({}),
    };

    // Dos peticiones EXACTAMENTE en paralelo.
    const [a, b] = await Promise.all([fetch(url, opts), fetch(url, opts)]);
    const statuses = [a.status, b.status].sort();

    assert('Exactamente 1 respuesta 200', statuses.filter((s) => s === 200).length === 1,
      `statuses: ${JSON.stringify(statuses)}`);
    assert('La otra respuesta es 409 (conflicto, no 2º despacho)',
      statuses.filter((s) => s === 409).length === 1,
      `statuses: ${JSON.stringify(statuses)}`);

    // Verifica el estado final de la orden: 1 sola confirmación.
    const check = await fetch(`${API}/api/${VERSION}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const ord = await check.json();
    assert('Orden en pendiente_envio', ord?.state === 'pendiente_envio', `state: ${ord?.state}`);
    assert('payment_status = pending', ord?.paymentStatus === 'pending', `paymentStatus: ${ord?.paymentStatus}`);
    // Un SEGUNDO despacho habría vuelto a incrementar fulfillmentRetryCount
    // (claim atómico) → si es exactamente 1, sólo se despachó una vez.
    assert('fulfillmentRetryCount === 1 (un solo despacho)',
      ord?.fulfillmentRetryCount === 1,
      `fulfillmentRetryCount: ${ord?.fulfillmentRetryCount}`);

    if (ord?.fulfillmentStatus === 'MANUAL_LOGISTICS') {
      console.warn('⚠️  El producto NO es Dropi (sin dropi_product_id) → no hay MOCK-DRP. ' +
        'Para verificar la no-duplicación del despacho, re-ejecuta CP6 con un productId que tenga dropi_product_id.');
    } else {
      assert('dropiOrderId es un único MOCK-DRP-* (DROPI_MOCK=true)',
        typeof ord?.dropiOrderId === 'string' && ord.dropiOrderId.startsWith('MOCK-DRP-'),
        `dropiOrderId: ${ord?.dropiOrderId}`);
      assert('fulfillmentStatus = DISPATCHED', ord?.fulfillmentStatus === 'DISPATCHED',
        `fulfillmentStatus: ${ord?.fulfillmentStatus}`);
      console.log(`ℹ️  dropiOrderId: ${ord?.dropiOrderId} — además verifica en los logs del backend UNA sola línea "[Dispatch] Dropi order created for Aynimar #${orderId}"`);
    }

    window.localStorage.removeItem('oi');
    console.groupEnd();
  } catch (err) {
    console.error('CHECKPOINT 6 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
  }
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 7: confirm-cod sobre orden ajena → 403 (Fase A/A2)
───────────────────────────────────────────────────────── */
async function checkpoint7_codOwnership(productId = 1) {
  console.group('CHECKPOINT 7 — confirm-cod sobre orden ajena');
  try {
    const victim = await _setupConfirmableOrder(productId);

    // Segundo usuario, sin relación con la orden.
    const attackerEmail = `attacker_${Date.now()}@aynimar-test.com`;
    const regRes = await fetch(`${API}/api/${VERSION}/customers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mal', lastName: 'Actor', identityNumber: '0000000000',
        phone: '0990000000', countryOfResidence: 'Ecuador', province: 'Guayas',
        city: 'Guayaquil', streetAddress: 'X', user: { email: attackerEmail, password: 'TestPass123!' },
      }),
    });
    const { auth } = await regRes.json();

    const res = await fetch(`${API}/api/${VERSION}/orders/${victim.orderId}/confirm-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
      body: JSON.stringify({}),
    });
    assert('confirm-cod de orden ajena → 403', res.status === 403, `status: ${res.status}`);

    // La orden de la víctima sigue confirmable por su dueño.
    const ok = await fetch(`${API}/api/${VERSION}/orders/${victim.orderId}/confirm-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${victim.authToken}` },
      body: JSON.stringify({}),
    });
    assert('el dueño sí puede confirmar su orden → 200', ok.status === 200, `status: ${ok.status}`);

    window.localStorage.removeItem('oi');
    console.groupEnd();
  } catch (err) {
    console.error('CHECKPOINT 7 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
  }
}

/* ─────────────────────────────────────────────────────────
   CHECKPOINT 8 (manual): stock insuficiente → 409

   Requiere un producto con stock conocido y bajo. Pasos:
   1. En el dashboard, fija stock = 1 en un producto de prueba (anota su id).
   2. checkpoint8_codInsufficientStock(idProducto)  → agrega 5 unidades.
   3. Debe responder 409 y NO cambiar el estado de la orden ni despachar.
───────────────────────────────────────────────────────── */
async function checkpoint8_codInsufficientStock(productId, amount = 5) {
  console.group('CHECKPOINT 8 — stock insuficiente');
  try {
    window.localStorage.removeItem('oi');
    const orderRes = await fetch(`${API}/api/${VERSION}/orders/guest-order`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
    });
    const { id: orderId } = await orderRes.json();
    await fetch(`${API}/api/${VERSION}/orders/add-item-guest`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, productId, amount }),
    });
    const email = `stock_${Date.now()}@aynimar-test.com`;
    const regRes = await fetch(`${API}/api/${VERSION}/customers`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Stock', lastName: 'Test', identityNumber: '0000000000', phone: '0991234567',
        countryOfResidence: 'Ecuador', province: 'Pichincha', city: 'Quito',
        streetAddress: 'X', user: { email, password: 'TestPass123!' },
      }),
    });
    const { auth } = await regRes.json();
    await fetch(`${API}/api/${VERSION}/orders/associate-order`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
      body: JSON.stringify({ orderId: parseInt(orderId, 10) }),
    });

    const res = await fetch(`${API}/api/${VERSION}/orders/${orderId}/confirm-cod`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth?.token}` },
      body: JSON.stringify({}),
    });
    assert('confirm-cod con stock insuficiente → 409', res.status === 409, `status: ${res.status}`);

    const check = await fetch(`${API}/api/${VERSION}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${auth?.token}` },
    });
    const ord = await check.json();
    assert('la orden sigue en carrito (rollback total)', ord?.state === 'carrito', `state: ${ord?.state}`);

    window.localStorage.removeItem('oi');
    console.groupEnd();
  } catch (err) {
    console.error('CHECKPOINT 8 ERROR:', err);
    assert('No exception thrown', false, err.message);
    console.groupEnd();
  }
}

/* ─────────────────────────────────────────────────────────
   RUNNER
───────────────────────────────────────────────────────── */
export async function runCheckoutTests({ productId = 1 } = {}) {
  console.clear();
  console.log('🧪 Aynimar Checkout Integration Tests');
  console.log('======================================');
  results.length = 0;

  // CP1: Guest order + product add
  const cp1 = await checkpoint1_guestOrderCreation(productId);

  // CP2: Drawer UI (manual — only meaningful if drawer is open)
  console.log('\n[CP2 is a manual check — open the cart drawer first, then call checkpoint2_drawerCodStrip()]');

  // CP3: Registration + association handshake (CRITICAL)
  const cp3 = cp1
    ? await checkpoint3_guestRegistrationAndAssociation({ orderId: cp1.orderId })
    : null;

  // CP4: COD confirmation
  if (cp3) {
    await checkpoint4_codConfirmation(cp3);
  }

  // CP5: Terms gate (run on /checkout page)
  if (typeof document !== 'undefined' && window.location.pathname.includes('checkout')) {
    checkpoint5_termsGate();
  }

  // CP6 + CP7: idempotencia y autorización de confirm-cod (Fase B / B3)
  await checkpoint6_codConcurrency(productId);
  await checkpoint7_codOwnership(productId);
  console.log('\n[CP8 (stock insuficiente) es manual — checkpoint8_codInsufficientStock(idProductoConStockBajo)]');

  // Summary
  console.log('\n══════════════════════════════════════');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Results: ${passed} passed / ${failed} failed out of ${results.length} assertions`);

  if (failed > 0) {
    console.log('\n🔴 Failed assertions:');
    results.filter(r => r.status === 'FAIL').forEach(r =>
      console.log(`  • ${r.label}${r.detail ? ` [${r.detail}]` : ''}`)
    );
  } else {
    console.log('🟢 All assertions passed — guest COD flow is healthy.');
  }

  return { passed, failed, results };
}

// Individual checkpoints exported for targeted debugging
export {
  checkpoint1_guestOrderCreation,
  checkpoint2_drawerCodStrip,
  checkpoint3_guestRegistrationAndAssociation,
  checkpoint4_codConfirmation,
  checkpoint5_termsGate,
  checkpoint6_codConcurrency,
  checkpoint7_codOwnership,
  checkpoint8_codInsufficientStock,
};
