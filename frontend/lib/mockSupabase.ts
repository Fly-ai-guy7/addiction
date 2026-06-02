import { Language } from "./translations";

export interface Profile {
    id: string;
    username: string;
    language: Language;
    focusArea: string;
    currentStatus: string;
    emergencyContact?: string;
    createdAt: string;
}

export interface CheckIn {
    id: string;
    mood: number;
    urge: number;
    sleep: number;
    isolation: number;
    spokeToSomeone: boolean;
    journalText: string;
    aiReflection: string;
    createdAt: string;
}

export interface JournalEntry {
    id: string;
    moodTag: string;
    triggerTags: string[];
    content: string;
    aiReflection?: string;
    createdAt: string;
}

export interface RiskEvent {
    id: string;
    triggerType: string;
    details: string;
    createdAt: string;
}

// Simulated Safety Core Heuristics
const CRISIS_KEYWORDS = [
    "suicide", "kill myself", "harm myself", "end my life", 
    "ينتحر", "عايز أموت", "أنهي حياتي", "أنتحر", "الموت",
    "shaking", "delirium", "hallucinations", "أعراض انسحاب", "رعشة"
];

function checkCrisis(text: string): { isCrisis: boolean; type: string; warningAr: string; warningEn: string } {
    const lowercase = text.toLowerCase();
    
    // Physical withdrawal
    if (lowercase.includes("shaking") || lowercase.includes("delirium") || lowercase.includes("رعشة") || lowercase.includes("أعراض انسحاب")) {
        return {
            isCrisis: true,
            type: "medical_detox",
            warningAr: "تنبيه طبي: أعراض الانسحاب الجسدية الشديدة قد تكون خطيرة وتتطلب إشرافاً طبياً فورياً. أرجوك توجه لأقرب مستشفى أو استشر طبيباً مختصاً لسلامتك.",
            warningEn: "Medical Warning: Severe physical withdrawal symptoms can be highly dangerous. Please go to the nearest hospital or consult a physician immediately for safe medical detoxification."
        };
    }
    
    // Suicidal / Self-harm ideation
    for (const kw of CRISIS_KEYWORDS) {
        if (lowercase.includes(kw)) {
            return {
                isCrisis: true,
                type: "self_harm",
                warningAr: "تنبيه طوارئ: حاسين بيك ومعاك، بس سلامتك هي أهم حاجة دلوقتي. لو بتفكر في إيذاء نفسك، أرجوك اتصل فوراً بالخط الساخن للصحة النفسية بمصر (16328) أو خط الوقاية (08008880700) أو كلم حد بتثق فيه. لست وحدك.",
                warningEn: "Safety Notice: We care about you. If you are in immediate distress or considering self-harm, please contact the Egypt Mental Health Helpline (16328), Suicide Prevention (08008880700) immediately or contact a trusted friend. You do not have to carry this alone."
            };
        }
    }
    
    return { isCrisis: false, type: "", warningAr: "", warningEn: "" };
}

