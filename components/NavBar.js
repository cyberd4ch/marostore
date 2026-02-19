import { useState } from "react";

import { WishlistIcon, CartIcon, UserIcon } from "../assets/icons";
import Image from "next/image";
import BetterLink from "./BetterLink";
import {authService} from "../src/services/auth.service";
import { Divide } from "lucide-react";


const NavBar = ()   => {
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    
    const toggleHandler = () => {
        if(isMenuVisible){
            closeMenu();
        } else{
            openMenu();
        }
    };

    const openMenu = () => {
        setIsMenuVisible(true);
    };

    const closeMenu = () => {
        setIsMenuVisible(false);
    };

    const signOutHandler = () => {
        signOut(authService)
            .then(() => {
                closeMenu();
            })
            .catch((error) => {
            console.log(error);
            });
    };

    return (
        <div>
            <div>
                <BetterLink href="/">
                    <Image src="/logo.png" alt="Logo" fill style={{objectFit: 'contain', padding: '4px'}} priority />
                </BetterLink>
            </div>
        </div>
    )

}

export default NavBar