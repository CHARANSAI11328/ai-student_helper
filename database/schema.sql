-- Learnova AI — Production PostgreSQL / Supabase Database Schema
-- Multi-Grade School STEM Learning Companion (Grades 6–12)

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE, -- Supabase auth.users reference when auth is active
  name VARCHAR(100) NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 12),
  language VARCHAR(10) NOT NULL DEFAULT 'en', -- 'en', 'te', 'hi'
  strong_subjects TEXT[] DEFAULT '{}',
  weak_subjects TEXT[] DEFAULT '{}',
  learning_goals TEXT DEFAULT '',
  explanation_style VARCHAR(30) DEFAULT 'step_by_step', -- 'simple', 'step_by_step', 'visual_detailed'
  confidence_level VARCHAR(30) DEFAULT 'moderate', -- 'beginner', 'moderate', 'confident'
  streak_count INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  total_study_minutes INTEGER DEFAULT 0,
  xp_points INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
  id VARCHAR(30) PRIMARY KEY, -- 'math', 'physics', 'chemistry'
  name VARCHAR(100) NOT NULL,
  color_code VARCHAR(20) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  description TEXT NOT NULL
);

-- 3. Topics Table (Hierarchical Curriculum for Grades 6-12)
CREATE TABLE IF NOT EXISTS topics (
  id VARCHAR(50) PRIMARY KEY,
  subject_id VARCHAR(30) NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 6 AND 12),
  title VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  order_index INTEGER DEFAULT 1,
  description TEXT NOT NULL,
  prerequisites TEXT[] DEFAULT '{}',
  key_formulas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Topic Progress & Adaptive Mastery Tracking
CREATE TABLE IF NOT EXISTS topic_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic_id VARCHAR(50) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  mastery_score NUMERIC(4,3) DEFAULT 0.000 CHECK (mastery_score BETWEEN 0 AND 1),
  status VARCHAR(30) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'needs_revision', 'mastered')),
  attempts_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  last_mistake_concept TEXT,
  last_practiced_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, topic_id)
);

-- 5. Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(30) NOT NULL REFERENCES subjects(id),
  grade INTEGER NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Messages Table (Supports Socratic structured responses & multimodal metadata)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender VARCHAR(20) NOT NULL CHECK (sender IN ('student', 'tutor')),
  content TEXT NOT NULL,
  structured_response JSONB, -- 9-step pedagogical breakdown
  image_url TEXT,
  ocr_extracted_text TEXT,
  is_verified_math BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject VARCHAR(30) NOT NULL REFERENCES subjects(id),
  topic_id VARCHAR(50) NOT NULL REFERENCES topics(id),
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  weak_concepts TEXT[] DEFAULT '{}',
  mastery_delta NUMERIC(4,3) DEFAULT 0.000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Quiz Responses Table (Detailed Question-level tracking)
CREATE TABLE IF NOT EXISTS quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  concept_tested VARCHAR(150) NOT NULL,
  student_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Saved Notes Table
CREATE TABLE IF NOT EXISTS saved_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  subject VARCHAR(30) NOT NULL REFERENCES subjects(id),
  topic_id VARCHAR(50),
  content_markdown TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  badge_icon VARCHAR(50) NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  category VARCHAR(30) DEFAULT 'learning'
);

-- 11. Student Achievements Table
CREATE TABLE IF NOT EXISTS student_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id VARCHAR(50) NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);

-- 12. Feedback & Safety Reports Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  safety_flag BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_topic_progress_student ON topic_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_conversations_student ON conversations(student_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_notes_student ON saved_notes(student_id);

-- Row Level Security (RLS) Enablement
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
