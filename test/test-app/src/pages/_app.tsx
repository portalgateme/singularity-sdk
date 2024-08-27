import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import Providers from '../Providers'

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  const AnyComponent = Component as any

  return (
    <Providers>
      <AnyComponent {...pageProps} />
    </Providers>
  )
}
