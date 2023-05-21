import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-6S5D2T7858" />
        <Script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments)}
          gtag('js', new Date());
          gtag('config', 'G-6S5D2T7858');
        </Script>
        <body>
          <Main />
          <NextScript />
          <div id="rootModal"></div>
{/*                                   <div id="widgets"></div>
                        <script src='https://www.hazvaca.com/project/widgets_code/s/red/3408'
                                type='text/javascript'></script> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;