import React, { useState, useEffect } from "react";
import { X, Volume2, VolumeX, Moon, CloudRain, Wind } from "lucide-react";
import { startNightAmbientSound, stopNightAmbientSound, updateBreathingSoundPhase, setMasterVolume } from "../utils/audio";

export default function BreathingModal({ isOpen, onClose }) {
  const [phase, setPhase] = useState("inhale");
  const [counter, setCounter] = useState(4);
  const [isAudioMuted, setIsAudioMuted] = useState(true); // 🔇 معطل مؤقتاً
  const [volume, setVolume] = useState(0.6);
  const [sessionMinutes, setSessionMinutes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // 🔇 الصوت موقّف — بانتظار ملف المستخدم
      // if (!isAudioMuted) {
      //   startNightAmbientSound();
      //   updateBreathingSoundPhase("inhale");
      // }

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
          // 🔇 صوت معطل
          // if (!isAudioMuted) {
          //   updateBreathingSoundPhase(currentPhase);
          // }
        }
        setPhase(currentPhase);
        setCounter(count);
      }, 1000);

      return () => {
        clearInterval(timer);
        // stopNightAmbientSound(); // 🔇 معطل
      };
    }
  }, [isOpen]); // أزل isAudioMuted من التبعيات مؤقتاً

  // Session timer countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

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
        <div className="h-12 flex flex-col items-center justify-center mb-3">
          <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
            {getPhaseTitle()}
          </p>
        </div>

        {/* Session Timer Indicator */}
        {timeLeft > 0 && (
          <div className="mb-3 text-[11px] text-purple-300 font-mono">
            متبقي {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </div>
        )}

        {/* Volume Slider */}
        <div className="flex items-center gap-3 mb-4 px-2">
          <Volume2 className="w-3.5 h-3.5 text-purple-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isAudioMuted ? 0 : volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (v > 0) {
                setIsAudioMuted(false);
                setMasterVolume(v);
              } else {
                setIsAudioMuted(true);
                stopNightAmbientSound();
              }
            }}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-800 accent-purple-500 cursor-pointer"
          />
        </div>

        {/* Timer Selector */}
        <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
          {[
            { val: 0, label: "غير محدود" },
            { val: 1, label: "1 د" },
            { val: 3, label: "3 د" },
            { val: 5, label: "5 د" },
            { val: 10, label: "10 د" }
          ].map((opt) => (
            <button
              key={opt.val}
              onClick={() => {
                setSessionMinutes(opt.val);
                setTimeLeft(opt.val * 60);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] border transition-all ${
                sessionMinutes === opt.val
                  ? "bg-purple-950/80 border-purple-500/50 text-purple-200 font-bold"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
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
