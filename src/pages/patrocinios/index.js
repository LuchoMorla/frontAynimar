import Head from 'next/head';
import Link from 'next/link';

export default function autoLogin() {
    return (
    <>
        <Head>
            <title>Aynimar | Patroconcursos</title>
        </Head>
        <div>
            <h1>
                Patroconcursos
            </h1>
            <p>En esta seccion Nuestros clientes podran concursar por premios otorgados por nuestros patrocinadores</p>
            <div>
                <div>
                    <h2>Productos marcados con QR</h2>
                    <p>Estos serian productos que probablemente pueden venir marcados con un premio, o te permitan participar en un juego o competicion.</p>
                    <p>La ventaja de esto es que podemos darle un valor agregado a nuestros clientes y a la vez impulsar una marca, por ejemplo usando el logo como ene l siguiente juego:</p>
                    <Link href='patrocinios/pacman'>Pacman</Link>
                </div>
            </div>
        </div>
    </>
    );
};