import '@/styles/global.sass';
import Header from '@/components/Header';
import { Toaster } from 'react-hot-toast';


export default function App({ Component, pageProps }) {
  return <>
    <Header />
    <main><Component {...pageProps} /></main>
    <Toaster />
  </>;
}
