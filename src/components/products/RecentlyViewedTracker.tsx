"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addViewedItem } from "@/store/recently-viewed/recently-viewed.reducer";

export default function RecentlyViewedTracker({ product }: { product: any }) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (product) {
            // We dispatch to Redux here once the page mounts on the client
            dispatch(addViewedItem(product));
        }
    }, [product, dispatch]);

    return null; // This component doesn't render anything UI-wise
}