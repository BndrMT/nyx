import { COMFORT_QUOTES } from "./quotes";

export const MOCK_POSTS = [
  {
    id: "nyx-post-1",
    tagId: "soul-exhaustion",
    content: "أحياناً أشعر أنني أنفق كل طاقتي في مساعدة الآخرين والابتسام في وجوههم، لكن حين أعود إلى غرفتي ليلاً لا أجد من يسألني كيف حال قلبي بحق.",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    retentionDays: 7, // 7 days retention
    quote: COMFORT_QUOTES[0],
    reactions: {
      "not-alone": 28,
      "i-feel-you": 45,
      "sending-peace": 19,
      "stay-strong": 33,
      "same-story": 12,
      "god-bless": 24
    }
  },
  {
    id: "nyx-post-2",
    tagId: "future-anxiety",
    content: "أخاف جداً من الخطوة القادمة في حياتي، لا أحد يعلم مقدار الرعب الذي ينتابني عند التفكير في المستقبل، لكنني أحاول التظاهر بالتماسك كل يوم.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    retentionDays: 1, // 24 hours retention
    quote: COMFORT_QUOTES[1],
    reactions: {
      "not-alone": 62,
      "i-feel-you": 80,
      "sending-peace": 30,
      "stay-strong": 51,
      "same-story": 44,
      "god-bless": 39
    }
  },
  {
    id: "nyx-post-3",
    tagId: "departed-loved-ones",
    content: "مر عام كامل على رحيل الشخص الذي كان ملاذي الوحيد.. ما زلت أبحث عن صوته في زوايا البيت وأكتفي بالبكاء الصامت حتى لا أنكُد على من حولي.",
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    retentionDays: 0, // Forever
    quote: COMFORT_QUOTES[2],
    reactions: {
      "not-alone": 39,
      "i-feel-you": 54,
      "sending-peace": 71,
      "stay-strong": 48,
      "same-story": 21,
      "god-bless": 95
    }
  },
  {
    id: "nyx-post-4",
    tagId: "unspoken-choke",
    content: "أدرك الآن أن بعض الخيبات لا تُحكى، لأن شرحها يضاعف من مرارتها.. اكتفيت بالانسحاب والسكوت، والسلام على ما كان.",
    createdAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    retentionDays: 30, // 30 days retention
    quote: COMFORT_QUOTES[3],
    reactions: {
      "not-alone": 50,
      "i-feel-you": 67,
      "sending-peace": 22,
      "stay-strong": 19,
      "same-story": 38,
      "god-bless": 41
    }
  }
];
