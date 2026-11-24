import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/lib/constants';
import { AuthProvider } from '@/lib/auth-context';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: `${APP_CONFIG.name} — ${APP_CONFIG.tagline}`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'ART Bandar Lampung',
    'Asisten Rumah Tangga Lampung',
    'Lowongan ART Lampung',
    'Pencarian ART Terdekat',
    'Babysitter Bandar Lampung',
    'Perawat Lansia Lampung',
    'ARTin',
  ],
  authors: [{ name: 'ARTin Platform' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FAFCFA] text-neutral-dark selection:bg-primary-light selection:text-primary-dark">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
