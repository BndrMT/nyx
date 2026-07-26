import React from "react";
import { Moon, ShieldCheck, Lock, Download } from "lucide-react";

export default function Footer({ onOpenPWAInstall }) {
  return (
    <footer className="mt-16 border-t border-white/5 bg-[#080910] text-slate-400 py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand statement */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
            <Moon className="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">نِيكْس (Nyx) — نَهْرُ النِّسْيَانِ وَالْخَلاصِ</h4>
            <p className="text-xs text-slate-500">تطبيق بدون حسابات ولا تتبع للهوية</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zero-Knowledge
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            ذكاء محلي بجهازك
          </span>
          <button
            onClick={onOpenPWAInstall}
            className="flex items-center gap-1 text-purple-300 hover:text-purple-100 transition-all font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            تثبيت التطبيق (PWA)
          </button>
        </div>

      </div>
    </footer>
  );
}
