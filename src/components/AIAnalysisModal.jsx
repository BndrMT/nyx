import React, { useState } from "react";
import { Sparkles, X, Heart, RefreshCw, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { analyzePostEmotionsLocally } from "../utils/localAI";
export default function AIAnalysisModal({ isOpen, onClose, post }) {
  const [step, setStep] = useState("intro"); // "intro" | "analyzing" | "result"
  const [result, setResult] = useState(null);
  const [showGentleWhisper, setShowGentleWhisper] = useState(false);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    setStep("analyzing");
    analyzePostEmotionsLocally(post.content, post.tagId).then((res) => {
      setResult(res);
      setStep("result");
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">تحليل المشاعر والوعي الوجداني</h2>
              <p className="text-[11px] text-purple-400 font-medium">قراءة رفيعة ومحمية بخصوصية جهازك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Intro */}
        {step === "intro" && (
          <div className="mt-4 space-y-4">
            
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>كيف يعمل هذا التحليل بكل أمان وخصوصية؟</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يتم إجراء هذا التحليل **محلياً بالكامل داخل متصفح جهازك**. لا يتم إرسال حرف واحد من كلماتك أو مشاعرك لأي خادم خارجي أو سيرفر إطلاقاً.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-300/90 font-semibold text-xs">
                <Heart className="w-4 h-4 text-amber-400" />
                <span>لطفاً منك :</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                الذكاء الاصطناعي هنا ليس قاضياً أو طبيباً نفسياً، بل هو مجرد مرآة دافئة تحاول انعكاس صدى كلماتك لتقريب الصورة لروحك. قد يصيب في قراءته وقد يخطئ كما يخطئ أي برنامج آلي.. خذ منه ما يمنح قلبك السكينة والطمأنينة، واترك ما لا يلامس شعورك الحقيقي.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/5">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                onClick={handleStartAnalysis}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>متابعة القراءة بحُب</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Analyzing */}
        {step === "analyzing" && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center mb-4 animate-spin">
              <RefreshCw className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              جارٍ قراءة نبض كلماتك وتحليل طاقة النص محلياً...
            </p>
            <p className="text-xs text-slate-500 mt-1">يتم معالجة النص داخل جهازك بالكامل بكل أمان</p>
          </div>
        )}

        {/* STEP 3: Result */}
        {step === "result" && result && (
          <div className="mt-4 space-y-4">
            
            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-center gap-3">
              <Heart className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                  نبض المشاعر المكتشف:
                </span>
                <span className="text-xs font-bold text-slate-100">{result.emotionTone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
              <p>{result.tenderReflection}</p>
            </div>

            <div className="border-t border-white/5 pt-2">
              <button
                onClick={() => setShowGentleWhisper(!showGentleWhisper)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-purple-950/30 border border-indigo-800/40 text-xs text-indigo-200 font-medium hover:border-indigo-500/50 transition-all"
              >
                <span className="flex items-center gap-2">
                  <span>🌱</span>
                  <span>هل ترغب في همسة رقيقة تُعينك على التعافي؟</span>
                </span>
                {showGentleWhisper ? (
                  <ChevronUp className="w-4 h-4 text-indigo-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-indigo-400" />
                )}
              </button>

              {showGentleWhisper && (
                <div className="mt-2 p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-700/50 text-xs text-indigo-100 leading-relaxed animate-fade-in">
                  {result.gentleWhisper}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-all"
              >
                إغلاق
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
