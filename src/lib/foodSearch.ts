import { FoodItem } from "@/types";
import { supabase } from "./supabase";

const USDA_API_KEY = process.env.NEXT_PUBLIC_USDA_KEY || "DEMO_KEY";

export async function searchFood(query: string, cuisineFilter?: string, categoryFilter?: string): Promise<FoodItem[]> {
  const [usdaResult, offResult] = await Promise.allSettled([
    searchUSDA(query),
    searchOpenFoodFacts(query)
  ]);

  let merged: FoodItem[] = [];

  if (usdaResult.status === "fulfilled") merged = [...merged, ...usdaResult.value];
  if (offResult.status === "fulfilled") merged = [...merged, ...offResult.value];

  // Fuzzy match deduplication by name (simple lowercase exact match for demo purposes)
  const seen = new Set<string>();
  let deduplicated = merged.filter((item) => {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Client-side filtering
  if (cuisineFilter) {
    // Basic mock logic: if user selected a cuisine, we pretend to filter by it.
    // In reality, USDA/OFF rarely tag 'cuisine', so we mock it for the demo or search keyword.
    deduplicated = deduplicated.filter(i => i.name.toLowerCase().includes(cuisineFilter.toLowerCase()) || i.cuisine === cuisineFilter);
  }
  
  if (categoryFilter && categoryFilter !== "All") {
    deduplicated = deduplicated.filter(i => i.category === categoryFilter);
  }

  // Sort by completeness (items with all macros present rank higher)
  deduplicated.sort((a, b) => {
    const scoreA = (a.protein > 0 ? 1 : 0) + (a.carbs > 0 ? 1 : 0) + (a.fat > 0 ? 1 : 0);
    const scoreB = (b.protein > 0 ? 1 : 0) + (b.carbs > 0 ? 1 : 0) + (b.fat > 0 ? 1 : 0);
    return scoreB - scoreA;
  });

  return deduplicated.slice(0, 20); // Return top 20
}

async function searchUSDA(query: string): Promise<FoodItem[]> {
  try {
    const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(query)}&api_key=${USDA_API_KEY}&pageSize=10`);
    const data = await res.json();
    if (!data.foods) return [];
    
    return data.foods.map((food: any) => {
      const getNutrient = (id: number) => food.foodNutrients.find((n: any) => n.nutrientId === id)?.value || 0;
      
      return {
        name: food.description,
        kcal_per_100g: getNutrient(1008), // Energy
        protein: getNutrient(1003),
        fat: getNutrient(1004),
        carbs: getNutrient(1005),
        fiber: getNutrient(1079),
        sugar: getNutrient(2000),
        sodium: getNutrient(1093),
        source: "USDA",
      } as FoodItem;
    });
  } catch (e) {
    console.error("USDA search failed", e);
    return [];
  }
}

async function searchOpenFoodFacts(query: string): Promise<FoodItem[]> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`);
    const data = await res.json();
    if (!data.products) return [];

    return data.products.map((p: any) => ({
      name: p.product_name || "Unknown Product",
      kcal_per_100g: p.nutriments?.["energy-kcal_100g"] || 0,
      protein: p.nutriments?.proteins_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      fiber: p.nutriments?.fiber_100g || 0,
      sugar: p.nutriments?.sugars_100g || 0,
      sodium: (p.nutriments?.sodium_100g || 0) * 1000, // OFF is g, we want mg
      source: "OFF",
      barcode: p.code,
    })) as FoodItem[];
  } catch (e) {
    console.error("OFF search failed", e);
    return [];
  }
}

export async function lookupBarcode(barcode: string): Promise<FoodItem | null> {
  // First check local Supabase cache
  try {
    const { data: cached } = await supabase.from('food_cache').select('*').eq('barcode', barcode).single();
    if (cached) return cached as FoodItem;
  } catch (e) { /* ignore */ }

  // Check Open Food Facts
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      const item: FoodItem = {
        name: p.product_name || "Scanned Product",
        kcal_per_100g: p.nutriments?.["energy-kcal_100g"] || 0,
        protein: p.nutriments?.proteins_100g || 0,
        carbs: p.nutriments?.carbohydrates_100g || 0,
        fat: p.nutriments?.fat_100g || 0,
        fiber: p.nutriments?.fiber_100g || 0,
        sugar: p.nutriments?.sugars_100g || 0,
        sodium: (p.nutriments?.sodium_100g || 0) * 1000,
        source: "OFF",
        barcode: barcode
      };
      
      // Cache it asynchronously
      supabase.from('food_cache').insert([item]).then();
      return item;
    }
  } catch (e) {
    console.error("Barcode lookup failed", e);
  }
  return null;
}
