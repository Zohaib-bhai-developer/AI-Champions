import React, { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt) return;

    setLoading(true);
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Image generation failed");
      }

      // get binary image from backend
      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImage(imageUrl);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while generating the image.");
    } finally {
      setLoading(false);
    }
  }

  function handleDownload() {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = "ai-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">AI Image Generator</h2>

      <input
        type="text"
        placeholder="Enter your image prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={generateImage}
        className="w-full py-3 mb-4 bg-blue-500 hover:bg-blue-600 rounded font-semibold transition"
      >
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && (
        <div className="mt-4 flex flex-col items-center">
          <img src={image} alt="AI Result" className="rounded shadow-md max-w-full" />
          <button
            onClick={handleDownload}
            className="mt-3 bg-green-500 hover:bg-green-600 px-5 py-2 rounded font-medium"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
}
