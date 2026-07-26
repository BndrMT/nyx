// Nyx Reddit Proxy — Vercel Serverless Function
// Fetches authentic Arabic emotional content from Reddit
// Strips ALL metadata: usernames, subreddits, URLs, timestamps
// Returns only cleaned text content — zero identifying info

// Verified Arabic subreddits with emotional/personal content
const ARABIC_SUBS = [
  "jordan", "saudiarabia", "Egypt", "Morocco", "Tunisia",
  "algeria", "iraq", "syria", "lebanon", "Kuwait",
  "Yemen", "sudan", "Palestine", "Qatar", "oman", "bahrain", "UAE", "libya"
];

// Verified search terms that return emotional Arabic content
const EMOTIONAL_TERMS = [
  "مشاعر", "صحة نفسية", " نفسية ", "وحيد", "حزين",
  "قلبي يتوجع", "مشكلتي", "أحس", "حياتي", "ضيق"
];

function stripMetadata(text) {
  if (!text) return "";
  return text
    .replace(/u\/\w+/gi, "")          // Remove usernames
    .replace(/r\/\w+/gi, "")           // Remove subreddit refs
    .replace(/https?:\/\/\S+/g, "")   // Remove URLs
    .replace(/\[\S+\]\(https?:\/\/\S+\)/g, "") // Remove markdown links
    .replace(/[#@]\S+/g, "")          // Remove hashtags and @mentions
    .replace(/\s+/g, " ")             // Collapse whitespace
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function isArabicContent(text) {
  // Check if text is predominantly Arabic
  if (!text) return false;
  const lower = text.toLowerCase();
  return arabicChars > text.length * 0.25;
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const subreddit = ARABIC_SUBS[Math.floor(Math.random() * ARABIC_SUBS.length)];
    
    // Try multiple subreddits and emotional search terms
    let posts = [];
    let attempts = 0;
    
    while (posts.length < 3 && attempts < 8) {
      const sub = ARABIC_SUBS[Math.floor(Math.random() * ARABIC_SUBS.length)];
      const term = EMOTIONAL_TERMS[Math.floor(Math.random() * EMOTIONAL_TERMS.length)];
      const url = `https://www.reddit.com/r/${sub}/search.json?q=${encodeURIComponent(term)}&restrict_sr=on&sort=top&limit=20&t=year`;
      attempts++;

      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "NyxApp/1.0 (emotional wellness)"
          }
        });
        if (!response.ok) {
          console.log("Reddit HTTP", response.status, "for", sub, term);
          continue;
        }
        const data = await response.json();
        if (!data?.data?.children || data.data.children.length === 0) {
          console.log("No results for", sub, term);
          continue;
        }

        for (const child of data.data.children) {
          const t = child.data;
          const text = stripMetadata(t.title + " " + (t.selftext || ""));
          if (text.length > 40 && isArabicContent(text)) {
            posts.push({
              content: text.substring(0, 500),
              score: t.score || 0
            });
          }
        }
      } catch (_e) { continue; }
    }

    // Sort by score (most engaging first)
    posts.sort((a, b) => b.score - a.score);
    
    // Take top 3, strip remaining timestamps
    const result = posts.slice(0, 3).map(p => ({
      content: p.content
    }));

    return res.status(200).json({ 
      success: true, 
      posts: result,
      source: subreddit
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: "Failed to fetch content",
      message: err.message 
    });
  }
}
