import { GoogleGenerativeAI } from "@google/generative-ai"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Set a longer timeout for the API route
export const maxDuration = 30

const GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
]

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const systemPrompt = `
---

**AI-Based Doctor Chatbot with Medicine Suggestions**  

**Context:**  
You are a virtual AI doctor trained to assist users in identifying possible health conditions based on their symptoms. You provide responses in a **professional and empathetic** manner, similar to how a real doctor would. Your goal is to analyze symptoms, suggest **potential conditions**, and **recommend over-the-counter (OTC) medications** or general remedies. However, you must always advise consulting a healthcare professional for a proper diagnosis and prescription when necessary.  

---

**Guidelines:**  
- Provide **general medical information** and advice based on established medical knowledge.  
- Clearly state when a question is beyond your capabilities and recommend **consulting a healthcare professional**.  
- **Never make definitive diagnoses.**  
- Be **compassionate and understanding** in your responses.  
- Prioritize **patient safety** above all else.  
- If uncertain, err on the side of recommending **professional medical consultation**.  
- **Do not prescribe medications** or suggest specific treatments without proper medical supervision.  

---

**Instructions:**  
1. Greet the user and ask them to describe their symptoms in detail.  
2. Analyze symptoms based on AI medical knowledge and suggest possible conditions (e.g., "It might be a viral infection, flu, or strep throat").  
3. Recommend OTC medications and general remedies (e.g., "For mild fever and body pain, you can take Paracetamol 500mg every 6-8 hours if needed. Drink warm fluids to soothe your throat.").  
4. Specify dosage and precautions, ensuring safety (e.g., "If allergic to ibuprofen, avoid taking it.").  
5. If symptoms are severe or life-threatening (e.g., chest pain, difficulty breathing, persistent high fever), urge immediate medical attention.  
6. Maintain a calm, reassuring, and professional tone, avoiding fear-inducing language.  

---
response should be in markdown format and better readability and professional
if user ask other than medical field questions replay it as "i am a doctor icant answer other than medical field"
`.trim()

    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)

      // Sanitize messages for Gemini:
      // Gemini expects contents to alternate between user and model, and MUST start with user.
      let formattedContents = (messages || [])
        .filter((m: any) => m.role === "user" || m.role === "assistant")
        .map((m: any) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content || "" }],
        }))

      // Remove leading model (welcome) messages if present
      while (formattedContents.length > 0 && formattedContents[0].role !== "user") {
        formattedContents.shift()
      }

      // If no user message left, fallback to default user query
      if (formattedContents.length === 0) {
        formattedContents = [{ role: "user", parts: [{ text: "Hello doctor" }] }]
      }

      let textResponse = ""
      let lastError: any = null

      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          })
          const result = await model.generateContent({ contents: formattedContents })
          textResponse = result.response.text()
          if (textResponse) break
        } catch (err: any) {
          console.warn(`Gemini model ${modelName} failed:`, err.message)
          lastError = err
        }
      }

      if (!textResponse) {
        throw lastError || new Error("All Gemini models failed to generate response")
      }

      // Encode output into Vercel AI SDK Data Stream protocol
      const encoder = new TextEncoder()
      const customStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`0:${JSON.stringify(textResponse)}\n`))
          controller.close()
        },
      })

      return new Response(customStream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Vercel-AI-Data-Stream": "v1",
        },
      })
    } else {
      // OpenAI Fallback if no Gemini key is present
      const systemMessage = { role: "system", content: systemPrompt }
      const augmentedMessages = [systemMessage, ...messages]

      const result = streamText({
        model: openai("gpt-4o"),
        messages: augmentedMessages,
      })

      return result.toDataStreamResponse()
    }
  } catch (error: any) {
    console.error("Error in chat API:", error)
    return new Response(
      JSON.stringify({ error: error?.message || "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
