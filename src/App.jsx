import React from "react";
import ImageGenerator from "./components/ImageGenerator";

export default function App() {
  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">AI Image Generator</h1>
      <ImageGenerator />
    </div>
  );
}
