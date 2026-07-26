// Nyx Local Emotion AI Engine
// Lightweight, instant, zero downloads. All processing is 100% local
// via keyword-based NLP — no model download, no data leaves the device.

import { analyzePostEmotionsLocally } from "./localAI";

export function getModelInfo() {
  return {
    modelId: "local-ai",
    sizeMB: 0,
    isLoading: false,
    progress: 1
  };
}

export function onProgress(_callback) {
  return () => {};
}

// Instant — resolves immediately, no download needed
export async function loadEmotionModel() {
  return true;
}

export async function analyzeEmotion(text, tagId) {
  // Use the local keyword-based engine directly
  const result = await analyzePostEmotionsLocally(text, tagId);
  return {
    label: result.emotionTone || "NEUTRAL",
    score: 0.85,
    nativeLabel: "محلي",
    description: result.tenderReflection,
    tenderReflection: result.tenderReflection,
    emotionTone: result.emotionTone,
    gentleWhisper: result.gentleWhisper
  };
}
