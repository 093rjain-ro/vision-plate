export interface Profile {
  user_id: string;
  name: string;
  age: number;
  weight_kg: number;
  height_cm: number;
  gender: "male" | "female" | "other";
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  tdee: number;
  calorie_target: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiaryEntry {
  id: string;
  user_id?: string;
  food_name: string;
  meal_type: "Breakfast" | "Lunch" | "Dinner" | "Snacks";
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vitamins: Record<string, any>;
  serving_g: number;
  logged_at?: string;
  created_at?: string;
}

export interface WaterLog {
  id: string;
  user_id?: string;
  amount_ml: number;
  logged_date: string;
  created_at?: string;
}

export interface WeightLog {
  id: string;
  user_id?: string;
  weight_kg: number;
  logged_date: string;
  created_at?: string;
}

export interface FoodItem {
  id?: string;
  name: string;
  kcal_per_100g: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vitamins?: Record<string, any>;
  source: "USDA" | "OFF" | "manual" | "claude";
  barcode?: string;
  cuisine?: string;
  category?: string;
}

export interface UserPreferences {
  user_id: string;
  cuisine_prefs: string[];
  category_prefs: string[];
  updated_at?: string;
}

export interface Achievement {
  id: string;
  user_id?: string;
  achievement_key: string;
  unlocked_at: string | null;
  progress: number;
}
