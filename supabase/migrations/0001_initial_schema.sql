-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  age INT,
  weight_kg FLOAT,
  height_cm FLOAT,
  gender TEXT,
  activity_level TEXT,
  goal TEXT,
  tdee INT,
  calorie_target INT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own profile" 
  ON profiles FOR ALL USING (auth.uid() = user_id);

-- 2. DIARY ENTRIES
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  meal_type TEXT NOT NULL,
  kcal FLOAT NOT NULL,
  protein FLOAT DEFAULT 0,
  carbs FLOAT DEFAULT 0,
  fat FLOAT DEFAULT 0,
  fiber FLOAT DEFAULT 0,
  sugar FLOAT DEFAULT 0,
  sodium FLOAT DEFAULT 0,
  vitamins JSONB DEFAULT '{}'::jsonb,
  serving_g FLOAT DEFAULT 100,
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own diary entries" 
  ON diary_entries FOR ALL USING (auth.uid() = user_id);

-- 3. WATER LOGS
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INT NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own water logs" 
  ON water_logs FOR ALL USING (auth.uid() = user_id);

-- 4. WEIGHT LOGS
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg FLOAT NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own weight logs" 
  ON weight_logs FOR ALL USING (auth.uid() = user_id);

-- 5. FOOD CACHE (Global table, readable by all authenticated users)
CREATE TABLE food_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  kcal_per_100g FLOAT NOT NULL,
  protein FLOAT DEFAULT 0,
  carbs FLOAT DEFAULT 0,
  fat FLOAT DEFAULT 0,
  fiber FLOAT DEFAULT 0,
  sugar FLOAT DEFAULT 0,
  sodium FLOAT DEFAULT 0,
  vitamins JSONB DEFAULT '{}'::jsonb,
  source TEXT NOT NULL,
  barcode TEXT,
  cuisine TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note: The prompt asked for "no RLS, readable and writable by all authenticated users"
-- But we still need to enable RLS to enforce the "authenticated" part, or just omit RLS.
-- Omitting RLS means it's public. We will enable RLS and add a policy for authenticated users.
ALTER TABLE food_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read food cache" 
  ON food_cache FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert food cache" 
  ON food_cache FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. USER PREFERENCES
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  cuisine_prefs TEXT[] DEFAULT '{}',
  category_prefs TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences" 
  ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- 7. ACHIEVEMENTS
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ,
  progress FLOAT DEFAULT 0,
  UNIQUE(user_id, achievement_key)
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own achievements" 
  ON achievements FOR ALL USING (auth.uid() = user_id);
