"use client";
import { useState } from "react";
import { 
    ShieldCheck, ShieldAlert, Fingerprint, Globe, 
    Key, MousePointerClick, Search, Filter, 
    ChevronRight, Lock, Terminal, Activity,
    Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// Mock data for the audit trail
const auditLogs = [
    { id: 1, event: "Admin Login", user: "Dachel A.", ip: "102.176.1.45", status: "Success", location: "Accra, GH", time: "2 mins ago", severity: "low" },
    { id: 2, event: "API Secret Rotated", user: "System", ip: "Internal", status: "Success", location: "Cloud-Compute", time: "45 mins ago", severity: "medium" },
    { id: 3, event: "Unauthorized Access", user: "Unknown", ip: "192.168.4.12", status: "Failed", location: "Lagos, NG", time: "2 hours ago", severity: "high" },
    { id: 4, event: "Product Delete", user: "Admin_02", ip: "41.215.160.7", status: "Success", location: "Kumasi, GH", time: "3 hours ago", severity: "medium" },
    { id: 5, event: "Batch Export", user: "Dachel A.", ip: "102.176.1.45", status: "Success", location: "Accra, GH", time: "5 hours ago", severity: "low" },
];

export default function SecurityAuditPage() {
    return (
        <div className="p-6 md:p-10 bg-background min-h-screen space-y-10 font-space-grotesk">
            
            {/* Header: SOC Style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Terminal className="text-primary" size={18} />
                        <span className="caption uppercase tracking-widest text-muted-foreground font-black">Core Security Protocol</span>
                    </div>
                    <h1 className="display-medium tracking-tighter text-foreground">Security Telemetry</h1>
                    <p className="subtitle text-muted-foreground/80 mt-1">Monitoring identity footprints and automated API trails.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-6 py-3 bg-card border border-border/40 rounded-2xl caption font-bold hover:bg-muted/10 transition-all">
                        <Download size={18} /> Export Audit
                    </button>
                    <div className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-primary/20">
                        <ShieldCheck size={20} />
                        <span className="font-bold">System Secure</span>
                    </div>
                </div>
            </div>

            {/* Top Metrics: Tactical View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border border-border/20 shadow-none rounded-[2.5rem] bg-card/50 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <Fingerprint size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full uppercase">Active</span>
                    </div>
                    <p className="caption text-muted-foreground font-bold uppercase tracking-widest">Active Sessions</p>
                    <h2 className="text-4xl font-funnel font-bold mt-1 text-foreground">12</h2>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">Verified across 3 regions</p>
                </Card>

                <Card className="border border-border/20 shadow-none rounded-[2.5rem] bg-card/50 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-destructive/10 rounded-2xl text-destructive">
                            <ShieldAlert size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-destructive/10 text-destructive px-3 py-1 rounded-full uppercase">Review Needed</span>
                    </div>
                    <p className="caption text-muted-foreground font-bold uppercase tracking-widest">Failed Logins (24h)</p>
                    <h2 className="text-4xl font-funnel font-bold mt-1 text-foreground">04</h2>
                    <p className="text-xs text-destructive font-medium mt-2">Flagged from blocked IPs</p>
                </Card>

                <Card className="border border-border/20 shadow-none rounded-[2.5rem] bg-card/50 p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Activity size={24} />
                        </div>
                        <span className="text-[10px] font-black bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase">Steady</span>
                    </div>
                    <p className="caption text-muted-foreground font-bold uppercase tracking-widest">API Throughput</p>
                    <h2 className="text-4xl font-funnel font-bold mt-1 text-foreground">4.2k</h2>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">99.9% success rate</p>
                </Card>
            </div>

            {/* Main Log Table */}
            <Card className="border border-border/20 shadow-none rounded-[3.5rem] bg-card/30 overflow-hidden">
                <CardHeader className="p-8 border-b border-border/20 flex flex-row items-center justify-between bg-card/50">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-foreground text-background rounded-full flex items-center justify-center">
                            <MousePointerClick size={20} />
                        </div>
                        <div>
                            <CardTitle className="h4">Identity Access Management Logs</CardTitle>
                            <p className="caption text-muted-foreground">Immutable history of administrative actions.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search by IP or User..." 
                                className="bg-background border border-border/40 pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <button className="p-2 bg-background border border-border/40 rounded-xl hover:bg-muted/10 transition-colors">
                            <Filter size={20} className="text-muted-foreground" />
                        </button>
                    </div>
                </CardHeader>
                
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/10">
                                    <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest">Event Trace</th>
                                    <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest">Operator</th>
                                    <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Origin (IP)</th>
                                    <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest">System Status</th>
                                    <th className="px-8 py-5 caption text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/10">
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${
                                                    log.severity === 'high' ? 'bg-destructive animate-pulse' : 
                                                    log.severity === 'medium' ? 'bg-secondary' : 'bg-emerald-500'
                                                }`} />
                                                <span className="font-bold text-sm text-foreground">{log.event}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">{log.user}</span>
                                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter">Authorized</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className="inline-flex items-center gap-2 bg-muted/20 px-3 py-1 rounded-lg border border-border/10">
                                                <Globe size={12} className="text-muted-foreground" />
                                                <span className="text-xs font-mono text-muted-foreground">{log.ip}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`caption text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                                                log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'
                                            }`}>
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                                <span className="text-sm font-medium">{log.time}</span>
                                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                <div className="p-6 bg-muted/5 border-t border-border/20 text-center">
                    <button className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
                        Load Full Telemetry Archive
                    </button>
                </div>
            </Card>

            {/* Bottom: Proactive Security Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border border-border/20 shadow-none rounded-[3rem] bg-foreground text-background p-8 flex flex-col justify-between">
                    <div>
                        <Lock size={32} className="mb-4 text-secondary" />
                        <h2 className="h3 font-normal">Encryption & Access</h2>
                        <p className="caption opacity-70 mt-2">Global access keys are rotated every 90 days. Next rotation in 14 days.</p>
                    </div>
                    <div className="flex gap-4 mt-8">
                        <button className="flex-1 bg-background text-foreground py-3 rounded-2xl caption font-black uppercase tracking-widest hover:bg-secondary transition-colors">
                            Rotate Keys
                        </button>
                        <button className="flex-1 border border-background/20 py-3 rounded-2xl caption font-black uppercase tracking-widest hover:bg-background/10 transition-colors">
                            IAM Policy
                        </button>
                    </div>
                </Card>

                <Card className="border border-border/20 shadow-none rounded-[3rem] bg-card p-8 border-dashed flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                        <Key size={30} className="text-muted-foreground" />
                    </div>
                    <h2 className="h4">Two-Factor Enforcement</h2>
                    <p className="caption text-muted-foreground mt-2 max-w-[280px]">All administrative accounts currently require biometric or token-based 2FA verification.</p>
                    <Link href="/dashboard/settings" className="mt-6 text-primary caption font-black uppercase tracking-widest hover:underline">
                        Audit Settings
                    </Link>
                </Card>
            </div>
        </div>
    );
}