import React, { useState } from "react";
import { X, Share2, Download, Copy, Check, Moon, Image as ImageIcon } from "lucide-react";
import { EMOTIONAL_TAGS } from "../data/tags";

export default function ShareCardModal({ isOpen, onClose, post }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !post) return null;

  const tag = EMOTIONAL_TAGS.find((t) => t.id === post.tagId) || EMOTIONAL_TAGS[0];

  // 1. Pure HTML5 Canvas Generator for 100% Real PNG Image Download
  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080; // High resolution 1080x1080 Story / Card size
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Dark background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 1080);
      bgGradient.addColorStop(0, "#0F121D");
      bgGradient.addColorStop(0.5, "#141827");
      bgGradient.addColorStop(1, "#090B12");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Outer glow border
      ctx.strokeStyle = "rgba(168, 85, 247, 0.3)";
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, 1000, 1000);

      // Card Header Tag
      ctx.fillStyle = "#A855F7";
      ctx.font = "bold 32px system-ui, Cairo, sans-serif";
      ctx.direction = "rtl";
      ctx.textAlign = "right";
      ctx.fillText(`${tag.icon} ${tag.name}`, 980, 120);

      // Nyx Badge
      ctx.fillStyle = "rgba(216, 180, 254, 0.8)";
      ctx.font = "24px system-ui, Cairo, sans-serif";
      ctx.fillText("تحت سِتْر الليل", 980, 170);

      // Divider line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 220);
      ctx.lineTo(980, 220);
      ctx.stroke();

      // Wrapped Vent Text
      ctx.fillStyle = "#F1F5F9";
      ctx.font = "38px system-ui, Cairo, sans-serif";
      
      const words = (`«${post.content}»`).split(" ");
      let line = "";
      let y = 320;
      const maxWidth = 880;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 980, y);
          line = words[n] + " ";
          y += 65;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 980, y);

      // Bottom Watermark Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.moveTo(100, 920);
      ctx.lineTo(980, 920);
      ctx.stroke();

      // Brand Title & Subtitle
      ctx.fillStyle = "#E9D5FF";
      ctx.font = "bold 36px system-ui, Cairo, sans-serif";
      ctx.fillText("نِيكْس (Nyx)", 980, 975);

      ctx.fillStyle = "#A855F7";
      ctx.font = "24px system-ui, Cairo, sans-serif";
      ctx.fillText("نَهْرُ النِّسْيَانِ وَالْخَلاصِ", 980, 1015);

      // Trigger PNG File Download or Native Share
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        // If native mobile sharing is available (iOS Safari & Android Chrome)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], "nyx-card.png", { type: "image/png" })] })) {
          const file = new File([blob], "nyx-card.png", { type: "image/png" });
          navigator.share({
            files: [file],
            title: "نِيكْس — نَهْرُ النِّسْيَانِ وَالْخَلاصِ",
            text: `«${post.content}»`
          }).catch(() => {});
        } else {
          // Standard browser image download trigger
          const link = document.createElement("a");
          link.download = `nyx-vent-card-${Date.now()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        }
        setDownloading(false);
      });
    } catch (e) {
      console.error("Canvas draw error:", e);
      setDownloading(false);
    }
  };

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
              <h2 className="text-base font-bold text-slate-100">بطاقة البوح (صورة ونَصّ)</h2>
              <p className="text-[11px] text-slate-400">بطاقة صورة PNG سينمائية مجهولة 100%</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Visual Share Card Preview */}
        <div className="my-4 p-0.5 rounded-3xl bg-gradient-to-b from-purple-600/30 via-indigo-600/20 to-purple-900/40">
          <div className="rounded-[23px] bg-gradient-to-b from-[#111422] via-[#0C0E18] to-[#080911] p-6 sm:p-8 text-right shadow-2xl relative overflow-hidden border border-white/10">
            
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
            </div>

          </div>
        </div>

        {/* Primary Action 1: Download / Native Mobile Image Share */}
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="w-full py-3 mb-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white font-bold text-xs shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <ImageIcon className="w-4 h-4 text-purple-200" />
          <span>{downloading ? "جارٍ إنشاء صورة PNG..." : "تحميل / مشاركة البطاقة كـ (صورة PNG)"}</span>
        </button>

        {/* Primary Action 2: Social Media Direct Links (Text format) */}
        <div className="space-y-2.5">
          <span className="block text-xs font-semibold text-slate-400">
            أو مشاركة كـ (نَص ورابط):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href={shareUrls.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-800/50 text-emerald-200 text-xs font-semibold hover:bg-emerald-900 transition-all"
            >
              <span>واتساب</span>
            </a>

            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              <span>تويتر (X)</span>
            </a>

            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-950/70 border border-blue-800/50 text-blue-200 text-xs font-semibold hover:bg-blue-900 transition-all"
            >
              <span>فيسبوك</span>
            </a>

            <button
              onClick={handleCopyText}
              className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-purple-950/80 border border-purple-800/50 text-purple-200 text-xs font-semibold hover:bg-purple-900 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "تم نسخ النص!" : "نسخ النص"}</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
          <span>صورة PNG سينمائية مجهولة 100% وخالية من أي بيانات شخصية</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">إغلاق</button>
        </div>

      </div>
    </div>
  );
}
