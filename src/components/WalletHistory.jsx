import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Cookie from 'js-cookie';
import endPoints from '@services/api';

const TYPE_LABELS = {
  sale:       'Venta de reciclable',
  commission: 'Comisión retenida',
  redemption: 'Canje en compra',
  adjustment: 'Ajuste',
};

const DIRECTION_COLOR = {
  credit: '#065f46',
  debit:  '#991b1b',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/**
 * WalletHistory — shows the authenticated user's full transaction ledger.
 *
 * Displays: date, type, gross amount, commission applied, net credits earned/spent.
 * Transparent breakdown so the user always knows where their credits came from.
 */
const WalletHistory = () => {
  const [data, setData]       = useState(null);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const fetchTransactions = useCallback(async (p) => {
    const token = Cookie.get('token');
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await axios.get(endPoints.wallet.myTransactions(p, 10), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res);
    } catch {
      setError('No se pudo cargar el historial. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTransactions(page); }, [page, fetchTransactions]);

  if (loading && !data) return <p style={styles.hint}>Cargando historial…</p>;
  if (error)            return <p style={{ color: '#991b1b' }}>{error}</p>;
  if (!data)            return null;

  const { transactions, totalCredits, pages } = data;

  return (
    <section style={styles.panel} aria-label="Historial de Ayni-Créditos">
      <div style={styles.header}>
        <h3 style={styles.title}>Historial de Ayni-Créditos</h3>
        <span style={styles.badge}>
          Saldo: <strong>{totalCredits}</strong> créditos
        </span>
      </div>

      {transactions.length === 0 ? (
        <p style={styles.hint}>Aún no tienes transacciones. ¡Recicla para ganar créditos!</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['Fecha', 'Tipo', 'Bruto (USD)', 'Comisión (30%)', 'Créditos'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={styles.tr}>
                  <td style={styles.td}>{formatDate(tx.createdAt)}</td>
                  <td style={styles.td}>{TYPE_LABELS[tx.type] ?? tx.type}</td>
                  <td style={styles.td}>
                    {tx.grossAmount > 0 ? `$${parseFloat(tx.grossAmount).toFixed(2)}` : '—'}
                  </td>
                  <td style={styles.td}>
                    {tx.commission > 0 ? `$${parseFloat(tx.commission).toFixed(2)}` : '—'}
                  </td>
                  <td style={{ ...styles.td, color: DIRECTION_COLOR[tx.direction], fontWeight: 700 }}>
                    {tx.direction === 'credit' ? '+' : '−'}{tx.netCredits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.pageBtn}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
          >
            ← Anterior
          </button>
          <span style={styles.pageLabel}>Página {page} de {pages}</span>
          <button
            style={styles.pageBtn}
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page >= pages || loading}
          >
            Siguiente →
          </button>
        </div>
      )}
    </section>
  );
};

const styles = {
  panel: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '12px',
    padding: '20px',
    marginTop: '24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#065f46',
  },
  badge: {
    background: '#dcfce7',
    border: '1px solid #86efac',
    borderRadius: '999px',
    padding: '4px 14px',
    fontSize: '0.85rem',
    color: '#065f46',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem',
  },
  th: {
    textAlign: 'left',
    padding: '8px 10px',
    borderBottom: '2px solid #bbf7d0',
    color: '#374151',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  tr: {
    borderBottom: '1px solid #d1fae5',
  },
  td: {
    padding: '8px 10px',
    color: '#1f2937',
    whiteSpace: 'nowrap',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '16px',
  },
  pageBtn: {
    background: '#065f46',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 14px',
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  pageLabel: {
    fontSize: '0.85rem',
    color: '#374151',
  },
  hint: {
    color: '#6b7280',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '16px 0',
  },
};

export default WalletHistory;
