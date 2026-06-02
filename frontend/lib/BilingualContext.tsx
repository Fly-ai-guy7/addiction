"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./translations";
import { mockSupabase, Profile } from "./mockSupabase";

interface BilingualContextType {
    language: Language;
    t: typeof translations["ar"];
    dir: "rtl" | "ltr";
    profile: Profile | null;
    toggleLanguage: (lang: Language) => void;
    refreshProfile: () => void;
}

const BilingualContext = createContext<BilingualContextType | undefined>(undefined);

export function BilingualProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("ar");
    const [profile, setProfile] = useState<Profile | null>(null);

    const refreshProfile = () => {
        const p = mockSupabase.getProfile();
        setProfile(p);
        if (p) {
            setLanguage(p.language);
        }
    };

    useEffect(() => {
        refreshProfile();
    }, []);

    const toggleLanguage = (lang: Language) => {
        setLanguage(lang);
        if (profile) {
            mockSupabase.updateProfileLanguage(lang);
            refreshProfile();
        }
    };

    const dir = (language === "ar" || language === "ar_eg") ? "rtl" : "ltr";
    const t = translations[language] || translations["ar"];

    return (
        <BilingualContext.Provider value={{ language, t, dir, profile, toggleLanguage, refreshProfile }}>
            <div dir={dir} className={language === "en" ? "font-sans" : "font-sans"}>
                {children}
            </div>
        </BilingualContext.Provider>
    );
}

export function useBilingual() {
    const context = useContext(BilingualContext);
    if (!context) {
        throw new Error("useBilingual must be used within a BilingualProvider");
    }
    return context;
}
