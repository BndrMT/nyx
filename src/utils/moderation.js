// Nyx Advanced Moderation Engine
// Detects: self-harm, profanity, letter manipulation, URL injection, English text
// All processing is 100% local — zero data leaves the device

// === SELF-HARM DETECTION ===
const SELF_HARM_KEYWORDS = [
  "انتحار", "أنتحر", "الانتحار",
  "إنهاء حياتي", "أنهي حياتي", "إنهاء الحياة",
  "أقتل نفسي", "قتل نفسي", "تخلص من حياتي", "أتخلص من حياتي",
  "إيذاء نفسي", "أؤذي نفسي", "أقطع شراييني",
  "لا أريد العيش", "تعبت من الحياة أريد الموت", "أريد الموت", "أبشر بالموت",
  "ارتاح من هذه الحياة الموت", "suicide", "end my life", "kill myself", "self-harm", "want to die"
];

// === PROFANITY DETECTION ===
// Arabic profanity roots — matched with normalization (removing repeats, tashkeel, etc.)
const PROFANITY_ROOTS = [
  "كس", "كسم", "كسخت", "كساس",
  "شرموط", "شرموطة", "عرص",
  "خول", "خوله", "مخول",
  "قحبة", "قحب",
  "متناك", "منيوك", "ينيك", "انيك", "نيك",
  "زب", "زبر",
  "طيز", "طياز",
  "عير", "عيور",
  "لبوه", "يلعن", "لعن",
  "انعل", "ملعون",
  "جهنم", "جحيم",
  "كلب", "كلبة", "كلاب",
  "حمار", "حمارة", "حمير",
  "خنزير", "خنازير",
  "بهيم", "بهيمة",
  "سافل", "سفالة",
  "وسخ", "قذر",
  "أنذال", "نذل", "نذالة",
  "مقرف", "قرف",
  "سالب", "سحاق", "سحاقية", "لوطي", "لواط",
  "خرا", "خرة",
  "بضان", "يبيض",
  "فاجر", "فاجرة", "فجور",
  "زنا", "زاني", "زانية",
  "ديوث", "دياثة",
  "سلخ", "سلخة",
  "معفن", "عفوته",
  "منحط", "انحطاط",
  "أهبل", "هبل", "مستهبل",
  "غبي", "غباء", "أغبياء",
  "متخلف", "تخلف"
];

// === SEXUAL CONTENT KEYWORDS (to block explicit content) ===
const SEXUAL_KEYWORDS = [
  "سكس", "سكـس", "جنس", "جنسي", "جنسية", "إباحي", "إباحية",
  "sex", "porn", "fuck", "fucking",
  "نيك", "متناك", "ينيك", "أنيكها",
  "بورن", "porno", "xxx",
  "سكس", "سيكس"
];

// === DETECTION FUNCTIONS ===

// Normalize Arabic text — remove tashkeel, repeated letters, substitute variants
function normalizeArabic(text) {
  return text
    // Remove diacritics (tashkeel)
    .replace(/[ًٌٍَُِّْ]/g, "")
    // Normalize Alef variants
    .replace(/[أإآا]/g, "ا")
    // Normalize Yeh
    .replace(/[يى]/g, "ي")
    // Normalize Teh Marbuta
    .replace(/[ة]/g, "ه")
    // Normalize Waw with hamza
    .replace(/[ؤ]/g, "و")
    // Normalize Alef with hamza below
    .replace(/[ئ]/g, "ي")
    // Remove repeated letters (3+ repeats → keep 2)
    .replace(/(.)\1{2,}/g, "$1$1")
    // Remove spaces and special chars inside words (e.g., "سـكـس" → "سكس")
    .replace(/[\s\-ـ.,\/_]/g, "");
}

// Check if text contains ANY profanity root (after normalization)
function containsProfanity(text) {
  const normalized = normalizeArabic(text);
  const stripped = normalized.toLowerCase();

  for (const root of PROFANITY_ROOTS) {
    if (stripped.includes(root)) return true;
  }
  return false;
}

// Check for sexual content
function containsSexual(text) {
  const normalized = normalizeArabic(text);
  const stripped = normalized.toLowerCase();
  
  for (const word of SEXUAL_KEYWORDS) {
    if (stripped.includes(word)) return false;
  }
  
  // Also check with l33t-sp34k patterns
  const leetNormalized = stripped
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/7/g, "t")
    .replace(/8/g, "b")
    .replace(/9/g, "g");
  
  for (const word of SEXUAL_KEYWORDS) {
    if (leetNormalized.includes(word)) return true;
  }
  
  return false;
}

// === MAIN EXPORT ===
export function checkSafety(text) {
  if (!text || typeof text !== "string") {
    return { isSafe: true, isSelfHarm: false };
  }

  const lower = text.toLowerCase();

  // 1. Check for Self-Harm
  const containsSelfHarm = SELF_HARM_KEYWORDS.some(keyword => lower.includes(keyword.toLowerCase()));

  if (containsSelfHarm) {
    return {
      isSafe: false,
      isSelfHarm: true,
      reason: "تم رصد عبارات تشير إلى ضائقة شائكة أو رغبة في إيذاء الذات. راحتك وسلامتك هي أولويتنا القصوى."
    };
  }

  // 2. Check for profanity (with normalization for letter manipulation)
  if (containsProfanity(text)) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "النص يحتوي على كلمات غير ملائمة لبيئة البوح الدافئة والسلامة المتبادلة."
    };
  }

  // 3. Check for sexual content
  if (containsSexual(text)) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "النص يحتوي على محتوى غير مناسب لبيئة البوح. هذه المساحة آمنة للجميع."
    };
  }

  // 4. Check for English/Latin characters (prevents link injection)
  const LATIN_PATTERN = /[a-zA-Z]{4,}/;
  const containsLatin = LATIN_PATTERN.test(text);
  if (containsLatin) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "يُسمح فقط بالكتابة بالعربية حفاظاً على خصوصية وبيئة البوح."
    };
  }

  // 5. Check for URLs
  const URL_PATTERN = /https?:\/\/|www\.|\.[a-zA-Z]{2,}(\/|\s|$)/;
  const containsURL = URL_PATTERN.test(text);
  if (containsURL) {
    return {
      isSafe: false,
      isSelfHarm: false,
      reason: "لا يُسمح بإدراج روابط حفاظاً على سلامة المجتمع."
    };
  }

  return { isSafe: true, isSelfHarm: false };
}
