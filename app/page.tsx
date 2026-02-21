'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Timer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Directory from '@/components/directory/directory.component';
import DealsSection from '@/components/home/DealsSection'; // We will create this
import { fetchCategoriesStart } from '@/app/store/categories/category.action';

export default function HomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white">
      {/* Redesigned Hero Section */}
      <section className="relative h-[85vh] md:h-[90vh] flex flex-col">
        {/* Background Images Layer */}
        <div className="absolute inset-0 z-0 flex flex-col lg:flex-row overflow-hidden">
          <div className="relative w-full lg:w-1/2 h-full opacity-30 lg:opacity-100">
            <Image
              src="/bgg.png"
              alt="Fashion background"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="hidden lg:block w-1/2 h-full bg-slate-50" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-20 pb-10 px-4 text-center">
          <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6 animate-pulse">
            Season Sale
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight max-w-4xl leading-[0.9]">
            Wear Better, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Look Better.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-lg mx-auto">
            Experience premium quality and timeless style with Maro Store’s exclusive collection. Classy clothes for classy people.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="rounded-full h-14 px-8 bg-slate-900 text-white hover:bg-slate-800 text-base shadow-xl shadow-slate-200">
              <Link href="/shop">Shop Collection <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full h-14 px-8 border-slate-200 text-base">
              New Arrivals
            </Button>
          </div>
        </div>

        {/* Integrated Deals Section - Overlapping the Hero Bottom */}
        <div className="mt-auto pb-12">
          <DealsSection />
        </div>
      </section>

      {/* Directory Section (Categories) */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Browse Categories</h2>
            <Link href="/shop" className="text-sm font-bold text-slate-500 hover:text-slate-900 underline underline-offset-4">View All</Link>
          </div>
          <Directory />
        </div>
      </section>
    </main>
  );
}