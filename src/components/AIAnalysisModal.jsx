import React, { useEffect, useState } from "react";
import { Sparkles, X, Heart, RefreshCw, ChevronDown, ChevronUp, Lock, Download, Check, AlertTriangle } from "lucide-react";
import { analyzePostEmotionsLocally } from "../utils/localAI";
import { loadEmotionModel, analyzeEmotion, getModelInfo, onProgress } from "../utils/emotionModel";

// Cache for model consent in localStorage
const CONSENT_KEY = "nyx_ai_model_consent_v1";

export default function AIAnalysisModal({ isOpen, onClose, post }) {
  const [step, setStep] = useState("intro"); // "intro" | "consent" | "downloading" | "analyzing" | "result"
  const [result, setResult] = useState(null);
  const [showGentleWhisper, setShowGentleWhisper] = useState(false);
  const [modelConsented, setModelConsented] = useState(() => localStorage.getItem(CONSENT_KEY) === "true");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState("");
  const [useLocalAI, setUseLocalAI] = useState(false);
  // progressRef reserved for future download cancellation

  useEffect(() => {
    if (isOpen) {
      setStep("intro");
      setResult(null);
      setShowGentleWhisper(false);
      setDownloadProgress(0);
      setDownloadError("");
      setUseLocalAI(false);

      // Check if model already loaded
      const info = getModelInfo();
      if (modelConsented || info.isLoading || info.progress > 0) {
        // Model consented or already loading — skip directly
      }
    }
  }, [isOpen]);

  // Listen for download progress
  useEffect(() => {
    if (step === "downloading") {
      const unsub = onProgress((pct) => {
        if (pct === -1) {
          setDownloadError("فشل تحميل النموذج. تحقق من اتصالك بالإنترنت وحاول مجدداً.");
          return;
        }
        setDownloadProgress(pct);
        if (pct >= 1) {
          // Download complete, start analysis
          setTimeout(() => handleRealAnalysis(), 200);
        }
      });
      return unsub;
    }
  }, [step]);

  if (!isOpen) return null;

  const handleStartConsent = () => {
    if (modelConsented) {
      // Already consented before — go straight to download
      setStep("downloading");
      loadEmotionModel().catch((err) => {
        setDownloadError(err.message || "خطأ في تحميل النموذج.");
      });
    } else {
      setStep("consent");
    }
  };

  const handleConsentAgree = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setModelConsented(true);
    setStep("downloading");
    loadEmotionModel().catch((err) => {
      setDownloadError(err.message || "خطأ في تحميل النموذج.");
    });
  };

  const handleConsentDecline = () => {
    setUseLocalAI(true);
    setStep("analyzing");
    handleLocalAnalysis();
  };

  const handleLocalAnalysis = () => {
    analyzePostEmotionsLocally(post.content, post.tagId).then((res) => {
      setResult(res);
      setStep("result");
    });
  };

  const handleRealAnalysis = async () => {
    setStep("analyzing");
    try {
      const emotion = await analyzeEmotion(post.content);
      // Map to the same response format as localAI for UI compatibility
      const tenderReflection = emotion.description;
      const emotionTone = `المشاعر المسيطرة: ${emotion.nativeLabel} (بثقة ${Math.round(emotion.score * 100)}%)`;
      const gentleWhisper = 
        emotion.label === "POSITIVE" 
          ? "حتى في الإيجابية، هناك عمق يستحق التأمل. فرحك مشروع، وألمك أيضاً. فقط.. كن مع نفسك كما أنت."
          : emotion.label === "NEGATIVE"
          ? "لا بأس أن تؤلم. لا بأس أن تبكي. مشاعرك حقيقية، ومكانك هنا آمن. خذ وقتك، فأنت لا يجب أن تكون بخير دائماً."
          : "في الحياد سكينة. ليس كل شيء يحتاج تصنيفاً. أحياناً مجرد التواجد هنا، بين هذه الكلمات، هو كافٍ.";
      
      setResult({ emotionTone, tenderReflection, gentleWhisper });
      setStep("result");
    } catch (err) {
      setDownloadError(err.message || "فشل التحليل. تجربة النسخة المحلية البديلة.");
      // Fallback to localAI
      handleLocalAnalysis();
    }
  };

  const modelInfo = getModelInfo();
  const modelSizeMB = modelInfo.sizeMB;

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

        {/* STEP 1: Reassuring Intro */}
        {step === "intro" && (
          <div className="mt-4 space-y-4">
            
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>كيف يعمل هذا التحليل بكل أمان وخصوصية؟</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                يتم إجراء هذا التحليل **محلياً بالكامل داخل متصفح جهازك** باستخدام نموذج ذكاء اصطناعي حقيقي. لا يتم إرسال حرف واحد من كلماتك أو مشاعرك لأي خادم خارجي أو سيرفر إطلاقاً.
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
                onClick={handleStartConsent}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>متابعة القراءة بحُب</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Model Download Consent */}
        {step === "consent" && !useLocalAI && (
          <div className="mt-4 space-y-4">
            
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Download className="w-4 h-4 text-purple-400" />
                <span>تأكيد تحميل نموذج التحليل العاطفي</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                لضمان خصوصيتكم وعدم مغادرة أي بيانات خاصة خارج جهازكم من أجل التحليل العاطفي، سيتم إرفاق نموذج التحليل على ذاكرة التطبيق.
              </p>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-300">حجم النموذج: ~{modelSizeMB} MB</span>
                  <p className="text-[10px] text-slate-500">يُحمَّل لمرة واحدة ويُخزَّن في متصفحك للاستخدامات المستقبلية</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-all"
              >
                غير موافق
              </button>
              <button
                onClick={handleConsentAgree}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>موافق</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-600 text-center">
              يمكنك العودة للتحليل لاحقاً في أي وقت. عدم الموافقة لا يمنع استخدام التطبيق.
            </p>

          </div>
        )}

        {/* STEP 3: Download Progress */}
        {step === "downloading" && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center">
              <Download className="w-7 h-7 text-purple-300 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {downloadProgress < 0.01 ? "جارٍ تجهيز نموذج التحليل العاطفي..." : "تحميل النموذج العاطفي..."}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {downloadProgress < 0.01 
                  ? `الحجم التقريبي: ~${modelSizeMB} MB — مرة واحدة فقط`
                  : `${Math.round(downloadProgress * 100)}%`}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${Math.max(1, downloadProgress * 100)}%` }}
              />
            </div>

            {downloadError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs">
                {downloadError}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Analyzing */}
        {step === "analyzing" && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/40 flex items-center justify-center mb-4 animate-spin">
              <RefreshCw className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-sm font-semibold text-slate-200">
              {useLocalAI 
                ? "جارٍ قراءة نبض كلماتك وتحليل طاقة النص محلياً..." 
                : "النموذج العاطفي يعمل على جهازك.. جارٍ تحليل المشاعر..."}
            </p>
            <p className="text-xs text-slate-500 mt-1">يتم معالجة النص داخل جهازك بالكامل بكل أمان</p>
          </div>
        )}

        {/* STEP 5: Result */}
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
