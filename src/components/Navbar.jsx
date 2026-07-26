import React from "react";
import { Moon, Flame, Download, Info } from "lucide-react";

export default function Navbar({ onOpenMyPosts, onOpenPWAInstall, onOpenAbout }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B0D14]/85 border-b border-white/5 shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 py-3.5 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-900/80 via-indigo-900/50 to-slate-900 border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-950/60">
            <Moon className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-100 to-slate-200">
                نِيكْس <span className="text-xs font-normal text-purple-400/80">(Nyx)</span>
              </h1>
              <button
                onClick={onOpenAbout}
                className="p-1 rounded-lg text-slate-500 hover:text-purple-300 hover:bg-slate-800/60 transition-all"
                title="عن التطبيق"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-purple-300/80 hidden sm:block font-medium">
              نَهْرُ النِّسْيَانِ وَالْخَلاصِ
            </p>
          </div>
        </div>

        {/* Minimal Controls (Only: همساتي & تثبيت التطبيق) */}
        <div className="flex items-center gap-2.5">
          
          {/* My Sent Posts (همساتي) */}
          <button
            onClick={onOpenMyPosts}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all active:scale-95"
            title="دفتر همساتي المحفوظة"
          >
            <Flame className="w-3.5 h-3.5 text-indigo-400" />
            <span>همساتي</span>
          </button>

          {/* PWA Install Button */}
          <button
            onClick={onOpenPWAInstall}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-purple-500/40 transition-all active:scale-95"
            title="تثبيت التطبيق على الهاتف"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>تثبيت التطبيق</span>
          </button>

        </div>

      </div>
    </header>
  );
}
