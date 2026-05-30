import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { macros, prefs } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      // Mock data if no key is provided
      return NextResponse.json([
        { name: "Grilled Chicken Salad", kcal: 350, protein: 40, carbs: 10, fat: 15, cuisine: "American", reason: "High protein, low carb to fit your remaining macros." },
        { name: "Greek Yogurt Bowl", kcal: 200, protein: 20, carbs: 15, fat: 5, cuisine: "Mediterranean", reason: "Quick snack with great protein balance." },
        { name: "Protein Shake", kcal: 150, protein: 30, carbs: 5, fat: 2, cuisine: "American", reason: "Perfect for closing out your protein goal." }
      ]);
    }

    const prompt = `The user has ${macros.kcal} kcal, ${macros.protein}g protein, ${macros.carbs}g carbs, ${macros.fat}g fat remaining today. Their cuisine preferences are ${prefs}. Suggest 3 simple meals or snacks that fit exactly into these remaining macros without exceeding them. Return a pure JSON array with no markdown blocks, no thinking, no yapping: [{"name": "string", "kcal": number, "protein": number, "carbs": number, "fat": number, "cuisine": "string", "reason": "string"}]`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620", // using 3.5 sonnet as standard latest stable
      max_tokens: 1000,
      temperature: 0.7,
      system: "You are a professional nutritionist. Respond only with the requested JSON array.",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const content = message.content[0].type === "text" ? message.content[0].text : "[]";
    
    // Clean up potential markdown blocks if claude ignores instructions
    const jsonStr = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const suggestions = JSON.parse(jsonStr);

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("AI Suggestion failed:", error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
