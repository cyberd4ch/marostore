import { StoreProvider } from "@/app/store-provider";
import { Providers } from './providers';
import { Space_Grotesk, DM_Serif_Display } from 'next/font/google';
import Navigation from '@/app/routes/navigation';
import localFont from 'next/font/local';
import './globals.css';
import React from 'react';
import { Toaster } from 'sonner';


const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const dmSerifDisplay = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif-display' });

export const metadata = {
  title: 'MaroStore - Fashion E-commerce',
  description: 'Online shopping for classy clothes and accessories',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable}`}>
      <body className="font-sans">
        <React.StrictMode>
          <Providers>
            <Navigation>
              <StoreProvider>
                {children}
              </StoreProvider>
              <Toaster position="top-right" richColors />
              </Navigation>
          </Providers>
        </React.StrictMode>
      </body>
    </html>
  );
}