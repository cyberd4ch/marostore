"use client";

import Link from "next/link";
import {
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Smartphone, // Using as a proxy for TikTok style
    ArrowRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const footerLinks = {
    company: [
        { title: "About Us", href: "/about" },
        { title: "Manifesto", href: "/manifesto" },
        { title: "Sustainability", href: "/sustainability" },
        { title: "Social Impact", href: "/impact" },
        { title: "Blog", href: "/blog" },
    ],
    help: [
        { title: "Contact Us", href: "/contact" },
        { title: "FAQs", href: "/faq" },
        { title: "Shipping Costs", href: "/shipping" },
        { title: "Order History", href: "/orders" },
    ],
    information: [
        { title: "Customer Care", href: "/care" },
        { title: "Terms & Conditions", href: "/terms" },
        { title: "Privacy Policy", href: "/privacy" },
        { title: "Sitemap", href: "/sitemap" },
    ]
};

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                {/* Top Section: Logo & Newsletter */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
                    <div className="space-y-6 max-w-sm">
                        <span className="text-2xl font-extrabold tracking-tighter text-white transition-colors hover:text-slate-300 md:text-3xl">
                            marostore
                        </span>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Maro Store is a curated destination for premium, high-fashion, and sustainable apparel.
                            Creating social change through style.
                        </p>
                        <div className="flex gap-4">
                            <Instagram size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                            <Facebook size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                            <Twitter size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                            <Youtube size={20} className="text-slate-400 hover:text-white cursor-pointer" />
                        </div>
                    </div>

                    <div className="w-full max-w-sm space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-white">
                            Join the Movement
                        </h4>
                        <div className="flex flex-col sm:flex-row items-stretch gap-0 border border-slate-800 focus-within:border-slate-400 transition-colors">
                            <Input
                                placeholder="email@newsletter.com"
                                className="bg-transparent border-none rounded-none h-12 text-white focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-600 grow"
                            />
                            <Button
                                className="bg-white text-black hover:bg-slate-200 rounded-none h-12 px-6 font-bold text-xs uppercase tracking-tighter shrink-0"
                            >
                                Subscribe
                            </Button>
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                            *Get updates on new drops and exclusive MoMo-only deals.
                        </p>
                    </div>
                </div>

                {/* Middle Section: Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-slate-900 pt-16 pb-20">
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-xs mb-8">Company</h5>
                        <ul className="space-y-4">
                            {footerLinks.company.map((link) => (
                                <li key={link.title}><Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.title}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-xs mb-8">Help & Support</h5>
                        <ul className="space-y-4">
                            {footerLinks.help.map((link) => (
                                <li key={link.title}><Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.title}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold uppercase tracking-widest text-xs mb-8">Information</h5>
                        <ul className="space-y-4">
                            {footerLinks.information.map((link) => (
                                <li key={link.title}><Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.title}</Link></li>
                            ))}
                        </ul>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h5 className="font-bold uppercase tracking-widest text-xs mb-4">Secure Checkout</h5>
                            <div className="flex items-center gap-3">
                                {/* Simple MoMo representation */}
                                <div className="flex -space-x-1">
                                    <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-black z-30" title="MTN" />
                                    <div className="w-6 h-6 rounded-full bg-red-600 border-2 border-black z-20" title="Telecel" />
                                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-black z-10" title="AirtelTigo" />
                                </div>
                                <div className="h-4 w-px bg-slate-800 mx-1" />
                                <span className="text-[10px] font-bold text-slate-400">PAYSTACK | BANK</span>
                            </div>
                        </div>
                        <div>
                            <h5 className="font-bold uppercase tracking-widest text-xs mb-4">Shipping</h5>
                            <div className="flex items-center gap-2">
                                <div className="h-1 w-4 bg-yellow-500" /> {/* DHL Yellow accent */}
                                <p className="text-slate-200 text-xs tracking-tighter font-black uppercase">DHL Global Express</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Copyright */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-900">
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest">
                        © {new Date().getFullYear()} MARO STORE. ALL RIGHTS RESERVED.
                    </p>
                    <div className="mt-4 md:mt-0 flex gap-6 text-[10px] uppercase tracking-widest text-slate-500">
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;