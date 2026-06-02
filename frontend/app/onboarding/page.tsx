"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { mockSupabase } from "@/lib/mockSupabase";
import { Language } from "@/lib/translations";
import { ShieldCheck, UserPlus, HelpCircle } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const { t, refreshProfile, toggleLanguage, dir } = useBilingual();

    const [username, setUsername] = useState("");
    const [dialect, setDialect] = useState<Language>("ar");
    const [focusArea, setFocusArea] = useState("general");
    const [currentStatus, setCurrentStatus] = useState("just_curious");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim()) {
            setError(dir === "rtl" ? "برجاء كتابة اسم مستعار آمن للاستمرار." : "Please enter an anonymous alias to proceed.");
            return;
        }

        try {
            // Write profile locally
            mockSupabase.createProfile(
                username.trim(),
                dialect,
                focusArea,
                currentStatus,
                emergencyContact.trim() || undefined
            );
            
            // Sync provider state
            toggleLanguage(dialect);
            refreshProfile();

            // Direct to dashboard
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create profile");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#3F9F81]/[0.01] rounded-full blur-[130px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 flex items-center justify-center p-6 z-10 w-full">
                    <Card className="w-full max-w-lg glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden animate-fade-in-up">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
                                <UserPlus className="h-4 w-4 text-[#3F9F81]" />
                                {t.onboardTitle}
                            </CardTitle>
                            <CardDescription className="text-[11px] text-neutral-400 mt-1">
                                {t.onboardSub}
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4 pt-6">
                                {error && (
                                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-200 text-xs rounded-md">
                                        {error}
                                    </div>
                                )}

                                {/* Anonymous Alias Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                        {t.labelUsername}
                                    </label>
                                    <Input
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder={t.placeholderUsername}
                                        maxLength={30}
                                        className="bg-white/[0.01] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <span className="text-[9px] text-neutral-500 leading-normal block">
                                        {dir === "rtl" 
                                        ? "تنبيه: لا تكتب اسمك الحقيقي أو أرقام تدل عليك لحماية سرية هويتك." 
                                        : "Tip: Avoid using birthdates, real names, or locations to guarantee anonymity."}
                                    </span>
                                </div>

                                {/* Preferred Language Select */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                        {t.labelLanguage}
                                    </label>
                                    <select
                                        value={dialect}
                                        onChange={(e) => {
                                            const l = e.target.value as Language;
                                            setDialect(l);
                                            toggleLanguage(l);
                                        }}
                                        className="w-full text-xs border border-white/10 rounded-md p-2.5 bg-white/[0.02] text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                                    >
                                        <option value="ar">العربية الفصحى (Standard Arabic)</option>
                                        <option value="ar_eg">عامية مصرية (Egyptian Dialect)</option>
                                        <option value="en">English (LTR)</option>
                                    </select>
                                </div>

                                {/* Focus Area Select */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                        {t.labelFocus}
                                    </label>
                                    <select
                                        value={focusArea}
                                        onChange={(e) => setFocusArea(e.target.value)}
                                        className="w-full text-xs border border-white/10 rounded-md p-2.5 bg-white/[0.02] text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                                    >
                                        <option value="general">{t.focusGeneral}</option>
                                        <option value="alcohol">{t.focusAlcohol}</option>
                                        <option value="substances">{t.focusSubstances}</option>
                                        <option value="behavioral">{t.focusBehavioral}</option>
                                        <option value="emotional">{t.focusEmotional}</option>
                                    </select>
                                </div>

                                {/* Current Status */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                        {t.labelStatus}
                                    </label>
                                    <select
                                        value={currentStatus}
                                        onChange={(e) => setCurrentStatus(e.target.value)}
                                        className="w-full text-xs border border-white/10 rounded-md p-2.5 bg-white/[0.02] text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                                    >
                                        <option value="just_curious">{t.statusCurious}</option>
                                        <option value="struggling">{t.statusStruggling}</option>
                                        <option value="new_recovery">{t.statusNew}</option>
                                        <option value="in_recovery">{t.statusSeasoned}</option>
                                        <option value="relapsed">{t.statusRelapsed}</option>
                                        <option value="supporting">{t.statusSupporting}</option>
                                    </select>
                                </div>

                                {/* Emergency Contact Input */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block flex items-center gap-1.5">
                                        {t.labelEmergency}
                                        <span className="text-[9px] font-bold text-neutral-500 capitalize">({dir === "rtl" ? "اختياري" : "optional"})</span>
                                    </label>
                                    <Input
                                        value={emergencyContact}
                                        onChange={(e) => setEmergencyContact(e.target.value)}
                                        placeholder={t.placeholderEmergency}
                                        maxLength={50}
                                        className="bg-white/[0.01] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                    <span className="text-[9px] text-neutral-500 leading-normal block">
                                        {dir === "rtl" 
                                        ? "يمكنك كتابة كنية لداعمك أو موجهك (مثال: أحمد واتساب)، ليساعدك النظام على صياغة رسائل استغاثة سريعة عند اللزوم." 
                                        : "Specify an alias or preferred app key (e.g. Sponsor Khalid). We use this to compile quick template texts."}
                                    </span>
                                </div>
                            </CardContent>

                            <CardFooter className="border-t border-white/5 pt-4 pb-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#3F9F81] hover:bg-[#348A6F] text-white text-xs font-semibold h-10 transition-all rounded-md shadow-[0_0_15px_rgba(63,159,129,0.1)] active:scale-[0.98]"
                                >
                                    <ShieldCheck className="mr-2 h-4 w-4 text-white" />
                                    {t.btnSubmitOnboard}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </main>
            </div>
        </div>
    );
}
