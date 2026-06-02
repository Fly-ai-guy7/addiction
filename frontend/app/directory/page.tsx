"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Filter, Search, Globe, Users, Clock, Compass } from "lucide-react";
import { mockSupabase } from "@/lib/mockSupabase";

interface Meeting {
    id: string;
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    type: "online" | "in_person";
    language: "ar" | "en";
    isWomenOnly: boolean;
    scheduleAr: string;
    scheduleEn: string;
    link: string;
}

const SEED_MEETINGS: Meeting[] = [
    {
        id: "1",
        titleAr: "اجتماع التعافي والمؤازرة الإلكتروني للسيدات",
        titleEn: "Online Women's Hope Support Meeting",
        descAr: "مساحة آمنة سرية بالكامل مخصصة للسيدات فقط لمشاركة الصعوبات والتعافي من الإدمان السلوكي والعاطفي.",
        descEn: "A strictly private, online safe space for women only to share struggles and heal from behavioral dependencies.",
        type: "online",
        language: "ar",
        isWomenOnly: true,
        scheduleAr: "كل يوم اثنين وخميس الساعة ٨ مساءً بتوقيت القاهرة",
        scheduleEn: "Every Monday and Thursday at 8:00 PM Cairo Time",
        link: "https://zoom.us/j/mock-meeting-women"
    },
    {
        id: "2",
        titleAr: "مجموعة زمالة الـ ١٢ خطوة باللغة العربية",
        titleEn: "Arabic Twelve-Step Fellowship Group",
        descAr: "اجتماع دراسة خطوات التعافي الاثني عشر والتشارك الصادق في ملاذ آمن تماماً.",
        descEn: "Classic 12-step study and honest sharing in a supportive Arabic-speaking environment.",
        type: "online",
        language: "ar",
        isWomenOnly: false,
        scheduleAr: "كل يوم سبت وثلاثاء الساعة ٩ مساءً بتوقيت القاهرة",
        scheduleEn: "Every Saturday and Tuesday at 9:00 PM Cairo Time",
        link: "https://zoom.us/j/mock-meeting-arabic-12step"
    },
    {
        id: "3",
        titleAr: "اجتماع تعافي المغتربين والمهنيين بمصر (إنجليزي)",
        titleEn: "Cairo Professional & Expat Recovery Group",
        descAr: "اجتماع دعم خاص مغلق باللغة الإنجليزية مخصص للمغتربين والمهنيين لتفادي وصمة المجتمع.",
        descEn: "A secure, closed English-speaking recovery group tailored for professionals and expats seeking absolute privacy.",
        type: "online",
        language: "en",
        isWomenOnly: false,
        scheduleAr: "كل يوم أربعاء الساعة ٧ مساءً بتوقيت القاهرة",
        scheduleEn: "Every Wednesday at 7:00 PM Cairo Time",
        link: "https://zoom.us/j/mock-meeting-expat-cairo"
    },
    {
        id: "4",
        titleAr: "اجتماع الدعم السلوكي والعادات المفتوح",
        titleEn: "General Behavioral Habits Recovery Circle",
        descAr: "مفتوح لكل من يعاني من عادات سلوكية قهرية (ألعاب، بورن، قمار) ويبحث عن رفقاء رحلة.",
        descEn: "Open circle for anyone recovering from compulsive behavioral habits seeking support partners.",
        type: "online",
        language: "ar",
        isWomenOnly: false,
        scheduleAr: "كل يوم جمعة الساعة ٥ مساءً بتوقيت القاهرة",
        scheduleEn: "Every Friday at 5:00 PM Cairo Time",
        link: "https://zoom.us/j/mock-meeting-behavioral"
    }
];

