"use client";

import { useSelector, useDispatch } from "react-redux";
import { selectWishlistItems } from "@/store/wishlist/wishlist.selector";
import { selectCurrentUser } from "@/store/user/user.selector";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/app/utils/firebase/firebase.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Loader2, User as UserIcon, Save, X, Edit2,
    Heart, Share2, Check, Phone, MapPin, Search
} from "lucide-react";

import { clearRecentlyViewed } from "@/store/recently-viewed/recently-viewed.reducer";

const OrderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center">
                <div className="space-y-2">
                    {/* Order ID Placeholder */}
                    <div className="h-3 w-24 bg-slate-200 rounded shadow-sm" />
                    {/* Date Placeholder */}
                    <div className="h-2 w-16 bg-slate-200 rounded shadow-sm" />
                </div>
                <div className="flex flex-col items-end space-y-2">
                    {/* Amount Placeholder */}
                    <div className="h-4 w-12 bg-slate-200 rounded shadow-sm" />
                    {/* Status Placeholder */}
                    <div className="h-3 w-10 bg-slate-200 rounded-full shadow-sm" />
                </div>
            </div>
        ))}
    </div>
);

const UserProfile = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { username } = useParams();

    const wishlistRef = useRef<HTMLDivElement>(null);
    const view = searchParams.get('view');

    // 1. STATE DECLARATIONS
    const [copied, setCopied] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);
    const [editFields, setEditFields] = useState<any>({});

    // 2. REDUX SELECTORS
    const wishlistItems = useSelector(selectWishlistItems);
    const currentUser = useSelector(selectCurrentUser);
    const recentlyViewedItems = useSelector((state: any) => {
        try {
            return state.recentlyViewed?.items || [];
        } catch (e) {
            return [];
        }
    });

    // 3. DERIVED LOGIC (Must be declared before UseEffects)
    const isOwnProfile = currentUser && currentUser.username === username;

    // 4. USE EFFECTS
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Fetch Order History
    useEffect(() => {
    const fetchUserOrders = async () => {
        // Import auth to get the current Firebase user directly
        const { auth } = await import("@/app/utils/firebase/firebase.utils");
        const firebaseUser = auth.currentUser;

        // Check if profile belongs to the logged-in user
        if (!isOwnProfile || !firebaseUser?.uid) return;
        
        setLoadingOrders(true);
        try {
            const token = await firebaseUser.getIdToken();

            const response = await fetch(`/api/orders/user/${firebaseUser.uid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Order fetch failed:", error);
        } finally {
            setLoadingOrders(false);
        }
    };

    if (isHydrated && isOwnProfile) {
        fetchUserOrders();
    }
}, [isOwnProfile, isHydrated]); // Added specific uid to dependencies

    // Fetch Profile Data
    useEffect(() => {
        const fetchUserData = async () => {
            if (!username || typeof username !== "string") return;
            setLoading(true);
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("username", "==", username));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    const docId = querySnapshot.docs[0].id;
                    setUserData({ ...data, id: docId });
                    setEditFields(data);
                }
            } catch (error) {
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [username]);

    // Scroll to Wishlist effect
    useEffect(() => {
        if (!loading && view === 'wishlist' && wishlistRef.current) {
            const timer = setTimeout(() => {
                wishlistRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [view, loading]);

    // 5. HANDLERS
    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
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

    const handleClearHistory = () => {
        dispatch(clearRecentlyViewed());
        toast.success("Browsing history cleared");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
        </div>
    );

    if (!userData) return <div className="min-h-screen flex items-center justify-center">User not found.</div>;

    return (
        <div className="min-h-screen bg-slate-100/80 p-4 flex items-center justify-center font-sans antialiased">
            <div className="w-full max-w-xl relative">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-8 text-center relative">
                    <button
                        onClick={handleShare}
                        className="absolute right-0 top-0 p-3 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                    >
                        {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} className="text-slate-600" />}
                    </button>
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-xl">
                        <UserIcon className="h-12 w-12 text-white" />
                    </div>
                    {isEditing ? (
                        <Input
                            value={editFields.displayName}
                            onChange={(e) => setEditFields({ ...editFields, displayName: e.target.value })}
                            className="text-center text-2xl font-bold bg-white border-slate-200 h-12 w-64 mx-auto mb-2"
                        />
                    ) : (
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{userData.displayName}</h1>
                    )}
                    <p className="text-slate-500 font-medium">@{userData.username}</p>
                </div>

                <Card className="border-none shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardContent className="p-0">
                        {/* Status Bar */}
                        <div className="w-full bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Profile Details</span>
                            {isEditing && (
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Fashion Preferences */}
                        <div className="p-8 md:p-10 space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Fashion Preferences</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Size</p>
                                        {isEditing ? (
                                            <select
                                                value={editFields.clothingSize}
                                                onChange={(e) => setEditFields({ ...editFields, clothingSize: e.target.value })}
                                                className="w-full bg-transparent font-bold text-slate-900 outline-none"
                                            >
                                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        ) : (
                                            <p className="font-bold text-slate-900">{userData.clothingSize || 'Not Set'}</p>
                                        )}
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Style</p>
                                        {isEditing ? (
                                            <Input
                                                value={editFields.stylePreference}
                                                onChange={(e) => setEditFields({ ...editFields, stylePreference: e.target.value })}
                                                className="h-6 p-0 border-none bg-transparent font-bold text-slate-900 shadow-none focus-visible:ring-0"
                                            />
                                        ) : (
                                            <p className="font-bold text-slate-900">{userData.stylePreference || 'Casual'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

{/* ORDER HISTORY SECTION */}
{isOwnProfile && isHydrated && (
    <div className="p-8 md:p-10 border-t border-slate-100 bg-white">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">
            Order History
        </h2>
        
        {loadingOrders ? (
            /* Using the Skeleton instead of the Loader2 spinner */
            <OrderSkeleton /> 
        ) : orders.length > 0 ? (
            <div className="space-y-4">
                {orders.map((order) => (
                    <div 
                        key={order.id} 
                        className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center transition-all hover:bg-slate-100 hover:shadow-sm"
                    >
                        <div>
                            <p className="text-xs font-black uppercase italic tracking-tighter text-slate-900">
                                Order #{order.orderReference?.slice(-6) || "N/A"}
                            </p>
                            <p className="text-[10px] text-slate-500">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-blue-600">
                                ₵{order.totalAmount?.toFixed(2) || "0.00"}
                            </p>
                            <span className="text-[9px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase">
                                {order.paymentStatus || "Paid"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 italic font-medium">No orders found yet.</p>
            </div>
        )}
    </div>
)}

                        {/* Recently Viewed */}
                        {isHydrated && recentlyViewedItems.length > 0 && (
                            <div className="p-8 md:p-10 border-t border-slate-100 bg-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Recently Viewed</h2>
                                    {isOwnProfile && (
                                        <button onClick={handleClearHistory} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100">
                                            <X size={12} className="text-slate-400" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {recentlyViewedItems.map((product: any) => (
                                        <div key={`recent-${product.id}`} className="min-w-[140px] w-[140px] flex-shrink-0">
                                            <ProductCard product={product} compact={true} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Action */}
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