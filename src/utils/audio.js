// 🔇 صوت التنفس موقّف مؤقتاً — بانتظار ملف صوتي من المستخدم
// تم تعطيل الصوت في المودال أسفله

let audioCtx = null;

// Nodes
let noise1Node = null;   // Wind source
let noise2Node = null;   // Rain source
let heartOsc = null;     // Gentle low-frequency pulse
let heartGain = null;
let windFilter = null;
let windGain = null;
let rainFilter1 = null;
let rainFilter2 = null;
let rainGain = null;
let masterGain = null;
let convolver = null;

let isPlaying = false;
let _currentPhase = "inhale";

// Pink noise generation (fills an AudioBuffer)
function createPinkBuffer(ctx, duration) {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
    b6 = white * 0.115926;
  }
  return buffer;
}

// Generate a simple reverb impulse response (decaying noise)
function createReverbIR(ctx, duration, decay) {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const env = Math.exp(-i / (sampleRate * decay));
    const noise = (Math.random() * 2 - 1) * env;
    left[i] = noise * 0.8;
    right[i] = noise * (0.7 + Math.random() * 0.3);
  }
  return buffer;
}

// LFO for wind modulation — creates natural whooshing variation
function createLFOModulation(ctx, filter, baseFreq, depth, rate) {
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(rate, ctx.currentTime);
  lfoGain.gain.setValueAtTime(depth, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  filter.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  lfo.start();
  return { lfo, lfoGain };
}

let windLFO = null;

// Stopped later: lfo.lfo.stop()
function stopLFO(lfo) {
  if (lfo) {
    try { lfo.lfo.stop(); } catch (_e) { /* ignore */ }
    try { lfo.lfo.disconnect(); } catch (_e) { /* ignore */ }
    try { lfo.lfoGain.disconnect(); } catch (_e) { /* ignore */ }
  }
}

export function startNightAmbientSound() {
  if (isPlaying) return;

  try {
    const Ac = window.AudioContext || window.webkitAudioContext;
    if (!Ac) return;
    audioCtx = new Ac();

    const now = audioCtx.currentTime;
    const bufDur = 4; // 4-second pink noise buffers (looped)

    // === WIND LAYER (Noise1 → Lowpass + LFO) ===
    const windBuffer = createPinkBuffer(audioCtx, bufDur);
    noise1Node = audioCtx.createBufferSource();
    noise1Node.buffer = windBuffer;
    noise1Node.loop = true;

    windFilter = audioCtx.createBiquadFilter();
    windFilter.type = "lowpass";
    windFilter.frequency.setValueAtTime(350, now);

    windGain = audioCtx.createGain();
    windGain.gain.setValueAtTime(0, now);
    windGain.gain.linearRampToValueAtTime(0.55, now + 2);

    // Wind LFO — gentle whoosh
    windLFO = createLFOModulation(audioCtx, windFilter, 350, 120, 0.12);

    noise1Node.connect(windFilter);
    windFilter.connect(windGain);

    // === RAIN LAYER (Noise2 → Stereo Bandpass Filters) ===
    const rainBuffer = createPinkBuffer(audioCtx, bufDur);
    noise2Node = audioCtx.createBufferSource();
    noise2Node.buffer = rainBuffer;
    noise2Node.loop = true;

    // Rain uses two overlapping bandpass filters for texture
    rainFilter1 = audioCtx.createBiquadFilter();
    rainFilter1.type = "bandpass";
    rainFilter1.frequency.setValueAtTime(1200, now);
    rainFilter1.Q.setValueAtTime(1.8, now);

    rainFilter2 = audioCtx.createBiquadFilter();
    rainFilter2.type = "bandpass";
    rainFilter2.frequency.setValueAtTime(3800, now);
    rainFilter2.Q.setValueAtTime(0.9, now);

    rainGain = audioCtx.createGain();
    rainGain.gain.setValueAtTime(0, now);
    rainGain.gain.linearRampToValueAtTime(0.4, now + 2);

    noise2Node.connect(rainFilter1);
    noise2Node.connect(rainFilter2);
    rainFilter1.connect(rainGain);
    rainFilter2.connect(rainGain);

    // === HEARTBEAT OSCILLATOR (Low-frequency gentle pulse) ===
    heartOsc = audioCtx.createOscillator();
    heartOsc.type = "sine";
    heartOsc.frequency.setValueAtTime(70, now);

    heartGain = audioCtx.createGain();
    heartGain.gain.setValueAtTime(0, now);
    // Gentle pulse: fade in slowly
    heartGain.gain.linearRampToValueAtTime(0.025, now + 3);

    heartOsc.connect(heartGain);

    // === REVERB (Convolver — spatial depth) ===
    const irBuffer = createReverbIR(audioCtx, 1.2, 0.35);
    convolver = audioCtx.createConvolver();
    convolver.buffer = irBuffer;

    // === MASTER BUS ===
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.22, now + 2);

    // Wind → Reverb → Master | Rain → Master | Heart → Master
    windGain.connect(convolver);
    convolver.connect(masterGain);
    rainGain.connect(masterGain);
    heartGain.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    // Start all sources
    noise1Node.start();
    noise2Node.start();
    heartOsc.start();

    isPlaying = true;
    currentPhase = "inhale";
    updateBreathingSoundPhase("inhale");
  } catch (e) {
    console.log("Nyx Audio: start error —", e.message);
    isPlaying = false;
  }
}

