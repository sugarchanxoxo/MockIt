import { NextRequest } from "next/server";
import axios from "axios";

// Configure with your Stability AI API key
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

export async function POST(req: NextRequest) {
  const { imagePrompt } = await req.json();

  if (!imagePrompt) {
    return new Response("Image prompt is required", { status: 400 });
  }

  if (!STABILITY_API_KEY) {
    return new Response("Stability API key is not configured", { status: 500 });
  }

  try {
    // Prepare payload for Stability AI SD3
    const payload = {
      prompt: imagePrompt,
      output_format: "jpeg"
    };

    // Call Stability AI's v2beta API for SD3
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: { 
          Authorization: `Bearer ${STABILITY_API_KEY}`, 
          Accept: "image/*" 
        },
      },
    );

    if (response.status !== 200) {
      throw new Error(`${response.status}: ${Buffer.from(response.data).toString()}`);
    }

    // Convert the image to a base64 string
    const base64Image = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    return new Response(JSON.stringify({ imageUrl }), { status: 200 });
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
}
