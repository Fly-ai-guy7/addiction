"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ChatSidebar } from "@/components/chat-sidebar";
import { api } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle, Sparkles, Send, RefreshCw, Mail, ArrowRight } from "lucide-react";

export default function SalesWorkflowPage() {
    const [leadName, setLeadName] = useState("");
    const [company, setCompany] = useState("");
    const [workflowId, setWorkflowId] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [draft, setDraft] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const startWorkflow = async () => {
        setLoading(true);
        try {
            const res = await api.post("/workflows/start", { lead_name: leadName, company: company });
            setWorkflowId(res.data.workflow_id);
            setStatus(res.data.status);
            setDraft(res.data.draft);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: "approve" | "reject") => {
        setLoading(true);
        try {
            const res = await api.post("/workflows/approve", { workflow_id: workflowId, action });
            setStatus(res.data.status);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-[#030305] text-neutral-200 overflow-hidden">
            <ChatSidebar className="hidden md:block" />
            <main className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
                {/* Visual Ambient Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-4xl mx-auto py-4">
                    <header className="mb-10">
                        <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-2">
                            <Sparkles className="h-3 w-3 text-neutral-400" />
                            Autonomous Workflow
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white glow-text-white">
                            Sales Auto-Pilot
                        </h1>
                        <p className="text-xs text-neutral-400 mt-1">
                            Deploy LangGraph agents to run deep outreach research and generate personalized communications.
                        </p>
                    </header>

                    {!workflowId ? (
                        <Card className="max-w-md glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden animate-fade-in-up">
                            <CardHeader className="border-b border-white/5 pb-4">
                                <CardTitle className="text-sm font-semibold tracking-wide text-white flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-neutral-400" />
                                    Configure Outreach
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Lead Name</label>
                                    <Input 
                                        value={leadName} 
                                        onChange={(e) => setLeadName(e.target.value)} 
                                        placeholder="e.g. Satya Nadella" 
                                        className="bg-white/[0.02] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Company</label>
                                    <Input 
                                        value={company} 
                                        onChange={(e) => setCompany(e.target.value)} 
                                        placeholder="e.g. Microsoft" 
                                        className="bg-white/[0.02] border-white/10 text-xs text-white placeholder-neutral-600 focus-visible:border-white/20 focus-visible:ring-0 focus-visible:ring-offset-0"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="border-t border-white/5 pt-4 pb-4">
                                <Button 
                                    className="w-full bg-white hover:bg-neutral-200 text-black shadow-glow-silver text-xs font-semibold h-10 transition-all duration-300 rounded-md active:scale-[0.98]" 
                                    onClick={startWorkflow} 
                                    disabled={loading || !leadName || !company}
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
                                    ) : (
                                        <ArrowRight className="mr-2 h-4 w-4 text-black" />
                                    )}
                                    Launch Agent Subroutine
                                </Button>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="max-w-2xl space-y-6 animate-fade-in-up">
                            {/* Workflow Status Card */}
                            <div className={`p-4 rounded-lg border glass-panel flex items-center justify-between shadow-glow-silver ${
                                status === "waiting_approval" ? "status-ring-waiting" : 
                                status === "completed" ? "status-ring-completed" : "status-ring-rejected"
                            }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`h-2.5 w-2.5 rounded-full ${
                                        status === "waiting_approval" ? "bg-yellow-500 animate-pulse" : 
                                        status === "completed" ? "bg-emerald-500" : "bg-red-500"
                                    }`} />
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Agent Lifecycle</p>
                                        <span className="text-xs font-semibold text-white capitalize">Status: {status?.replace('_', ' ')}</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-neutral-500">ID: {workflowId.slice(0, 8)}</span>
                            </div>

                            {status === "waiting_approval" && (
                                <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden">
                                    <CardHeader className="border-b border-white/5 pb-4">
                                        <CardTitle className="text-sm font-semibold tracking-wide text-white flex items-center justify-between">
                                            <span>Interrupt Action Required</span>
                                            <span className="text-[9px] font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2 py-0.5 rounded uppercase tracking-wider">Awaiting User</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">Generated Outreach Draft</div>
                                        <div className="bg-[#050507]/90 border border-white/5 p-5 rounded-md whitespace-pre-wrap font-mono text-xs text-neutral-300 leading-relaxed mb-6 max-h-[300px] overflow-y-auto custom-scrollbar">
                                            {draft}
                                        </div>
                                        <div className="flex gap-4">
                                            <Button 
                                                onClick={() => handleAction("approve")} 
                                                disabled={loading}
                                                className="flex-1 bg-white hover:bg-neutral-200 text-black shadow-glow-silver text-xs font-semibold h-10 rounded-md transition-all active:scale-[0.98]"
                                            >
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                                Approve & Authorize
                                            </Button>
                                            <Button 
                                                onClick={() => handleAction("reject")} 
                                                disabled={loading}
                                                variant="outline" 
                                                className="flex-1 border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-neutral-400 hover:text-red-400 text-xs font-semibold h-10 rounded-md transition-all active:scale-[0.98]"
                                            >
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Outreach
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {status === "completed" && (
                                <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden">
                                    <CardHeader className="border-b border-white/5 pb-4">
                                        <CardTitle className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Outreach Complete
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            The personalized agent communication has been compiled and dispatched to <strong className="text-white">{leadName}</strong>.
                                        </p>
                                        <div className="p-4 bg-[#050507]/60 rounded-md border border-white/5 text-[11px] text-neutral-400 leading-normal">
                                            Audit signature commited to pgvector and registered within Celery task schedule.
                                        </div>
                                        <Button 
                                            variant="outline" 
                                            className="border-white/10 hover:bg-white/5 text-white text-xs font-semibold h-9 rounded-md transition-all mt-2" 
                                            onClick={() => {
                                                setWorkflowId(null);
                                                setLeadName("");
                                                setCompany("");
                                                setStatus(null);
                                            }}
                                        >
                                            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Start New Subroutine
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {status === "rejected" && (
                                <Card className="glass-panel border-white/5 shadow-glow-silver rounded-lg overflow-hidden">
                                    <CardHeader className="border-b border-white/5 pb-4">
                                        <CardTitle className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                            <XCircle className="h-5 w-5 text-red-400" /> Campaign Interrupted
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-6 space-y-4">
                                        <p className="text-xs text-neutral-300 leading-relaxed">
                                            You rejected the generated draft. The orchestration process has been safely aborted and logged.
                                        </p>
                                        <Button 
                                            variant="outline" 
                                            className="border-white/10 hover:bg-white/5 text-white text-xs font-semibold h-9 rounded-md transition-all" 
                                            onClick={() => {
                                                setWorkflowId(null);
                                                setLeadName("");
                                                setCompany("");
                                                setStatus(null);
                                            }}
                                        >
                                            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Configure New Outreach
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
