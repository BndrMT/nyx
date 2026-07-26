import React, { useState } from "react";
import { X, Send, Heart, AlertCircle } from "lucide-react";
import { EMOTIONAL_TAGS } from "../data/tags";
import { checkSafety } from "../utils/moderation";

export default function CreatePostModal({ isOpen, onClose, onSubmitPost, onTriggerSOS }) {
  const [content, setContent] = useState("");
  // Default emotional tag is "غصّةٌ مكتومة" (silent-grief)
  const [selectedTagId, setSelectedTagId] = useState("silent-grief");
  const [errorWarning, setErrorWarning] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // Safety & Self-harm evaluation
    const safetyResult = checkSafety(content);

    if (!safetyResult.isSafe) {
      if (safetyResult.isSelfHarm) {
        onClose();
        onTriggerSOS(safetyResult.reason);
        return;
      } else {
        setErrorWarning(safetyResult.reason);
        return;
      }
    }

    onSubmitPost({
      content: content.trim(),
      tagId: selectedTagId,
      retentionDays: 0 // Default: Forever (إلى الأبد)
    });

    setContent("");
    setErrorWarning("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-purple-500/20 p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/40 flex items-center justify-center">
              <Heart className="w-4 h-4 text-purple-300" />
            </div>
            <h2 className="text-base font-bold text-slate-100">أَلْقِ بعِبْئِك الآن</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Author Emotional Tag Selector */}
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto no-scrollbar p-1">
            {EMOTIONAL_TAGS.filter((t) => t.id !== "all").map((tag) => {
              const isSelected = selectedTagId === tag.id;
              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => setSelectedTagId(tag.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-purple-600 text-white border border-purple-400 shadow-md scale-105"
                      : "bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  <span>{tag.icon}</span>
                  <span>{tag.name}</span>
                </button>
              );
            })}
          </div>

          {/* Text Area */}
          <div>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setErrorWarning("");
              }}
              placeholder="اكتب هنا ما خنقته العَبرة أو عجزت عن قوله لأحد.. اترك كلماتك ترحل في الليل بحرية وسلام..."
              className="w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 resize-none transition-all leading-relaxed"
              maxLength={800}
            />
            <div className="flex items-center justify-end text-[11px] text-slate-500 mt-1">
              <span>{content.length} / 800</span>
            </div>
          </div>

          {/* Error warning if any */}
          {errorWarning && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorWarning}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-950/50 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              <span>أرسل البوح تحت ستر الليل</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
