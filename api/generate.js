export const config = {
  runtime: "nodejs", // ensure Node runtime (not Edge)
};

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // HuggingFace FREE model endpoint
    const HF_URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({
        error: "Model failed to generate image",
        details: await response.text(),
      });
    }

    // Get raw binary image data
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Send actual PNG binary
    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server crashed generating image." });
  }
}
