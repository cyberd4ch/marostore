import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Get user data from cookies (requires you to set a cookie on login)
    const userCompletedOnboarding = request.cookies.get('onboardingCompleted')?.value === 'true';
    const { pathname } = request.nextUrl;

    // 2. If they haven't completed onboarding and aren't already on the onboarding page
    if (!userCompletedOnboarding && !pathname.startsWith('/onboarding') && !pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};