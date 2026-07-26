import React, { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import PostCard from "./components/PostCard";
import CreatePostModal from "./components/CreatePostModal";
import SOSModal from "./components/SOSModal";
import AIAnalysisModal from "./components/AIAnalysisModal";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import MyPostsModal from "./components/MyPostsModal";
import BreathingModal from "./components/BreathingModal";
import Footer from "./components/Footer";

import { getStoredPosts, saveNewPost, togglePostReaction, getUserReactions, getOrCreateDeviceUUID, deleteMyPost } from "./utils/storage";
import { registerServiceWorker } from "./utils/pwa";
import { Heart, Sparkles, ShieldCheck, PenTool, Wind, Moon, RefreshCw } from "lucide-react";

const BATCH_SIZE = 6;

export default function App() {
  const [posts, setPosts] = useState([]);
  const [userReactions, setUserReactions] = useState({});
  const [activeTag, setActiveTag] = useState("all");

  // Infinite Scroll / Batch Loading state
  const [displayedCount, setDisplayedCount] = useState(BATCH_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [sosReason, setSosReason] = useState("");
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [selectedPostForAI, setSelectedPostForAI] = useState(null);
  const [isPWAInstallOpen, setIsPWAInstallOpen] = useState(false);
  const [isMyPostsOpen, setIsMyPostsOpen] = useState(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);

  useEffect(() => {
    getOrCreateDeviceUUID();
    registerServiceWorker();
    setPosts(getStoredPosts());
    setUserReactions(getUserReactions());
  }, []);

  // Reset pagination count when active tag changes
  useEffect(() => {
    setDisplayedCount(BATCH_SIZE);
  }, [activeTag]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [displayedCount, posts, activeTag, isLoadingMore]);

  const handleLoadMore = () => {
    const filtered = activeTag === "all" ? posts : posts.filter((p) => p.tagId === activeTag);
    if (displayedCount >= filtered.length) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount((prev) => prev + BATCH_SIZE);
      setIsLoadingMore(false);
    }, 400);
  };

  const handleCreatePost = (newPostData) => {
    const updated = saveNewPost(newPostData);
    setPosts(updated);
  };

  const handleToggleReaction = (postId, reactionId) => {
    const res = togglePostReaction(postId, reactionId);
    setPosts(res.posts);
    setUserReactions(res.userReactions);
  };

  const handleDeletePost = (postId) => {
    const updated = deleteMyPost(postId);
    setPosts(updated);
  };

  const handleUpdateRetention = () => {
    setPosts(getStoredPosts());
  };

  const handleOpenAIAnalysis = (post) => {
    setSelectedPostForAI(post);
    setIsAIOpen(true);
  };

  const handleTriggerSOS = (reason) => {
    setSosReason(reason);
    setIsSOSOpen(true);
  };

  const filteredPosts = activeTag === "all"
    ? posts
    : posts.filter((p) => p.tagId === activeTag);

  const visiblePosts = filteredPosts.slice(0, displayedCount);
  const hasMore = displayedCount < filteredPosts.length;

  return (
    <div className="min-h-screen bg-[#0B0D14] text-slate-100 flex flex-col selection:bg-purple-900 selection:text-purple-100">
      
      {/* Sticky Top Navbar */}
      <Navbar
        onOpenMyPosts={() => setIsMyPostsOpen(true)}
        onOpenPWAInstall={() => setIsPWAInstallOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-6 pb-12">
        
        {/* Serene Poetic Hero Header Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/60 border border-purple-500/20 p-6 sm:p-8 mb-8 text-center sm:text-right shadow-2xl">
          <div className="absolute top-0 left-0 -ml-16 -mt-16 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            
            {/* Title Column */}
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-purple-100 to-indigo-200 leading-relaxed tracking-wide">
                أَرْوَاحٌ خَفِيَّةٌ تَطُوفُ فِي صَمْتٍ تَدْعُو لَكَ بِالسَّلاَمِ
              </h2>
            </div>

            {/* Hero Controls: "تنفس بعمق" & "بوح جديد" */}
            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
              
              {/* Action Buttons */}
              <div className="flex flex-row gap-2.5 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => setIsBreathingOpen(true)}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl bg-purple-950/70 border border-purple-700/50 text-purple-200 font-semibold text-xs hover:bg-purple-900 transition-all"
                >
                  <Wind className="w-3.5 h-3.5 text-purple-300" />
                  <span>تنفس بعمق</span>
                </button>

                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-purple-950/60 hover:from-purple-500 hover:to-indigo-500 transition-all active:scale-95"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>بوح جديد</span>
                </button>
              </div>

              {/* Privacy & Safety Metrics */}
              <div className="flex flex-row items-center justify-between sm:justify-end gap-2 text-[10px] text-slate-400 pt-1 border-t border-white/5 w-full">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  مستور ومجهول 100%
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-purple-400" />
                  أرواح تدعو لك
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  تحليل محلي
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* Emotion Tag Filters */}
        <FilterBar activeTag={activeTag} onSelectTag={setActiveTag} />

        {/* Posts Silent Feed (Batch Loaded / Infinite Scroll) */}
        <section className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
              <Moon className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
              <h3 className="text-base font-bold text-slate-300">لا يوجد بوح تحت هذا الوسم حالياً</h3>
              <p className="text-xs text-slate-500 mt-1">كن أول من يشارك مشاعره تحت هذا الوسم بحرية وسكون.</p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-900/60 border border-purple-700/50 text-purple-200 text-xs font-semibold hover:bg-purple-800 transition-all"
              >
                بوح جديد
              </button>
            </div>
          ) : (
            <>
              {visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  userReactions={userReactions}
                  onToggleReaction={handleToggleReaction}
                />
              ))}

              {/* Infinite Scroll Load Trigger & Spinner */}
              {hasMore && (
                <div ref={loadMoreRef} className="pt-6 pb-2 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 text-purple-200 text-xs font-medium hover:bg-purple-950/60 hover:border-purple-400/50 transition-all"
                  >
                    {isLoadingMore ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 text-purple-300 animate-spin" />
                        <span>جارٍ استكشاف همسات ليلية إضافية...</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-3.5 h-3.5 text-purple-400" />
                        <span>استكشاف المزيد من همسات الليل</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </main>

      {/* Modals & Dialogs */}
      <CreatePostModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmitPost={handleCreatePost}
        onTriggerSOS={handleTriggerSOS}
      />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        reason={sosReason}
      />

      <AIAnalysisModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        post={selectedPostForAI}
      />

      <PWAInstallPrompt
        isOpen={isPWAInstallOpen}
        onClose={() => setIsPWAInstallOpen(false)}
      />

      <MyPostsModal
        isOpen={isMyPostsOpen}
        onClose={() => setIsMyPostsOpen(false)}
        onDeletePost={handleDeletePost}
        onUpdateRetention={handleUpdateRetention}
        onAnalyzeAI={handleOpenAIAnalysis}
      />

      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenPWAInstall={() => setIsPWAInstallOpen(true)} />

    </div>
  );
}
