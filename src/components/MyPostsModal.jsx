import React, { useEffect, useState } from "react";
import { Flame, X, Trash2, Moon, ShieldCheck, Heart, Clock, Sparkles, Share2 } from "lucide-react";
import { getMySentPosts, deleteMyPost, updatePostRetention } from "../utils/storage";
import { EMOTIONAL_TAGS } from "../data/tags";

export default function MyPostsModal({ isOpen, onClose, onDeletePost, onUpdateRetention, onAnalyzeAI, onShare }) {
  const [myPosts, setMyPosts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMyPosts(getMySentPosts());
      setDeletingId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const RETENTION_OPTIONS = [
    { value: 1, label: "24 ساعة" },
    { value: 3, label: "3 أيام" },
    { value: 7, label: "7 أيام" },
    { value: 30, label: "30 يوماً" },
    { value: 0, label: "إلى الأبد" }
  ];

  const handleRetentionChange = (postId, value) => {
    updatePostRetention(postId, value);
    setMyPosts(getMySentPosts());
    if (onUpdateRetention) onUpdateRetention();
  };

  const handleDeleteWithBurnEffect = (postId) => {
    setDeletingId(postId);
    setTimeout(() => {
      const updated = deleteMyPost(postId);
      setMyPosts(updated.filter((p) => getMySentPosts().some((mp) => mp.id === p.id)));
      onDeletePost(postId);
      setDeletingId(null);
    }, 750);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center">
              <Flame className="w-4 h-4 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">همساتي المحفوظة تحت سِتْر الليل</h2>
              <p className="text-[11px] text-slate-400">البوح الذي أرسلته من جهازك، والتفاعلات وتحليل المشاعر</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Posts List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-4 pr-1">
          {myPosts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <Moon className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
              <p>لم تقم بإرسال أي همسة من هذا الجهاز بعد.</p>
            </div>
          ) : (
            myPosts.map((post) => {
              const tag = EMOTIONAL_TAGS.find((t) => t.id === post.tagId) || EMOTIONAL_TAGS[0];
              const totalReactions = Object.values(post.reactions || {}).reduce((a, b) => a + b, 0);
              const isDeletingThis = deletingId === post.id;

              return (
                <div
                  key={post.id}
                  className={`p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 transition-all ${
                    isDeletingThis ? "animate-burn-dissolve border-rose-600/80 bg-rose-950/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/5 pb-2">
                    <span className="flex items-center gap-1.5 font-medium text-purple-300">
                      <span>{tag.icon}</span>
                      <span>{tag.name}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onClose();
                          if (onShare) onShare(post);
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] text-slate-300 hover:text-white transition-all"
                        title="مشاركة هذه الهمسة كبطاقة"
                      >
                        <Share2 className="w-3 h-3 text-purple-400" />
                        <span>مشاركة</span>
                      </button>
                      <button
                        onClick={() => handleDeleteWithBurnEffect(post.id)}
                        disabled={isDeletingThis}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-rose-400/90 hover:text-rose-200 hover:bg-rose-950/60 border border-rose-900/40 text-[10px] transition-all"
                        title="احتراق وتلاشي هذه الهمسة"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>تلاشي</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Retention Selector */}
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      مدة البقاء:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {RETENTION_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleRetentionChange(post.id, opt.value)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] border transition-all ${
                            (post.retentionDays || 0) === opt.value
                              ? "bg-amber-950/80 border-amber-500/60 text-amber-200 font-bold"
                              : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reaction Count & AI Analysis Button */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 text-purple-300">
                      <Heart className="w-3.5 h-3.5 text-purple-400" />
                      وصلتك {totalReactions} دعوة وتفاعل صامت
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        if (onAnalyzeAI) onAnalyzeAI(post);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium text-purple-300 bg-purple-950/50 border border-purple-800/40 hover:bg-purple-900/70 hover:text-purple-100 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                      <span>تحليل مشاعري</span>
                    </button>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            تتلاشى الهمسة بالكامل عند اختيار الحذف
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">إغلاق</button>
        </div>

      </div>
    </div>
  );
}
