export const config = {
  runtime: "nodejs", // Force Node runtime on Vercel
};

export async function POST(req) {
  try {
    const body = await req.json();
    const prompt = body.prompt;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400 }
      );
    }

    // HuggingFace FREE ENDPOINT
    const HF_URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({
          error: "Model failed to generate image",
          details: errText,
        }),
        { status: 500 }
      );
    }

    // Return binary image data
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Server crashed generating image." }),
      { status: 500 }
    );
  }
}
