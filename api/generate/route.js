export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // HuggingFace FLUX Schnell - FREE but requires token
    const HF_URL =
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

    const response = await fetch(HF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`,
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

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: "Server crashed generating image." });
  }
}

