import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';

const castoroFont = localFont({
  src: './fonts/Castoro-Regular.ttf',
  variable: '--font-body',
});
const muktaFont = localFont({
  src: './fonts/Mukta-ExtraBold.ttf',
  variable: '--font-title',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${castoroFont.variable} ${muktaFont.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}
