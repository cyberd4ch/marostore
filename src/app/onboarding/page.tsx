"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/utils/firebase/firebase.utils";
import { selectCurrentUser } from "@/store/user/user.selector";
import { checkUserSession } from "@/store/user/user.action";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
    Loader2, User, Phone, MapPin,
    CheckCircle2, Circle, ArrowRight, ArrowLeft, Shirt, Bell, Instagram
} from "lucide-react";

const OnboardingForm = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formFields, setFormFields] = useState({
        displayName: "",
        phoneNumber: "",
        address: "",
        city: "",
        postCode: "",
        clothingSize: "M",
        stylePreference: "Casual"
    });
    useEffect(() => {
        // Only run this check once Redux has finished loading
        if (isRehydrated && currentUser) {
            const user = currentUser as any;

            // 1. Check if they have already onboarded
            if (user.onboardingCompleted && user.username) {
                toast.info("Welcome back! Redirecting to your profile...");
                router.replace(`/u/${user.username}`); // Use replace so they can't hit 'back' to return to onboarding
                return; // Stop execution here
            }

            // 2. If not onboarded, populate the form with whatever info we DO have
            setFormFields(prev => ({
                ...prev,
                displayName: prev.displayName || user.displayName || "",
                phoneNumber: prev.phoneNumber || user.phoneNumber || "",
                address: prev.address || user.address || "",
                city: prev.city || user.city || "",
                postCode: prev.postCode || user.postCode || ""
            }));
        }
    }, [currentUser, isRehydrated, router]);

    const { displayName, phoneNumber, address, city, postCode } = formFields;

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    // --- LOGIC HELPERS ---
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const isStepValid = () => {
        switch (step) {
            case 1:
                return displayName.trim().length > 2 && phoneNumber.trim().length > 8;
            case 2:
                return address.trim().length > 5 && city.trim().length > 2;
            default:
                return true;
        }
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isStepValid()) {
            nextStep();
        } else {
            toast.error("Please fill in all required fields correctly.");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const activeUid = (currentUser as any)?.uid || auth.currentUser?.uid;

        if (!activeUid) {
            toast.error("Session expired.");
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading("Creating your fashion profile...");

        try {
            const userDocRef = doc(db, "users", activeUid);
            const username = formFields.displayName.toLowerCase().trim().replace(/\s+/g, '-');

            // --- USERNAME AVAILABILITY CHECK ---
            const { collection, query, where, getDocs } = await import("firebase/firestore");
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("username", "==", username));
            const querySnapshot = await getDocs(q);

            let finalUsername = username;
            if (!querySnapshot.empty) {
                finalUsername = `${username}-${activeUid.substring(0, 5)}`;
            }

            // --- UPDATE FIREBASE ---
            await updateDoc(userDocRef, {
                ...formFields,
                username: finalUsername,
                onboardingCompleted: true,
                updatedAt: new Date(),
            });

            // 1. Set cookie for middleware/server-side checks
            document.cookie = "onboardingCompleted=true; path=/; max-age=31536000";

            // 2. Refresh Redux Session
            dispatch(checkUserSession());

            toast.success("Welcome to MaroStore!", { id: loadingToast });

            // 3. HARD REFRESH REDIRECT
            // This ensures the Guard and Redux state are fully reset with the new DB data
            window.location.href = `/u/${finalUsername}`;

        } catch (error) {
            console.error(error);
            toast.error("Save failed.", { id: loadingToast });
            setIsLoading(false);
        }
    };

    if (!isRehydrated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const progressValue = (step / 3) * 100;
    const displayFirstName = displayName ? displayName.split(' ')[0] : "";

    return (
        <div className="min-h-screen bg-slate-100/80 p-4 flex items-center justify-center font-sans antialiased">
            <div className="w-full max-w-xl">

                {/* Header Section */}
                <div className="flex flex-row items-center justify-between w-full px-4 mb-6">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                            {displayFirstName ? `Welcome, ${displayFirstName}!` : "Welcome!"}
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base">Let's get your account set up</p>
                    </div>

                    <div className="shrink-0 ml-4">
                        <div className="bg-white px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-700 shadow-sm border border-slate-200 whitespace-nowrap uppercase tracking-wider">
                            {Math.round(progressValue)}% Done
                        </div>
                    </div>
                </div>

                {/* Unified Floating Card */}
                <Card className="border-none shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardContent className="p-0">

                        {/* Progress Header */}
                        <div className="w-full bg-slate-50/50 px-8 pt-8 pb-6 border-b border-slate-100">
                            <Progress value={progressValue} className="h-1.5 bg-slate-200 rounded-full" />
                            <div className="flex justify-between mt-4 px-1">
                                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${step >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Profile</span>
                                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${step >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Shipping</span>
                                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${step >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Finalize</span>
                            </div>
                        </div>

                        {/* Form Content Area */}
                        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">

                            {/* STEP 1 */}
                            {step === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md"><User className="h-4 w-4 text-slate-600" /></div>
                                            Personal Details
                                        </h2>
                                        <p className="text-sm text-slate-400">Basic information for your profile</p>
                                    </div>
                                    <div className="grid gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
                                            <Input name="displayName" value={displayName} onChange={handleChange} placeholder="John Doe" className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-base" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Phone Number</Label>
                                            <Input name="phoneNumber" value={phoneNumber} onChange={handleChange} placeholder="024 XXX XXXX" className="h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-slate-200 transition-all text-base" required />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2 */}
                            {step === 2 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md"><MapPin className="h-4 w-4 text-slate-600" /></div>
                                            Shipping Address
                                        </h2>
                                        <p className="text-sm text-slate-400">Where we'll send your orders</p>
                                    </div>
                                    <div className="grid gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Street Address</Label>
                                            <Input name="address" value={address} onChange={handleChange} placeholder="Street Address" className="h-12 rounded-xl bg-slate-50 border-transparent transition-all" required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">City</Label>
                                                <Input name="city" value={city} onChange={handleChange} placeholder="City" className="h-12 rounded-xl bg-slate-50 border-transparent transition-all" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="postCode" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Post Code</Label>
                                                <Input name="postCode" value={postCode} onChange={handleChange} placeholder="Post Code" className="h-12 rounded-xl bg-slate-50 border-transparent transition-all" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3 */}
                            {step === 3 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                            <div className="p-1.5 bg-slate-100 rounded-md"><Shirt className="h-4 w-4 text-slate-600" /></div>
                                            Preferences
                                        </h2>
                                        <p className="text-sm text-slate-400">Tailor your shopping experience</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center p-4 bg-slate-900 rounded-2xl text-white shadow-md shadow-slate-900/10">
                                            <div className="flex items-center gap-3">
                                                <Bell className="h-5 w-5 opacity-80" />
                                                <span className="font-semibold text-sm tracking-tight">Order Notifications</span>
                                            </div>
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Instagram className="h-5 w-5 opacity-60" />
                                                <span className="font-semibold text-sm tracking-tight">Instagram Sync</span>
                                            </div>
                                            <Circle className="h-5 w-5" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex gap-3 pt-4 items-center">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={prevStep}
                                        className="h-12 px-6 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                                    >
                                        Back
                                    </Button>
                                )}

                                {step < 3 ? (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                        className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
                                    >
                                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 h-12 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Complete Setup"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OnboardingForm;