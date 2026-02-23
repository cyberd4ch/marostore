"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Menu, Home, ShoppingBag, Info, PhoneCall, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "../search-command/search-command";

interface NavigationSheetProps {
    currentUser: any;
    signOutUser: () => void;
}

export const NavigationSheet = ({ currentUser, signOutUser }: NavigationSheetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const toggleDrawer = useCallback(() => setIsOpen((prev) => !prev), []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
    }, [isOpen]);

    if (!mounted) return null;

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Shop", href: "/shop", icon: ShoppingBag },
        { name: "About Us", href: "/about", icon: Info },
        { name: "Contact", href: "/contact", icon: PhoneCall },
    ];

    return (
        <>
            {/* Custom Trigger Button */}
            <Button 
                size="icon" 
                variant="ghost" 
                onClick={toggleDrawer}
                className="rounded-full text-slate-600 hover:bg-slate-100 active:scale-90 transition-transform"
            >
                <Menu className="h-6 w-6" />
            </Button>

            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[10000] flex justify-start">
                            {/* Backdrop - matching your cart dropdown */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={toggleDrawer}
                                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                            />

                            {/* Drawer Content */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 30, stiffness: 250 }}
                                className="relative flex h-full w-[85vw] max-w-[350px] flex-col bg-white shadow-2xl"
                            >
                                {/* Header */}
                                <div className="px-6 pt-10 pb-6">
                                    <button 
                                        onClick={toggleDrawer}
                                        className="absolute right-4 top-8 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="h-6 w-6 text-slate-400" />
                                    </button>
                                    <Link href="/" onClick={toggleDrawer} className="block">
                                        <span className="text-2xl font-black tracking-tighter text-slate-900">
                                            marostore
                                        </span>
                                    </Link>
                                </div>

                                {/* Navigation Links */}
                                <nav className="flex-1 px-4 py-4 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={toggleDrawer}
                                            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-lg font-bold text-slate-700 hover:bg-slate-50 transition-colors active:scale-[0.98]"
                                        >
                                            <link.icon className="h-5 w-5 text-slate-400" />
                                            {link.name}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Footer Area */}
                                <div className="border-t border-slate-50 bg-slate-50/50 p-6 space-y-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsSearchOpen(true);
                                            setIsOpen(false);
                                        }}
                                        className="w-full justify-start rounded-2xl h-14 text-slate-600 gap-3 border-slate-200 bg-white shadow-sm"
                                    >
                                        <Search className="h-5 w-5" />
                                        <span className="font-bold">Search Store</span>
                                    </Button>

                                    {currentUser ? (
                                        <div className="space-y-3">
                                            <Button asChild variant="secondary" className="w-full rounded-2xl h-14 font-bold">
                                                <Link href={`/u/${(currentUser as any).username || 'profile'}`} onClick={toggleDrawer}>
                                                    <UserIcon className="mr-2 h-5 w-5" /> My Profile
                                                </Link>
                                            </Button>
                                            <Button 
                                                onClick={() => { signOutUser(); toggleDrawer(); }} 
                                                className="w-full rounded-2xl h-14 bg-black text-white font-bold"
                                            >
                                                <LogOut className="mr-2 h-5 w-5" /> Sign Out
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button asChild className="w-full rounded-2xl h-14 bg-black text-white font-bold shadow-xl shadow-slate-200">
                                            <Link href="/auth" onClick={toggleDrawer}>Sign In / Register</Link>
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <SearchCommand open={isSearchOpen} setOpen={setIsSearchOpen} />
        </>
    );
};