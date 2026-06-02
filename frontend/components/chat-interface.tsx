"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Bot, Sparkles, Terminal, ChevronRight, Layers } from "lucide-react";
import { useClerk, UserButton } from "@clerk/nextjs";
import { api } from "@/lib/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Message = {
    role: "user" | "assistant";
    content: string;
};

const TEAM_MEMBERS = [
    { name: "Product", role: "CPO", icon: "🚀", desc: "Visionary Product Architect", active: true },
    { name: "IT & Engineering", role: "CTO", icon: "💻", desc: "World-Class Tech Architect", active: false },
    { name: "Marketing", role: "CMO", icon: "🎨", desc: "Visionary Brand Strategist", active: false },
    { name: "Sales", role: "Head of Sales", icon: "💼", desc: "Enterprise Deal Closer", active: false },
    { name: "Social Media", role: "Director", icon: "📱", desc: "Viral Growth Hacker", active: false },
    { name: "People", role: "Chief People Officer", icon: "👥", desc: "Culture & Talent Expert", active: false },
];

export function ChatInterface() {
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"standard" | "corporate">("standard");
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hello! I am **Solar Hypernova**, your advanced multi-agent orchestrator. Ask me to research markets, solve architectural equations, or draft outreach strategies." }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post("/chat/send", {
                message: userMsg.content,
                history: messages,
                mode: mode
            });

            const aiMsg: Message = { role: "assistant", content: res.data.response };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Failed to establish secure socket with the model nodes. Please ensure the backend docker-compose environment is responsive." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#030305] text-neutral-200 overflow-hidden">
            {/* Main Chat Area */}
            <div className="flex flex-col flex-1 h-full min-w-0">
                <header className="flex h-14 items-center justify-between gap-4 border-b border-white/5 bg-[#050508]/45 backdrop-blur-md px-8 shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <Terminal className="h-4 w-4 text-neutral-400" />
                        <div className="h-4 w-[1px] bg-white/10" />
                        <div className="relative">
                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value as "standard" | "corporate")}
                                className="text-xs font-semibold tracking-wide text-neutral-200 border border-white/10 rounded-md pl-2 pr-7 py-1 bg-white/[0.02] hover:bg-white/[0.05] focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                            >
                                <option value="standard">Standard Node (GPT-3.5)</option>
                                <option value="corporate">Executive Supervisor (GPT-4)</option>
                            </select>
                            <ChevronRight className="h-3 w-3 text-neutral-400 absolute right-2 top-1.5 rotate-90 pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UserButton afterSignOutUrl="/" appearance={{
                            elements: {
                                avatarBox: "h-7 w-7 border border-white/10 rounded-full"
                            }
                        }} />
                    </div>
                </header>

                <main className="flex-1 overflow-hidden p-6 relative">
                    {/* Glowing aesthetic ambient background blur */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
                    
                    <ScrollArea className="h-full pr-4 custom-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-6 py-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex gap-4 ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}>
                                    {m.role === "assistant" && (
                                        <Avatar className="h-8 w-8 border border-white/10 bg-[#08080a] flex items-center justify-center shrink-0">
                                            <AvatarFallback className="bg-transparent text-white"><Bot className="h-4 w-4" /></AvatarFallback>
                                            <AvatarImage src="/bot-avatar.png" className="p-1" />
                                        </Avatar>
                                    )}
                                    <div className={`max-w-[85%] rounded-lg p-4 leading-relaxed text-xs border ${
                                        m.role === "user" 
                                        ? "bg-white text-black border-white/20 font-medium shadow-glow-silver" 
                                        : "glass-panel text-neutral-200 border-white/5"
                                    }`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                img: ({ node, ...props }) => <img {...props} className="max-w-full rounded-md my-2 border border-white/10 shadow-glow-silver" alt={props.alt || "Ingested Document View"} />,
                                                a: ({ node, ...props }) => <a {...props} className="underline text-white font-semibold hover:opacity-85" target="_blank" rel="noopener noreferrer" />,
                                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                                li: ({ children }) => <li className="mb-0.5">{children}</li>,
                                                code({ node, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return match ? (
                                                        <div className="rounded-md border border-white/5 bg-[#050507]/90 overflow-hidden my-3">
                                                            <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.02] border-b border-white/5 text-[10px] text-neutral-400 font-mono">
                                                                <span>{match[1].toUpperCase()}</span>
                                                                <span className="text-[9px] uppercase tracking-wider text-neutral-600">ReadOnly</span>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                // @ts-ignore
                                                                style={vscDarkPlus}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                customStyle={{
                                                                    background: "transparent",
                                                                    padding: "12px",
                                                                    margin: 0,
                                                                    fontSize: "11px",
                                                                    lineHeight: "1.5"
                                                                }}
                                                                {...props}
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-neutral-300" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {m.content}
                                        </ReactMarkdown>
                                    </div>
                                    {m.role === "user" && (
                                        <Avatar className="h-8 w-8 border border-white/15 bg-white flex items-center justify-center shrink-0">
                                            <AvatarFallback className="bg-transparent text-black"><User className="h-4 w-4" /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-4 justify-start animate-pulse">
                                    <Avatar className="h-8 w-8 border border-white/5 bg-[#08080a] flex items-center justify-center">
                                        <AvatarFallback className="bg-transparent"><Sparkles className="h-4 w-4 text-neutral-400 animate-spin" /></AvatarFallback>
                                    </Avatar>
                                    <div className="glass-panel max-w-[85%] rounded-lg p-4 border border-white/5 text-xs text-neutral-400 flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                                        <span>Orchestrating agent subroutines...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </main>

                <footer className="border-t border-white/5 bg-[#050507]/40 backdrop-blur-md p-4 shrink-0 z-10">
                    <div className="max-w-3xl mx-auto flex gap-3 relative items-center">
                        <Input
                            placeholder="Instruct Solar Hypernova..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                            disabled={isLoading}
                            className="flex-1 bg-white/[0.01] hover:bg-white/[0.03] focus-visible:bg-white/[0.04] border-white/10 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 text-xs rounded-md h-10 transition-all text-white placeholder-neutral-500"
                        />
                        <Button 
                            onClick={sendMessage} 
                            disabled={isLoading || !input.trim()}
                            className="bg-white hover:bg-neutral-200 text-black shadow-glow-silver h-10 w-10 p-0 rounded-md shrink-0 flex items-center justify-center transition-all duration-300 active:scale-95"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </footer>
            </div>

            {/* Executive Board (Only in Corporate Mode) */}
            {mode === "corporate" && (
                <div className="w-80 border-l border-white/5 bg-[#050508]/80 backdrop-blur-xl p-6 shrink-0 h-full flex flex-col justify-between overflow-hidden animate-fade-in-up">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <h2 className="text-xs font-semibold mb-6 flex items-center gap-2 tracking-widest text-neutral-400 uppercase">
                            <Layers className="h-3.5 w-3.5" /> Executive Sub-Agents
                        </h2>
                        <ScrollArea className="flex-1 pr-1 custom-scrollbar">
                            <div className="space-y-3 pb-4">
                                {TEAM_MEMBERS.map((member, i) => (
                                    <Card key={i} className="bg-white/[0.01] border-white/5 rounded-md hover:bg-white/[0.03] transition-all hover:border-white/10 hover:shadow-glow-silver group cursor-default">
                                        <CardHeader className="p-3 pb-1 flex flex-row items-center gap-3 space-y-0">
                                            <div className="text-lg bg-white/[0.03] group-hover:bg-white/[0.08] p-1.5 rounded-md border border-white/5 transition-all">{member.icon}</div>
                                            <div className="min-w-0">
                                                <CardTitle className="text-xs font-bold text-white tracking-wide truncate">{member.role}</CardTitle>
                                                <p className="text-[10px] text-neutral-500 font-medium truncate">{member.name}</p>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-1">
                                            <p className="text-[10px] italic text-neutral-400 leading-normal">"{member.desc}"</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 text-[9px] text-neutral-600 leading-relaxed">
                        Supervisor coordinates IT, Marketing, Sales, Social, HR, and Product via semantic routing matrix.
                    </div>
                </div>
            )}
        </div>
    );
}
