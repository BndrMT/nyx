import React, { useState, useEffect } from "react";
import { BookOpen, Lock, X, Plus, Save, Trash2, ShieldCheck, Heart } from "lucide-react";
import { getSecretDiary, saveSecretDiaryEntry } from "../utils/storage";

export default function SecretsNotebookModal({ isOpen, onClose }) {
  const [entries, setEntries] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEntries(getSecretDiary());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updated = saveSecretDiaryEntry({ content: newNote.trim() });
    setEntries(updated);
    setNewNote("");
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/30 p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/40 flex items-center justify-center">
              <Lock className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">دفتر الأسرار الشخصي المشفر</h2>
              <p className="text-[11px] text-slate-400">خاص بك وحدك، يخزن في ذاكرة هاتفك فقط</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Add toggle */}
        <div className="py-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            أسرارك المحفوظة ({entries.length})
          </span>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-800/50 text-indigo-200 text-xs font-medium hover:bg-indigo-900 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>سر جديد</span>
            </button>
          )}
        </div>

        {/* Input Form if adding */}
        {isAdding && (
          <form onSubmit={handleSave} className="mb-4 p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3">
            <textarea
              rows={4}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="اكتب سرك الخاص هنا.. لن يظهر لأحد إطلاقاً ولن يُرفع لأي سيرفر..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ السر</span>
              </button>
            </div>
          </form>
        )}

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pr-1">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              <BookOpen className="w-8 h-8 text-slate-700 mx-auto mb-2 opacity-50" />
              <p>لم تقم بكتابة أي أسرار شخصية بعد.</p>
              <p className="text-[10px] text-slate-600 mt-1">دفترك محمي 100% داخل متصفحك.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5 border-b border-white/5 pb-1">
                  <span>{new Date(entry.date).toLocaleDateString("ar-SA", { year: "numeric", month: "short", day: "numeric" })}</span>
                  <span className="flex items-center gap-1 text-emerald-400/90">
                    <Lock className="w-3 h-3" /> محمي محلياً
                  </span>
                </div>
                <p className="whitespace-pre-line text-slate-300">{entry.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/5 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            مشفر في ذاكرة المتصفح المحلية فقط
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">إغلاق</button>
        </div>

      </div>
    </div>
  );
}
