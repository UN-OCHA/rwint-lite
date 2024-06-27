import Document, { Head, Main, NextScript } from 'next/document'
import { GTMInit, GTMIframe } from '../components//gtm'
import { breakpoints, colors, fonts, fontSizes, measurements } from '../theme/variables'

export default class MyDocument extends Document {
  render () {
    const { html } = this.props

    return (
      <html lang='en'>
        <Head>
          <GTMInit />
          <script src='https://cdnjs.cloudflare.com/polyfill/v2/polyfill.min.js?features=Object.assign,Map,Set' />
        </Head>
        <body>
          <GTMIframe />
          <Main />
          <NextScript />
        </body>
        <style jsx>{`
          html {
            font-size: 100%;
            background: ${colors.bg.body};
            margin: 0;
            margin-left: calc(100vw - 100%);
            padding: 0;
          }
          body {
            font-family: ${fonts.body};
            font-size: ${fontSizes.base};
            color: ${colors.text.body};
            background: ${colors.bg.content};
            max-width: ${measurements.maxWidth};
            margin: 0 auto;
            padding: 0;
          }
          @media (min-width: ${breakpoints.md}) {
            html {
              padding: 0 ${measurements.baseUnit}em;
            }
          }
        `}</style>
      </html>
    )
  }
}
