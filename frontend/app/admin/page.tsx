"use client";

import React, { useEffect, useState } from "react";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { mockSupabase, RiskEvent } from "@/lib/mockSupabase";
import { ShieldAlert, Users, LineChart, Cpu, BarChart3, Lock } from "lucide-react";

export default function AdminDashboardPage() {
    const { t, dir } = useBilingual();
    const [stats, setStats] = useState<any>(null);
    const [risks, setRisks] = useState<RiskEvent[]>([]);

    useEffect(() => {
        setStats(mockSupabase.getAdminStats());
        setRisks(mockSupabase.getRiskEvents());
    }, []);

    // Generate seed counts for demo visualization if no local records exist
    const displayStats = stats && stats.totalUsersCount > 0 ? stats : {
        totalUsersCount: 148,
        checkinsCount: 1240,
        journalsCount: 980,
        highRiskFlagsCount: 6,
        primaryLanguageSplit: "ar_eg",
        focusArea: "substances",
        stage: "new_recovery"
    };

    const displayRisks = risks.length > 0 ? risks : [
        { id: "1", triggerType: "self_harm_ideation", details: "Suicidal distress keywords identified in secure journal.", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: "2", triggerType: "high_craving_escalation", details: "Urge level spike logged at 9/10 rate.", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: "3", triggerType: "medical_detox_warning", details: "Severe physical alcohol withdrawal symptoms flagged.", createdAt: new Date(Date.now() - 3600000 * 12).toISOString() },
    ];

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#3F9F81]/[0.01] rounded-full blur-[140px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-5xl mx-auto px-6 py-10 z-10 w-full">
                    {/* Privacy Assurance Header */}
                    <div className="p-3 bg-red-950/20 border border-red-500/10 text-red-300 rounded-lg text-xs leading-relaxed mb-8 flex items-center gap-2.5 animate-fade-in-up">
                        <Lock className="h-4 w-4 text-red-400 shrink-0" />
                        <span>
                            {dir === "rtl" 
                            ? "تأمين السرية المطلقة: محتويات اليوميات أو المحادثات الخاصة مخفية تماماً. تعرض لوحة التحكم مؤشرات مجهولة الهوية فقط للامتثال والحوكمة." 
                            : "Governance Shield: Raw journal logs and conversations are completely obscured. The metrics panel displays anonymous aggregate metadata only."}
                        </span>
                    </div>

                    <header className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <BarChart3 className="h-3.5 w-3.5 text-[#3F9F81]" />
                            {dir === "rtl" ? "حوكمة العمليات والبيانات" : "System analytics hub"}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.adminTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.adminSub}
                        </p>
                    </header>

                    {/* Aggregate Stats Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
                        <Card className="glass-panel border-white/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Anonymous Profiles</p>
                                    <h3 className="text-2xl font-black text-white mt-1">{displayStats.totalUsersCount}</h3>
                                </div>
                                <Users className="h-4 w-4 text-[#3F9F81] opacity-75" />
                            </div>
                        </Card>

                        <Card className="glass-panel border-white/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Total Check-ins Logged</p>
                                    <h3 className="text-2xl font-black text-white mt-1">{displayStats.checkinsCount}</h3>
                                </div>
                                <LineChart className="h-4 w-4 text-[#3F9F81] opacity-75" />
                            </div>
                        </Card>

                        <Card className="glass-panel border-white/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Encrypted Journals</p>
                                    <h3 className="text-2xl font-black text-white mt-1">{displayStats.journalsCount || displayStats.checkinsCount * 0.8}</h3>
                                </div>
                                <Lock className="h-4 w-4 text-[#3F9F81] opacity-75" />
                            </div>
                        </Card>

                        <Card className="glass-panel border-red-500/20 bg-red-950/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-red-400">High-Risk Flags Raised</p>
                                    <h3 className="text-2xl font-black text-red-200 mt-1">{displayStats.highRiskFlagsCount}</h3>
                                </div>
                                <ShieldAlert className="h-4 w-4 text-red-400 opacity-75 animate-pulse" />
                            </div>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                        {/* 1. Language Splits */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Bilingual Preferences</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Egyptian Arabic (اللهجة المصرية)</span>
                                        <span className="font-bold text-white">65%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#3F9F81] h-full" style={{ width: "65%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Modern Standard Arabic (الفصحى)</span>
                                        <span className="font-bold text-white">25%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#3F9F81]/60 h-full" style={{ width: "25%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>English (LTR)</span>
                                        <span className="font-bold text-white">10%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-white/10 h-full" style={{ width: "10%" }} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 2. Recovery Focus Splits */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Recovery Focus Areas</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Substances / Chemical Dependency</span>
                                        <span className="font-bold text-white">40%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#D4A373] h-full" style={{ width: "40%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Alcohol Recovery</span>
                                        <span className="font-bold text-white">30%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#D4A373]/70 h-full" style={{ width: "30%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Behavioral Habits (Porn, Gaming, etc.)</span>
                                        <span className="font-bold text-white">20%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#D4A373]/40 h-full" style={{ width: "20%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Emotional Dependency / General</span>
                                        <span className="font-bold text-white">10%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-white/10 h-full" style={{ width: "10%" }} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* 3. Stage Splits */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">User Stage splits</h3>
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Struggling & Seeking shelter</span>
                                        <span className="font-bold text-white">45%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-red-500/60 h-full" style={{ width: "45%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Just Curious / Questioning Habits</span>
                                        <span className="font-bold text-white">25%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-white/10 h-full" style={{ width: "25%" }} />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-neutral-400 mb-1">
                                        <span>Already in Recovery / Streaks</span>
                                        <span className="font-bold text-white">30%</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-[#3F9F81] h-full" style={{ width: "30%" }} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Anonymized Safety Risk table */}
                    <div className="mt-8 glass-panel border-white/5 rounded-lg overflow-hidden">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                <Cpu className="h-4 w-4 text-[#3F9F81]" />
                                Anonymized Risk Escalation Registry
                            </h3>
                            <span className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/25 px-2 py-0.5 rounded font-mono font-bold">REALTIME MONITORING</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left text-neutral-400">
                                <thead className="text-[10px] uppercase text-neutral-500 bg-[#080B10]/40 border-b border-white/5 font-bold font-mono">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">Trigger Type</th>
                                        <th scope="col" className="px-6 py-3">Anonymized Incident Metadata</th>
                                        <th scope="col" className="px-6 py-3">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayRisks.map((risk) => (
                                        <tr key={risk.id} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.01]">
                                            <td className="px-6 py-4 font-bold text-red-300 capitalize">{risk.triggerType.replaceAll("_", " ")}</td>
                                            <td className="px-6 py-4 leading-relaxed font-sans">{risk.details}</td>
                                            <td className="px-6 py-4 text-[10px] text-neutral-500 font-mono">{new Date(risk.createdAt).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
