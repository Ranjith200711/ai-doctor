import { GoogleGenerativeAI } from "@google/generative-ai";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Set a longer timeout for the API route
export const maxDuration = 30;

const GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
];

// API route to analyze prescription images
export async function POST(req: Request) {
  try {
    let imageBase64: string = "";
    let mimeType: string = "image/jpeg";
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      const rawImage = body.image || body.imagePath;
      if (typeof rawImage === "string") {
        if (rawImage.startsWith("data:")) {
          const parts = rawImage.split(";base64,");
          mimeType = parts[0].replace("data:", "");
          imageBase64 = parts[1];
        } else {
          imageBase64 = rawImage;
        }
      }
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File;
      if (file) {
        mimeType = file.type || "image/jpeg";
        const buffer = Buffer.from(await file.arrayBuffer());
        imageBase64 = buffer.toString("base64");
      }
    }

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image found in request" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey);
      const prompt = "You are an expert AI doctor assistant. Please analyze this prescription image in detail. Extract and list all medications, dosages, frequency, and instructions clearly, along with general health advice and precautions.";

      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType,
        },
      };

      let text = "";
      let lastError: any = null;

      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent([prompt, imagePart]);
          text = result.response.text();
          if (text) break;
        } catch (err: any) {
          console.warn(`Prescription analysis model ${modelName} failed:`, err.message);
          lastError = err;
        }
      }

      if (!text) {
        throw lastError || new Error("All Gemini models failed for image analysis");
      }

      return new Response(JSON.stringify({ analysis: text, result: text }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // OpenAI Fallback
      const { text: result } = await generateText({
        model: openai("gpt-4o"),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are an expert AI doctor assistant. Please analyze this prescription image in detail. Extract and list all medications, dosages, frequency, and instructions clearly, along with general health advice and precautions.",
              },
              {
                type: "image",
                image: imageBase64,
              },
            ],
          },
        ],
      });

      return new Response(JSON.stringify({ analysis: result, result }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in image analysis:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to process image analysis" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
