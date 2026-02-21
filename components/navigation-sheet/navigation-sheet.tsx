"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchCommand } from "../search-command/search-command";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

interface NavigationSheetProps {
    currentUser: any;
    signOutUser: () => void;
}

export const NavigationSheet = ({ currentUser, signOutUser }: NavigationSheetProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full text-slate-600 hover:bg-slate-100">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-[300px] sm:w-[350px] flex flex-col p-6">
                <SheetHeader className="mb-8 text-left">
                    <SheetTitle asChild>
                        <Link href="/" className="flex items-center">
                            <Image src="/logo.png" alt="Logo" width={120} height={40} className="object-contain" />
                        </Link>
                    </SheetTitle>
                </SheetHeader>

                {/* Mobile Links */}
                <div className="flex flex-col gap-6 flex-1">
                    <Link href="/" className="text-lg font-semibold text-slate-900">Home</Link>
                    <Link href="/shop" className="text-lg font-semibold text-slate-900">Shop</Link>
                    <Link href="/about" className="text-lg font-semibold text-slate-900">About Us</Link>
                    <Link href="/contact" className="text-lg font-semibold text-slate-900">Contact</Link>
                </div>

                {/* Mobile Footer / Auth */}
                <div className="border-t border-slate-100 pt-6 mt-auto flex flex-col gap-4">
                    <Button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors bg-slate-100/50 px-3 py-1.5 rounded-full border border-transparent hover:border-slate-200"
                    >
                        <Search className="h-4 w-4" />
                        <span className="text-xs font-medium">Search shop...</span>
                        <kbd className="text-[10px]">⌘K</kbd>
                    </Button>

                    {/* Place the SearchCommand Dialog here */}
                    <SearchCommand open={isSearchOpen} setOpen={setIsSearchOpen} />

                    {currentUser ? (
                        <div className="flex flex-col gap-3">
                            <Button asChild variant="secondary" className="w-full rounded-xl h-12">
                                <Link href={`/u/${(currentUser as any).username || 'profile'}`}>My Profile</Link>
                            </Button>
                            <Button onClick={signOutUser} className="w-full rounded-xl h-12 bg-slate-900 text-white">
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <Button asChild className="w-full rounded-xl h-12 bg-slate-900 text-white font-bold">
                            <Link href="/auth">Sign In / Register</Link>
                        </Button>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};