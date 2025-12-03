import React, { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt) return;

    setLoading(true);
    setImage(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    setImage(data.image);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl">
      <input
        type="text"
        placeholder="Enter your image prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
      />

      <button
        onClick={generateImage}
        className="bg-blue-500 px-6 py-3 rounded hover:bg-blue-600 w-full"
      >
        Generate Image
      </button>

      {loading && <p className="mt-4 text-center">Generating...</p>}

      {image && (
        <img
          src={`data:image/png;base64,${image}`}
          alt="AI Result"
          className="mt-4 rounded"
        />
      )}
    </div>
  );
}
