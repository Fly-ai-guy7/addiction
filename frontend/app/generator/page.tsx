"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, Copy, Share2, Send, MessageSquare, Sparkles } from "lucide-react";
import { mockSupabase } from "@/lib/mockSupabase";

export default function MessageGeneratorPage() {
    const router = useRouter();
    const { t, profile, dir } = useBilingual();
    const [selectedTemplate, setSelectedTemplate] = useState("struggling");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
        }
    }, [router]);

    const templates: any = {
        struggling: {
            ar: "أهلاً، أنا أمر بوقت صعب ورغبات شديدة الآن وأحتاج للتحدث معك عندما تتاح لك فرصة. شكراً لك.",
            ar_eg: "يا فندم، أنا مضغوط شوية النهاردة وعندي رغبة صعبة ومش عايز أنعزل. ممكن ندردش شوية لما تفضى؟",
            en: "Hey, I am having a tough time with urges today and don't want to isolate. Can you call me when you have a moment? Thanks.",
            franco: "Hey, ana mzkonk w 3andy urge sa3b enhrda w msh 3ayz a3zl nfsy, momken nklm b3d lma tfda? Shokran."
        },
        slip: {
            ar: "أهلاً، لقد تعرضت لهفوة أو كبوة اليوم ولا أريد الانعزال. أريد التحدث معك للمشاركة والبدء من جديد.",
            ar_eg: "أهلاً، حصلت كبوة أو هفوة معايا النهاردة ومش عايز أستسلم للعزلة. محتاج أتكلم معاك عشان أبدأ من تاني.",
            en: "Hey, I had a slip today and don't want to fall into isolation. I need to talk to share this honestly and start fresh.",
            franco: "Hey, 7slt hfwa enhrda w msh 3ayz a3zl nfsy. me7tag atklm m3ak 3ashan abd2 mn tany. Shokran."
        },
        call: {
            ar: "مرحباً، أرجو الاتصال بي عندما تتاح لك الفرصة. أحتاج للتحدث مع شخص آمن.",
            ar_eg: "مرحباً، كلمني يا فندم أول ما تفضى لو سمحت. محتاج أتكلم مع حد آمن.",
            en: "Hi, please give me a call when you have a moment. I need to talk to someone safe.",
            franco: "Hi, klmny awl m tfda lw sm7t. me7tag atklm m3a 7d amn."
        },
        meeting: {
            ar: "أهلاً، هل يمكنك مساعدتي في الذهاب إلى اجتماع دعم اليوم؟ أشعر بالتردد وأحتاج لبعض التشجيع.",
            ar_eg: "يا فندم، هل ممكن تساعدني أروح اجتماع النهاردة؟ حاسس بكسل وتردد ومحتاج تشجيع.",
            en: "Hey, can you help me get to a support meeting today? I am feeling hesitant and could use some encouragement.",
            franco: "Hey, momken tsa3dny aro7 egtma3 enhrda? 7ass b ksl w trdd w me7tag tshge3. Shokran."
        }
    };

    const activeText = templates[selectedTemplate];

    const copyText = (txt: string) => {
        navigator.clipboard.writeText(txt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareWhatsApp = (txt: string) => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(txt)}`, "_blank");
    };

    if (!profile) return null;

    const btnTemplates = [
        { key: "struggling", label: t.templateStruggling },
        { key: "slip", label: t.templateSlip },
        { key: "call", label: t.templateCall },
        { key: "meeting", label: t.templateMeeting },
    ];

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-[#3F9F81]/[0.01] rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-3xl mx-auto px-6 py-10 z-10 w-full">
                    <header className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <Sparkles className="h-3.5 w-3.5 text-[#3F9F81] animate-pulse" />
                            {dir === "rtl" ? "صياغة الدعم السريع" : "Outreach message synthesis"}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.genTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.genSub}
                        </p>
                    </header>

                    {/* Template selection Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-in-up">
                        {btnTemplates.map(btn => (
                            <Button
                                key={btn.key}
                                onClick={() => setSelectedTemplate(btn.key)}
                                className={`text-[10px] font-bold h-11 px-3 rounded-md transition-all whitespace-normal leading-normal text-center border ${
                                    selectedTemplate === btn.key 
                                    ? "bg-white/[0.04] text-white border-white/10 shadow-glow-silver" 
                                    : "bg-transparent text-neutral-500 border-white/5 hover:text-white"
                                }`}
                            >
                                {btn.label}
                            </Button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                        {/* 1. Arabic & Colloquial Output */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="pb-3 border-b border-white/5">
                                <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
                                    {dir === "rtl" ? "العربية الفصحى والعامية" : "Arabic Translations"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">اللهجة المصرية</span>
                                    <p className="text-xs text-neutral-200 bg-white/[0.01] border border-white/5 p-3 rounded leading-relaxed">{activeText.ar_eg}</p>
                                    <Button
                                        onClick={() => copyText(activeText.ar_eg)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-[10px] text-neutral-400 hover:text-white hover:bg-white/5 mt-1"
                                    >
                                        <Copy className="h-3 w-3 mr-1" /> {t.btnCopy}
                                    </Button>
                                </div>

                                <div className="space-y-1.5 border-t border-white/5 pt-4">
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">العربية الفصحى</span>
                                    <p className="text-xs text-neutral-200 bg-white/[0.01] border border-white/5 p-3 rounded leading-relaxed">{activeText.ar}</p>
                                    <Button
                                        onClick={() => copyText(activeText.ar)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-[10px] text-neutral-400 hover:text-white hover:bg-white/5 mt-1"
                                    >
                                        <Copy className="h-3 w-3 mr-1" /> {t.btnCopy}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. English & Franco Keyboard Output */}
                        <Card className="glass-panel border-white/5 rounded-lg overflow-hidden flex flex-col justify-between">
                            <CardHeader className="pb-3 border-b border-white/5">
                                <CardTitle className="text-xs font-bold text-white uppercase tracking-wider">
                                    {t.phoneticArabic} & LTR
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="space-y-1.5">
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Franco / Arabizi Dialect</span>
                                    <p className="text-xs text-neutral-200 bg-white/[0.01] border border-white/5 p-3 rounded leading-relaxed font-mono">{activeText.franco}</p>
                                    <Button
                                        onClick={() => copyText(activeText.franco)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-[10px] text-neutral-400 hover:text-white hover:bg-white/5 mt-1"
                                    >
                                        <Copy className="h-3 w-3 mr-1" /> {t.btnCopy}
                                    </Button>
                                </div>

                                <div className="space-y-1.5 border-t border-white/5 pt-4">
                                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">English Output</span>
                                    <p className="text-xs text-neutral-200 bg-white/[0.01] border border-white/5 p-3 rounded leading-relaxed">{activeText.en}</p>
                                    <Button
                                        onClick={() => copyText(activeText.en)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 text-[10px] text-neutral-400 hover:text-white hover:bg-white/5 mt-1"
                                    >
                                        <Copy className="h-3 w-3 mr-1" /> {t.btnCopy}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Clipboard feedback and Quick Share Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-white/[0.01] border border-white/5 rounded-lg animate-fade-in-up">
                        <div className="flex items-center gap-2">
                            {copied ? (
                                <span className="text-xs font-semibold text-[#3F9F81] flex items-center gap-1">
                                    <ClipboardCheck className="h-4 w-4 text-[#3F9F81]" />
                                    {dir === "rtl" ? "تم نسخ النص إلى الحافظة بنجاح!" : "Message copied to clipboard successfully!"}
                                </span>
                            ) : (
                                <span className="text-xs text-neutral-400">
                                    {dir === "rtl" ? "اضغط على زر النسخ ثم أرسل لصديقك أو موجهك." : "Select copy above, then click below to launch WhatsApp instantly."}
                                </span>
                            )}
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto">
                            <Button
                                onClick={() => shareWhatsApp(activeText.ar_eg)}
                                className="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20BA56] text-white text-xs font-semibold h-9 rounded-md transition-all active:scale-[0.98] shadow-[0_0_15px_rgba(37,211,102,0.1)] px-5"
                            >
                                <Share2 className="h-4 w-4 mr-2" />
                                {dir === "rtl" ? "مشاركة عبر واتساب" : "Launch WhatsApp"}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
