"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageSquare, LayoutDashboard, SendHorizontal } from "lucide-react";

interface ChatSidebarProps {
    className?: string;
}

export function ChatSidebar({ className }: ChatSidebarProps) {
    const pathname = usePathname();

    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/sales", label: "Sales Agent", icon: SendHorizontal },
    ];

    return (
        <div className={`w-64 border-r border-white/5 h-screen bg-[#060608]/75 backdrop-blur-xl flex flex-col justify-between ${className}`}>
            <div className="flex flex-col flex-1 overflow-hidden py-6">
                <div className="px-6 mb-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="font-bold text-base tracking-tight text-white glow-text-white transition-all duration-300 group-hover:text-neutral-200">
                            Solar Hypernova
                        </span>
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                    </Link>
                </div>
                
                <div className="px-4 mb-6">
                    <Button 
                        asChild
                        variant="outline" 
                        className="w-full justify-start bg-transparent border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 hover:border-white/20 hover:shadow-glow-silver transition-all duration-300 rounded-md h-9 text-xs font-medium"
                    >
                        <Link href="/">
                            <Plus className="mr-2 h-3.5 w-3.5" />
                            New Conversation
                        </Link>
                    </Button>
                </div>

                <div className="px-3 mb-6">
                    <h3 className="mb-2 px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        Navigation
                    </h3>
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant="ghost"
                                    className={`w-full justify-start h-9 text-xs rounded-md transition-all duration-200 ${
                                        isActive 
                                        ? "bg-white/[0.04] border border-white/10 text-white font-medium shadow-glow-silver" 
                                        : "text-neutral-400 hover:text-white hover:bg-white/[0.02] border border-transparent"
                                    }`}
                                >
                                    <Link href={item.href}>
                                        <Icon className={`mr-2.5 h-4 w-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                                        {item.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 px-3 overflow-hidden flex flex-col">
                    <h3 className="mb-2 px-3 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        Recent Chats
                    </h3>
                    <ScrollArea className="flex-1 pr-1 custom-scrollbar">
                        <div className="space-y-1 p-0.5">
                            {[1, 2, 3].map((i) => (
                                <Button
                                    key={i}
                                    variant="ghost"
                                    className="w-full justify-start h-8 text-[11px] font-normal text-neutral-400 hover:text-white hover:bg-white/[0.02] rounded-md transition-all"
                                >
                                    <MessageSquare className="mr-2.5 h-3.5 w-3.5 text-neutral-500" />
                                    <span className="truncate">Outreach Optimization Session</span>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
            
            <div className="p-4 border-t border-white/5 bg-[#040405]/50 flex items-center justify-between text-[10px] text-neutral-600">
                <span>Obsidian Console v0.1</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            </div>
        </div>
    );
}
