import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
          {/* fonts.gstatic.com needs two preconnects: one plain for the CSS fetch,
              one with crossOrigin for the WOFF/WOFF2 fetches (different CORS mode) */}
          <link rel="preconnect" href="https://fonts.gstatic.com" />
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