export default function SupportDirectoryPage() {
    const router = useRouter();
    const { t, profile, dir } = useBilingual();

    // Filters states
    const [filterWomen, setFilterWomen] = useState(false);
    const [filterArabic, setFilterArabic] = useState(false);
    const [filterEnglish, setFilterEnglish] = useState(false);

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
        }
    }, [router]);

    // Apply Filter logic
    const filteredMeetings = SEED_MEETINGS.filter(meeting => {
        if (filterWomen && !meeting.isWomenOnly) return false;
        if (filterArabic && meeting.language !== "ar") return false;
        if (filterEnglish && meeting.language !== "en") return false;
        return true;
    });

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#3F9F81]/[0.01] rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-4xl mx-auto px-6 py-10 z-10 w-full">
                    {/* Unverified Seed Warning banner */}
                    <div className="p-4 bg-amber-950/40 border border-amber-500/20 text-amber-200 rounded-lg text-xs leading-relaxed mb-8 flex items-start gap-3 shadow-[0_0_15px_rgba(234,179,8,0.03)] animate-fade-in-up">
                        <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-white uppercase tracking-wider mb-0.5">
                                {dir === "rtl" ? "دليل تجريبي غير معتمد" : "Demo Placeholders"}
                            </p>
                            <p>{t.warnVerified}</p>
                        </div>
                    </div>

                    <header className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <Compass className="h-4 w-4 text-neutral-500" />
                            {dir === "rtl" ? "دليل التعافي والأمان" : "Support networks mapping"}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.dirTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.dirSub}
                        </p>
                    </header>

                    {/* Filter controls row */}
                    <div className="flex flex-wrap gap-3 items-center p-4 bg-white/[0.01] border border-white/5 rounded-lg mb-8 animate-fade-in-up">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                            <Filter className="h-3.5 w-3.5" />
                            {dir === "rtl" ? "تصفية الاجتماعات" : "Filters"}
                        </span>
                        
                        <div className="flex flex-wrap gap-2">
                            <Button
                                size="sm"
                                onClick={() => setFilterWomen(!filterWomen)}
                                className={`h-8 text-[10px] font-semibold rounded-md border ${
                                    filterWomen 
                                    ? "bg-[#3F9F81]/15 text-white border-[#3F9F81]/30" 
                                    : "bg-transparent text-neutral-500 border-white/5 hover:text-white"
                                }`}
                            >
                                {t.filterWomen}
                            </Button>

                            <Button
                                size="sm"
                                onClick={() => {
                                    setFilterArabic(!filterArabic);
                                    if (filterEnglish) setFilterEnglish(false);
                                }}
                                className={`h-8 text-[10px] font-semibold rounded-md border ${
                                    filterArabic 
                                    ? "bg-[#3F9F81]/15 text-white border-[#3F9F81]/30" 
                                    : "bg-transparent text-neutral-500 border-white/5 hover:text-white"
                                }`}
                            >
                                {t.filterArabic}
                            </Button>

                            <Button
                                size="sm"
                                onClick={() => {
                                    setFilterEnglish(!filterEnglish);
                                    if (filterArabic) setFilterArabic(false);
                                }}
                                className={`h-8 text-[10px] font-semibold rounded-md border ${
                                    filterEnglish 
                                    ? "bg-[#3F9F81]/15 text-white border-[#3F9F81]/30" 
                                    : "bg-transparent text-neutral-500 border-white/5 hover:text-white"
                                }`}
                            >
                                {t.filterEnglish}
                            </Button>
                        </div>
                    </div>

                    {/* Directory Listings Grid */}
                    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                        {filteredMeetings.map((meeting) => (
                            <Card key={meeting.id} className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between hover:border-white/10 hover:shadow-glow-silver transition-all duration-300">
                                <CardHeader className="pb-3 border-b border-white/5">
                                    <div className="flex gap-1.5 mb-2">
                                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded capitalize ${meeting.type === "online" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "bg-purple-500/10 text-purple-400 border border-purple-500/20"}`}>
                                            {meeting.type}
                                        </span>
                                        {meeting.isWomenOnly && (
                                            <span className="text-[8px] font-bold bg-[#3F9F81]/10 text-[#3F9F81] border border-[#3F9F81]/20 px-2 py-0.5 rounded uppercase">
                                                Women Only
                                            </span>
                                        )}
                                        <span className="text-[8px] font-mono font-bold bg-white/5 border border-white/5 text-neutral-400 px-2 py-0.5 rounded uppercase">
                                            {meeting.language.toUpperCase()}
                                        </span>
                                    </div>
                                    <CardTitle className="text-sm font-bold text-white leading-normal">
                                        {dir === "rtl" ? meeting.titleAr : meeting.titleEn}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="pt-4 pb-4 space-y-4">
                                    <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                                        {dir === "rtl" ? meeting.descAr : meeting.descEn}
                                    </p>
                                    
                                    {/* Time and details */}
                                    <div className="space-y-2 text-[10px] text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3.5 w-3.5 text-[#3F9F81] shrink-0" />
                                            <span>{dir === "rtl" ? meeting.scheduleAr : meeting.scheduleEn}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
                                            <span className="truncate">Blurred for verification</span>
                                        </div>
                                    </div>
                                </CardContent>
                                
                                <CardFooter className="pt-2 pb-3 border-t border-white/5 bg-black/5">
                                    <Button
                                        disabled
                                        className="w-full text-xs font-semibold h-8 bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5"
                                    >
                                        {dir === "rtl" ? "رابط الوصول (يتطلب اعتماد الدليل)" : "Access Link (Awaiting verification)"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
