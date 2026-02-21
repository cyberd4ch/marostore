"use client";

import { useState } from "react";
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

interface NavigationSheetProps {
    currentUser: any;
    signOutUser: () => void;
}

export const NavigationSheet = ({ currentUser, signOutUser }: NavigationSheetProps) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
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

                    {/* Navigation Links */}
                    <div className="flex flex-col gap-6 flex-1">
                        <Link href="/" className="text-lg font-semibold text-slate-900">Home</Link>
                        <Link href="/shop" className="text-lg font-semibold text-slate-900">Shop</Link>
                        <Link href="/about" className="text-lg font-semibold text-slate-900">About Us</Link>
                        <Link href="/contact" className="text-lg font-semibold text-slate-900">Contact</Link>
                    </div>

                    {/* Mobile Footer Area */}
                    <div className="border-t border-slate-100 pt-6 mt-auto flex flex-col gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsSearchOpen(true)}
                            className="w-full justify-start rounded-xl h-12 text-slate-600 gap-3 border-slate-200"
                        >
                            <Search className="h-4 w-4" />
                            <span className="font-medium">Search Store</span>
                        </Button>

                        {currentUser ? (
                            <div className="flex flex-col gap-3">
                                <Button asChild variant="secondary" className="w-full rounded-xl h-12">
                                    <Link href={`/u/${(currentUser as any).username || 'profile'}`}>
                                        My Profile
                                    </Link>
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

            {/* IMPORTANT: SearchCommand is placed OUTSIDE the Sheet. 
              This prevents the "Dialog inside Dialog" focus trap issues 
              and ensures the search overlay renders on top of everything.
            */}
            <SearchCommand open={isSearchOpen} setOpen={setIsSearchOpen} />
        </>
    );
};