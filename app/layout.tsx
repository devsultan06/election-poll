import { prisma } from '@/lib/prisma'; // Import your Prisma client
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  let association = null;

  try {
    // Fetch association info directly from the DB using Prisma
    // Only attempt if we're not in a build environment
    if (process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL) {
      association = await prisma.association.findFirst({
        select: { name: true, logoUrl: true },
      });
    }
  } catch (error) {
    // Silently handle database connection errors during build
    console.warn('Unable to fetch association metadata during build:', error);
  }

  return {
    title: association?.name ? `${association.name} Poll` : 'Election Management System',
    description: 'Election Management System',
    icons: {
      icon: association?.logoUrl || '/favicon.ico',
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
