export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
        body: JSON.stringify({
          input: { prompt },
        }),
      }
    );

    const prediction = await response.json();

    if (prediction?.urls?.get) {
      const imgResp = await fetch(prediction.urls.get);
      const imgJson = await imgResp.json();

      if (imgJson?.output?.[0]) {
        const imgUrl = imgJson.output[0];
        const imgFile = await fetch(imgUrl);
        const arrayBuffer = await imgFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", "image/png");
        return res.send(buffer);
      }
    }

    return res.status(500).json({ error: "Image generation failed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed." });
  }
}
