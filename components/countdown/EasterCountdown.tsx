'use client';

import { useState, useEffect } from 'react';

// The Meeus/Jones/Butcher algorithm to calculate Easter Sunday
function getNextEasterDate() {
    const currentYear = new Date().getFullYear();
    
    const calculateEasterForYear = (year: number) => {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        
        // Month is 0-indexed in JavaScript Date
        return new Date(year, month - 1, day);
    };

    let easterDate = calculateEasterForYear(currentYear);

    // If Easter has already passed this year, calculate for next year
    if (new Date().getTime() > easterDate.getTime()) {
        easterDate = calculateEasterForYear(currentYear + 1);
    }

    return easterDate;
}

export function EasterCountdown() {
    const [isMounted, setIsMounted] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        setIsMounted(true);
        const targetDate = getNextEasterDate().getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((difference % (1000 * 60)) / 1000),
                });
            }
        };

        // Run immediately to avoid 1-second delay, then set interval
        updateCountdown();
        const intervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Prevent hydration mismatch errors in Next.js by not rendering the times until mounted
    if (!isMounted) {
        return (
            <div className="bg-red-600 text-white font-mono px-3 py-1 rounded-sm text-xs flex gap-2 opacity-50">
                <span>--D</span> : <span>--H</span> : <span>--M</span> : <span>--S</span>
            </div>
        );
    }

    // Pad single digits with leading zeros (e.g., 9 becomes 09)
    const format = (num: number) => num.toString().padStart(2, '0');

    return (
        <div className="bg-red-600 text-white font-mono px-3 py-1 rounded-sm text-xs flex gap-2">
            <span>{format(timeLeft.days)}D</span> :{' '}
            <span>{format(timeLeft.hours)}H</span> :{' '}
            <span>{format(timeLeft.minutes)}M</span> :{' '}
            <span>{format(timeLeft.seconds)}S</span>
        </div>
    );
}