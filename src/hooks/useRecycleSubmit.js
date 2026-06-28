import { useCallback, useContext, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import AppContext from '@context/AppContext';
import endPoints from '@services/api';
import reporter from '../lib/reporter';

/**
 * Classifies an axios error into one of four categories so callers can show
 * the right message without parsing HTTP status codes themselves.
 *
 * @param {unknown} err
 * @returns {{ type: 'auth'|'validation'|'server'|'network', message: string }}
 */
function classifyError(err) {
  const status = err?.response?.status;
  const serverMessage = err?.response?.data?.message;

  if (!err?.response) {
    return {
      type: 'network',
      message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
    };
  }
  if (status === 401 || status === 403) {
    return {
      type: 'auth',
      message: 'Tu sesión expiró. Por favor inicia sesión nuevamente para continuar.',
    };
  }
  if (status === 400 || status === 422) {
    return {
      type: 'validation',
      message: serverMessage || 'Los datos enviados no son válidos. Verifica el formulario.',
    };
  }
  return {
    type: 'server',
    message: serverMessage || `Error del servidor (${status ?? 'desconocido'}). Intenta nuevamente en unos minutos.`,
  };
}

/**
 * useRecycleSubmit — manages the full lifecycle of selling a recyclable item.
 *
 * Responsibilities:
 *  - Validates JWT presence before any network call.
 *  - Creates (or reuses) a payment session stored in localStorage('pi').
 *  - Posts the waste item to the payment session.
 *  - Updates the global metacircle context on success.
 *  - Classifies and reports errors to Sentry (or console fallback).
 *
 * @param {Object} product  The waste/recyclable item from the API.
 * @returns {{ isLoading: boolean, error: Object|null, success: boolean, submit: Function, reset: Function }}
 */
export function useRecycleSubmit(product) {
  const { addToMetacircle } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  /**
   * @param {number} amount  Quantity of the waste item to sell.
   */
  const submit = useCallback(async (amount) => {
    setError(null);
    setSuccess(false);

    // ── Auth guard ────────────────────────────────────────────────────────────
    const token = Cookie.get('token');
    if (!token) {
      const authError = {
        type: 'auth',
        message: 'Debes iniciar sesión para vender reciclables.',
      };
      setError(authError);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    setIsLoading(true);

    try {
      // ── Step 1: resolve payment session ──────────────────────────────────
      let paymentId = parseInt(localStorage.getItem('pi'), 10) || null;

      if (!paymentId) {
        reporter.addBreadcrumb('Creating new recycling payment session', { productId: product?.id });
        const { data } = await axios.post(endPoints.payments.postPayment, {}, { headers });
        paymentId = data.id;
        localStorage.setItem('pi', String(paymentId));
        reporter.addBreadcrumb('Payment session created', { paymentId });
      } else {
        reporter.addBreadcrumb('Reusing existing payment session', { paymentId });
      }

      // ── Step 2: add the waste item to the session ─────────────────────────
      const packet = {
        paymentId,
        wasteId: product.id,
        amount: parseInt(amount, 10),
      };

      reporter.addBreadcrumb('Adding waste to payment session', packet);
      await axios.post(endPoints.payments.postCommodity, packet, { headers });

      // ── Step 3: update global state ───────────────────────────────────────
      addToMetacircle(product);
      setSuccess(true);

    } catch (err) {
      const classified = classifyError(err);

      reporter.captureException(err, {
        context: 'useRecycleSubmit',
        errorType: classified.type,
        productId: product?.id,
        productName: product?.name,
        extra: {
          status: err?.response?.status,
          responseData: err?.response?.data,
        },
      });

      setError(classified);
    } finally {
      setIsLoading(false);
    }
  }, [product, addToMetacircle]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { isLoading, error, success, submit, reset };
}
