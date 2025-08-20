import { IncomingForm } from "formidable";
import fs from "fs";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

// Set a longer timeout for the API route
export const maxDuration = 30;

// This will disable body parsing so we can handle form data (image upload)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Define types for the form data
interface FormData {
  imagePath: string;
}

interface File {
  filepath: string;
}

const parseImage = (req: Request): Promise<FormData> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject("Error parsing the form");
      }

      // Assuming only one file is uploaded and its name is 'image'
      const imageFile = files.image as File[];
      if (!imageFile || !imageFile[0]) {
        return reject("No image file found");
      }

      resolve({ imagePath: imageFile[0].filepath });
    });
  });
};

// Function to analyze the image using the OpenAI API
const analyzeImage = async (imagePath: string) => {
  const imageBuffer = fs.readFileSync(imagePath);

  // Assuming openai provides an image analysis method
  // If openai SDK supports image analysis, use it here
  const response = await openai.createImageAnalysis({
    model: "image-alpha-001", // Or use an appropriate model for image analysis
    file: imageBuffer,
  });

  return response.data; // Return the response from OpenAI API
};

// This is the main API route for the chat functionality
export async function POST(req: Request) {
  try {
    // Parse the image from the request
    const { imagePath } = await parseImage(req);

    // Analyze the image using the OpenAI API
    const analysisResult = await analyzeImage(imagePath);

    return new Response(JSON.stringify(analysisResult), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in image analysis:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process image analysis" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
