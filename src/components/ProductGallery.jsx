import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import styles from '@styles/ProductGallery.module.scss';

const ProductGallery = ({ images = [], name = '' }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const validImages = useMemo(() => images.filter(Boolean), [images]);

  if (validImages.length === 0) return null;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      active: true,
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => setZoom((z) => ({ ...z, active: false }));

  return (
    <div className={styles.gallery}>
      {/* Main image with coordinate zoom */}
      <div
        className={styles.mainImageWrapper}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        title="Pasa el mouse para hacer zoom"
      >
        <div
          key={validImages[activeIndex]}
          className={styles.imageScaleWrapper}
          style={zoom.active ? {
            transform: `scale(2.6)`,
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
            transition: 'transform-origin 0.04s linear',
          } : {
            transform: 'scale(1)',
            transition: 'transform 0.25s ease',
          }}
        >
          <Image
            src={validImages[activeIndex]}
            alt={name}
            layout="fill"
            objectFit="cover"
            priority={activeIndex === 0}
            draggable={false}
          />
        </div>

        {/* Zoom hint — hidden while zooming */}
        {!zoom.active && (
          <span className={styles.zoomHint}>🔍</span>
        )}

        {/* Prev / Next arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowLeft}`}
              onClick={() => setActiveIndex((i) => (i - 1 + validImages.length) % validImages.length)}
              aria-label="Imagen anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowRight}`}
              onClick={() => setActiveIndex((i) => (i + 1) % validImages.length)}
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className={styles.thumbnailStrip}>
          {validImages.map((src, idx) => (
            <button
              key={`${src}-${idx}`}
              type="button"
              className={`${styles.thumbnail} ${idx === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
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
