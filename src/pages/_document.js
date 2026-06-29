import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          {/* Preconnect eliminates DNS+TLS handshake from the critical path */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap"
          />
                              {/* GA scripts moved to _app.js via <Script strategy="afterInteractive"> */}
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id="rootModal"></div>
{/*                                   <div id="widgets"></div>
                        <script src='https://www.hazvaca.com/project/widgets_code/s/red/3408'
                                type='text/javascript'></cript> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;