import React from "react";
import { X, Heart, Moon, ShieldCheck, Lock, Sparkles, Wind } from "lucide-react";

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl overflow-hidden">
        
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-900/20 blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6 mt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-900/80 to-indigo-800/60 border border-purple-400/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-950/60">
            <Moon className="w-7 h-7 text-purple-200" />
          </div>
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
            🌙 عن نِيكْس (Nyx)
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-4 text-xs text-slate-200 leading-relaxed">
          
          <p>
            نِيكْس ليست شبكة تواصل اجتماعي، ولا منصة للبحث عن الإعجابات.
          </p>

          <p>
            هي مساحة رقمية آمنة — تهمس فيها بما في قلبك.
          </p>

          <div className="pt-3 space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-950/30 border border-purple-900/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100">خصوصية تامة</span>
                <p className="text-slate-400 text-[11px] mt-0.5">لا حسابات، إيميلات ولا تسجيل دخول.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-indigo-950/30 border border-indigo-900/40">
              <Heart className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100">تفاعل صامت</span>
                <p className="text-slate-400 text-[11px] mt-0.5">أزرار تعاطف. لا تعليقات، لا جدال.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-teal-950/30 border border-teal-900/40">
              <Lock className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100">تحليل محلي</span>
                <p className="text-slate-400 text-[11px] mt-0.5">مشاعرك تبقى في جهازك، لا تغادره أبداً.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-950/30 border border-amber-900/40">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100">نظام أمان</span>
                <p className="text-slate-400 text-[11px] mt-0.5">رصد تلقائي محلي لكلمات الضائقة وتوجيه لخطوط المساعدة وقت الحاجة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-purple-950/30 border border-purple-900/40">
              <Wind className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-100">تنفس بعمق</span>
                <p className="text-slate-400 text-[11px] mt-0.5">جلسة تهدئة مريحة بتمارين التنفس.</p>
              </div>
            </div>
          </div>

          <div className="pt-3 text-center border-t border-white/5">
            <p className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100 leading-relaxed">
              نِيكْس — نَهْرُ النِّسْيَانِ وَالْخَلاصِ
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              أرواح خفية تطوف في صمت تدعو لك بالسلام.
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-all"
        >
          فهمت 🌙
        </button>

      </div>
    </div>
  );
}
