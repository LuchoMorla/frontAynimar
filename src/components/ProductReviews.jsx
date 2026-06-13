import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import endPoints from '@services/api';
import styles from '@styles/ProductReviews.module.scss';

// ── Helpers ───────────────────────────────────────────────────────────────────

function Stars({ rating, size = 'md' }) {
  return (
    <span className={`${styles.stars} ${styles[`stars_${size}`]}`} aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </span>
  );
}

function InteractiveStars({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className={styles.interactiveStars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          className={`${styles.interactiveStar} ${s <= (hover || value) ? styles.starFilled : styles.starEmpty}`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          aria-label={`${s} estrella${s > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}

function RatingBar({ star, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.ratingBar}>
      <span className={styles.ratingBarLabel}>{star}★</span>
      <div className={styles.ratingBarTrack}>
        <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.ratingBarCount}>{count}</span>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Main Component ────────────────────────────────────────────────────────────

const ECUADORIAN_CITIES = [
  'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Manta',
  'Loja', 'Ibarra', 'Riobamba', 'Esmeraldas', 'Latacunga',
  'Portoviejo', 'Machala', 'Santo Domingo', 'Durán', 'Milagro',
];

export default function ProductReviews({ productId, businessId = null }) {
  const [reviews, setReviews]       = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [filterRating, setFilterRating] = useState(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [formRating,   setFormRating]   = useState(0);
  const [formName,     setFormName]     = useState('');
  const [formCity,     setFormCity]     = useState('');
  const [formComment,  setFormComment]  = useState('');
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [formError,    setFormError]    = useState('');

  const fetchReviews = useCallback(async (rating = filterRating, p = page) => {
    setLoading(true);
    try {
      const url = endPoints.reviews.getReviews(productId, { rating, page: p, limit: 8 });
      const { data } = await axios.get(url);
      setReviews(data.reviews ?? []);
      setStats(data.stats ?? null);
      setTotalPages(data.pages ?? 1);
    } catch (_) {
      // silent — show empty state
    } finally {
      setLoading(false);
    }
  }, [productId, filterRating, page]);

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId, filterRating, page]);

  const handleFilterRating = (r) => {
    const next = filterRating === r ? null : r;
    setFilterRating(next);
    setPage(1);
    fetchReviews(next, 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!formRating) { setFormError('Por favor selecciona una calificación.'); return; }
    if (formName.trim().length < 2) { setFormError('Tu nombre debe tener al menos 2 caracteres.'); return; }
    if (formComment.trim().length < 5) { setFormError('El comentario debe tener al menos 5 caracteres.'); return; }

    setSubmitting(true);
    try {
      await axios.post(endPoints.reviews.postReview, {
        productId:    Number(productId),
        businessId:   businessId ?? null,
        rating:       formRating,
        customerName: formName.trim(),
        city:         formCity.trim() || null,
        comment:      formComment.trim(),
      });
      setSubmitted(true);
      setFormRating(0);
      setFormName('');
      setFormCity('');
      setFormComment('');
      fetchReviews(null, 1);
    } catch (err) {
      setFormError(err.response?.data?.message ?? 'No se pudo guardar tu reseña. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const noReviewsYet = !loading && stats?.total === 0;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Opiniones del producto</h2>

      {/* ── Summary block ─────────────────────────────────────────────────── */}
      {stats && stats.total > 0 && (
        <div className={styles.summaryBlock}>
          <div className={styles.summaryLeft}>
            <span className={styles.averageScore}>{stats.average ?? '—'}</span>
            <Stars rating={Math.round(stats.average ?? 0)} size="lg" />
            <span className={styles.reviewCount}>{stats.total} opinión{stats.total !== 1 ? 'es' : ''}</span>
          </div>
          <div className={styles.summaryRight}>
            {stats.breakdown.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={stats.total} />
            ))}
          </div>
        </div>
      )}

      {/* ── Filter chips ─────────────────────────────────────────────────── */}
      {stats && stats.total > 0 && (
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Filtrar:</span>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => handleFilterRating(r)}
              className={`${styles.filterChip} ${filterRating === r ? styles.filterChipActive : ''}`}
            >
              {r}★
            </button>
          ))}
          {filterRating && (
            <button onClick={() => handleFilterRating(null)} className={styles.filterClear}>
              Limpiar filtro
            </button>
          )}
        </div>
      )}

      {/* ── Review list ──────────────────────────────────────────────────── */}
      {loading ? (
        <div className={styles.loadingRow}>
          <span className={styles.spinner} />
        </div>
      ) : noReviewsYet ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>✦</span>
          <p className={styles.emptyTitle}>Sé el primero en calificar este producto</p>
          <p className={styles.emptySubtitle}>
            Cuéntanos tu experiencia tras recibir tu pedido. Tu opinión ayuda a otros compradores ecuatorianos.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.reviewList}>
            {reviews.map((r) => (
              <article key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <Stars rating={r.rating} size="sm" />
                  <span className={styles.reviewDate}>{formatDate(r.createdAt ?? r.created_at)}</span>
                </div>
                <p className={styles.reviewComment}>{r.comment}</p>
                <div className={styles.reviewFooter}>
                  <span className={styles.reviewName}>{r.customerName ?? r.customer_name}</span>
                  {(r.city) && (
                    <span className={styles.reviewCity}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {r.city}
                    </span>
                  )}
                  <span className={styles.verifiedBadge}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                    Comprador verificado
                  </span>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={styles.pageBtn}>← Anterior</button>
              <span className={styles.pageInfo}>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={styles.pageBtn}>Siguiente →</button>
            </div>
          )}
        </>
      )}

      {/* ── Review form ──────────────────────────────────────────────────── */}
      <div className={styles.formBlock}>
        <h3 className={styles.formTitle}>Comparte tu opinión</h3>
        {submitted ? (
          <div className={styles.successMessage}>
            <span>✓</span> ¡Gracias por tu reseña! Ayudas a otros compradores ecuatorianos a decidir mejor.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Star selector */}
            <div className={styles.formField} role="group" aria-labelledby="rating-label">
              <span id="rating-label" className={styles.formLabel}>Tu calificación *</span>
              <InteractiveStars value={formRating} onChange={setFormRating} />
            </div>

            {/* Name & city row */}
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="review-name">Tu nombre *</label>
                <input
                  id="review-name"
                  type="text"
                  placeholder="Ej: María García"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  maxLength={80}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel} htmlFor="review-city">Ciudad</label>
                <select
                  id="review-city"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className={styles.formInput}
                >
                  <option value="">Seleccionar ciudad...</option>
                  {ECUADORIAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comment */}
            <div className={styles.formField}>
              <label className={styles.formLabel} htmlFor="review-comment">Tu comentario *</label>
              <textarea
                id="review-comment"
                placeholder="Cuéntanos tu experiencia con el producto..."
                value={formComment}
                onChange={(e) => setFormComment(e.target.value)}
                rows={4}
                maxLength={1000}
                className={`${styles.formInput} ${styles.formTextarea}`}
                required
              />
              <span className={styles.charCount}>{formComment.length}/1000</span>
            </div>

            {formError && <p className={styles.formError}>{formError}</p>}

            <button type="submit" disabled={submitting} className={styles.submitBtn}>
              {submitting ? 'Enviando...' : 'Publicar mi reseña'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
