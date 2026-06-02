"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { mockSupabase, CheckIn } from "@/lib/mockSupabase";
import { 
    Calendar, 
    Flame, 
    BrainCircuit, 
    BookMarked, 
    AlertTriangle, 
    MessageSquare, 
    Search,
    ChevronRight,
    TrendingUp,
    HeartPulse,
    Activity
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { t, profile, dir } = useBilingual();
    const [checkins, setCheckins] = useState<CheckIn[]>([]);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Enforce onboarding check
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
            return;
        }

        setCheckins(mockSupabase.getCheckIns());
        setStats(mockSupabase.getAdminStats());
    }, [router]);

    const latestCheckin = checkins[0];
    const hasCheckedInToday = latestCheckin 
        ? new Date(latestCheckin.createdAt).toDateString() === new Date().toDateString()
        : false;

    // Determine Suggested Action
    let suggestedAction = t.actionCheckin;
    let suggestedHref = "/check-in";
    if (hasCheckedInToday) {
        if (latestCheckin.urge >= 7) {
            suggestedAction = t.actionCompanion;
            suggestedHref = "/companion";
        } else {
            suggestedAction = t.actionGrounding;
            suggestedHref = "/urgent";
        }
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#3F9F81]/[0.01] rounded-full blur-[140px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-5xl mx-auto px-6 py-10 z-10 w-full">
                    {/* Welcome Header */}
                    <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in-up">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                                <HeartPulse className="h-4 w-4 text-[#3F9F81]" />
                                {t.dashWelcome}
                            </div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                {dir === "rtl" ? `أهلاً بك، ${profile.username}` : `Welcome, ${profile.username}`}
                            </h1>
                            <p className="text-xs text-neutral-400 mt-1">
                                {dir === "rtl" ? `مجال تعافيك: ${(t as any)["focus" + profile.focusArea.charAt(0).toUpperCase() + profile.focusArea.slice(1)] || profile.focusArea}` : `Your sanctuary: ${(t as any)["focus" + profile.focusArea.charAt(0).toUpperCase() + profile.focusArea.slice(1)] || profile.focusArea}`}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded text-neutral-400">
                                {dir === "rtl" ? `المرحلة: ${(t as any)["status" + profile.currentStatus.charAt(0).toUpperCase() + profile.currentStatus.slice(1)] || profile.currentStatus}` : `Stage: ${(t as any)["status" + profile.currentStatus.charAt(0).toUpperCase() + profile.currentStatus.slice(1)] || profile.currentStatus}`}
                            </span>
                        </div>
                    </header>

                    {/* Stats Streak Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up">
                        <Card className="glass-panel border-white/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{t.dashDaysCount}</p>
                                    <h3 className="text-2xl font-black text-white mt-1">{checkins.length}</h3>
                                </div>
                                <Calendar className="h-4 w-4 text-[#3F9F81] opacity-80" />
                            </div>
                        </Card>

                        <Card className="glass-panel border-white/5 p-4 rounded-md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">{t.dashStreak}</p>
                                    <h3 className="text-2xl font-black text-[#D4A373] mt-1">{stats ? stats.activeStreakDays : 0} {dir === "rtl" ? "يوم" : "days"}</h3>
                                </div>
                                <Flame className="h-4 w-4 text-[#D4A373] opacity-80" />
                            </div>
                        </Card>

                        <Card className="glass-panel border-white/5 p-4 rounded-md col-span-2">
                            <div className="flex justify-between items-start">
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#3F9F81]">{t.dashNextAction}</p>
                                    <p className="text-[11px] text-neutral-300 font-semibold truncate mt-1 leading-normal">
                                        {suggestedAction}
                                    </p>
                                </div>
                                <Button asChild size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-white/5 rounded-full shrink-0">
                                    <Link href={suggestedHref}>
                                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Central Quick Actions */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                        {/* 1. Daily Check-in Card */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
                                    <Activity className="h-4 w-4 text-[#3F9F81]" />
                                    {t.navCheckIn}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-[11px] text-neutral-400 leading-normal">
                                    {dir === "rtl" ? "تأمل في مشاعرك، نومك، وعزلتك يومياً لبناء انعكاس دعم مخصص." : "Register your mood, urges, sleep logs, and notes to unlock secure diagnostic reflections."}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-white/5">
                                <Button asChild className="w-full text-xs font-semibold h-9 rounded-md bg-[#3F9F81] hover:bg-[#348A6F] text-white transition-all">
                                    <Link href="/check-in">
                                        {hasCheckedInToday ? (dir === "rtl" ? "عرض تقييم اليوم" : "Review Daily Log") : (dir === "rtl" ? "سجل تقييم اليوم" : "Log Daily Pulse")}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* 2. Chat Companion Card */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-white flex items-center gap-2 uppercase tracking-wide">
                                    <MessageSquare className="h-4 w-4 text-[#3F9F81]" />
                                    {t.navCompanion}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-[11px] text-neutral-400 leading-normal">
                                    {dir === "rtl" ? "تحدث سرياً مع مساعد أمان للمساعدة عند اشتداد الرغبة وإجراء تدريبات التنفس." : "Consult Aman Companion anonymously for rapid crisis redirection and urge surfing loops."}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-white/5">
                                <Button asChild variant="outline" className="w-full text-xs font-semibold h-9 rounded-md border-white/10 hover:bg-white/5 text-white transition-all">
                                    <Link href="/companion">
                                        {dir === "rtl" ? "دردش مع أمان" : "Consult Sanctuary Guide"}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* 3. Urgent Relief Card */}
                        <Card className="glass-panel border-red-500/20 bg-red-950/15 rounded-lg overflow-hidden flex flex-col justify-between shadow-[0_0_15px_rgba(239,68,68,0.02)]">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-semibold text-red-200 flex items-center gap-2 uppercase tracking-wide">
                                    <AlertTriangle className="h-4 w-4 text-red-400" />
                                    {t.navUrgent}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-[11px] text-red-300/80 leading-normal">
                                    {dir === "rtl" ? "ملاذ فوري لتخطي الرغبات الصعبة: مؤقت تأجيل ٢٠ دقيقة، منفس بصري، وأرقام الطوارئ." : "Immediate panic shelter: 20-min urge timers, breathing waves, and crisis redirects."}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-2 border-t border-red-500/10">
                                <Button asChild className="w-full text-xs font-semibold h-9 rounded-md bg-red-900/90 hover:bg-red-800 text-red-100 transition-all border border-red-500/20">
                                    <Link href="/urgent">
                                        {t.dashBtnSupport}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Trend Sparklines */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-[#3F9F81]" />
                                {dir === "rtl" ? "مؤشرات المزاج والرغبة (الـ ٧ تقييمات الأخيرة)" : "Mood & Urge Trends (Last 7 Check-ins)"}
                            </h3>
                            
                            {checkins.length === 0 ? (
                                <div className="h-32 flex items-center justify-center border border-dashed border-white/5 rounded text-[11px] text-neutral-500">
                                    {dir === "rtl" ? "سجل تقييمك اليومي لتفعيل المؤشرات البصرية" : "Log your first daily check-in to activate trend sparklines."}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Mood line */}
                                    <div>
                                        <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-2">
                                            <span>{dir === "rtl" ? "متوسط جودة المزاج" : "Mood Index"}</span>
                                            <span className="font-bold text-white">
                                                {(checkins.reduce((acc, c) => acc + c.mood, 0) / checkins.length).toFixed(1)} / 10
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-1.5 h-12 pt-2">
                                            {checkins.slice(0, 7).reverse().map((c, i) => (
                                                <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                                                    <div 
                                                        className="bg-[#3F9F81] rounded-t-sm transition-all duration-300 hover:opacity-80" 
                                                        style={{ height: `${(c.mood / 10) * 100}%` }}
                                                    />
                                                    <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 text-[8px] text-neutral-600 font-mono">
                                                        {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric' })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Urges line */}
                                    <div>
                                        <div className="flex justify-between items-center text-[10px] text-neutral-400 mb-2">
                                            <span>{dir === "rtl" ? "مستوى الرغبة الشديدة" : "Urge/Craving Rate"}</span>
                                            <span className="font-bold text-[#D4A373]">
                                                {(checkins.reduce((acc, c) => acc + c.urge, 0) / checkins.length).toFixed(1)} / 10
                                            </span>
                                        </div>
                                        <div className="flex items-end gap-1.5 h-12 pt-2">
                                            {checkins.slice(0, 7).reverse().map((c, i) => (
                                                <div key={i} className="flex-1 flex flex-col justify-end h-full group relative">
                                                    <div 
                                                        className="bg-[#D4A373] rounded-t-sm transition-all duration-300 hover:opacity-80" 
                                                        style={{ height: `${(c.urge / 10) * 100}%` }}
                                                    />
                                                    <span className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 text-[8px] text-neutral-600 font-mono">
                                                        {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric' })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Today's Reflection */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <BrainCircuit className="h-4 w-4 text-[#3F9F81]" />
                                    {t.dashBtnReflection}
                                </h3>
                                <p className="text-[11px] text-neutral-300 leading-relaxed italic">
                                    {latestCheckin 
                                    ? `"${latestCheckin.aiReflection}"`
                                    : dir === "rtl" 
                                    ? "أكمل تقييمك اليومي ليظهر هنا رفيق تعافيك الذكي والداعم." 
                                    : "Complete your daily pulse log. Today's custom AI healing reflection will generate and output here."}
                                </p>
                            </div>

                            {latestCheckin && (
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                                    <span>{new Date(latestCheckin.createdAt).toLocaleString()}</span>
                                    <span className="text-[#3F9F81] font-semibold">Active Sanctuary Reflection</span>
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Secondary Access Navigation row */}
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                        <Button asChild variant="outline" className="h-10 text-xs font-semibold rounded-md border-white/10 hover:bg-white/5 text-white transition-all">
                            <Link href="/journal" className="flex items-center gap-2 justify-center">
                                <BookMarked className="h-4 w-4 text-neutral-400" />
                                {t.navJournal}
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="h-10 text-xs font-semibold rounded-md border-white/10 hover:bg-white/5 text-white transition-all">
                            <Link href="/directory" className="flex items-center gap-2 justify-center">
                                <Search className="h-4 w-4 text-neutral-400" />
                                {t.navDirectory}
                            </Link>
                        </Button>
                    </div>
                </main>
            </div>
        </div>
    );
}
