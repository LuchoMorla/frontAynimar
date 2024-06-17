import Head from 'next/head';
import Pacman from '../../../games/Pacman.jsx';

export default function autoLogin() {
    return (
    <>
        <Head>
            <title>AyniPacman</title>
        </Head>
        <div>
            <h1>
                Patroconcursos | AyniPacman
            </h1>
            <p>En esta seccion Nuestros clientes podran concursar por premios otorgados por nuestros patrocinadores, este caso es un ejemplo de caso de uso por parte de Aynimar</p>
            <div>
                <Pacman />
            </div>
        </div>
    </>
    );
};