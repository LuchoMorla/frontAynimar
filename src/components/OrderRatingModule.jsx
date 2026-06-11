import React, { useState } from 'react';
import styles from '@styles/OrderRating.module.scss';

/**
 * OrderRatingModule — interactive star rating with optional micro-review.
 *
 * Props
 * ─────
 * initialRating  Pre-selected rating 0–5 (default 0).
 * readOnly       If true, renders a display-only version (no interaction).
 * onSubmit       Called with { rating, review } when the user submits.
 *                If omitted, the submit button is hidden.
 */
const OrderRatingModule = ({ initialRating = 0, readOnly = false, onSubmit }) => {
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(initialRating);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (value) => {
    if (!readOnly) setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    if (typeof onSubmit === 'function') onSubmit({ rating, review });
    setSubmitted(true);
  };

  const display = readOnly ? initialRating : (hovered || rating);

  if (submitted) {
    return (
      <div className={styles.successMessage}>
        <span aria-hidden="true">🌟</span> ¡Gracias por tu calificación!
      </div>
    );
  }

  return (
    <div className={styles.container} aria-label="Calificación del pedido">
      <p className={styles.prompt}>
        {readOnly ? 'Calificación del pedido' : '¿Cómo calificarías tu experiencia?'}
      </p>

      <div
        className={styles.stars}
        onMouseLeave={() => !readOnly && setHovered(0)}
        aria-label={`${display} de 5 estrellas`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${star <= display ? styles.active : styles.inactive}`}
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            disabled={readOnly}
            aria-label={`${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
          >
            ★
          </button>
        ))}
      </div>

      {!readOnly && rating > 0 && (
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <textarea
            className={styles.reviewInput}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia (opcional)..."
            rows={3}
            maxLength={300}
          />
          <button type="submit" className={styles.submitBtn}>
            Enviar calificación
          </button>
        </form>
      )}
    </div>
  );
};

export default OrderRatingModule;
