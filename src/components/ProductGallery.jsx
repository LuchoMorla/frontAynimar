import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from '@styles/ProductGallery.module.scss';

const ProductGallery = ({ images = [], name = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = useMemo(() => images.filter(Boolean), [images]);

  if (validImages.length === 0) return null;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <div key={validImages[activeIndex]} className={styles.imageScaleWrapper}>
          <Image
            src={validImages[activeIndex]}
            alt={name}
            layout="fill"
            objectFit="cover"
            priority={activeIndex === 0}
          />
        </div>
      </div>

      {validImages.length > 1 && (
        <div className={styles.thumbnailStrip}>
          {validImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className={`${styles.thumbnail} ${idx === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <Image src={src} alt={`${name} ${idx + 1}`} width={70} height={70} objectFit="cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
