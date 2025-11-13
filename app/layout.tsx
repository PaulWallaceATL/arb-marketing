import type { Metadata } from 'next';
import Script from 'next/script';
import { Libre_Baskerville } from 'next/font/google';
import localFont from 'next/font/local';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

// Google Font
const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  display: 'swap',
});

// Local Custom Font - Roxborough CF
const roxboroughCF = localFont({
  src: '../public/assets/fonts/Roxborough CF.ttf',
  variable: '--font-roxborough-cf',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ARB Marketing || Legal Marketing & Referral Solutions',
  description: 'ARB Marketing delivers qualified personal injury leads and strategic marketing for law firms. Helping attorneys win bigger cases and scale sustainably.',
  metadataBase: new URL('https://arb-marketing.vercel.app'),
  openGraph: {
    title: 'ARB Marketing || Legal Marketing & Referral Solutions',
    description: 'ARB Marketing delivers qualified personal injury leads and strategic marketing for law firms. Helping attorneys win bigger cases and scale sustainably.',
    images: [{
      url: 'https://arb-marketing.vercel.app/assets/img/logo-arb.svg',
      width: 1200,
      height: 630,
      alt: 'ARB Marketing',
      type: 'image/svg+xml',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARB Marketing || Legal Marketing & Referral Solutions',
    description: 'ARB Marketing delivers qualified personal injury leads and strategic marketing for law firms. Helping attorneys win bigger cases and scale sustainably.',
    images: [{
      url: 'https://arb-marketing.vercel.app/assets/img/logo-arb.svg',
      alt: 'ARB Marketing',
    }],
  },
  icons: {
    icon: '/assets/img/logo-arb.svg',
    shortcut: '/assets/img/logo-arb.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${libreBaskerville.variable} ${roxboroughCF.variable}`}>
      <head>
        {/* Google Fonts */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Arimo:ital,wght@0,400..700;1,400..700&family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Familjen+Grotesk:ital,wght@0,400..700;1,400..700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Syne:wght@400..800&display=swap" 
          rel="stylesheet" 
        />
        {/* CSS Files - Import in order */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/css/animate.css" />
        <link rel="stylesheet" href="/assets/css/custom-font.css" />
        <link rel="stylesheet" href="/assets/css/fontawesome.css" />
        <link rel="stylesheet" href="/assets/css/aos.css" />
        <link rel="stylesheet" href="/assets/css/icomoon.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
        <link rel="stylesheet" href="/assets/css/app.min.css" />
        <link rel="stylesheet" href="/assets/css/greyscale-override.css" />
        {/* Mobile Menu Fix - Must be loaded last */}
        <link rel="stylesheet" href="/assets/css/mobile-menu-fix.css" />
      </head>
      <body className="light">
        <div id="site-content">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        
        {/* JavaScript Files */}
        <Script src="/assets/js/jquery-3.6.0.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/bootstrap.bundle.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/vendors/menu.js" strategy="lazyOnload" />
        <Script src="/assets/js/swiper-bundle.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/vendors/counterup.js" strategy="lazyOnload" />
        <Script src="/assets/js/wow.min.js" strategy="lazyOnload" />
        <Script src="/assets/js/aos.js" strategy="lazyOnload" />
        <Script src="/assets/js/app.js" strategy="lazyOnload" />
        <Script src="/assets/js/main.js" strategy="lazyOnload" />
        
        {/* Initialize WOW.js, AOS, and Custom Cursor */}
        <Script id="init-animations-and-cursor" strategy="lazyOnload">
          {`
            if (typeof WOW !== 'undefined') {
              new WOW().init();
            }
            if (typeof AOS !== 'undefined') {
              AOS.init({
                duration: 800,
                once: true
              });
            }
            
            // Ensure custom cursor initializes
            if (typeof jQuery !== 'undefined') {
              jQuery(document).ready(function() {
                // Check if cursor element exists
                const cursorExists = document.querySelector('.custom-cursor');
                console.log('Custom cursor element exists:', !!cursorExists);
                console.log('jQuery loaded:', !!jQuery, 'App.js should have initialized cursor');
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
