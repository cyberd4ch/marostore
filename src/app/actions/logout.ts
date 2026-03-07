// src/app/actions/logout.ts
'use server';

import { cookies } from 'next/headers';

export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete('__session');
}