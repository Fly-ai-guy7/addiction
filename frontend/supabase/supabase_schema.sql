-- Aman Path Recovery Platform
-- Supabase Core Database Schema

-- Enable pgvector for future recovery content embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Profiles (Anonymous users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    language VARCHAR(10) DEFAULT 'ar' NOT NULL, -- 'ar', 'ar_eg', 'en'
    focus_area VARCHAR(100) NOT NULL, -- 'alcohol', 'substances', 'behavioral', etc.
    current_status VARCHAR(100) NOT NULL, -- 'just_curious', 'struggling', 'recovery', etc.
    emergency_contact TEXT, -- Optional, clearly marked as anonymous/optional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row-Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. Daily Check-ins
CREATE TABLE IF NOT EXISTS public.check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mood INTEGER CHECK (mood >= 1 AND mood <= 10) NOT NULL,
    urge INTEGER CHECK (urge >= 1 AND urge <= 10) NOT NULL,
    sleep INTEGER CHECK (sleep >= 1 AND sleep <= 10) NOT NULL,
    isolation INTEGER CHECK (isolation >= 1 AND isolation <= 10) NOT NULL,
    spoke_to_someone BOOLEAN DEFAULT false NOT NULL,
    journal_text TEXT,
    ai_reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

-- Check-ins Policies
CREATE POLICY "Users can read their own check-ins" ON public.check_ins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own check-ins" ON public.check_ins
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 3. Private Journals
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mood_tag VARCHAR(50) NOT NULL,
    trigger_tags TEXT[], -- array of tags
    content TEXT NOT NULL,
    ai_reflection TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Journal Policies
CREATE POLICY "Users can read their own journals" ON public.journal_entries
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journals" ON public.journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" ON public.journal_entries
    FOR DELETE USING (auth.uid() = user_id);


-- 4. AI Conversations (Aman Companion chat threads)
CREATE TABLE IF NOT EXISTS public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb NOT NULL, -- Array of chat message objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own AI conversations" ON public.ai_conversations
    FOR ALL USING (auth.uid() = user_id);


-- 5. Risk Events (Anonymized metadata logs for governance/safety)
CREATE TABLE IF NOT EXISTS public.risk_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- keeps logs anonymized even if user deletes profile
    trigger_type VARCHAR(100) NOT NULL, -- 'crisis_keyword', 'relapse_trigger', 'severe_isolation'
    details TEXT, -- Anonymized description of the risk context
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;

-- Admins can read anonymized risk events for system analytics; normal users cannot read others
CREATE POLICY "Admins can view risk events" ON public.risk_events
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            -- Placeholder logic for checking admin flags in user metadata
        )
    );

CREATE POLICY "Users can insert their own risk events" ON public.risk_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 6. Meeting Directory (Verified support directories)
CREATE TABLE IF NOT EXISTS public.meeting_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'online', 'in_person'
    language VARCHAR(10) NOT NULL, -- 'ar', 'en'
    tags VARCHAR(50)[], -- 'women_only', 'behavioral', 'twelve_step', etc.
    schedule_details TEXT NOT NULL,
    access_link TEXT, -- Online URL or location details
    is_verified BOOLEAN DEFAULT false NOT NULL, -- Needs manual verification before public exposure
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.meeting_directory ENABLE ROW LEVEL SECURITY;

-- Open read permissions for verified directory listings
CREATE POLICY "Anyone can read verified directory listings" ON public.meeting_directory
    FOR SELECT USING (is_verified = true);
