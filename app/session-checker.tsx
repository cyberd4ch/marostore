'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkUserSession } from '@/app/store/user/user.action';

export default function SessionChecker() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(checkUserSession());
    }, [dispatch]);
    return null;
}