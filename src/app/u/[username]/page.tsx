"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "@/store/user/user.selector";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/app/utils/firebase/firebase.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Loader2, User as UserIcon, Save, X, Edit2,
    Share2, Check, RefreshCw, Heart
} from "lucide-react";

import { clearRecentlyViewed } from "@/store/recently-viewed/recently-viewed.reducer";

const OrderSkeleton = () => (
    <div className="space-y-4 animate-pulse p-4">
        {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-xl" />
        ))}
    </div>
);

const UserProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const params = useParams();
    const username = params?.username as string;

    const [copied, setCopied] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [editFields, setEditFields] = useState<any>({});

    const currentUser = useSelector(selectCurrentUser);
    const recentlyViewedItems = useSelector((state: any) => state.recentlyViewed?.items || []);

    // FIX 1: Robust Case-Insensitive Owner Check
    const isOwnProfile = !!currentUser && !!username && 
        currentUser.username?.toLowerCase() === username.toLowerCase();

    // 1. FETCH ORDERS (Owner Only)
    const fetchUserOrders = useCallback(async (uid: string) => {
        if (!isOwnProfile) return;
        
        setLoadingOrders(true);
        try {
            const { auth } = await import("@/app/utils/firebase/firebase.utils");
            const token = await auth.currentUser?.getIdToken();
            
            const response = await fetch(`/api/orders/user/${uid}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Cache-Control': 'no-cache'
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Orders error:", error);
        } finally {
            setLoadingOrders(false);
        }
    }, [isOwnProfile]);

    // 2. FETCH PROFILE DATA
    const fetchProfileData = useCallback(async () => {
        if (!username) return;
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            let profileData = null;

            if (!querySnapshot.empty) {
                const docSnap = querySnapshot.docs[0];
                profileData = { ...docSnap.data(), id: docSnap.id };
            } else {
                // Fallback to UID direct doc search
                const docRef = doc(db, "users", username);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) profileData = { ...docSnap.data(), id: docSnap.id };
            }

            if (profileData) {
                setUserData(profileData);
                setEditFields(profileData);
                
                // If this is the logged-in user's profile, trigger order fetch
                if (isOwnProfile || currentUser?.uid === profileData.id) {
                    fetchUserOrders(profileData.id);
                }
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error("Load error:", error);
            toast.error("Error loading profile");
        } finally {
            setLoading(false);
        }
    }, [username, isOwnProfile, currentUser?.uid, fetchUserOrders]);

    // 3. LIFECYCLE
    useEffect(() => {
        setIsHydrated(true);
        fetchProfileData();
    }, [fetchProfileData]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Profile link copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        if (!userData?.id) return;
        setIsSaving(true);
        const loadingToast = toast.loading("Saving changes...");
        try {
            const userDocRef = doc(db, "users", userData.id);
            await updateDoc(userDocRef, editFields);
            setUserData({ ...editFields, id: userData.id });
            setIsEditing(false);
            toast.success("Profile updated!", { id: loadingToast });
        } catch (error) {
            toast.error("Update failed.", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        </div>
    );

    if (!userData) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">User Not Found</h2>
            <p className="text-slate-500 mb-6">The profile you are looking for doesn't exist.</p>
            <button onClick={() => router.push('/')} className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold">Go Home</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100/80 p-4 flex items-center justify-center font-sans antialiased">
            <div className="w-full max-w-xl relative">
                {/* Header */}
                <div className="flex flex-col items-center mb-8 text-center relative">
                    <button onClick={handleShare} className="absolute right-0 top-0 p-3 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95">
                        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} className="text-slate-600" />}
                    </button>
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
                        <UserIcon className="h-12 w-12 text-white" />
                    </div>
                    {isEditing ? (
                        <Input value={editFields.displayName} onChange={(e) => setEditFields({ ...editFields, displayName: e.target.value })} className="text-center text-2xl font-bold bg-white border-slate-200 h-12 w-64 mx-auto mb-2" />
                    ) : (
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{userData.displayName}</h1>
                    )}
                    <p className="text-slate-500 font-medium">@{userData.username}</p>
                </div>

                <Card className="border-none shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardContent className="p-0">
                        {/* Tab-like header */}
                        <div className="w-full bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Activity & Preferences</span>
                            {isEditing && <button onClick={() => setIsEditing(false)}><X size={18} className="text-slate-400" /></button>}
                        </div>

                        {/* Liked Items (Reads from profile owner's data) */}
                        <div className="p-8 border-b border-slate-100">
                            <div className="flex items-center gap-2 mb-6">
                                <Heart size={16} className="text-rose-500 fill-rose-500" />
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Wishlist</h2>
                            </div>
                            
                            {userData.wishlist && userData.wishlist.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {userData.wishlist.map((product: any) => (
                                        <ProductCard key={product.id} product={product} compact={true} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-xs text-slate-400 italic font-medium">No liked items to show.</p>
                                </div>
                            )}
                        </div>

                        {/* Order History (Owner Only) */}
                        {isOwnProfile && isHydrated && (
                            <div className="p-8 bg-slate-50/50 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order History</h2>
                                    <button onClick={() => fetchUserOrders(userData.id)} disabled={loadingOrders}>
                                        <RefreshCw size={14} className={`text-slate-400 ${loadingOrders ? 'animate-spin' : ''}`} />
                                    </button>
                                </div>

                                {loadingOrders ? <OrderSkeleton /> : orders.length > 0 ? (
                                    <div className="space-y-3">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-4 bg-white rounded-2xl flex justify-between items-center shadow-sm">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-tighter text-slate-900">ORD-{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-[9px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="text-sm font-black text-blue-600">₵{order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-xs text-slate-400 italic">No previous orders.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Bar */}
                        {isOwnProfile && (
                            <div className="p-6 bg-slate-900">
                                <button 
                                    onClick={isEditing ? handleSave : () => setIsEditing(true)} 
                                    disabled={isSaving}
                                    className="flex items-center justify-center gap-2 w-full text-white text-sm font-bold active:scale-95 transition-all"
                                >
                                    {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : isEditing ? <><Save size={16} /> Save Changes</> : <><Edit2 size={16} /> Edit Profile</>}
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;