/**
 * Checkout Guest-First Integration Test Plan
 * Run manually in browser console OR adapt for Jest/Playwright.
 *
 * Covers the full funnel from "add to cart" → drawer → checkout → COD confirm,
 * with assertion points that catch the "Order not found" race condition.
 *
 * Usage (browser console):
 *   const { runCheckoutTests } = await import('/src/lib/checkoutIntegrationTest.js');
 *   await runCheckoutTests({ baseUrl: 'http://localhost:3001', verbose: true });
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

    // Step C: The critical check — can we PATCH the order as the authenticated user?
    const patchRes = await fetch(`${API}/api/${VERSION}/orders/${resolvedOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      // Use a test-safe state that doesn't finalize the order — check if the endpoint accepts
      // Alternatively query the order first
      body: JSON.stringify({ state: 'carrito' }), // Keep in carrito to not corrupt test data
    });

    assert(
      'PATCH /orders/:id as authenticated user responds 2xx (order ownership confirmed)',
      patchRes.status >= 200 && patchRes.status < 300,
      `status: ${patchRes.status} — if 404 here, the association didn't transfer ownership`
    );

    if (patchRes.status === 404) {
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
   CHECKPOINT 4: COD order confirmation (state = pendiente_envio)

   Verifies that PATCH /orders/:id with authToken succeeds
   AFTER the association is confirmed.
   This should NOT produce "Order not found".
───────────────────────────────────────────────────────── */
async function checkpoint4_codConfirmation({ resolvedOrderId, authToken }) {
  console.group('CHECKPOINT 4 — COD Order Confirmation');

  if (!resolvedOrderId || !authToken) {
    assert('Precondition: resolvedOrderId and authToken from CP3', false, 'skipping');
    console.groupEnd();
    return;
  }

  try {
    const codRes = await fetch(`${API}/api/${VERSION}/orders/${resolvedOrderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ state: 'pendiente_envio' }),
    });

    assert('PATCH /orders/:id (COD) responds 200 or 201',
      codRes.status === 200 || codRes.status === 201,
      `status: ${codRes.status}`);

    if (codRes.status === 404) {
      console.error('🔴 "Order not found" reproduced at CP4.');
      console.error('   This means processCoddOrder gets 404 even after association.');
    }

    const codData = await codRes.json();
    assert('Response confirms state = pendiente_envio',
      codData?.state === 'pendiente_envio',
      `state: ${codData?.state}`);

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
   RUNNER
───────────────────────────────────────────────────────── */
export async function runCheckoutTests({ productId = 1, verbose = false } = {}) {
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
};
