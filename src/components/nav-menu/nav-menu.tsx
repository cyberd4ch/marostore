"use client";

import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export const NavMenu = () => (
  <NavigationMenu>
    <NavigationMenuList className="hidden md:flex gap-2">
      
      {/* Home Link */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
          <Link href="/">Home</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* Shop Link */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
          <Link href="/shop">Shop</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* About Us Link */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
          <Link href="/about">About Us</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

      {/* Contact Link */}
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
          <Link href="/contact">Contact</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>

    </NavigationMenuList>
  </NavigationMenu>
);
