import React, { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate image");
      }

      // ✔ Correct: convert backend binary → blob → URL
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);

    } catch (error) {
      console.error("Error:", error);
      alert("Image generation failed. Check console.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-4 text-white">AI Image Generator</h1>

      <input
        type="text"
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 rounded mb-4 text-black"
      />

      <button
        onClick={generateImage}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {image && (
        <img
          src={image}
          alt="Generated Output"
          className="mt-6 w-full rounded shadow-lg"
        />
      )}
    </div>
  );
}
