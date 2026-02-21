'use client';

import Image from 'next/image';
import { Heart, Plus, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectCartItems } from '../../app/store/cart/cart.selector';
import { addItemToCart } from '../../app/store/cart/cart.action';
import { CategoryItem } from '../../app/store/categories/category.types';

import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component'; // updated import
import { toast } from 'sonner';

type ProductCardProps = {
    product: CategoryItem;
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
    const { name, price, imageUrl } = product;
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);

    const addProductToCart = () => {
        dispatch(addItemToCart(cartItems, product));
        toast.success(`${product.name} added to cart`);
    };

    return (
        <Card className="group overflow-hidden rounded-2xl border-slate-200 shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-[4/3] bg-[#E5E5E5] p-6">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="w-full h-[95%] object-cover mb-1 group-hover:opacity-80 transition-opacity"
                    priority
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white"
                >
                    <Heart className="h-5 w-5 text-slate-900" />
                </Button>
            </div>
            <CardContent className="p-5 pt-6 pb-2">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-900 leading-tight">{name}</h3>
                        <div className="mt-1 flex items-center gap-1">
                            {/* <Star className="h-4 w-4 fill-black text-black" /> */}
                            {/* <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-sm text-slate-500">({product.reviews})</span> */}
                        </div>
                        {/* <p className="text-sm text-slate-500">₵{price}</p> */}
                        <div className="text-right">
                            <span className="text-lg font-bold text-slate-900">₵{price}</span>
                        </div>
                    </div>
                    <CardFooter className="mt-6 grid grid-cols-2 gap-3">
                        <Button className="h-11 rounded-xl bg-[#1A1A1A] font-bold text-white hover:bg-black">
                            Buy Now
                        </Button>
                        <Button
                            onClick={addProductToCart}
                            variant="outline"
                            className="h-11 rounded-xl border-slate-200 font-bold text-slate-900 hover:bg-slate-50"
                        >
                            <Plus className="mr-2 h-6 w-6 stroke-[3]" />
                            Add to Cart
                        </Button>

                    </CardFooter>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductCard;