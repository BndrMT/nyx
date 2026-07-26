// Web Audio Dynamic Breathing Synthesizer
// Smoothly morphs soundscape between Wind (Inhale) and Rain / Water Stream (Exhale)

let audioCtx = null;
let noiseNode = null;
let gainNode = null;
let windFilter = null;
// rainFilter reserved for future dual-layer rain/wind separation
let isPlaying = false;

export function startNightAmbientSound() {
  if (isPlaying) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();

    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.06;
      b6 = white * 0.115926;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Filter 1: Wind Sound (Lowpass with sweep)
    windFilter = audioCtx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.setValueAtTime(350, audioCtx.currentTime);

    // Master Gain
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 1.5);

    noiseNode.connect(windFilter);
    windFilter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
    isPlaying = true;
  } catch (e) {
    console.log("Web Audio error:", e);
  }
}

// Morph audio based on breathing phase: "inhale" (wind) vs "exhale" (rain/stream)
export function updateBreathingSoundPhase(phase) {
  if (!isPlaying || !audioCtx || !windFilter) return;

  try {
    const now = audioCtx.currentTime;
    if (phase === "inhale") {
      // Wind breeze: gradual frequency rise
      windFilter.type = "lowpass";
      windFilter.frequency.cancelScheduledValues(now);
      windFilter.frequency.exponentialRampToValueAtTime(650, now + 3.5);
    } else if (phase === "exhale") {
      // Gentle rainfall / stream water trickle: lower cutoff with soft rumble
      windFilter.type = "bandpass";
      windFilter.Q.value = 1.2;
      windFilter.frequency.cancelScheduledValues(now);
      windFilter.frequency.exponentialRampToValueAtTime(220, now + 4);
    } else {
      // Hold phase: neutral soothing tone
      windFilter.type = "lowpass";
      windFilter.frequency.cancelScheduledValues(now);
      windFilter.frequency.exponentialRampToValueAtTime(320, now + 2);
    }
  } catch (e) {
    console.log("Audio morph error:", e);
  }
}

export function stopNightAmbientSound() {
  if (!isPlaying || !audioCtx) return;

  try {
    if (gainNode && audioCtx) {
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      setTimeout(() => {
        if (noiseNode) noiseNode.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        audioCtx = null;
      }, 800);
    } else {
      isPlaying = false;
    }
  } catch (_e) {
    isPlaying = false;
  }
}
