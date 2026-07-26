import React from "react";
import { HeartHandshake, PhoneCall, ShieldCheck, X, LifeBuoy, Heart } from "lucide-react";
import { CRISIS_HELPLINES } from "../data/helplines";

export default function SOSModal({ isOpen, onClose, reason }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-purple-500/40 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-rose-900/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-2xl bg-slate-800/80 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Compassionate Header */}
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-900/80 to-rose-900/80 border border-purple-400/40 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-950/80">
            <Heart className="w-8 h-8 text-rose-300 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-rose-100 to-amber-200">
            لست وحدك في هذا العالم.. نحن نهتم لأمرك
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            قرأ النظام كلمات تشير إلى ألم عميق وضائقة شائكة. سلامتك وروحك غالية جداً، وهناك من هو مستعد لسماعك واحتوائك بسرية مطلقة ودون أي أحكام.
          </p>
        </div>

        {/* Warm Guidance Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-800/50 mb-6 flex items-center gap-3">
          <LifeBuoy className="w-6 h-6 text-purple-400 flex-shrink-0" />
          <p className="text-xs text-purple-200 leading-normal">
            تم توقيف إتاحة المنشور للعامة حمايةً لسلامتك، وندعوك للتواصل المباشر مع خبراء مختصين ومحترفين في الاستماع السرّي المجاني:
          </p>
        </div>

        {/* Helplines Directory */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            خطوط الاستشارات والدعم النفسي المباشرة:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CRISIS_HELPLINES.map((h, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base">{h.flag}</span>
                    <span className="text-xs font-bold text-slate-200">{h.country}</span>
                  </div>
                  {h.lines.map((line, lIdx) => (
                    <div key={lIdx} className="text-[11px] text-slate-400 mb-1">
                      <span className="text-slate-300 font-medium">{line.name}: </span>
                      <span className="text-purple-300 font-mono font-bold">{line.number}</span>
                      <p className="text-[10px] text-slate-500">{line.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            جميع اتصالاتك ومحادثاتك مع جهات المساعدة مجانية وسرية 100%
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-950/60 border border-purple-800/40 text-purple-300 text-xs font-semibold hover:bg-purple-900 transition-all"
          >
            فهمت ذلك
          </button>
        </div>

      </div>
    </div>
  );
}
