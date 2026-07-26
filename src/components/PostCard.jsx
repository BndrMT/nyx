import React from "react";
import { Clock, Heart, Share2 } from "lucide-react";
import { EMOTIONAL_TAGS } from "../data/tags";
import { EMPATHETIC_REACTIONS } from "../data/reactions";
import confetti from "canvas-confetti";

export default function PostCard({ post, userReactions, onToggleReaction, onShare }) {
  const tag = EMOTIONAL_TAGS.find((t) => t.id === post.tagId) || EMOTIONAL_TAGS[0];
  const postUserReactions = userReactions[post.id] || {};

  const getTopReactionGlow = () => {
    const reactions = post.reactions || {};
    let topId = null;
    let maxCount = 0;

    Object.entries(reactions).forEach(([id, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topId = id;
      }
    });

    if (!topId || maxCount === 0) {
      return "border-white/[0.07] hover:border-purple-500/30 shadow-xl";
    }

    switch (topId) {
      case "not-alone":
        return "border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.12)]";
      case "i-feel-you":
        return "border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.12)]";
      case "sending-peace":
        return "border-teal-500/30 shadow-[0_0_25px_rgba(20,184,166,0.12)]";
      case "stay-strong":
        return "border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.12)]";
      case "same-story":
        return "border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.12)]";
      case "god-bless":
        return "border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)]";
      default:
        return "border-white/[0.07] hover:border-purple-500/30 shadow-xl";
    }
  };

  const handleReactionClick = (reactionId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 14,
      spread: 45,
      origin: { x, y },
      colors: ["#C084FC", "#818CF8", "#38BDF8", "#F472B6"],
      scalar: 0.65
    });

    onToggleReaction(post.id, reactionId);
  };

  const formatRelativeTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMinutes = Math.floor((now - date) / (1000 * 60));

      if (diffMinutes < 1) return "الآن";
      if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      const diffDays = Math.floor(diffHours / 24);
      return `منذ ${diffDays} يوم`;
    } catch (_e) {
      return "منذ قليل";
    }
  };

  return (
    <article className={`group relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#111523]/80 to-[#0C0E17]/95 border p-5 sm:p-6 transition-all duration-300 ${getTopReactionGlow()} animate-card-entrance`}>
      
      {/* Top Header info — symmetric layout */}
      <div className="flex items-center justify-between mb-4">
        {/* Author Tag Badge */}
        <div className="flex-1 flex justify-start">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/70 border border-purple-800/40 text-purple-200">
            <span>{tag.icon}</span>
            <span>{tag.name}</span>
          </span>
        </div>

        {/* Share & Timestamp */}
        <div className="flex-1 flex justify-end items-center gap-2 text-[11px] text-slate-500">
          <button
            onClick={() => onShare && onShare(post)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-purple-300 hover:border-purple-500/40 transition-all"
            title="مشاركة البطاقة كصورة"
          >
            <Share2 className="w-3 h-3" />
            <span>مشاركة</span>
          </button>

          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Post Text Content */}
      <div className="mb-5 text-sm sm:text-base leading-relaxed text-slate-200 font-normal whitespace-pre-line tracking-wide">
        {post.content}
      </div>

      {/* Dynamic Serenity Comfort Quote */}
      {post.quote && (
        <div className="mb-5 p-3 rounded-2xl bg-purple-950/20 border border-purple-900/30 text-xs italic text-purple-300/90 flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span>{post.quote}</span>
        </div>
      )}

      {/* Actions & Reactions Container */}
      <div className="pt-3 border-t border-white/5 flex flex-col gap-3">
        
        {/* Empathetic Reaction Grid */}
        <div className="flex flex-wrap items-center gap-2">
          {EMPATHETIC_REACTIONS.map((r) => {
            const count = post.reactions?.[r.id] || 0;
            const hasReacted = !!postUserReactions[r.id];

            return (
              <button
                key={r.id}
                onClick={(e) => handleReactionClick(r.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs transition-all duration-200 border ${
                  hasReacted
                    ? "bg-purple-900/70 text-purple-200 border-purple-500/60 shadow-inner scale-105"
                    : `bg-slate-900/70 text-slate-400 border-slate-800/70 ${r.color}`
                }`}
                title={r.label}
              >
                <span className="text-sm">{r.icon}</span>
                <span className="font-medium text-[11px]">{r.label}</span>
                {count > 0 && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    hasReacted ? "bg-purple-700/80 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

    </article>
  );
}
