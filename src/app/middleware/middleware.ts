import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Lightweight helper to decode JWT payload in Edge Runtime
 * This allows us to check { admin: true } without the full Admin SDK
 */
function getJwtPayload(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // 1. COOKIE & SESSION RETRIEVAL
    const session = request.cookies.get('__session')?.value;
    const userCompletedOnboarding = request.cookies.get('onboardingCompleted')?.value === 'true';

    // 2. DEFINE ROUTE GROUPS
    const isAuthPage = pathname.startsWith('/auth');
    const isDashboardPage = pathname.startsWith('/dashboard'); // Common user dashboard
    const isAdminPage = pathname.startsWith('/admin');         // Exclusive admin area
    const isOnboardingPage = pathname.startsWith('/onboarding');
    const isPublicStaticAsset = pathname.startsWith('/_next') || pathname.includes('.');

    // 3. SECURITY LOGIC (ORDER MATTERS)

    // A. NO SESSION: Redirect to /auth if trying to access any protected route
    if (!session && (isDashboardPage || isAdminPage || isOnboardingPage)) {
        const loginUrl = new URL('/auth', request.url);
        loginUrl.searchParams.set('from', pathname); // OWASP: Remember intended destination
        return NextResponse.redirect(loginUrl);
    }

    // B. WITH SESSION: Traffic Control
    if (session) {
        const payload = getJwtPayload(session);
        const isAdmin = payload?.admin === true;

        // B1. Prevent logged-in users from seeing /auth
        if (isAuthPage) {
            return NextResponse.redirect(new URL('/dashboard-check', request.url));
        }

        // B2. ADMIN PROTECTION: If targeting /admin but lacks claim
        if (isAdminPage && !isAdmin) {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

        // B3. ONBOARDING ENFORCEMENT: (Only for non-admins or standard flow)
        // We skip this check for static assets and the onboarding page itself
        if (!userCompletedOnboarding && !isOnboardingPage && !isAdminPage && !isPublicStaticAsset) {
            return NextResponse.redirect(new URL('/onboarding', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};