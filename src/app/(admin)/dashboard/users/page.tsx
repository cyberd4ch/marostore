'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch"; // Ensure you have this shadcn component
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react';

import { auth } from '@/lib/utils/firebase/firebase.utils';

interface User {
    uid: string;
    displayName: string | null;
    email: string;
    isAdmin: boolean;
}

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

 const fetchUsers = async () => {
    try {
        setLoading(true);
        
        // 1. Get the current user's token
        const user = auth.currentUser;
        if (!user) {
            toast.error("You must be logged in");
            return;
        }
        const token = await user.getIdToken();

        // 2. Pass that token in the Authorization header
        const res = await fetch('/api/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        
        if (res.ok && Array.isArray(data)) {
            setUsers(data);
        } else {
            toast.error(data.error || "Access Denied");
        }
    } catch (error) {
        toast.error("Failed to load users");
    } finally {
        setLoading(false);
    }
};

    const toggleAdmin = async (uid: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/admin/users/', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, isAdmin: !currentStatus }),
            });

            if (res.ok) {
                setUsers(prev => prev.map(u => u.uid === uid ? { ...u, isAdmin: !currentStatus } : u));
                toast.success("Permissions updated");
            }
        } catch (error) {
            toast.error("Failed to update user");
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    return (
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-4xl font-black tracking-tighter">TEAM ACCESS</h1>

            <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
                <CardHeader>
                    <CardTitle>Registered Users ({users.length})</CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Admin Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                        ) : users.map((user) => (
                            <TableRow key={user.uid}>
                                <TableCell className="font-medium">{user.displayName || 'Anonymous'}</TableCell>
                                <TableCell className="text-slate-500">{user.email}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={user.isAdmin}
                                            onCheckedChange={() => toggleAdmin(user.uid, !!user.isAdmin)}
                                        />
                                        {user.isAdmin ?
                                            <ShieldCheck className="text-green-600" size={18} /> :
                                            <ShieldAlert className="text-slate-300" size={18} />
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}