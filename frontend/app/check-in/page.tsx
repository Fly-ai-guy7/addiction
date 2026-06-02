"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { mockSupabase, CheckIn } from "@/lib/mockSupabase";
import { Activity, ShieldCheck, Heart, AlertCircle, RefreshCw, Sparkles } from "lucide-react";

export default function CheckInPage() {
    const router = useRouter();
    const { t, profile, dir } = useBilingual();

    // Check-in States
    const [mood, setMood] = useState(5);
    const [urge, setUrge] = useState(1);
    const [sleep, setSleep] = useState(5);
    const [isolation, setIsolation] = useState(1);
    const [spokeToSomeone, setSpokeToSomeone] = useState(false);
    const [journalText, setJournalText] = useState("");
    
    const [submittedLog, setSubmittedLog] = useState<CheckIn | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
        }
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            try {
                const newLog = mockSupabase.addCheckIn(
                    mood,
                    urge,
                    sleep,
                    isolation,
                    spokeToSomeone,
                    journalText.trim()
                );
                setSubmittedLog(newLog);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 800); // Add a small organic loader to feel like processing LLM
    };

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-[#3F9F81]/[0.01] rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-2xl mx-auto px-6 py-10 z-10 w-full">
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <Activity className="h-4 w-4 text-[#3F9F81]" />
                            {t.navCheckIn}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.checkinTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.checkinSub}
                        </p>
                    </header>

                    {!submittedLog ? (
                        <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden animate-fade-in-up">
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-6 pt-6">
                                    {/* Mood Slider */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <label className="font-semibold text-neutral-300 uppercase tracking-wide">{t.labelMood}</label>
                                            <span className="font-bold text-[#3F9F81] font-mono text-sm">{mood} / 10</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="10" 
                                            value={mood} 
                                            onChange={(e) => setMood(parseInt(e.target.value))}
                                            className="w-full accent-[#3F9F81] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Urge Slider */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <label className="font-semibold text-neutral-300 uppercase tracking-wide">{t.labelUrge}</label>
                                            <span className={`font-bold font-mono text-sm ${urge >= 7 ? "text-red-400" : "text-[#D4A373]"}`}>{urge} / 10</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="10" 
                                            value={urge} 
                                            onChange={(e) => setUrge(parseInt(e.target.value))}
                                            className="w-full accent-[#D4A373] bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Sleep Slider */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <label className="font-semibold text-neutral-300 uppercase tracking-wide">{t.labelSleep}</label>
                                            <span className="font-bold text-neutral-200 font-mono text-sm">{sleep} / 10</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="10" 
                                            value={sleep} 
                                            onChange={(e) => setSleep(parseInt(e.target.value))}
                                            className="w-full accent-neutral-400 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Isolation Slider */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <label className="font-semibold text-neutral-300 uppercase tracking-wide">{t.labelIsolation}</label>
                                            <span className="font-bold text-neutral-200 font-mono text-sm">{isolation} / 10</span>
                                        </div>
                                        <input 
                                            type="range" 
                                            min="1" 
                                            max="10" 
                                            value={isolation} 
                                            onChange={(e) => setIsolation(parseInt(e.target.value))}
                                            className="w-full accent-neutral-400 bg-white/5 h-1.5 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>

                                    {/* Spoke to Someone Today Boolean */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wide block">{t.labelSpoke}</label>
                                        <div className="flex gap-4">
                                            <Button
                                                type="button"
                                                onClick={() => setSpokeToSomeone(true)}
                                                className={`flex-1 text-xs h-9 rounded-md transition-all ${
                                                    spokeToSomeone 
                                                    ? "bg-[#3F9F81] text-white border-transparent shadow-[0_0_12px_rgba(63,159,129,0.1)]" 
                                                    : "bg-white/[0.01] hover:bg-white/[0.03] text-neutral-400 border border-white/10"
                                                }`}
                                            >
                                                {t.yes}
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() => setSpokeToSomeone(false)}
                                                className={`flex-1 text-xs h-9 rounded-md transition-all ${
                                                    !spokeToSomeone 
                                                    ? "bg-white/15 text-white border-transparent" 
                                                    : "bg-white/[0.01] hover:bg-white/[0.03] text-neutral-400 border border-white/10"
                                                }`}
                                            >
                                                {t.no}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Free Journal Field */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wide block">{t.labelJournal}</label>
                                        <Textarea
                                            value={journalText}
                                            onChange={(e) => setJournalText(e.target.value)}
                                            placeholder={t.placeholderJournal}
                                            rows={4}
                                            className="bg-white/[0.01] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none leading-relaxed"
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="border-t border-white/5 pt-4 pb-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold h-10 transition-all rounded-md shadow-glow-silver active:scale-[0.98]"
                                    >
                                        {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                        {t.btnSubmitCheckin}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    ) : (
                        /* Submission AI Feedback View */
                        <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden animate-fade-in-up">
                            <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                                <div className="space-y-0.5">
                                    <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-[#3F9F81] animate-pulse" />
                                        {t.aiReflectionTitle}
                                    </CardTitle>
                                </div>
                                <span className="text-[9px] font-mono text-neutral-500">{new Date(submittedLog.createdAt).toLocaleTimeString()}</span>
                            </CardHeader>
                            
                            <CardContent className="pt-6 pb-6">
                                <p className="text-xs text-neutral-200 leading-relaxed font-sans bg-white/[0.01] border border-white/5 p-4 rounded-md italic">
                                    "{submittedLog.aiReflection}"
                                </p>

                                {/* If cravings were recorded high, provide a prompt warning */}
                                {urge >= 7 && (
                                    <div className="mt-4 p-3 bg-yellow-950/20 border border-yellow-500/20 rounded-md text-[10px] text-yellow-300 flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-400 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">
                                            {dir === "rtl" 
                                            ? "أمان يذكرك: مستوى الرغبة الشديدة مرتفع اليوم. هل ترغب في استخدام منفس التنفس أو صياغة رسالة استغاثة لموجهك؟" 
                                            : "Aman Reminder: Cravings are spiking today. Consider using our interactive delay timers or messaging safe networks."}
                                        </p>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="border-t border-white/5 pt-4 pb-4 flex gap-3">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="flex-1 bg-white hover:bg-neutral-200 text-black text-xs font-semibold h-10 rounded-md transition-all active:scale-[0.98]"
                                >
                                    {dir === "rtl" ? "العودة إلى لوحة التحكم" : "Go to Dashboard"}
                                </Button>
                                <Button
                                    onClick={() => setSubmittedLog(null)}
                                    variant="outline"
                                    className="flex-1 border-white/10 hover:bg-white/5 text-xs text-white h-10 rounded-md transition-all"
                                >
                                    <RefreshCw className="mr-2 h-3.5 w-3.5" />
                                    {dir === "rtl" ? "تقييم جديد" : "Log Another Pulse"}
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </main>
            </div>
        </div>
    );
}
