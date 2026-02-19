'use client';

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
        <div className="group relative flex w-full flex-col items-center h-[350px]">
            <img
                src={imageUrl}
                alt={name}
                className="w-full h-[95%] object-cover mb-1 group-hover:opacity-80 transition-opacity"
            />
            <div className="flex w-full justify-between text-lg mt-1">
                <span className="w-[90%] mb-4">{name}</span>
                <span className="w-[10%]">{price}</span>
            </div>
            <Button
                variant="google"
                onClick={addProductToCart}
                className="absolute w-4/5 opacity-70 group-hover:opacity-85 group-hover:block hidden top-[255px] max-[800px]:block max-[800px]:opacity-90 max-[800px]:min-w-fit max-[800px]:px-2"
            >
                Add to cart
            </Button>
        </div>
    );
};

export default ProductCard;