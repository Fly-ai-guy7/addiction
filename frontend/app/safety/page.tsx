"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Heart, EyeOff, Scale, HelpCircle } from "lucide-react";
import { mockSupabase } from "@/lib/mockSupabase";

export default function SafetyPage() {
    const router = useRouter();
    const { t, profile, dir } = useBilingual();

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
        }
    }, [router]);

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#3F9F81]/[0.01] rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-4xl mx-auto px-6 py-10 z-10 w-full">
                    <header className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <ShieldCheck className="h-4 w-4 text-[#3F9F81]" />
                            {dir === "rtl" ? "الأمان والامتثال" : "Compliance charter"}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.safetyTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.safetySub}
                        </p>
                    </header>

                    <div className="space-y-6 animate-fade-in-up">
                        {/* 1. Complete Privacy-First Commitment */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <div className="flex items-start gap-4">
                                <EyeOff className="h-8 w-8 text-[#3F9F81] shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {dir === "rtl" ? "خصوصية حديدية مجهولة بالكامل" : "Sovereign Anonymity Charter"}
                                    </h3>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                        {dir === "rtl" 
                                        ? "لا نطلب منك بريدًا إلكترونيًا، أو اسمًا حقيقيًا، أو رقم هاتف للاستخدام الأساسي. حسابك بالكامل يتم تخزينه محلياً على متصفحك. لا توجد أي بيانات تعافي خاصة بك يتم تداولها، أو بيعها، أو مشاركتها مع أطراف ثالثة نهائياً. أنت تمتلك بياناتك بنسبة ١٠٠٪." 
                                        : "We enforce zero identity tracking. Basic operations require no email, real names, or phone numbers. All recovery progress logs remain safely stored inside your browser's local sandbox, completely safe from central server leaks, diagnostic logs, or third-party brokers. Your recovery belongs strictly to you."}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* 2. Responsible AI Boundaries */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <div className="flex items-start gap-4">
                                <Scale className="h-8 w-8 text-[#3F9F81] shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {dir === "rtl" ? "حدود وقوانين الذكاء الاصطناعي المسؤول" : "Responsible Generative AI Boundaries"}
                                    </h3>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                        {dir === "rtl" 
                                        ? "رفيق أمان الرقمي مصمم لغرض المؤازرة العاطفية والتخفيف من الرغبات الشديدة فقط. لا يقوم المساعد بتشخيص الحالات الطبية، ولا يقدم نصائح تطهير جسدي (Medical Detox)، ولا يدعي أنه معالج طبي أو موجه (سبرنسور) بشري. في كل حوار عالي الخطورة، نؤكد بشدة ونشجع على التواصل مع رفقاء التعافي البشريين والداعمين." 
                                        : "Aman Companion is engineered strictly as an observational, empathetic support buffer. The agent does not diagnose clinical addictions, write medical detox programs, or replace the vital human guidance of a sponsor or counselor. In every severe urge cycle, the system prioritizes and actively encourages connecting with verified human care networks."}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* 3. Crisis Escalation protocol */}
                        <Card className="glass-panel border-white/5 p-6 rounded-lg">
                            <div className="flex items-start gap-4">
                                <Heart className="h-8 w-8 text-[#3F9F81] shrink-0 mt-1" />
                                <div className="space-y-2">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                        {dir === "rtl" ? "بروتوكول التعامل مع الأزمات والطوارئ" : "Human-in-the-loop Escalation Protocol"}
                                    </h3>
                                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                                        {dir === "rtl" 
                                        ? "مساعد أمان يطبق فلاتر لغوية باللغتين العربية والإنجليزية لمراقبة الكلمات الدالة على الأزمات أو الرغبة في إيذاء النفس. عند رصد أي كلمة دالة، يتوقف المساعد فوراً عن الدردشة العامة، ويقوم بعرض كروت الطوارئ المخصصة التي تحتوي على أرقام خطوط الدعم النفسي والوقاية الرسمية بمصر والشرق الأوسط." 
                                        : "The platform integrates real-time linguistic filters (Fusha, Colloquial Egyptian, and English) to immediately detect keywords of acute distress, domestic abuse, or self-harm ideation. When flagged, the interface actively prepends emergency overlays with verified local helplines (16328 / 08008880700) to ensure the user receives immediate human attention."}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
