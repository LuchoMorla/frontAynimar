import Head from 'next/head';
import FormProduct from '@components/FormProduct';
import ProductReviews from '@components/ProductReviews';

export default function ProductStand({ product }) {
  if (!product) return null;

  return (
    <>
      <Head>
        <title>Aynimar | {product.name}</title>
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
