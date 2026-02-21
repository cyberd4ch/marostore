"use client";

import { useSelector } from "react-redux";
import { selectWishlistItems } from "@/app/store/wishlist/wishlist.selector";
import { selectCurrentUser } from "@/app/store/user/user.selector"; // Added this
import ProductCard from "@/components/product-card/product-card.component";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/app/utils/firebase/firebase.utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, User as UserIcon, Save, X, Edit2, Heart, Share2, Check } from "lucide-react";

const UserProfile = () => {
    const router = useRouter();
    const { username } = useParams();
    const [copied, setCopied] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Redux Data
    const wishlistItems = useSelector(selectWishlistItems);
    const currentUser = useSelector(selectCurrentUser);

    // Permission Check: Is this MY profile?
    const isOwnProfile = currentUser && currentUser.username === username;

    const [editFields, setEditFields] = useState<any>({});

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
                    {/* Share Button (Always Visible) */}
                    <button
                        onClick={handleShare}
                        className="absolute right-0 top-0 p-3 bg-white rounded-full shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-90"
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

                        {/* --- PREFERENCES SECTION --- */}
                        <div className="p-8 md:p-10 space-y-8">
                            {/* Lifestyle Section */}
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

                            {/* Shipping Section */}
                            <div className="space-y-4">
                                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shipping Details</h2>
                                <div className="space-y-3">
                                    <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Address & City</p>
                                        {isEditing ? (
                                            <div className="space-y-2">
                                                <Input value={editFields.address} onChange={(e) => setEditFields({ ...editFields, address: e.target.value })} placeholder="Address" className="h-8 text-sm" />
                                                <Input value={editFields.city} onChange={(e) => setEditFields({ ...editFields, city: e.target.value })} placeholder="City" className="h-8 text-sm" />
                                            </div>
                                        ) : (
                                            <p className="font-semibold text-slate-900">
                                                {userData.address ? `${userData.address}, ${userData.city}` : 'No address saved'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- WISHLIST SECTION (The one you wanted to keep) --- */}
                        <div className="p-8 md:p-10 border-t border-slate-100 bg-slate-50/30">
                            <div className="flex items-center justify-between mb-6">
                                <div className="space-y-1">
                                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Wishlist</h2>
                                    <p className="text-xs text-slate-500">{wishlistItems.length} items saved</p>
                                </div>
                                <Heart className={wishlistItems.length > 0 ? "fill-red-500 text-red-500" : "text-slate-300"} size={18} />
                            </div>

                            {wishlistItems.length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {wishlistItems.slice(0, 4).map((product: any) => (
                                        <div key={product.id} className="scale-95 origin-top">
                                            {/* compact prop passed here */}
                                            <ProductCard product={product} compact={true} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-[2rem]">
                                    <p className="text-sm text-slate-400">No items in wishlist yet.</p>
                                </div>
                            )}

                            {wishlistItems.length > 4 && (
                                <button
                                    onClick={() => router.push('/wishlist')}
                                    className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors"
                                >
                                    View All {wishlistItems.length} Items
                                </button>
                            )}
                        </div>

                        {/* Footer Action - Only visible to the owner */}
                        {isOwnProfile && (
                            <div className="p-6 bg-slate-900">
                                {isEditing ? (
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="flex items-center justify-center gap-2 w-full text-white text-sm font-bold active:scale-95 transition-all"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save size={16} /> Save Preferences</>}
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center justify-center gap-2 w-full text-white text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                                    >
                                        <Edit2 size={16} /> Edit Shopping Preferences
                                    </button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;