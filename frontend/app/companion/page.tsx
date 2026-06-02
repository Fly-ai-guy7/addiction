"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, Sparkles, HeartPulse, AlertTriangle, ShieldCheck } from "lucide-react";
import { mockSupabase } from "@/lib/mockSupabase";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    isCrisis?: boolean;
}

export default function CompanionPage() {
    const router = useRouter();
    const { t, profile, dir, language } = useBilingual();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
            return;
        }

        // Initialize greeting message based on language/dialect
        const isEg = p.language === "ar_eg";
        const isEn = p.language === "en";
        
        let greeting = "";
        if (isEn) {
            greeting = "Hello! I am your **Aman Companion**. I am here as a private, supportive space to help you navigate urges, explore grounding techniques, or write message drafts. How can I help you today?";
        } else if (isEg) {
            greeting = "أهلاً بيك يا فندم! أنا **مساعد أمان**. أنا هنا عشان أكون معاك خطوة بخطوة في مكان سري وبدون أي أحكام. تحب نعمل تدريب لركوب الموجة، ولا نصيغ رسالة لداعمك، ولا حاسس بضغط وعايز تتكلم؟";
        } else {
            greeting = "مرحباً بك! أنا **مساعد أمان**. أنا رفيقك الرقمي لتعافي آمن وسرّي بالكامل. أقف معك هنا لتجاوز الرغبات الشديدة، صياغة رسائل الدعم للموجهين، أو الإرشاد العاطفي. كيف يمكنني مساندتك اليوم؟";
        }

        setMessages([{ role: "assistant", content: greeting }]);
    }, [router]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const userMsg: ChatMessage = { role: "user", content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setLoading(true);

        // Process response
        setTimeout(() => {
            const isEg = language === "ar_eg";
            const isEn = language === "en";
            const lowercaseText = text.toLowerCase();

            // 1. Safety Checks (Self-harm / Detox)
            if (lowercaseText.includes("suicide") || lowercaseText.includes("kill") || lowercaseText.includes("ينتحر") || lowercaseText.includes("أموت") || lowercaseText.includes("أنهي حياتي")) {
                mockSupabase.logRiskEvent("crisis_chat_flag", `Crisis keyword triggered in chat: "${text}"`);
                
                const warning = isEn 
                    ? "SAFETY NOTICE: We care about you deeply. If you are in immediate distress or considering self-harm, please contact the Egypt Mental Health Helpline (16328), Suicide Prevention (08008880700) immediately. You do not have to carry this alone. Click the red button above for immediate grounding tools."
                    : "تنبيه طوارئ هام: حاسين بيك ومعاك، بس سلامتك هي أهم حاجة دلوقتي. لو بتمر بوقت صعب وبتفكر في إيذاء نفسك، أرجوك اتصل فوراً بالخط الساخن للأمانة العامة للصحة النفسية بمصر (16328) أو خط الوقاية من الانتحار (08008880700) أو كلم حد بتثق فيه. إحنا معاك ولست وحدك.";
                
                setMessages((prev) => [...prev, { role: "assistant", content: warning, isCrisis: true }]);
                setLoading(false);
                return;
            }

            if (lowercaseText.includes("shaking") || lowercaseText.includes("delirium") || lowercaseText.includes("رعشة") || lowercaseText.includes("انسحاب")) {
                mockSupabase.logRiskEvent("detox_chat_flag", `Detox withdrawal indicators flagged: "${text}"`);
                const detoxWarning = isEn
                    ? "MEDICAL WARNING: Withdrawal symptoms like shaking or delirium can be life-threatening. Please seek professional medical detox at the nearest hospital immediately."
                    : "تنبيه طبي عاجل: أعراض الانسحاب الجسدية الشديدة (زي الرعشة الشديدة أو الهذيان) ممكن تكون خطيرة جداً على حياتك. أرجوك توجه فوراً لأقرب مستشفى أو كلم طبيب مختص فوراً لسلامتك.";
                setMessages((prev) => [...prev, { role: "assistant", content: detoxWarning, isCrisis: true }]);
                setLoading(false);
                return;
            }

            // 2. Shortcut Replies
            let reply = "";
            if (lowercaseText.includes("urge") || lowercaseText.includes("موجة") || lowercaseText.includes("شغف")) {
                reply = isEn
                    ? "Let's surf this craving wave together. First, **pause and delay any action for 20 minutes**. Focus entirely on your breath: inhale for 4 seconds, hold for 4 seconds, and exhale for 4 seconds. Cravings are chemistry—they rise, peak, and then wash away. You are safe."
                    : isEg
                    ? "يلا نركب موجة الرغبة دي سوا ونعديها. أول حاجة، **أجل أي تصرف لمدة ٢٠ دقيقة**. ركز كل انتباهك على نفسك: شهيق رايق في ٤ ثواني، اكتمه ٤ ثواني، وطلعه في زفير هادي ٤ ثواني. الرغبة كيميا في المخ هتاخد وقتها وتتلاشى تماماً. أنت قدها وفي أمان."
                    : "دعنا نركب موجة الرغبة معاً لنتجاوزها بسلام. أولاً، **أجل اتخاذ أي إجراء لمدة ٢٠ دقيقة كاملة**. ركز انتباهك بالكامل على أنفاسك: شهيق عميق في ٤ ثوانٍ، احبسه ٤ ثوانٍ، ثم زفير بطيء في ٤ ثوانٍ. تذكر أن الرغبة مجرد تفاعل كيميائي، ستصل لذروتها وتتلاشى تماماً.";
            } else if (lowercaseText.includes("sponsor") || lowercaseText.includes("موجه") || lowercaseText.includes("رسالة")) {
                reply = isEn
                    ? "I can help you break isolation. Here is a direct draft template you can copy:\n\n*\"I am having a high urge today and don't want to isolate. Can you call me when you have a moment?\"*\n\nYou can access our **Message Builder** page for dialect and phonetic Arabizi options."
                    : isEg
                    ? "كسر العزلة هو حجر الأساس للتعافي. اتفضل الصيغة دي تقدر تبعتها لداعمك أو صديق آمن فوراً:\n\n*\"أنا مضغوط شوية النهاردة ومش عايز أنعزل. ممكن تكلمني لما تفضى؟\"*\n\nوتقدر تروح لصفحة **صياغة رسائل الدعم** عشان تلاقي صيغ تانية بالعامية والفرانكو."
                    : "كسر العزلة هو الخطوة الأهم للتعافي. إليك صيغة رسالة قصيرة ومباشرة يمكنك نسخها لموجهك أو داعمك:\n\n*\"أعاني من رغبة ملحة اليوم ولا أريد الانعزال. هل يمكننا التحدث عندما تتاح لك الفرصة؟\"*\n\nكما يمكنك زيارة صفحة **مولد الرسائل** للحصول على خيارات متعددة بالفصحى والفرانكو.";
            } else if (lowercaseText.includes("slip") || lowercaseText.includes("كبوة") || lowercaseText.includes("هفوة") || lowercaseText.includes("وقعت")) {
                reply = isEn
                    ? "A slip is a data point for learning, not a failure. It does not erase your clean time or the hard work you have put in. Take a deep breath. Do not isolate. Reach out to a support person and remember that your recovery progress is still entirely yours."
                    : isEg
                    ? "الكبوة دي مجرد محطة للتعلم، مش نهاية الطريق. وقوعك النهاردة مش معناه إن مجهودك وأيام تعافيك اللي فاتت راحت في الأرض. مجهودك لسه ملكك. خد نفس عميق، بلاش تنعزل، وتواصل مع موجهك أو صديق آمن. كل الدعم ليك."
                    : "الهفوة أو الكبوة هي مجرد منعطف للتعلم وليست نهاية الطريق. زلتك اليوم لا تمحو إنجازاتك وأيام تعافيك السابقة. خذ نفساً عميقاً. تجنب الانعزال تماماً، وتواصل فوراً مع داعمك أو شخص آمن. تقدمك لا يزال ملكك.";
            } else {
                // General Empathy responses
                reply = isEn
                    ? "I hear you, and I am here with you in this private sanctuary. Your thoughts are completely private, and every small step you take is a win. What is on your mind?"
                    : isEg
                    ? "حاسس بيك وسامعك يا فندم. مكانك هنا سري ومحمي مية في المية، وكل خطوة صغيرة بتعملها هي نجاح حقيقي. تحب نحكي في إيه؟"
                    : "أسمعك جيداً وأقف بجانبك في هذا الملاذ الآمن والسرّي بالكامل. تذكر أن كل خطوة صغيرة تخطوها هي انتصار حقيقي لتعافيك. ما الذي يشغل تفكيرك الآن؟";
            }

            setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
            setLoading(false);
        }, 1000);
    };

    if (!profile) return null;

    const shortcuts = [
        { label: language === "en" ? "🌊 Surf an Urge" : language === "ar_eg" ? "🌊 ركوب موجة الرغبة" : "🌊 ركوب موجة الرغبة", text: "urge" },
        { label: language === "en" ? "✉️ Sponsor Message" : language === "ar_eg" ? "✉️ رسالة للموجه" : "✉️ رسالة للموجه", text: "sponsor" },
        { label: language === "en" ? "🌱 Reflect after Slip" : language === "ar_eg" ? "🌱 كبوة وعايز أتعلم" : "🌱 كبوة وأريد التعلم", text: "slip" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden h-screen">
            {/* Background blur styling */}
            <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-[#3F9F81]/[0.01] rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col flex-1 h-full min-w-0">
                <AmanNavbar />

                <div className="flex-1 max-w-3xl mx-auto px-6 py-6 w-full flex flex-col justify-between overflow-hidden">
                    <header className="mb-4 flex items-center justify-between shrink-0">
                        <div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-0.5">
                                <Sparkles className="h-3.5 w-3.5 text-[#3F9F81] animate-pulse" />
                                Interactive AI Guide
                            </div>
                            <h1 className="text-xl font-bold text-white tracking-tight">
                                {t.companionTitle}
                            </h1>
                        </div>
                        <span className="h-2 w-2 rounded-full bg-[#3F9F81] shadow-[0_0_8px_rgba(63,159,129,0.4)]" />
                    </header>

                    {/* Chat Messages viewport */}
                    <div className="flex-1 overflow-hidden min-h-0 border border-white/5 bg-[#0C121A]/35 backdrop-blur-xl rounded-lg flex flex-col mb-4">
                        <ScrollArea className="flex-1 p-4 custom-scrollbar">
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                                        {m.role === "assistant" && (
                                            <div className="h-7 w-7 border border-white/10 bg-[#080B10] flex items-center justify-center shrink-0 rounded-full">
                                                <Bot className="h-3.5 w-3.5 text-[#3F9F81]" />
                                            </div>
                                        )}
                                        <div className={`rounded-lg p-3.5 text-xs leading-relaxed max-w-[85%] border ${
                                            m.role === "user" 
                                            ? "bg-[#3F9F81] text-white border-transparent shadow-[0_0_12px_rgba(63,159,129,0.1)]" 
                                            : m.isCrisis 
                                            ? "bg-red-950/40 border-red-500/20 text-red-200"
                                            : "bg-white/[0.01] border-white/5 text-neutral-200"
                                        }`}>
                                            {m.content.split("\n").map((line, idx) => (
                                                <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                                                    {line.startsWith("*") && line.endsWith("*") ? (
                                                        <em className="font-semibold block bg-black/15 p-2 rounded border border-white/5 my-1 not-italic text-white font-mono">{line.replaceAll("*", "")}</em>
                                                    ) : line}
                                                </p>
                                            ))}
                                        </div>
                                        {m.role === "user" && (
                                            <div className="h-7 w-7 border border-white/10 bg-white flex items-center justify-center shrink-0 rounded-full">
                                                <User className="h-3.5 w-3.5 text-black" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {loading && (
                                    <div className="flex gap-3 justify-start animate-pulse">
                                        <div className="h-7 w-7 border border-white/5 bg-[#080B10] flex items-center justify-center rounded-full">
                                            <Sparkles className="h-3.5 w-3.5 text-neutral-500 animate-spin" />
                                        </div>
                                        <div className="bg-white/[0.01] border border-white/5 rounded-lg p-3.5 text-xs text-neutral-400">
                                            {dir === "rtl" ? "مساعد أمان يفكر..." : "Aman Companion reflecting..."}
                                        </div>
                                    </div>
                                )}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>
                        
                        {/* Instant Shortcut Prompts */}
                        <div className="px-4 py-2 border-t border-white/5 flex gap-2 overflow-x-auto shrink-0 custom-scrollbar bg-black/10">
                            {shortcuts.map((sc, idx) => (
                                <Button
                                    key={idx}
                                    size="sm"
                                    onClick={() => handleSend(sc.text)}
                                    className="bg-white/[0.02] border border-white/5 text-neutral-400 hover:text-white hover:bg-white/5 hover:border-white/10 h-7 text-[10px] px-2.5 rounded-full shrink-0"
                                >
                                    {sc.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Chat input box */}
                    <div className="shrink-0 space-y-2">
                        <div className="flex gap-2 relative items-center">
                            <Input
                                placeholder={t.placeholderChat}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
                                disabled={loading}
                                className="flex-1 bg-white/[0.01] hover:bg-white/[0.03] focus-visible:bg-white/[0.04] border-white/10 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs rounded-md h-10 transition-all text-white placeholder-neutral-600"
                            />
                            <Button 
                                onClick={() => handleSend(inputValue)} 
                                disabled={loading || !inputValue.trim()}
                                className="bg-white hover:bg-neutral-200 text-black shadow-glow-silver h-10 w-10 p-0 rounded-md shrink-0 flex items-center justify-center transition-all duration-300 active:scale-95"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-[9px] text-neutral-600 leading-normal text-center">
                            {t.companionDisclaimer}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
