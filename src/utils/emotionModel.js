// Nyx Local Emotion AI Engine
// Uses Transformers.js to run a real Arabic-capable sentiment model
// entirely in-browser — ZERO data leaves the device.
//
// Model: xenova/bert-base-multilingual-uncased-sentiment
// Size: ~150 MB (downloaded once, cached in browser IndexedDB)
// Supports: Arabic, English, and 100+ languages

let pipeline = null;
let isLoading = false;
let loadProgress = 0;
let progressListeners = [];

const MODEL_ID = "Xenova/bert-base-multilingual-uncased-sentiment";
const MODEL_SIZE_MB = 150; // approximate

export function getModelInfo() {
  return {
    modelId: MODEL_ID,
    sizeMB: MODEL_SIZE_MB,
    isLoading,
    progress: loadProgress
  };
}

export function onProgress(callback) {
  progressListeners.push(callback);
  return () => {
    progressListeners = progressListeners.filter(cb => cb !== callback);
  };
}

function notifyProgress(progress) {
  loadProgress = progress;
  progressListeners.forEach(cb => cb(progress));
}

export async function loadEmotionModel() {
  if (pipeline) return pipeline; // already loaded
  if (isLoading) {
    // Wait for current load to finish
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (pipeline) {
          clearInterval(check);
          resolve(pipeline);
        }
      }, 200);
    });
  }

  isLoading = true;
  notifyProgress(0);

  try {
    const { pipeline: hfPipeline } = await import("@xenova/transformers");

    // Load with progress tracking
    const model = await hfPipeline("sentiment-analysis", MODEL_ID, {
      progress_callback: (progress) => {
        if (progress.status === "progress") {
          const pct = progress.loaded / progress.total;
          notifyProgress(Math.min(pct, 0.95));
        }
      }
    });

    pipeline = model;
    isLoading = false;
    notifyProgress(1);
    return model;
  } catch (err) {
    isLoading = false;
    notifyProgress(-1); // error signal
    throw err;
  }
}

export async function analyzeEmotion(text) {
  const model = await loadEmotionModel();
  const result = await model(text);

  // result is [{ label: "POSITIVE"|"NEGATIVE"|"NEUTRAL", score: 0.98 }]
  if (!result || result.length === 0) {
    return {
      label: "NEUTRAL",
      score: 0,
      nativeLabel: "محايد",
      description: "لم يتمكن النظام من تحليل المشاعر بدعم كافٍ."
    };
  }

  const { label, score } = result[0];

  // Map to Arabic emotional context
  const arabicLabels = {
    "POSITIVE": "إيجابي",
    "NEGATIVE": "سلبي",
    "NEUTRAL": "محايد"
  };

  const descriptions = {
    "POSITIVE": "كلماتك تحمل طاقة إيجابية وأملاً. حتى في وسط الوجع، هناك بصيص نور يتسلل من بين الحروف.",
    "NEGATIVE": "كلماتك تحمل ثقلاً وألماً. مسموح لك أن تشعر بهذا كله، وهذه المساحة هنا تحتضن مشاعرك كما هي، دون تجميل.",
    "NEUTRAL": "كلماتك تحمل تأملاً هادئاً. لا تصنيف واضح للمشاعر، لكن الصمت وحده قد يكون أعمق الكلام."
  };

  return {
    label,
    score,
    nativeLabel: arabicLabels[label] || label,
    description: descriptions[label] || descriptions["NEUTRAL"]
  };
}
