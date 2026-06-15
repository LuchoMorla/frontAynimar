import Head from 'next/head';
import HowItWorks from '@components/HowItWorks';

export default function ComoFunciona() {
  return (
    <>
      <Head>
        <title>¿Cómo funciona? | Aynimar</title>
        <meta
          name="description"
          content="Descubre cómo Aynimar une el e-commerce con la economía circular en 3 simples pasos: compra, recicla y gana Ayni-Créditos para tus próximas compras."
        />
      </Head>
      <HowItWorks />
    </>
  );
}
