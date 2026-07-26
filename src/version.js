// Nyx — Application Version
// Version format: MAJOR.MINOR.PATCH
//   MAJOR: Core architecture changes, full rewrites
//   MINOR: Significant feature additions
//   PATCH: Fixes, small tweaks, UI refinements
//
// Changelog:
// 1.3.0 — AI expansion (11 emotions, 20+ responses), premium audio (wind+rain+heartbeat),
//         self-host fonts, CSP hardening, CSS animations, 60-text dailySeeder
// 1.3.1 — Real QR code (qrcode lib), PWA icons (192/512/maskable), iOS meta tags
// 1.4.0 — Real local AI via Transformers.js (Arabic sentiment model),
//         advanced profanity detection with letter-manipulation prevention,
//         consent-based model download with progress tracking
// 1.3.2 — Fix: ReferenceError isTimerRunning, symmetric CreatePostModal header,
//         remove "تحت ستر الليل" from cards, "سري" badge, English/URL filter,
//         new icon design, symmetric post tags, full tag display,
//         force PWA update on deploy (SW v2)

const VERSION = {
  major: 1,
  minor: 4,
  patch: 0,
  codename: "نَهْرُ النِّسْيَانِ وَالْخَلاصِ"
};

export const APP_VERSION = `${VERSION.major}.${VERSION.minor}.${VERSION.patch}`;
export const VERSION_CODENAME = VERSION.codename;
