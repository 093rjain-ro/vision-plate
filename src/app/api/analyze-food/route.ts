import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "", // Ensure you have ANTHROPIC_API_KEY in .env.local
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType = "image/jpeg" } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    
    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock data if no API key is provided for testing UI
      console.warn("No ANTHROPIC_API_KEY provided. Returning mock data.");
      return NextResponse.json({
        foodName: "Dal rice + salad (Mock)",
        calories: 520,
        protein_g: 32,
        carbs_g: 85,
        fat_g: 18,
        fiber_g: 12
      });
    }

    // Call Claude 3.5 Sonnet Vision API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      system: "You are a nutrition expert AI.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              },
            },
            {
              type: "text",
              text: "Identify the food and return ONLY a JSON object with: foodName, calories, protein_g, carbs_g, fat_g, fiber_g. Estimate portion size from the image. No preamble, no markdown.",
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    let jsonResult = {};
    if (content.type === "text") {
      try {
        jsonResult = JSON.parse(content.text.trim());
      } catch (parseError) {
        console.error("Failed to parse JSON from Claude response:", content.text);
        return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
      }
    }

    return NextResponse.json(jsonResult);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
