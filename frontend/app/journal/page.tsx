"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { AmanNavbar } from "@/components/AmanNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockSupabase, JournalEntry } from "@/lib/mockSupabase";
import { BookOpen, ShieldCheck, Heart, Trash2, Search, Plus, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

export default function JournalPage() {
    const router = useRouter();
    const { t, profile, dir, language } = useBilingual();
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    
    // Form states
    const [content, setContent] = useState("");
    const [moodTag, setMoodTag] = useState("Calm");
    const [triggerText, setTriggerText] = useState("");
    
    // Filter / Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const p = mockSupabase.getProfile();
        if (!p) {
            router.push("/onboarding");
            return;
        }
        setJournals(mockSupabase.getJournals());
    }, [router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setTimeout(() => {
            const triggers = triggerText.trim()
                ? triggerText.split(",").map(tag => tag.trim().toLowerCase()).filter(Boolean)
                : [];

            mockSupabase.addJournal(moodTag, triggers, content.trim());
            
            // Reset form
            setContent("");
            setTriggerText("");
            setMoodTag("Calm");
            
            // Reload journals list
            setJournals(mockSupabase.getJournals());
            setLoading(false);
        }, 600);
    };

    const handleDelete = (id: string) => {
        mockSupabase.deleteJournal(id);
        setJournals(mockSupabase.getJournals());
    };

    // Filtered journal history
    const filteredJournals = journals.filter(j => {
        const text = j.content.toLowerCase();
        const search = searchQuery.toLowerCase();
        const matchesContent = text.includes(search);
        const matchesMood = j.moodTag.toLowerCase().includes(search);
        const matchesTriggers = j.triggerTags.some(t => t.includes(search));
        return matchesContent || matchesMood || matchesTriggers;
    });

    if (!profile) return null;

    const moodOptions = [
        { label: language === "en" ? "😊 Calm / Hopeful" : "😊 هادئ / متفائل", val: "Calm" },
        { label: language === "en" ? "😴 Tired / Fatigued" : "😴 متعب / مرهق", val: "Tired" },
        { label: language === "en" ? "😰 Anxious / Nervous" : "😰 متوتر / قلق", val: "Anxious" },
        { label: language === "en" ? "😠 Angry / Irritated" : "😠 غاضب / منفعل", val: "Angry" },
        { label: language === "en" ? "😔 Lonely / Isolated" : "😔 وحيد / منعزل", val: "Lonely" },
    ];

    return (
        <div className="min-h-screen bg-[#0A0E14] text-neutral-200 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#3F9F81]/[0.01] rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col flex-1">
                <AmanNavbar />

                <main className="flex-1 max-w-4xl mx-auto px-6 py-10 z-10 w-full">
                    {/* Privacy Alert Header */}
                    <div className="p-3 bg-[#3F9F81]/5 border border-[#3F9F81]/15 text-[#3F9F81] rounded-lg text-xs leading-relaxed mb-8 flex items-center gap-2.5 animate-fade-in-up">
                        <ShieldCheck className="h-4 w-4 text-[#3F9F81] shrink-0" />
                        <span>
                            {dir === "rtl" 
                            ? "ملاذ سري بالكامل: جميع كتاباتك في اليوميات مشفرة محلياً على متصفحك. لا توجد أي بيانات تغادر جهازك." 
                            : "Sanctuary Lock: All journal content is stored privately inside your local browser. Zero server exposure."}
                        </span>
                    </div>

                    <header className="mb-8 animate-fade-in-up">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-1">
                            <BookOpen className="h-4 w-4 text-neutral-500" />
                            {t.navJournal}
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">
                            {t.journalTitle}
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            {t.journalSub}
                        </p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8 items-start animate-fade-in-up">
                        {/* 1. Log Journal Form */}
                        <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden">
                            <form onSubmit={handleSubmit}>
                                <CardHeader className="border-b border-white/5 pb-3">
                                    <CardTitle className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <Plus className="h-4 w-4 text-[#3F9F81]" />
                                        {dir === "rtl" ? "خاطرة جديدة" : "New Private Reflection"}
                                    </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="space-y-4 pt-6">
                                    {/* Mood Tag Select */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                            {dir === "rtl" ? "الحالة المزاجية" : "Primary Mood Tag"}
                                        </label>
                                        <select
                                            value={moodTag}
                                            onChange={(e) => setMoodTag(e.target.value)}
                                            className="w-full text-xs border border-white/10 rounded-md p-2.5 bg-white/[0.02] text-white focus:outline-none focus:border-white/20 transition-all cursor-pointer"
                                        >
                                            {moodOptions.map(opt => (
                                                <option key={opt.val} value={opt.val}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Trigger Tags Input */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                            {t.labelTags}
                                        </label>
                                        <Input
                                            value={triggerText}
                                            onChange={(e) => setTriggerText(e.target.value)}
                                            placeholder={t.placeholderTags}
                                            className="bg-white/[0.01] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </div>

                                    {/* Content Textarea */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                                            {dir === "rtl" ? "نص الخاطرة" : "Journal Content"}
                                        </label>
                                        <Textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder={t.placeholderJournal}
                                            rows={6}
                                            required
                                            className="bg-white/[0.01] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none leading-relaxed"
                                        />
                                    </div>
                                </CardContent>

                                <CardFooter className="border-t border-white/5 pt-4 pb-4">
                                    <Button
                                        type="submit"
                                        disabled={loading || !content.trim()}
                                        className="w-full bg-[#3F9F81] hover:bg-[#348A6F] text-white text-xs font-semibold h-10 transition-all rounded-md shadow-[0_0_15px_rgba(63,159,129,0.1)] active:scale-[0.98]"
                                    >
                                        {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                                        {t.btnLogJournal}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>

                        {/* 2. Journal History list */}
                        <div className="space-y-4">
                            {/* Search Filter */}
                            <div className="relative flex items-center">
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t.searchJournal}
                                    className="bg-white/[0.01] border-white/10 text-xs text-white pl-9 placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Search className="h-4 w-4 text-neutral-600 absolute left-3 pointer-events-none" />
                            </div>

                            <ScrollArea className="h-[430px] pr-1 custom-scrollbar">
                                <div className="space-y-4">
                                    {filteredJournals.length === 0 ? (
                                        <div className="h-40 flex items-center justify-center border border-dashed border-white/5 rounded-lg text-xs text-neutral-500 text-center p-6">
                                            {searchQuery ? (dir === "rtl" ? "لم نجد نتائج تطابق بحثك." : "No matching private journals found.") : t.noJournal}
                                        </div>
                                    ) : (
                                        filteredJournals.map((journal) => (
                                            <Card key={journal.id} className="glass-panel border-white/5 rounded-md p-4 space-y-3 relative hover:border-white/10 transition-all animate-fade-in-up">
                                                {/* Header info */}
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <span className="text-[9px] font-mono text-neutral-500">
                                                            {new Date(journal.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </span>
                                                        <div className="flex gap-1.5 mt-1 flex-wrap">
                                                            <span className="text-[8px] font-bold bg-white/5 border border-white/5 text-white px-2 py-0.5 rounded capitalize">
                                                                {journal.moodTag}
                                                            </span>
                                                            {journal.triggerTags.map((tag, idx) => (
                                                                <span key={idx} className="text-[8px] font-mono bg-amber-500/5 border border-amber-500/10 text-[#D4A373] px-2 py-0.5 rounded">
                                                                    #{tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Delete Button */}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(journal.id)}
                                                        className="h-8 w-8 text-neutral-600 hover:text-red-400 hover:bg-red-500/5 rounded-full"
                                                        title="Delete permanently"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>

                                                {/* Journal content */}
                                                <p className="text-xs text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
                                                    {journal.content}
                                                </p>

                                                {/* Dynamic Reflection display */}
                                                {journal.aiReflection && (
                                                    <div className="p-3 bg-white/[0.01] border border-white/5 rounded-md text-[10px] text-neutral-400 leading-relaxed">
                                                        <div className="flex items-center gap-1 font-bold text-white mb-1">
                                                            <Sparkles className="h-3.5 w-3.5 text-[#3F9F81]" />
                                                            {t.aiReflectionTitle}
                                                        </div>
                                                        "{journal.aiReflection}"
                                                    </div>
                                                )}
                                            </Card>
                                        ))
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
