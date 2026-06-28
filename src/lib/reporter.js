/**
 * Thin error-reporting facade.
 *
 * Uses window.Sentry when available (drop in @sentry/nextjs and it works
 * automatically). Falls back to structured console.error so every capture
 * is still visible during development and in any log aggregator that reads
 * the browser console.
 *
 * Usage:
 *   reporter.captureException(error, { context: 'useRecycleSubmit', extra: {} })
 *   reporter.addBreadcrumb('Payment session created', { paymentId })
 */

function getSentry() {
  if (typeof window !== 'undefined' && window.Sentry) return window.Sentry;
  return null;
}

const reporter = {
  captureException(error, context = {}) {
    const sentry = getSentry();
    if (sentry) {
      sentry.withScope((scope) => {
        Object.entries(context).forEach(([key, value]) => {
          scope.setExtra(key, value);
        });
        sentry.captureException(error);
      });
    } else {
      console.error('[reporter] captureException', { message: error?.message, ...context, error });
    }
  },

  addBreadcrumb(message, data = {}) {
    const sentry = getSentry();
    if (sentry) {
      sentry.addBreadcrumb({ message, data, level: 'info' });
    } else {
      console.info('[reporter] breadcrumb', message, data);
    }
  },
};

export default reporter;
