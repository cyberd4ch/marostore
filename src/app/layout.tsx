import { StoreProvider } from "@/app/store-provider";
import { Providers } from './providers';
import { Space_Grotesk, DM_Serif_Display } from 'next/font/google';
import Navigation from '@/app/routes/navigation';
import Footer from '@/components/Footer';
import localFont from 'next/font/local';
import './globals.css';
import React, { useEffect } from 'react';
import { Toaster } from 'sonner';
import OnboardingGuard from "@/components/OnboardingGuard";



const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const dmSerifDisplay = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif-display' });

export const metadata = {
  title: 'MaroStore - Fashion E-commerce',
  description: 'Online shopping for classy clothes and accessories',
};

// Remove the useEffect and router imports from here!
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSerifDisplay.variable}`}>
      <body className="font-sans">
        <Providers>
          <StoreProvider>
            {/* Add the Guard here inside the providers */}
            <OnboardingGuard>
              <Navigation>
                {children}
                <Footer />
              </Navigation>
            </OnboardingGuard>
          </StoreProvider>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}