import React, { useRef, useState } from "react";
import { X, Share2, Download, Copy, Check, Moon, Heart } from "lucide-react";
import { EMOTIONAL_TAGS } from "../data/tags";

export default function ShareCardModal({ isOpen, onClose, post }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);

  if (!isOpen || !post) return null;

  const tag = EMOTIONAL_TAGS.find((t) => t.id === post.tagId) || EMOTIONAL_TAGS[0];

  const handleCopyText = () => {
    const textToCopy = `«${post.content}»\n\n— بوح مستور عبر تطبيق نِيكْس (نَهْرُ النِّسْيَانِ وَالْخَلاصِ)\n${window.location.origin}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrls = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(`«${post.content}»\n\nنِيكْس — نَهْرُ النِّسْيَانِ وَالْخَلاصِ\n${window.location.origin}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`«${post.content}»\n\nنِيكْس — نَهْرُ النِّسْيَانِ وَالْخَلاصِ`)}&url=${encodeURIComponent(window.location.origin)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/30 p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">بطاقة البوح السينمائية</h2>
              <p className="text-[11px] text-slate-400">بطاقة مجهولة ومحميّة بالكامل وجاهزة للنشر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Visual Share Card Canvas */}
        <div className="my-5 p-1 rounded-3xl bg-gradient-to-b from-purple-600/30 via-indigo-600/20 to-purple-900/40 p-0.5">
          <div
            ref={cardRef}
            className="rounded-[23px] bg-gradient-to-b from-[#111422] via-[#0C0E18] to-[#080911] p-6 sm:p-8 text-right shadow-2xl relative overflow-hidden border border-white/10"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

            {/* Tag Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 border border-purple-700/50 text-purple-200">
                <span>{tag.icon}</span>
                <span>{tag.name}</span>
              </span>
              <div className="w-6 h-6 rounded-full bg-purple-950/60 flex items-center justify-center border border-purple-800/40">
                <Moon className="w-3.5 h-3.5 text-purple-300" />
              </div>
            </div>

            {/* Vent Text */}
            <p className="text-sm sm:text-base leading-relaxed text-slate-100 font-normal py-3 border-t border-b border-white/5 my-3 whitespace-pre-line tracking-wide">
              «{post.content}»
            </p>

            {/* Card Watermark Footer */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
                  <Moon className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-100">
                    نِيكْس (Nyx)
                  </h4>
                  <p className="text-[9px] text-purple-300/70 font-medium">نَهْرُ النِّسْيَانِ وَالْخَلاصِ</p>
                </div>
              </div>

              {/* QR Code Space Placeholder */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-purple-500/30 p-1 flex items-center justify-center text-[9px] text-purple-300 text-center font-mono shadow-inner">
                [QR]
              </div>
            </div>

          </div>
        </div>

        {/* Social Share Action Buttons */}
        <div className="space-y-3">
          <span className="block text-xs font-semibold text-slate-400">
            مشاركة عبر وسائل التواصل الاجتماعى:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            
            {/* WhatsApp */}
            <a
              href={shareUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-200 text-xs font-semibold hover:bg-emerald-900 transition-all"
            >
              <span>واتساب</span>
            </a>

            {/* X / Twitter */}
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              <span>تويتر (X)</span>
            </a>

            {/* Facebook */}
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-950/70 border border-blue-800/50 text-blue-200 text-xs font-semibold hover:bg-blue-900 transition-all"
            >
              <span>فيسبوك</span>
            </a>

            {/* Instagram / Snapchat Copy Text */}
            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم النسخ!" : "إنستغرام / سناب"}</span>
            </button>

          </div>

        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span>البطاقة مجهولة 100% وخالية من أي بيانات شخصية</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">إغلاق</button>
        </div>

      </div>
    </div>
  );
}
