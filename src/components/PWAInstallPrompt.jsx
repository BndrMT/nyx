import React from "react";
import { Smartphone, Share, PlusSquare, X, ShieldCheck } from "lucide-react";

export default function PWAInstallPrompt({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-800 border border-purple-400/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-950/80">
            <Smartphone className="w-7 h-7 text-purple-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">تثبيت تطبيق نِيكْس على هاتفك</h3>
          <p className="text-xs text-slate-400 mt-1">
            لا حاجة لمتجر التطبيقات! احصل على التطبيق مباشرة على شاشة هاتفك بأداء فائق وخاطف.
          </p>
        </div>

        {/* Instructions by Platform */}
        <div className="space-y-4 mb-6 text-xs text-slate-300">
          
          {/* iOS Safari */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-purple-300 flex items-center gap-1.5 mb-1">
              📱 هواتف آيفون (iPhone / iPad - Safari):
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>اضغط على زر المشاركة <Share className="w-3.5 h-3.5 inline text-purple-400" /> أسفل المتصفح.</li>
              <li>اختر <span className="text-slate-200 font-semibold">"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)</span> <PlusSquare className="w-3.5 h-3.5 inline text-purple-400" />.</li>
              <li>اضغط "إضافة" وستجد أيقونة التطبيق جاهزة على هاتفك!</li>
            </ol>
          </div>

          {/* Android Chrome */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5 mb-1">
              🤖 هواتف أندرويد (Android - Chrome):
            </span>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>افتح قائمة الخيارات (⋮) أعلى متصفح كروم.</li>
              <li>اختر <span className="text-slate-200 font-semibold">"تثبيت التطبيق" (Install App)</span> أو "إضافة للشاشة".</li>
              <li>سيتم تثبيت التطبيق فوراً ليعمل كـ PWA مستقل!</li>
            </ol>
          </div>

        </div>

        <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            بدون إعلانات مزعجة وخفيف الوزن
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 transition-all"
          >
            تم، شكراً
          </button>
        </div>

      </div>
    </div>
  );
}
