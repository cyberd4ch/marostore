"use client";

import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/user/user.selector";
import { selectWishlistItems } from "@/store/wishlist/wishlist.selector";
import ProductCard from "@/components/ProductCard";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { db, auth, storage } from "@/lib/utils/firebase/firebase.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
    Loader2, User as UserIcon, Save, Edit2,
    Share2, Check, RefreshCw, Heart, Package, LogOut, Camera
} from "lucide-react";

// 1. Preset Avatars
const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sugar",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
];

const UserProfile = () => {
    const params = useParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const username = params?.username as string;

    const currentUser = useSelector(selectCurrentUser);
    const reduxWishlist = useSelector(selectWishlistItems);

    const [userData, setUserData] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState<any>({});
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const isOwnProfile = !!currentUser && !!username &&
        currentUser.username?.toLowerCase() === username.toLowerCase();

    // 2. Avatar Selection Handler (Presets)
    const selectAvatar = async (url: string) => {
        if (!userData?.id) return;
        try {
            await updateDoc(doc(db, "users", userData.id), { photoURL: url });
            setUserData((prev: any) => ({ ...prev, photoURL: url }));
            setEditFields((prev: any) => ({ ...prev, photoURL: url }));
            toast.success("Avatar updated!");
        } catch (error) {
            toast.error("Failed to update avatar");
        }
    };

    // 3. Custom Image Upload Handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userData?.id) return;
        if (!file.type.startsWith('image/')) {
            toast.error("Please upload an image file");
            return;
        }

        setIsUploading(true);
        const storageRef = ref(storage, `avatars/${userData.id}`);
        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            await updateDoc(doc(db, "users", userData.id), { photoURL: downloadURL });
            setUserData((prev: any) => ({ ...prev, photoURL: downloadURL }));
            setEditFields((prev: any) => ({ ...prev, photoURL: downloadURL }));
            toast.success("Photo updated!");
        } catch (error) {
            toast.error("Upload failed");
        } finally { setIsUploading(false); }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out");
            router.push("/auth/signin");
        } catch (error) { toast.error("Error signing out"); }
    };

    const fetchUserOrders = useCallback(async (uid: string) => {
        if (!isOwnProfile) return;
        setLoadingOrders(true);
        try {
            const idToken = await auth.currentUser?.getIdToken(true);
            const response = await fetch(`/api/orders/user/${uid}`, {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            const data = await response.json();
            if (data.success) setOrders(data.orders);
        } catch (error) { console.error(error); } finally { setLoadingOrders(false); }
    }, [isOwnProfile]);

    const syncWishlistToFirestore = useCallback(async (currentId: string, currentWishlist: any[]) => {
        if (isOwnProfile && reduxWishlist.length > 0 && (!currentWishlist || currentWishlist.length === 0) && !isSyncing) {
            setIsSyncing(true);
            try {
                const userDocRef = doc(db, "users", currentId);
                await updateDoc(userDocRef, { wishlist: reduxWishlist });
                setUserData((prev: any) => ({ ...prev, wishlist: reduxWishlist }));
            } catch (error) { console.error(error); } finally { setIsSyncing(false); }
        }
    }, [isOwnProfile, reduxWishlist, isSyncing]);

    const fetchProfileData = useCallback(async () => {
        if (!username) return;
        setLoading(true);
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const snap = await getDocs(q);

            let profileData: any = null;
            if (!snap.empty) {
                profileData = { ...snap.docs[0].data(), id: snap.docs[0].id };
            } else {
                const docRef = doc(db, "users", username);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) profileData = { ...docSnap.data(), id: docSnap.id };
            }

            if (profileData) {
                setUserData(profileData);
                setEditFields(profileData);
                if (isOwnProfile || currentUser?.uid === profileData.id) {
                    fetchUserOrders(profileData.id);
                }
                syncWishlistToFirestore(profileData.id, profileData.wishlist || []);
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [username, isOwnProfile, currentUser?.uid, fetchUserOrders, syncWishlistToFirestore]);

    useEffect(() => { fetchProfileData(); }, [fetchProfileData]);

    const handleSave = async () => {
        if (!userData?.id) return;
        setIsSaving(true);
        try {
            const { displayName, bio } = editFields;
            await updateDoc(doc(db, "users", userData.id), { displayName, bio: bio || "" });
            setUserData({ ...userData, displayName, bio });
            setIsEditing(false);
            toast.success("Profile updated");
        } catch (e) { toast.error("Save failed"); } finally { setIsSaving(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-slate-400" /></div>;
    if (!userData) return <div className="min-h-screen flex items-center justify-center">User not found</div>;

    return (
        <div className="min-h-screen bg-slate-100/80 p-4 flex items-center justify-center antialiased">
            <div className="w-full max-w-xl">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-8 text-center relative">
                    <div className="absolute right-0 top-0 flex gap-2">
                        {isOwnProfile && (
                            <button onClick={handleLogout} className="p-3 bg-white rounded-full shadow-sm hover:bg-red-50 text-slate-600 hover:text-red-600 transition-all">
                                <LogOut size={18} />
                            </button>
                        )}
                        <button onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                            toast.success("Link copied!");
                        }} className="p-3 bg-white rounded-full shadow-sm hover:bg-slate-50 transition-all text-slate-600">
                            {copied ? <Check size={18} className="text-green-500" /> : <Share2 size={18} />}
                        </button>
                    </div>

                    {/* Profile Image Logic */}
                    <div className="relative group">
                        <div
                            className={`w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-xl overflow-hidden border-4 border-white ${isOwnProfile ? 'cursor-pointer' : ''}`}
                            onClick={() => isOwnProfile && fileInputRef.current?.click()}
                        >
                            {isUploading ? <Loader2 className="h-8 w-8 text-white animate-spin" /> :
                                userData.photoURL ? <Image src={userData.photoURL} alt="Avatar" width={96} height={96} className="object-cover w-full h-full" /> :
                                    <UserIcon className="h-12 w-12 text-white" />}

                            {isOwnProfile && !isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white h-6 w-6" />
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </div>

                    {/* Avatar Preset Grid - Only visible when editing */}
                    {isEditing && (
                        <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Or choose an avatar</p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                {PRESET_AVATARS.map((url) => (
                                    <button
                                        key={url}
                                        onClick={() => selectAvatar(url)}
                                        className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${userData.photoURL === url ? 'border-black scale-110 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={url} alt="preset" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <div className="w-full max-w-xs space-y-2">
                            <Input value={editFields.displayName} onChange={(e) => setEditFields({ ...editFields, displayName: e.target.value })} className="text-center text-xl font-bold bg-white" placeholder="Name" />
                            <Textarea value={editFields.bio} onChange={(e) => setEditFields({ ...editFields, bio: e.target.value })} className="text-center text-sm bg-white resize-none" placeholder="Write a short bio..." />
                        </div>
                    ) : (
                        <>
                            <h1 className="text-3xl font-extrabold text-slate-900">{userData.displayName}</h1>
                            <p className="text-slate-500 text-sm mb-2">@{userData.username}</p>
                            <p className="text-slate-600 text-sm max-w-xs italic">{userData.bio || "No bio yet."}</p>
                        </>
                    )}
                </div>

                <Card className="rounded-[2.5rem] bg-[#F3F0E6] overflow-hidden shadow-xl border-none">
                    <CardContent className="p-0">
                        {/* Wishlist Section */}
                        <div className="p-8 border-b border-slate-200/50">
                            <div className="flex items-center gap-2 mb-6">
                                <Heart size={16} className="text-rose-500 fill-rose-500" />
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Wishlist</h2>
                            </div>
                            {userData?.wishlist && userData.wishlist.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {userData.wishlist.map((product: any) => (
                                        <ProductCard key={product.id} product={product} compact={true} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10"><p className="text-sm text-slate-400 italic">Wishlist is empty</p></div>
                            )}
                        </div>

                        {/* Orders Section */}
                        {isOwnProfile && (
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Package size={16} className="text-blue-500" />
                                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order History</h2>
                                    </div>
                                    <RefreshCw size={14} className={`cursor-pointer text-slate-400 ${loadingOrders ? 'animate-spin' : ''}`} onClick={() => fetchUserOrders(userData.id)} />
                                </div>
                                {loadingOrders ? (
                                    <div className="flex justify-center py-4"><Loader2 className="animate-spin text-slate-300" /></div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-3">
                                        {orders.map(order => (
                                            <div key={order.id} className="p-4 bg-white/50 rounded-xl flex justify-between items-center shadow-sm">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-900">ORD-{order.id.slice(-5).toUpperCase()}</p>
                                                    <p className="text-[9px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <p className="font-bold text-blue-600 text-sm">₵{order.totalAmount}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : <p className="text-center text-sm text-slate-400 italic py-6">No orders yet</p>}
                            </div>
                        )}

                        {/* Edit/Save Footer */}
                        {isOwnProfile && (
                            <div className="p-4 bg-[#0F172A]">
                                <button
                                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                                    disabled={isSaving}
                                    className="w-full text-white font-bold flex items-center justify-center gap-2 py-2 active:scale-95 transition-all"
                                >
                                    {isSaving ? <Loader2 className="animate-spin size={16}" /> : isEditing ? <Save size={16} /> : <Edit2 size={16} />}
                                    {isEditing ? "Save Changes" : "Edit Profile"}
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