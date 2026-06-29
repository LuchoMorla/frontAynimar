import Head from 'next/head';
import FormProduct from '@components/FormProduct';
import ProductReviews from '@components/ProductReviews';

export default function ProductStand({ product }) {
  if (!product) return null;

  const canonical = `https://www.aynimar.com/store/${product.id}`;
  const image = (() => {
    try { const a = JSON.parse(product.images); return a?.[0] ?? product.image; } catch { return product.image; }
  })();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description ?? '',
    image: image ? [image] : [],
    sku: product.externalId ?? String(product.id),
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'USD',
      price: product.price,
      availability: (product.stock == null || product.stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Aynimar' },
    },
  };

  return (
    <>
      <Head>
        <title>{product.name} | Aynimar Shop</title>
        <meta name="description" content={`Compra ${product.name} con pago contra entrega en Ecuador. Precio: $${product.price}.`} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${product.name} | Aynimar`} />
        <meta property="og:description" content={`Compra ${product.name} con pago contra entrega. $${product.price}`} />
        {image && <meta property="og:image" content={image} />}
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Aynimar`} />
        <meta name="twitter:description" content={`Compra ${product.name} con pago contra entrega en Ecuador. $${product.price}`} />
        {image && <meta name="twitter:image" content={image} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <FormProduct product={product} />
      {product.id && (
        <ProductReviews productId={product.id} businessId={product.businessId ?? null} />
      )}
    </>
  );
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const API     = process.env.NEXT_PUBLIC_API_URL;
  const VERSION = process.env.NEXT_PUBLIC_API_API_VERSION || 'v1';

  try {
    const res = await fetch(`${API}/api/${VERSION}/products/${id}`);
    if (!res.ok) return { notFound: true };
    const product = await res.json();
    if (!product?.id) return { notFound: true };
    return { props: { product }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}
