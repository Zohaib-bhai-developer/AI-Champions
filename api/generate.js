import Replicate from "replicate";

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const result = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: { prompt }
      }
    );

    let imageUrl = null;

    if (Array.isArray(result)) imageUrl = result[0];
    if (!imageUrl && result?.output) imageUrl = result.output[0];
    if (!imageUrl && typeof result === "string") imageUrl = result;

    if (!imageUrl) {
      return res.status(500).json({ error: "No image returned from API" });
    }

    return res.status(200).json({ url: imageUrl });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({
      error: err.message || "Image generation failed",
    });
  }
}
