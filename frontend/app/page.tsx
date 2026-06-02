"use client";

import Link from "next/link";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users2, EyeOff, KeyRound, Sparkles, Heart } from "lucide-react";

export default function LandingPage() {
    const { t, profile, dir } = useBilingual();

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            {/* Soft, warm ambient desert dune lighting */}
            <div className="absolute top-[-100px] left-1/4 w-[600px] h-[600px] bg-[#3F9F81]/[0.02] rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-100px] right-10 w-[500px] h-[500px] bg-[#D4A373]/[0.01] rounded-full blur-[180px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-6xl mx-auto px-6 py-12 lg:py-20 z-10 w-full">
                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[10px] font-bold tracking-widest text-[#3F9F81] uppercase mb-6">
                            <Sparkles className="h-3 w-3 text-[#3F9F81]" />
                            {t.subtitle}
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                            {t.landingHero}
                        </h1>
                        
                        <p className="text-sm lg:text-base text-neutral-400 leading-relaxed mb-8 max-w-2xl mx-auto">
                            {t.landingSub}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            {profile ? (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white hover:bg-neutral-200 text-black text-xs font-semibold h-11 px-8 rounded-md transition-all active:scale-[0.98] shadow-glow-silver"
                                >
                                    <Link href="/dashboard">
                                        {dir === "rtl" ? "الدخول إلى لوحة التحكم الخاصة بي" : "Go to my Recovery Dashboard"}
                                    </Link>
                                </Button>
                            ) : (
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white hover:bg-neutral-200 text-black text-xs font-semibold h-11 px-8 rounded-md transition-all active:scale-[0.98] shadow-glow-silver"
                                >
                                    <Link href="/onboarding">
                                        {t.landingButton}
                                    </Link>
                                </Button>
                            )}

                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="border-white/10 hover:bg-white/5 text-xs text-neutral-300 font-semibold h-11 px-6 rounded-md transition-all"
                            >
                                <Link href="/safety">
                                    {t.navSafety}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Three Pillars Overview */}
                    <div className="grid md:grid-cols-3 gap-6 mb-20 animate-fade-in-up">
                        <div className="glass-panel p-6 rounded-lg border border-white/5 hover:border-[#3F9F81]/25 transition-all">
                            <Users2 className="h-7 w-7 text-[#3F9F81] mb-4" />
                            <h3 className="text-sm font-bold text-white mb-2">{t.whyTitle}</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">{t.whyDescription}</p>
                        </div>

                        <div className="glass-panel p-6 rounded-lg border border-white/5 hover:border-[#3F9F81]/25 transition-all">
                            <EyeOff className="h-7 w-7 text-[#3F9F81] mb-4" />
                            <h3 className="text-sm font-bold text-white mb-2">{t.trustTitle}</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">{t.trustDescription}</p>
                        </div>

                        <div className="glass-panel p-6 rounded-lg border border-white/5 hover:border-[#3F9F81]/25 transition-all">
                            <KeyRound className="h-7 w-7 text-[#3F9F81] mb-4" />
                            <h3 className="text-sm font-bold text-white mb-2">Designed for MENA</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                {dir === "rtl" 
                                ? "مصمم خصيصاً لمراعاة التقاليد العائلية، وتخفيف الوصمة، ومساعدة الأفراد في مصر والمنطقة العربية على كسر دائرة الإدمان بخصوصية وسرية متكاملة." 
                                : "Specially customized to navigate family expectations, reduce local social stigma, and empower individuals in Egypt/MENA to safely break the cycles of habits in total anonymity."}
                            </p>
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="glass-panel p-8 rounded-lg border border-white/5 mb-16 animate-fade-in-up">
                        <h2 className="text-lg font-bold text-white text-center mb-8">{t.howTitle}</h2>
                        
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-[#3F9F81]">{t.howStep1}</h4>
                                <p className="text-xs text-neutral-300 font-semibold">{t.howStep1Desc}</p>
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    {dir === "rtl" ? "لا نطلب معلومات حقيقية أو هوية شخصية. أمانك يبدأ بأسماء وهمية خالية من المراقبة." : "Zero credentials required. Your safety begins with a selected screen name and zero traceability."}
                                </p>
                            </div>

                            <div className="space-y-2 border-t md:border-t-0 md:border-r md:border-l border-white/5 pt-6 md:pt-0 md:px-6">
                                <h4 className="text-xs font-bold text-[#3F9F81]">{t.howStep2}</h4>
                                <p className="text-xs text-neutral-300 font-semibold">{t.howStep2Desc}</p>
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    {dir === "rtl" ? "قم بتقييم مزاجك اليومي وتدوين خواطرك، ليولد لك الذكاء الاصطناعي انعكاساً خاصاً داعماً وخالياً من الأحكام." : "Review key recovery indicators and complete logs to generate custom reflections from our safe AI."}
                                </p>
                            </div>

                            <div className="space-y-2 pt-6 md:pt-0">
                                <h4 className="text-xs font-bold text-[#3F9F81]">{t.howStep3}</h4>
                                <p className="text-xs text-neutral-300 font-semibold">{t.howStep3Desc}</p>
                                <p className="text-[10px] text-neutral-500 leading-relaxed">
                                    {dir === "rtl" ? "تخطَ الرغبات الشديدة فوراً بمؤقتات التهدئة ومولدات رسائل الاستغاثة المجهولة لإرسالها لأصدقاء موثوقين." : "Navigate urge surfing seamlessly with built-in breath pacing bubbles and quick copy SMS generators."}
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <footer className="border-t border-white/5 bg-[#080B10]/90 py-6 text-center z-10">
                <p className="text-[10px] text-neutral-600 flex items-center justify-center gap-1.5 leading-relaxed">
                    <Heart className="h-3 w-3 text-[#3F9F81]" />
                    {dir === "rtl" 
                    ? "أمان باث © ٢٠٢٦ — رفيق تعافيك السري الآمن في مصر والشرق الأوسط." 
                    : "Aman Path © 2026 — Your private recovery companion in Egypt and the MENA region."}
                </p>
                <p className="text-[9px] text-neutral-700 mt-1">
                    {dir === "rtl" ? "مسار أمان لا يغني عن الدعم الطبي الطارئ. في حالات الطوارئ القصوى، اتصل فوراً بالخطوط الساخنة الوطنية." : "Aman Path is not a replacement for clinical emergency. In acute distress, contact state helplines immediately."}
                </p>
            </footer>
        </div>
    );
}
