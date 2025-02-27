import { headers } from 'next/headers';
import { Metadata } from 'next';

import { baseURL, metaByLang } from '@/resources/config';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { getDictionary, SupportedLocale } from './dictionaries';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { cn } from '@/lib/utils';
import { Background } from '@/components/Background';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ViewTransitions } from 'next-view-transitions';
import { ReactLenis } from 'lenis/react'

import '../globals.css';

const primary = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
});

const code = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-code',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: SupportedLocale }>;
}): Promise<Metadata> {
  const host = (await headers()).get('host');
  const metadataBase = host ? new URL(`https://${host}`) : undefined;
  const lang = (await params).lang || 'en';
  const localizedMeta = metaByLang[lang];

  return {
    title: localizedMeta.title,
    description: localizedMeta.description,
    openGraph: {
      title: localizedMeta.og.title,
      description: localizedMeta.og.description,
      url: 'https://' + baseURL,
      images: [
        {
          url: localizedMeta.og.image,
          alt: localizedMeta.og.title,
        },
      ],
      type: localizedMeta.og.type as
        | 'website'
        | 'article'
        | 'book'
        | 'profile'
        | 'music.song'
        | 'music.album'
        | 'music.playlist'
        | 'music.radio_station'
        | 'video.movie'
        | 'video.episode'
        | 'video.tv_show'
        | 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: localizedMeta.og.title,
      description: localizedMeta.og.description,
      images: [localizedMeta.og.image],
    },
    metadataBase,
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: SupportedLocale }>;
}>) {
  const lang = (await params).lang;
  const dict = await getDictionary(lang);

  return (
    <ViewTransitions>
      <html
        lang={lang}
        className={cn(primary.variable, code.variable, 'scroll-smooth', 'antialiased')}
        suppressHydrationWarning
      >
        <body className="relative flex flex-col min-h-screen bg-background font-sans transition-colors duration-300 overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={0}>
              <ReactLenis root>
                <Background />
                <Header dictionary={dict} />
                <main className="flex flex-grow">{children}</main>
                <Footer dictionary={dict} />
                <Toaster position="top-right" />
              </ReactLenis >
            </TooltipProvider>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
