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
          <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://cdn.paymentez.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap"
          />
        </Head>
        <body>
          {/* GTM noscript fallback — required by GTM spec for non-JS environments */}
          <noscript dangerouslySetInnerHTML={{ __html:
            `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M93VNFW6" height="0" width="0" style="display:none;visibility:hidden"></iframe>`
          }} />
          <Main />
          <NextScript />
          <div id="rootModal"></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;