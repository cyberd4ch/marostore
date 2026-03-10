'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Directory from '@/components/directory/directory.component';
import DealsSection from '@/components/home/DealsSection';
import { fetchCategoriesStart } from '@/store/categories/category.action';
import { selectCategoriesMap } from '@/store/categories/category.selector';
import TrendingWearSection from '@/components/home/TrendingWearSection';
import { CategoryShowcase } from '@/components/home/CategoryShowcase';

export default function HomePage() {
  const dispatch = useDispatch();

  const categoriesMap = useSelector(selectCategoriesMap);

  const categoriesArray = Object.keys(categoriesMap).map((title) => ({
    title,
    items: categoriesMap[title],
  }));

  useEffect(() => {
    dispatch(fetchCategoriesStart());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-white">
      {/* SECTION 1: CLEAN MINIMALIST HERO */}
      <section className="relative w-full h-[70vh] flex items-center overflow-hidden bg-slate-50">
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          <div className="text-left space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">New Season Drop</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter">
              WEAR <br /> BETTER.
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-md leading-relaxed">
              Experience premium quality and timeless style with Maro Store’s exclusive collection.
            </p>
            
            <div className="flex items-center gap-4">
              <Button asChild size="lg" className="rounded-none h-14 px-10 bg-slate-900 hover:bg-black transition-all">
                <Link href="/shop">SHOP NOW</Link>
              </Button>
              <Link href="/shop" className="group flex items-center font-bold text-sm tracking-widest uppercase">
                Explore <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="hidden lg:block relative h-[60vh] w-full">
            <Image
              src="/bgg.png"
              alt="Fashion background"
              fill
              className="object-contain object-right"
              priority
            />
          </div>
        </div>
        {/* Subtle background text */}
        <div className="absolute bottom-0 right-0 text-[20vw] font-black text-slate-200/50 leading-none select-none translate-y-1/4">
          MARO'S
        </div>
      </section>

      {/* SECTION 2: DEALS OF THE DAY (With proper white space) */}
      <section className="py-24 bg-white border-y border-slate-100">
          <DealsSection />
      </section>

            <section className="py-24 bg-white border-y border-slate-100">
          <TrendingWearSection />
      </section>

            <section className="py-24 bg-white border-y border-slate-100">
          <CategoryShowcase />
      </section>
      

      {/* SECTION 3: DIRECTORY (Categories) */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">The Collections</h2>
            <div className="h-1 w-12 bg-slate-900 mt-4" />
          </div>
          {/* We wrap the Styled Component Directory to control its layout better */}
          <div className="w-full">
            <Directory />
          </div>
        </div>
      </section>
    </main>
  );
}