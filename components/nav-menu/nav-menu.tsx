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
      <NavigationMenuItem>
        <Link href="/" legacyBehavior passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
            Home
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/shop" legacyBehavior passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
            Shop
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/about" legacyBehavior passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
            About Us
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link href="/contact" legacyBehavior passHref>
          <NavigationMenuLink className={`${navigationMenuTriggerStyle()} bg-transparent font-medium text-slate-600 hover:text-slate-900`}>
            Contact
          </NavigationMenuLink>
        </Link>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);