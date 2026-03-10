import { JSX, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, getUserDocument } from '../../lib/utils/firebase/firebase.utils'; 
import { onAuthStateChanged } from 'firebase/auth';

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getUserDocument(user.uid);
                    if (userDoc && userDoc.isAdmin) {
                        setIsAdmin(true);
                    } else {
                        // User is logged in but NOT an admin
                        navigate('/'); 
                    }
                } catch (error) {
                    console.error("Failed to verify admin status", error);
                    navigate('/');
                }
            } else {
                // No user logged in at all
                navigate('/auth'); 
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (isLoading) {
        return <div>Loading Dashboard...</div>; // Replace with a nice Spinner
    }

    return isAdmin ? children : null;
};

export default ProtectedAdminRoute;