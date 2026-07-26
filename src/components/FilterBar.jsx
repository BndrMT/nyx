import React from "react";
import { EMOTIONAL_TAGS } from "../data/tags";

export default function FilterBar({ activeTag, onSelectTag }) {
  return (
    <div className="w-full py-4 border-b border-white/5 mb-6">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-2">
          <span>تصفح حسب المشاعر:</span>
        </div>

        {/* 2-Row / Multi-row responsive grid without horizontal scrolling */}
        <div className="flex flex-wrap gap-2">
          {EMOTIONAL_TAGS.map((tag) => {
            const isActive = activeTag === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => onSelectTag(tag.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-900/70 border border-purple-500/60 text-purple-200 shadow-md shadow-purple-950/50 scale-105"
                    : "bg-slate-900/60 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
