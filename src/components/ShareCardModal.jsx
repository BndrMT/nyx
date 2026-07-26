import React, { useState, useEffect } from "react";
import { X, Share2, Copy, Check, Moon, Image as ImageIcon } from "lucide-react";
import { EMOTIONAL_TAGS } from "../data/tags";
import { EMPATHETIC_REACTIONS } from "../data/reactions";
import QRCode from "qrcode";

export default function ShareCardModal({ isOpen, onClose, post }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    if (isOpen && post) {
      QRCode.toDataURL(window.location.origin, {
        width: 80,
        margin: 1,
        color: { dark: "#A855F7", light: "#0B0D14" }
      }).then(setQrDataUrl).catch(() => {});
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const tag = EMOTIONAL_TAGS.find((t) => t.id === post.tagId) || EMOTIONAL_TAGS[0];

  // HTML5 Canvas Generator with Dynamic Text Height & Multi-row Wrapping Reaction Badges + Real QR Code
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
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

      // Nyx Subtitle Badge
      ctx.fillStyle = "rgba(216, 180, 254, 0.8)";
      ctx.font = "24px system-ui, Cairo, sans-serif";
      ctx.fillText("تحت سِتْر الليل", 980, 165);

      // Top Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(980, 200);
      ctx.stroke();

      // Determine optimal font size based on text length to avoid collision
      const textLen = post.content.length;
      let fontSize = 36;
      let lineHeight = 58;

      if (textLen > 250) {
        fontSize = 28;
        lineHeight = 46;
      } else if (textLen > 150) {
        fontSize = 32;
        lineHeight = 52;
      }

      ctx.fillStyle = "#F1F5F9";
      ctx.font = `${fontSize}px system-ui, Cairo, sans-serif`;
      
      const words = (`«${post.content}»`).split(" ");
      let line = "";
      let y = 270;
      const maxWidth = 880;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 980, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 980, y);

      // Dynamic Divider after vent text
      let rxY = y + 45;
      if (rxY > 740) rxY = 740;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.moveTo(100, rxY);
      ctx.lineTo(980, rxY);
      ctx.stroke();

      // Multi-row wrapping for reaction badges
      let rxX = 980;
      let currentY = rxY + 25;
      ctx.font = "20px system-ui, Cairo, sans-serif";
      ctx.textAlign = "right";

      EMPATHETIC_REACTIONS.forEach((r) => {
        const count = post.reactions?.[r.id] || 0;
        if (count > 0) {
          const badgeText = `${r.icon} ${r.label} (${count})`;
          const badgeWidth = ctx.measureText(badgeText).width + 28;

          // If badge exceeds left margin (100px), wrap to next row
          if (rxX - badgeWidth < 100) {
            rxX = 980;
            currentY += 50;
          }

          if (currentY < 880) {
            // Draw pill background
            ctx.fillStyle = "rgba(26, 32, 53, 0.9)";
            ctx.beginPath();
            ctx.roundRect(rxX - badgeWidth, currentY, badgeWidth, 38, 16);
            ctx.fill();
            ctx.strokeStyle = "rgba(168, 85, 247, 0.4)";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Draw pill text
            ctx.fillStyle = "#E2E8F0";
            ctx.fillText(badgeText, rxX - 14, currentY + 26);

            rxX -= (badgeWidth + 12);
          }
        }
      });

      // Bottom Watermark & QR Code Divider
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, 910);
      ctx.lineTo(980, 910);
      ctx.stroke();

      // Brand Title & Subtitle
      ctx.fillStyle = "#E9D5FF";
      ctx.font = "bold 36px system-ui, Cairo, sans-serif";
      ctx.fillText("نِيكْس (Nyx)", 980, 965);

      ctx.fillStyle = "#A855F7";
      ctx.font = "22px system-ui, Cairo, sans-serif";
      ctx.fillText("نَهْرُ النِّسْيَانِ وَالْخَلاصِ", 980, 1005);

      // Real QR Code — draw to off-screen canvas then onto the card
      const qrSize = 100;
      const qrX = 100;
      const qrY = 930;

      const qrCanvas = document.createElement("canvas");
      qrCanvas.width = qrSize;
      qrCanvas.height = qrSize;
      await QRCode.toCanvas(qrCanvas, window.location.origin, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#A855F7",
          light: "#0B0D14"
        }
      });

      // Draw rounded background for QR
      ctx.fillStyle = "#0B0D14";
      ctx.beginPath();
      ctx.roundRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 12);
      ctx.fill();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.6)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw the real QR code
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

      // Trigger PNG File Download or Native Share
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], "nyx-card.png", { type: "image/png" })] })) {
          const file = new File([blob], "nyx-card.png", { type: "image/png" });
          navigator.share({
            files: [file],
            title: "نِيكْس — نَهْرُ النِّسْيَانِ وَالْخَلاصِ",
            text: `«${post.content}»`
          }).catch(() => {});
        } else {
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
              <h2 className="text-base font-bold text-slate-100">بطاقة البوح السينمائية (PNG)</h2>
              <p className="text-[11px] text-slate-400">تتضمن أوسمة التفاعلات ورمز QR المنصة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Share Card Preview */}
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

            {/* Empathetic Reaction Counts Preview (Multi-row wrapped) */}
            <div className="flex flex-wrap gap-1.5 py-2 border-b border-white/5 mb-3">
              {EMPATHETIC_REACTIONS.map((r) => {
                const count = post.reactions?.[r.id] || 0;
                if (count === 0) return null;
                return (
                  <span key={r.id} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 border border-purple-800/40 text-purple-200">
                    {r.icon} {r.label} ({count})
                  </span>
                );
              })}
            </div>

            {/* Card Watermark & QR Placeholder Footer */}
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

              {/* Real QR Code */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-purple-500/40 p-1 flex items-center justify-center shadow-inner">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR" className="w-full h-full" />
                ) : (
                  <span className="text-[8px] text-purple-300 font-mono">QR</span>
                )}
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
          <span>{downloading ? "جارٍ رسم صورة PNG الملتفة..." : "تحميل / مشاركة البطاقة كـ (صورة PNG)"}</span>
        </button>

        {/* Primary Action 2: Social Media Direct Links */}
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
          <span>تلتف التفاعلات والنصوص تلقائياً دون تداخل</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">إغلاق</button>
        </div>

      </div>
    </div>
  );
}
