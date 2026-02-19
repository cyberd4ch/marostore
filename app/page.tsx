'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { CirclePlay } from 'lucide-react';
import { BackgroundPattern } from '@/components/background-pattern';
import Link from 'next/link';
import Image from 'next/image';
import Directory from '@/components/directory/directory.component';
import { fetchCategoriesStart } from '@/app/store/categories/category.action';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  return (
    <>
      {/* Hero Section (from your original page.tsx) */}
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="absolute inset-0 flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full">
            <Image
              src="/bgg.png"
              alt="Hero background"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative w-full lg:w-1/2 h-1/2 lg:h-full">
            <BackgroundPattern />
          </div>
        </div>
        <div className="relative z-10 text-center px-4 py-16">
          <h1 className="text-4xl font-bold text-primary mb-4 tracking-tighter sm:text-5xl md:text-6xl md:leading-[1.2] lg:text-7xl">
            Online Shopping - Maro's Collection
          </h1>
          <div className="space-x-4">
            <p className="bg-secondary/10 text-foreground/90 md:text-lg mb-4 mt-4 px-6 py-3 rounded-full inline-block">
              Wear better, look better. <br />
              Don't you just love being in classy clothes?
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                asChild
                className="bg-secondary rounded-full text-background px-6 py-3 font-medium hover:bg-secondary/80 transition-colors"
                size="lg"
              >
                <Link href="/shop">Shop Now</Link>
              </Button>
              <Button
                className="rounded-full text-base shadow-none"
                size="lg"
                variant="outline"
              >
                <CirclePlay className="h-5! w-5!" /> Follow our TikTok
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Section (categories) */}
      <section className="py-16">
        <Directory />
      </section>
    </>
  );
}