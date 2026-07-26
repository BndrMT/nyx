// Local Client-Side Moderation & Safety Utility

const SELF_HARM_KEYWORDS = [
  "انتحار", "أنتحر", "الانتحار",
  "إنهاء حياتي", "أنهي حياتي", "إنهاء الحياة",
  "أقتل نفسي", "قتل نفسي", "تخلص من حياتي", "أتخلص من حياتي",
  "إيذاء نفسي", "أؤذي نفسي", "أقطع شراييني",
  "لا أريد العيش", "تعبت من الحياة أريد الموت", "أريد الموت", "أبشر بالموت",
  "ارتاح من هذه الحياة الموت", "suicide", "end my life", "kill myself", "self-harm", "want to die"
];

const PROFANITY_PATTERNS = [
  /\b(شتيمة|تجاوز|وقاحة|سب)\b/i
  // Clean regex rules for blatant toxic abuse without false positives on legitimate emotional expression
];

// English/Latin characters and URL patterns — blocked to prevent link injection
const LATIN_PATTERN = /[a-zA-Z]{4,}/; // Blocks any 4+ consecutive Latin chars
const URL_PATTERN = /https?:\/\/|www\.|\.[a-zA-Z]{2,}(\/|\s|$)/;

export function checkSafety(text) {
  if (!text || typeof text !== "string") {
    return { isSafe: true, isSelfHarm: false };
  }

  const lower = text.toLowerCase();

  // 1. Check for Self-Harm / Crisis Intervention
  const containsSelfHarm = SELF_HARM_KEYWORDS.some(keyword => lower.includes(keyword.toLowerCase()));

  if (containsSelfHarm) {
    return {
      isSafe: false,
      isSelfHarm: true,
      reason: "تم رصد عبارات تشير إلى ضائقة شائكة أو رغبة في إيذاء الذات. راحتك وسلامتك هي أولويتنا القصوى."
    };
  }

  // 2. Check for Blatant Toxic Profanity
  const containsProfanity = PROFANITY_PATTERNS.some(pattern => pattern.test(lower));

  if (containsProfanity) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "يحتوي النص على كلمات غير ملائمة لبيئة البوح الدافئة والسلامة المتبادلة."
    };
  }

  // 3. Check for Latin/English characters (prevents link injection)
  const containsLatin = LATIN_PATTERN.test(text);
  if (containsLatin) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "النص يحتوي على أحرف لاتينية. يُسمح فقط بالكتابة بالعربية حفاظاً على خصوصية وبيئة البوح."
    };
  }

  // 4. Check for URLs
  const containsURL = URL_PATTERN.test(text);
  if (containsURL) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "النص يحتوي على رابط. لا يُسمح بإدراج روابط حفاظاً على سلامة المجتمع."
    };
  }

  return { isSafe: true, isSelfHarm: false };
}
