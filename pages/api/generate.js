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

    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: { prompt }
      }
    );

    // output ka format kabhi kabhi array hota hai, kabhi single string
    const imageUrl = Array.isArray(output) ? output[0] : output;

    if (!imageUrl) {
      return res.status(500).json({ error: "Image URL missing from API." });
    }

    return res.status(200).json({ url: imageUrl });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: error.message || "Image generation failed",
    });
  }
}