// Simulated Reflection Generator based on System Prompts
function generateMockReflection(
    mood: number, 
    urge: number, 
    sleep: number, 
    isolation: number, 
    spokeToSomeone: boolean, 
    journalText: string,
    lang: Language
): string {
    const safety = checkCrisis(journalText);
    if (safety.isCrisis) {
        return lang === "en" ? safety.warningEn : safety.warningAr;
    }

    // Standard reflection matching language
    if (lang === "en") {
        let reflection = `It takes deep strength to log your progress today. You graded your mood as ${mood}/10. `;
        if (urge >= 8) {
            reflection += `We see that cravings are feeling very high (${urge}/10) right now. Cravings are like waves; they peak and then wash away. Please consider visiting the Urgent Support section to complete the 60-second breathing surfing drill. `;
        } else {
            reflection += `Your urge level is stable at ${urge}/10, which is a powerful success. Keep riding this peaceful path. `;
        }
        if (spokeToSomeone) {
            reflection += `Connecting with someone today was a beautiful step. Breaking isolation is key to rewiring. `;
        } else if (isolation >= 7) {
            reflection += `Isolation is feeling high. Consider using our Message Builder to send a brief, effortless check-in text to a safe friend or sponsor today. You do not have to walk this path alone. `;
        }
        reflection += "You are safe, you are anonymous, and you are taking step-by-step progress.";
        return reflection;
    } else {
        const isEg = lang === "ar_eg";
        let reflection = isEg 
            ? `كتابة تقييمك النهاردة هي خطوة شجاعة وقوية جداً. أنت سجلت مزاجك النهاردة ${mood} من ١٠. `
            : `تسجيل حالتك النفسية اليوم هو خطوة شجاعة وتدل على قوة إرادتك. لقد سجلت حالتك المزاجية ${mood} من ١٠. `;
            
        if (urge >= 8) {
            reflection += isEg
                ? `واخدين بالنا إن الرغبة عندك عالية وصعبة النهاردة (${urge}/١٠). الرغبة دي زي موجة البحر، بتعلى وبتوصل لأخرها وبعدين بتهدى وتتلاشى تماماً. ننصحك تروح لقسم الدعم السريع وتجرب منفس التنفس لمدة ٦٠ ثانية. `
                : `نلاحظ أن رغبتك ملحة وشديدة اليوم (${urge}/١٠). تذكر دائماً أن الرغبات تشبه أمواج البحر، ترتفع حتى تبلغ ذروتها ثم تتلاشى تدريجياً. ننصحك بزيارة قسم الدعم العاجل لتجربة منفس التنفس التهدئي. `;
        } else {
            reflection += isEg
                ? `مستوى رغبتك مستقر وهادي عند ${urge} من ١٠، وده نجاح قوى وجامد جداً. كمل بنفس الهدوء. `
                : `مستوى رغبتك مستقر وهادئ اليوم عند ${urge} من ١٠، وهذا يعتبر إنجازاً رائعاً يدعو للفخر. استمر في هذا المسار الآمن. `;
        }
        
        if (spokeToSomeone) {
            reflection += isEg
                ? `مكالمتك أو كلامك مع حد النهاردة كان خطوة ممتازة لكسر العزلة. الدعم البشري بيفرق كتير في طريقنا. `
                : `تواصلك مع شخص ما اليوم هو خطوة رائعة لكسر العزلة. التواصل البشري الصادق هو حجر الأساس للتعافي. `;
        } else if (isolation >= 7) {
            reflection += isEg
                ? `حاسين إن العزلة صعبة عليك النهاردة. جرب تستخدم مولد الرسائل السريع وتبعت رسالة بسيطة ومجهودها قليل لموجهك أو صديق آمن. إحنا معاك خطوة بخطوة ومش لوحدك. `
                : `يبدو أن العزلة تشكل عبئاً عليك اليوم. جرب استخدام مولد الرسائل البسيط لإرسال رسالة قصيرة لموجهك أو صديق آمن. تذكر أنك لست وحدك في هذا المسار. `;
        }
        
        reflection += isEg ? "أنت في أمان، وهويتك سرية بالكامل، وبنتقدم خطوة بخطوة." : "أنت في أمان تام، وهويتك سرية بالكامل، ونمضي معاً خطوة بخطوة.";
        return reflection;
    }
}

// Local Storage Core Implementation keys
const KEYS = {
    PROFILE: "aman_profile",
    CHECKINS: "aman_checkins",
    JOURNALS: "aman_journals",
    RISK_LOGS: "aman_risk_logs"
};

