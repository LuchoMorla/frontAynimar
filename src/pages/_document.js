import Document, { Html, Head, Main, NextScript } from 'next/document';
/* import Script from 'next/script'; */
import { GA_TRACKING_ID } from '@gtag';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="es">
        <Head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/static/favicon.ico" />
                              {/* Google Adsense */}
                    {/* <script data-ad-client="<Your value here>" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script> */}
                    {/* Global Site Tag (gtag.js) - Google Analytics */}
                    <script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                        }}
                    />
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