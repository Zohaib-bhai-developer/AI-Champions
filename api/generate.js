export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // HuggingFace FREE Inference API endpoint (NO API KEY REQUIRED)
    const HF_URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({ image: base64Image });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Image generation failed" });
  }
}
