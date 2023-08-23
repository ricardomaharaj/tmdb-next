import { AppProps } from 'next/app'
import { Header } from '~/components/header'
import '~/styles/globals.css'
import { Urql } from '~/util/urql'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Urql>
      <Header />
      <Component {...pageProps} />
    </Urql>
  )
}