export const mockSupabase = {
    // --- Profiles API ---
    getProfile(): Profile | null {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem(KEYS.PROFILE);
        return data ? JSON.parse(data) : null;
    },

    createProfile(
        username: string, 
        language: Language, 
        focusArea: string, 
        currentStatus: string, 
        emergencyContact?: string
    ): Profile {
        const newProfile: Profile = {
            id: crypto.randomUUID(),
            username,
            language,
            focusArea,
            currentStatus,
            emergencyContact,
            createdAt: new Date().toISOString()
        };
        localStorage.setItem(KEYS.PROFILE, JSON.stringify(newProfile));
        return newProfile;
    },

    updateProfileLanguage(lang: Language): Profile | null {
        const profile = this.getProfile();
        if (!profile) return null;
        profile.language = lang;
        localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
        return profile;
    },

    clearProfile(): void {
        localStorage.removeItem(KEYS.PROFILE);
        localStorage.removeItem(KEYS.CHECKINS);
        localStorage.removeItem(KEYS.JOURNALS);
        localStorage.removeItem(KEYS.RISK_LOGS);
    },

    // --- Check-ins API ---
    getCheckIns(): CheckIn[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(KEYS.CHECKINS);
        return data ? JSON.parse(data) : [];
    },

    addCheckIn(
        mood: number, 
        urge: number, 
        sleep: number, 
        isolation: number, 
        spokeToSomeone: boolean, 
        journalText: string
    ): CheckIn {
        const checkins = this.getCheckIns();
        const profile = this.getProfile();
        const lang = profile ? profile.language : "ar";
        
        const reflection = generateMockReflection(
            mood, urge, sleep, isolation, spokeToSomeone, journalText, lang
        );

        // Heuristic safety logging
        const crisis = checkCrisis(journalText);
        if (crisis.isCrisis) {
            this.logRiskEvent(crisis.type, `Checked in with keyword flags. Status: ${crisis.type}`);
        } else if (urge >= 9) {
            this.logRiskEvent("high_craving_escalation", `Cravings spike rated ${urge}/10`);
        }

        const newCheckIn: CheckIn = {
            id: crypto.randomUUID(),
            mood,
            urge,
            sleep,
            isolation,
            spokeToSomeone,
            journalText,
            aiReflection: reflection,
            createdAt: new Date().toISOString()
        };

        checkins.unshift(newCheckIn); // Newest first
        localStorage.setItem(KEYS.CHECKINS, JSON.stringify(checkins));
        return newCheckIn;
    },

    // --- Private Journals API ---
    getJournals(): JournalEntry[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(KEYS.JOURNALS);
        return data ? JSON.parse(data) : [];
    },

    addJournal(moodTag: string, triggerTags: string[], content: string): JournalEntry {
        const journals = this.getJournals();
        const profile = this.getProfile();
        const lang = profile ? profile.language : "ar";

        const crisis = checkCrisis(content);
        let reflection = "";
        
        if (crisis.isCrisis) {
            this.logRiskEvent(crisis.type, `Journal logged crisis triggers. Type: ${crisis.type}`);
            reflection = lang === "en" ? crisis.warningEn : crisis.warningAr;
        } else {
            reflection = lang === "en" 
                ? "Your journal is private and safe. Writing your feelings down is a highly therapeutic act that breaks the cycle of automated responses. Keep processing your triggers."
                : lang === "ar_eg"
                ? "يومياتك سرية ومحمية بالكامل. إنك تكتب مشاعرك دي خطوة علاجية ممتازة بتكسر دوائر العقل التلقائية. كمل تفريغ مشاعرك وأفكارك بكل حرية."
                : "دفتر يومياتك سرّي ومحمي بالكامل. تفريغ مشاعرك كتابةً هو تمرين علاجي رائع يكسر الأنماط الفكرية التلقائية. استمر في تفريغ أفكارك بكل حرية.";
        }

        const newEntry: JournalEntry = {
            id: crypto.randomUUID(),
            moodTag,
            triggerTags,
            content,
            aiReflection: reflection,
            createdAt: new Date().toISOString()
        };

        journals.unshift(newEntry);
        localStorage.setItem(KEYS.JOURNALS, JSON.stringify(journals));
        return newEntry;
    },

    deleteJournal(id: string): void {
        const journals = this.getJournals();
        const filtered = journals.filter(j => j.id !== id);
        localStorage.setItem(KEYS.JOURNALS, JSON.stringify(filtered));
    },

    // --- Risk Event Logger (Anonymized) ---
    getRiskEvents(): RiskEvent[] {
        if (typeof window === "undefined") return [];
        const data = localStorage.getItem(KEYS.RISK_LOGS);
        return data ? JSON.parse(data) : [];
    },

    logRiskEvent(type: string, details: string): RiskEvent {
        const logs = this.getRiskEvents();
        const newLog: RiskEvent = {
            id: crypto.randomUUID(),
            triggerType: type,
            details,
            createdAt: new Date().toISOString()
        };
        logs.unshift(newLog);
        localStorage.setItem(KEYS.RISK_LOGS, JSON.stringify(logs));
        return newLog;
    },

    // --- Admin/Prototype Dashboard Stats ---
    getAdminStats() {
        const checkins = this.getCheckIns();
        const journals = this.getJournals();
        const risks = this.getRiskEvents();
        const profile = this.getProfile();
        
        // Mock some general metadata splits
        return {
            totalUsersCount: profile ? 1 : 0,
            activeStreakDays: checkins.length,
            checkinsCount: checkins.length,
            journalsCount: journals.length,
            highRiskFlagsCount: risks.length,
            primaryLanguageSplit: profile ? profile.language : "none",
            focusArea: profile ? profile.focusArea : "none",
            stage: profile ? profile.currentStatus : "none"
        };
    }
};
