import React, { useState, useEffect } from "react";
import { X, Volume2, VolumeX, Moon, CloudRain, Wind } from "lucide-react";
import { startNightAmbientSound, stopNightAmbientSound, updateBreathingSoundPhase } from "../utils/audio";

export default function BreathingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("inhale"); // "inhale" | "hold" | "exhale"
  const [counter, setCounter] = useState(4);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (!isAudioMuted) {
        startNightAmbientSound();
        updateBreathingSoundPhase("inhale");
      }

      let currentPhase = "inhale";
      let count = 4;

      const timer = setInterval(() => {
        count--;
        if (count <= 0) {
          if (currentPhase === "inhale") {
            currentPhase = "hold";
            count = 7;
          } else if (currentPhase === "hold") {
            currentPhase = "exhale";
            count = 8;
          } else {
            currentPhase = "inhale";
            count = 4;
          }
          if (!isAudioMuted) {
            updateBreathingSoundPhase(currentPhase);
          }
        }
        setPhase(currentPhase);
        setCounter(count);
      }, 1000);

      return () => {
        clearInterval(timer);
        stopNightAmbientSound();
      };
    }
  }, [isOpen, isAudioMuted]);

  if (!isOpen) return null;

  const toggleAudio = () => {
    if (isAudioMuted) {
      startNightAmbientSound();
      updateBreathingSoundPhase(phase);
      setIsAudioMuted(false);
    } else {
      stopNightAmbientSound();
      setIsAudioMuted(true);
    }
  };

  const getPhaseTitle = () => {
    if (phase === "inhale") return "شهيق هادئ كالنسيم (صوت الرياح)...";
    if (phase === "hold") return "احتفظ بالهواء واستشعر الأمان...";
    return "زفير بطيء ورقيق (صوت المطر والخرير)...";
  };

  const getPhaseIcon = () => {
    if (phase === "inhale") return <Wind className="w-5 h-5 text-purple-300 animate-pulse" />;
    if (phase === "hold") return <Moon className="w-5 h-5 text-indigo-300 animate-pulse" />;
    return <CloudRain className="w-5 h-5 text-teal-300 animate-pulse" />;
  };

  const getPhaseColor = () => {
    if (phase === "inhale") return "from-purple-500 to-indigo-500 scale-125 border-purple-400";
    if (phase === "hold") return "from-indigo-600 to-purple-800 scale-125 border-indigo-300";
    return "from-teal-700 to-slate-800 scale-90 border-teal-400";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />

        {/* Mute / Unmute & Close Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-purple-300 hover:text-white transition-all"
            title="تشغيل/إيقاف الصوت المتدرج"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />}
            <span>{isAudioMuted ? "الصوت متوقف" : "الصوت المتدرج يعمل"}</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            {getPhaseIcon()}
            <h3 className="text-lg font-bold text-slate-100">تنفس بعمق</h3>
          </div>
          <p className="text-xs text-slate-400">تلاشٍ متدرج بين رياح الشهيق وخضرة مطر الزفير</p>
        </div>

        {/* Pulsing Animated Breathing Circle */}
        <div className="relative my-6 flex items-center justify-center">
          <div className={`w-44 h-44 rounded-full bg-gradient-to-tr ${getPhaseColor()} border-2 shadow-2xl flex items-center justify-center transition-all duration-1000 ease-in-out`}>
            <div className="text-center">
              <span className="text-4xl font-extrabold text-white block tracking-tighter font-mono">
                {counter}
              </span>
              <span className="text-[11px] text-purple-200 font-medium">ثوانٍ</span>
            </div>
          </div>
        </div>

        {/* Phase Text */}
        <div className="h-12 flex flex-col items-center justify-center mb-4">
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
            {getPhaseTitle()}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-purple-950/80 border border-purple-800/50 text-purple-200 text-xs font-bold hover:bg-purple-900 transition-all"
        >
          إنهاء الجلسة والعودة للبوح
        </button>

      </div>
    </div>
  );
}
