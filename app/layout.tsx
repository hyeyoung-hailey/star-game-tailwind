// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // 👈 GA용 Script 컴포넌트 추가

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'noitow',
  description: '당신이 움직이는 순간, 새로운 흐름이 시작됩니다.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ GA4 추적 코드 삽입 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VNGTLYZT9M"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
