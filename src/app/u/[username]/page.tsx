"use client";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/user/user.selector";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db, auth } from "@/app/utils/firebase/firebase.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, User as UserIcon, Save, X, Edit2, Share2, Check, RefreshCw, Heart, Package } from "lucide-react";

const UserProfile = () => {
    const router = useRouter();
    const params = useParams();
    const username = params?.username as string;
    const currentUser = useSelector(selectCurrentUser);

    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState<any>({});
    const [copied, setCopied] = useState(false);

    // 1. Identify if viewer is owner
    // We check both username and the underlying UID for safety
    const isOwnProfile = !!currentUser && (
        currentUser.username?.toLowerCase() === username?.toLowerCase() || 
        currentUser.uid === userData?.id
    );

    // 2. Optimized Order Fetcher
    const fetchUserOrders = useCallback(async (uid: string) => {
        if (!uid) return;
        setLoadingOrders(true);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            const response = await fetch(`/api/orders/user/${uid}`, {
                headers: { 'Authorization': `Bearer ${idToken}` }
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
    }, []);

    // 3. Robust Profile Fetcher
    const fetchProfile = useCallback(async () => {
        if (!username) return;
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const snap = await getDocs(q);

            let data = null;
            if (!snap.empty) {
                data = { ...snap.docs[0].data(), id: snap.docs[0].id };
            } else {
                // Try fetching by ID directly if username search fails
                const docRef = doc(db, "users", username);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) data = { ...docSnap.data(), id: docSnap.id };
            }

            if (data) {
                setUserData(data);
                setEditFields(data);
                // Immediately fetch orders if viewer is owner
                if (currentUser?.uid === data.id) {
                    fetchUserOrders(data.id);
                }
            }
        } catch (e) {
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    }, [username, currentUser?.uid, fetchUserOrders]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleSave = async () => {
        if (!userData?.id) return;
        const toastId = toast.loading("Saving...");
        try {
            await updateDoc(doc(db, "users", userData.id), editFields);
            setUserData({ ...editFields });
            setIsEditing(false);
            toast.success("Updated!", { id: toastId });
        } catch (e) {
            toast.error("Save failed", { id: toastId });
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!userData) return <div className="p-20 text-center">User not found.</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white">
                            <UserIcon size={40} />
                        </div>
                        <button 
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                                toast.success("Link copied");
                            }}
                            className="absolute -right-2 -top-2 p-2 bg-white shadow-md rounded-full"
                        >
                            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
                        </button>
                    </div>

                    <div>
                        {isEditing ? (
                            <Input 
                                value={editFields.displayName} 
                                onChange={e => setEditFields({...editFields, displayName: e.target.value})}
                                className="text-center font-bold text-xl"
                            />
                        ) : (
                            <h1 className="text-2xl font-bold">{userData.displayName}</h1>
                        )}
                        <p className="text-slate-500">@{userData.username}</p>
                    </div>
                </div>

                <Card className="rounded-[2rem] overflow-hidden border-none shadow-sm">
                    <CardContent className="p-0">
                        {/* Wishlist Section */}
                        <div className="p-6 border-b">
                            <div className="flex items-center gap-2 mb-4">
                                <Heart size={18} className="text-rose-500 fill-rose-500" />
                                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Wishlist</h2>
                            </div>
                            
                            {userData.wishlist?.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {userData.wishlist.map((item: any) => (
                                        <ProductCard key={item.id} product={item} compact />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">Wishlist is empty</p>
                            )}
                        </div>

                        {/* Order History (Owner Only) */}
                        {isOwnProfile && (
                            <div className="p-6 bg-slate-50/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Package size={18} className="text-blue-500" />
                                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Order History</h2>
                                    </div>
                                    <button onClick={() => fetchUserOrders(userData.id)}>
                                        <RefreshCw size={14} className={loadingOrders ? "animate-spin" : ""} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {orders.length > 0 ? orders.map(order => (
                                        <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Order ID</p>
                                                <p className="text-xs font-bold">#{order.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-blue-600">₵{order.totalAmount}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )) : !loadingOrders && (
                                        <p className="text-sm text-slate-400 text-center py-4">No orders yet</p>
                                    )}
                                    {loadingOrders && <Loader2 className="animate-spin mx-auto text-slate-300" />}
                                </div>
                            </div>
                        )}

                        {/* Edit Action */}
                        {isOwnProfile && (
                            <div className="p-4 bg-slate-900">
                                <button 
                                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                    className="w-full text-white text-sm font-bold flex items-center justify-center gap-2"
                                >
                                    {isEditing ? <><Save size={16}/> Save Changes</> : <><Edit2 size={16}/> Edit Profile</>}
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