"use client";
import { X, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function QuickViewModal({ product, onClose, onAddToCart }: any) {
    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Fade */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Slide/Scale Up */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-hidden relative flex flex-col md:flex-row shadow-2xl"
            >
                <button 
                    onClick={onClose} 
                    className="absolute right-6 top-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white shadow-sm transition-colors"
                >
                    <X size={20} />
                </button>
                
                <div className="md:w-1/2 relative aspect-square md:aspect-auto h-[300px] md:h-auto">
                    <Image 
                        src={product.imageUrl || product.image || "/placeholder.png"} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                    />
                </div>

                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                        {product.category}
                    </span>
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">
                        {product.name}
                    </h2>
                    <p className="text-2xl font-bold text-slate-900 mb-6">
                        ${product.price.toFixed(2)}
                    </p>
                    <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                        Elevate your style with the {product.name}. A perfect blend of premium craftsmanship and contemporary design.
                    </p>
                    
                    <button 
                        onClick={() => { onAddToCart(); onClose(); }} 
                        className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                    >
                        <ShoppingCart size={20} /> Add to Cart
                    </button>
                </div>
            </motion.div>
        </div>
    );
}