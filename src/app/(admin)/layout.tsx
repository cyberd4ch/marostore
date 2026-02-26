// app/(admin)/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth, verifyAdminStatus } from '@/lib/firebaseAdmin'; // Your existing lib path
import AdminSidebar from '@/components/AdminSidebar'; // We'll move the UI here

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;

    // 1. Hard check: No cookie? No entry.
    if (!sessionCookie) {
        redirect('/auth?from=/dashboard');
    }

    try {
        // 2. Verify the JWT and Custom Claims on the Server


        const isAdmin = await verifyAdminStatus(sessionCookie);
        if (!isAdmin) redirect('/unauthorized');

        // 4. Authorized: Render the UI
        return (
            <div className="flex min-h-screen bg-slate-50">
                {/* We move your sidebar UI to a separate Client Component */}
                <AdminSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        );

    } catch (error) {
        console.error("Admin verification failed:", error);
        redirect('/auth');
    }
}