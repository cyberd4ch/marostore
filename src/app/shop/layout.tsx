'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCategoriesStart } from '@/store/categories/category.action';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategoriesStart());
    }, [dispatch]);

    return <>{children}</>;
}