// Phase timer for the heartbeat pulse synced to breathing
let heartPulseInterval = null;

function stopHeartPulse() {
  if (heartPulseInterval) {
    clearInterval(heartPulseInterval);
    heartPulseInterval = null;
  }
}

export function updateBreathingSoundPhase(phase) {
  if (!isPlaying || !audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    _currentPhase = phase;
    const morphTime = 3.5;

    switch (phase) {
      case "inhale":
        // Wind rises: lowpass opens up (whoosh)
        windFilter.type = "lowpass";
        windFilter.frequency.cancelScheduledValues(now);
        windFilter.frequency.setTargetAtTime(750, now, morphTime * 0.3);
        windGain.gain.cancelScheduledValues(now);
        windGain.gain.setTargetAtTime(0.7, now, morphTime * 0.35);

        // Rain recedes
        rainGain.gain.cancelScheduledValues(now);
        rainGain.gain.setTargetAtTime(0.15, now, morphTime * 0.3);

        // Heart steady
        if (heartGain) {
          heartGain.gain.cancelScheduledValues(now);
          heartGain.gain.setTargetAtTime(0.035, now, 1.5);
        }

        if (windLFO) {
          windLFO.lfoGain.gain.cancelScheduledValues(now);
          windLFO.lfoGain.gain.setTargetAtTime(180, now, 2);
          windLFO.lfo.frequency.cancelScheduledValues(now);
          windLFO.lfo.frequency.setTargetAtTime(0.18, now, 1.5);
        }
        break;

      case "hold":
        // Sustained neutral — wind settles, rain ambient
        windFilter.type = "lowpass";
        windFilter.frequency.cancelScheduledValues(now);
        windFilter.frequency.setTargetAtTime(380, now, 2.5);
        windGain.gain.cancelScheduledValues(now);
        windGain.gain.setTargetAtTime(0.3, now, 2);

        rainGain.gain.cancelScheduledValues(now);
        rainGain.gain.setTargetAtTime(0.3, now, 2);

        if (heartGain) {
          heartGain.gain.cancelScheduledValues(now);
          heartGain.gain.setTargetAtTime(0.03, now, 2);
        }

        if (windLFO) {
          windLFO.lfoGain.gain.cancelScheduledValues(now);
          windLFO.lfoGain.gain.setTargetAtTime(60, now, 2);
          windLFO.lfo.frequency.cancelScheduledValues(now);
          windLFO.lfo.frequency.setTargetAtTime(0.08, now, 2);
        }
        break;

      case "exhale":
        // Rain swells, wind softens
        windFilter.type = "lowpass";
        windFilter.frequency.cancelScheduledValues(now);
        windFilter.frequency.setTargetAtTime(200, now, morphTime * 0.35);
        windGain.gain.cancelScheduledValues(now);
        windGain.gain.setTargetAtTime(0.2, now, morphTime * 0.3);

        // Rain gains presence
        rainGain.gain.cancelScheduledValues(now);
        rainGain.gain.setTargetAtTime(0.6, now, morphTime * 0.3);

        if (heartGain) {
          heartGain.gain.cancelScheduledValues(now);
          heartGain.gain.setTargetAtTime(0.02, now, 1.5);
        }

        if (windLFO) {
          windLFO.lfoGain.gain.cancelScheduledValues(now);
          windLFO.lfoGain.gain.setTargetAtTime(40, now, 2);
          windLFO.lfo.frequency.cancelScheduledValues(now);
          windLFO.lfo.frequency.setTargetAtTime(0.06, now, 1.5);
        }
        break;
    }
  } catch (e) {
    console.log("Nyx Audio: morph error —", e.message);
  }
}

export function setMasterVolume(level) {
  // level: 0.0 → 1.0
  if (!isPlaying || !audioCtx || !masterGain) return;
  try {
    const gain = 0.04 + level * 0.2; // maps 0→0.04 (barely audible) to 1→0.24 (full)
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setTargetAtTime(gain, audioCtx.currentTime, 0.5);
  } catch (_e) { /* ignore */ }
}

export function stopNightAmbientSound() {
  if (!isPlaying || !audioCtx) return;

  try {
    stopHeartPulse();
    stopLFO(windLFO);

    const fadeOut = 0.8;
    if (masterGain) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, fadeOut * 0.3);
    }

    setTimeout(() => {
      try {
        [noise1Node, noise2Node, heartOsc].forEach((n) => {
          if (n) { try { n.stop(); } catch (_e) { /* ignore */ } }
        });
        if (audioCtx) {
          audioCtx.close().catch(() => {});
          audioCtx = null;
        }
      } catch (_e) { /* ignore */ }
      isPlaying = false;
      noise1Node = null;
      noise2Node = null;
      heartOsc = null;
      heartGain = null;
      windFilter = null;
      windGain = null;
      rainFilter1 = null;
      rainFilter2 = null;
      rainGain = null;
      masterGain = null;
      convolver = null;
      windLFO = null;
    }, fadeOut * 1200);
  } catch (_e) {
    isPlaying = false;
  }
}
