'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export default function ProductGallery({ images, title }: ProductGalleryProps) {
    const galleryImages = images?.length > 0 ? images : ['/placeholder.jpg'];
    const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

    // Force selection to synchronize whenever the user switches between items
    useEffect(() => {
        if (galleryImages.length > 0) {
            setSelectedImage(galleryImages[0]);
        }
    }, [images]); // Tracks changes to the raw source images property array

    return (
        <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F6F6F6]">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-contain object-center p-4 transition-opacity duration-300" 
                />
            </div>

            <div className="grid grid-cols-4 gap-4">
                {galleryImages.map((img, index) => (
                    <button
                        key={`${img}-${index}`}
                        onClick={() => setSelectedImage(img)}
                        className={cn(
                            "relative aspect-square overflow-hidden rounded-lg bg-[#F6F6F6] transition-all",
                            "hover:opacity-80 active:scale-95",
                            selectedImage === img 
                                ? "ring-2 ring-slate-900 ring-offset-2" 
                                : "ring-1 ring-slate-200"
                        )}
                    >
                        <Image
                            src={img}
                            alt={`${title} view ${index + 1}`}
                            fill
                            sizes="150px"
                            className="object-contain p-1"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}
