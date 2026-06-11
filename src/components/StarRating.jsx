import React from 'react';
import styles from '@styles/StarRating.module.scss';

const StarRating = ({ rating = 0, count = null }) => {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div className={styles.container} aria-label={`Calificación: ${clamped} de 5`}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(clamped);
          const isHalf = !isFull && star - 0.5 <= clamped;
          return (
            <span
              key={star}
              className={`${styles.star} ${isFull ? styles.full : isHalf ? styles.half : styles.empty}`}
              aria-hidden="true"
            >
              ★
            </span>
          );
        })}
      </div>
      {count !== null && (
        <span className={styles.count}>({count} reseñas)</span>
      )}
    </div>
  );
};

export default StarRating;
