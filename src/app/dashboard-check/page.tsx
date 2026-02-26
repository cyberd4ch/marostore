import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardCheck() {
    const sessionCookie = (await cookies()).get('__session')?.value;

    if (!sessionCookie) redirect('/login');

    try {
        const decodedToken = await auth().verifyIdToken(sessionCookie);

        if (decodedToken.admin === true) {
            redirect('/admin/dashboard');
        } else {
            redirect('/user/dashboard');
        }
    } catch (e) {
        redirect('/unauthorized');
    }
}