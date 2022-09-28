import Head from 'next/head';
import AutoLoginPage from '@components/AutoLoginPage';

export default function autoLogin() {
    return (
    <>
        <Head>
            <title>Aynimar | Auto-Login</title>
        </Head>
        <AutoLoginPage />    
    </>
    );
};