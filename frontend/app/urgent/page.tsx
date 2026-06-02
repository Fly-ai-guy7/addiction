"use client";

import React, { useState, useEffect } from "react";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { AlertTriangle, ShieldCheck, Heart, RefreshCw, Volume2, Phone } from "lucide-react";

export default function UrgentPage() {
    const { t, dir, language } = useBilingual();

    // Breathing States
    const [breathState, setBreathState] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [breathSeconds, setBreathSeconds] = useState(4);

    // Timer States
    const [timerRunning, setTimerRunning] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(1200); // 20 minutes = 1200 seconds

    // Checklist States
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);

    // Simulated Breathing animation clock
    useEffect(() => {
        const interval = setInterval(() => {
            setBreathSeconds((prev) => {
                if (prev === 1) {
                    // Toggle state
                    setBreathState((state) => {
                        if (state === "inhale") return "hold";
                        if (state === "hold") return "exhale";
                        return "inhale";
                    });
                    return 4; // Reset to 4 seconds
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Countdown Timer clock
    useEffect(() => {
        let interval: any = null;
        if (timerRunning && secondsLeft > 0) {
            interval = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0) {
            setTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [timerRunning, secondsLeft]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        setSecondsLeft(1200);
        setTimerRunning(true);
    };

    const getBreathInstruction = () => {
        if (breathState === "inhale") return t.groundingInstructionInhale;
        if (breathState === "hold") return t.groundingInstructionHold;
        return t.groundingInstructionExhale;
    };

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-red-950/[0.03] rounded-full blur-[130px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-4xl mx-auto px-6 py-10 z-10 w-full">
                    {/* Urgent Warning Banner */}
                    <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-200 rounded-lg text-xs leading-relaxed mb-10 flex items-start gap-3 shadow-[0_0_20px_rgba(239,68,68,0.05)] animate-fade-in-up">
                        <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-white uppercase tracking-wider mb-1">
                                {language === "en" ? "Crisis Notice" : "تنبيه طوارئ حرج"}
                            </p>
                            <p>{t.emergencyNotice}</p>
                        </div>
                    </div>

                    <header className="mb-8 animate-fade-in-up">
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.urgentTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.urgentSub}
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8 mb-8 animate-fade-in-up">
                        {/* 1. Breathing Bubble Grounder */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="border-b border-white/5 pb-3">
                                <CardTitle className="text-xs font-semibold text-white tracking-wide uppercase flex items-center gap-2">
                                    <Volume2 className="h-4 w-4 text-[#3F9F81]" />
                                    {t.groundingVisualizer}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center min-h-[220px]">
                                {/* Animated Breathing Circle */}
                                <div 
                                    className={`rounded-full flex items-center justify-center text-center transition-all duration-[4000ms] ease-in-out border ${
                                        breathState === "inhale" 
                                        ? "w-40 h-40 bg-[#3F9F81]/10 border-[#3F9F81]/40 scale-110 shadow-[0_0_35px_rgba(63,159,129,0.15)]" 
                                        : breathState === "hold" 
                                        ? "w-40 h-40 bg-[#D4A373]/10 border-[#D4A373]/40 scale-110 shadow-[0_0_35px_rgba(212,163,115,0.15)]"
                                        : "w-28 h-28 bg-white/[0.02] border-white/10 scale-95"
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <p className="text-white text-xs font-bold transition-all duration-300">
                                            {getBreathInstruction()}
                                        </p>
                                        <p className="text-[10px] text-neutral-500 font-mono">
                                            {breathSeconds}s
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 pb-2 bg-black/10 text-[9px] text-neutral-500 text-center leading-relaxed block border-t border-white/5">
                                Guided deep breathing stimulates the vagus nerve to naturally trigger chemical de-escalation.
                            </CardFooter>
                        </Card>

                        {/* 2. 20-Min urge Delay Timer */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="border-b border-white/5 pb-3">
                                <CardTitle className="text-xs font-semibold text-white tracking-wide uppercase flex items-center gap-2">
                                    <RefreshCw className="h-4 w-4 text-[#D4A373]" />
                                    {t.delayTimer}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center min-h-[220px]">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl font-extrabold text-white tracking-wider font-mono">
                                        {formatTime(secondsLeft)}
                                    </div>
                                    <Button
                                        onClick={startTimer}
                                        className={`text-xs font-semibold h-9 rounded-md transition-all ${
                                            timerRunning 
                                            ? "bg-transparent border border-white/10 text-neutral-400" 
                                            : "bg-white hover:bg-neutral-200 text-black shadow-glow-silver px-6"
                                        }`}
                                    >
                                        {timerRunning ? (language === "en" ? "Timer Running..." : "المؤقت يعمل...") : (language === "en" ? "Start 20-Minute Delay" : "ابدأ تأجيل ٢٠ دقيقة")}
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-2 pb-2 bg-black/10 text-[9px] text-neutral-500 text-center leading-relaxed block border-t border-white/5">
                                Cravings are chemical neuro-signals that generally subside naturally if delayed by 20 minutes.
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Grounding Checklist & Local Egypt Helplines */}
                    <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up">
                        {/* Action Checklist */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-[#3F9F81]" />
                                {t.callSafeList}
                            </h3>
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer text-xs group text-neutral-300">
                                    <input 
                                        type="checkbox" 
                                        checked={check1} 
                                        onChange={() => setCheck1(!check1)}
                                        className="mt-0.5 rounded border-white/10 accent-[#3F9F81] h-3.5 w-3.5"
                                    />
                                    <span className={check1 ? "line-through text-neutral-500" : "group-hover:text-white"}>{t.checkSpoke}</span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer text-xs group text-neutral-300">
                                    <input 
                                        type="checkbox" 
                                        checked={check2} 
                                        onChange={() => setCheck2(!check2)}
                                        className="mt-0.5 rounded border-white/10 accent-[#3F9F81] h-3.5 w-3.5"
                                    />
                                    <span className={check2 ? "line-through text-neutral-500" : "group-hover:text-white"}>{t.checkBreath}</span>
                                </label>

                                <label className="flex items-start gap-3 cursor-pointer text-xs group text-neutral-300">
                                    <input 
                                        type="checkbox" 
                                        checked={check3} 
                                        onChange={() => setCheck3(!check3)}
                                        className="mt-0.5 rounded border-white/10 accent-[#3F9F81] h-3.5 w-3.5"
                                    />
                                    <span className={check3 ? "line-through text-neutral-500" : "group-hover:text-white"}>{t.checkOutreach}</span>
                                </label>
                            </div>
                        </Card>

                        {/* Local Helpline contacts */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[#3F9F81]" />
                                {t.egyptHelpline}
                            </h3>
                            <div className="space-y-4">
                                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-md flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-semibold text-white">الخط الساخن للصحة النفسية بمصر</p>
                                        <p className="text-[10px] text-neutral-500 font-mono">Secretariat of Mental Health</p>
                                    </div>
                                    <span className="font-extrabold text-[#3F9F81] font-mono text-sm">16328</span>
                                </div>

                                <div className="p-3 bg-white/[0.01] border border-white/5 rounded-md flex justify-between items-center text-xs">
                                    <div>
                                        <p className="font-semibold text-white">خط الوقاية من الانتحار بمصر</p>
                                        <p className="text-[10px] text-neutral-500 font-mono">Suicide Prevention Line</p>
                                    </div>
                                    <span className="font-extrabold text-[#3F9F81] font-mono text-sm">08008880700</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
