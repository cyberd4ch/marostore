import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. Skip middleware for all API routes explicitly
    if (pathname.startsWith('/api')) {
        return NextResponse.next();
    }

    const userCompletedOnboarding = request.cookies.get('onboardingCompleted')?.value === 'true';

    // 2. Optimized redirect logic
    const isPublicPage = pathname.startsWith('/onboarding') || pathname.startsWith('/login') || pathname === '/';
    
    if (!userCompletedOnboarding && !isPublicPage) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // This regex matches everything EXCEPT api, static files, and images
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};