"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useBilingual } from "@/lib/BilingualContext";
import { Button } from "@/components/ui/button";
import { mockSupabase } from "@/lib/mockSupabase";
import { 
    AlertTriangle, 
    LayoutDashboard, 
    BookOpen, 
    MessageSquare, 
    ClipboardList, 
    Search, 
    ShieldCheck, 
    Activity, 
    Settings, 
    Globe2,
    RefreshCw
} from "lucide-react";

export function AmanNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { language, t, dir, profile, toggleLanguage, refreshProfile } = useBilingual();

    const menuItems = [
        { href: "/dashboard", label: t.navDashboard, icon: LayoutDashboard },
        { href: "/check-in", label: t.navCheckIn, icon: Activity },
        { href: "/companion", label: t.navCompanion, icon: MessageSquare },
        { href: "/journal", label: t.navJournal, icon: BookOpen },
        { href: "/generator", label: t.navGenerator, icon: ClipboardList },
        { href: "/directory", label: t.navDirectory, icon: Search },
        { href: "/safety", label: t.navSafety, icon: ShieldCheck },
    ];

    const resetDemo = () => {
        mockSupabase.clearProfile();
        refreshProfile();
        router.push("/");
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    return (
        <header className="border-b border-white/5 bg-[#0C121A]/80 backdrop-blur-md sticky top-0 z-50 px-6 h-16 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-bold text-base tracking-wide text-white glow-text-emerald transition-all duration-300">
                        {t.title}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3F9F81] animate-pulse" />
                </Link>

                {profile && (
                    <nav className="hidden xl:flex items-center gap-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Button
                                    key={item.href}
                                    asChild
                                    variant="ghost"
                                    className={`h-9 px-3 text-xs rounded-md transition-all duration-200 ${
                                        isActive 
                                        ? "bg-white/[0.04] text-white font-medium border border-white/5" 
                                        : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
                                    }`}
                                >
                                    <Link href={item.href} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Immediate Crisis Reliever Trigger */}
                <Button
                    asChild
                    variant="destructive"
                    className="bg-red-950/80 border border-red-500/30 text-red-200 hover:bg-red-900 transition-all font-semibold h-9 text-xs px-3 rounded-md animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                >
                    <Link href="/urgent" className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {t.navUrgent}
                    </Link>
                </Button>

                {/* Dialect / Language Selector dropdown */}
                <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-md">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLanguage("ar")}
                        className={`h-7 px-2 text-[10px] rounded font-semibold ${language === "ar" ? "bg-white/10 text-white" : "text-neutral-500"}`}
                    >
                        فصحى
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLanguage("ar_eg")}
                        className={`h-7 px-2 text-[10px] rounded font-semibold ${language === "ar_eg" ? "bg-white/10 text-white" : "text-neutral-500"}`}
                    >
                        مصري
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleLanguage("en")}
                        className={`h-7 px-2 text-[10px] rounded font-semibold ${language === "en" ? "bg-white/10 text-white" : "text-neutral-500"}`}
                    >
                        English
                    </Button>
                </div>

                {profile ? (
                    <div className="flex items-center gap-2">
                        <span className="hidden md:inline text-[10px] font-mono text-neutral-500 bg-white/[0.02] border border-white/5 px-2 py-1 rounded">
                            {profile.username}
                        </span>
                        
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={resetDemo}
                            title="Reset Prototype Data"
                            className="h-9 w-9 text-neutral-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 rounded-md"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <Button
                        asChild
                        variant="ghost"
                        className="text-xs text-neutral-400 hover:text-white h-9 px-3 rounded-md"
                    >
                        <Link href="/onboarding">
                            Onboard
                        </Link>
                    </Button>
                )}

                <Button
                    asChild
                    variant="ghost"
                    className="h-9 px-3 text-xs text-neutral-400 hover:text-white"
                >
                    <Link href="/admin">
                        Admin
                    </Link>
                </Button>
            </div>
        </header>
    );
}
