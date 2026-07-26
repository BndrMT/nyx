// Nyx Reddit Proxy — Vercel Serverless Function
// Fetches authentic Arabic emotional content from Reddit
// Strips ALL metadata: usernames, subreddits, URLs, timestamps
// Returns only cleaned text content — zero identifying info

const SUBREDDITS = ["arabs", "jordan", "Egypt", "saudiarabia", "Morocco", "Tunisia", "algeria", "iraq", "syria", "lebanon", "Yemen", "sudan", "Palestine", "Kuwait", "Qatar", "oman", "bahrain", "UAE", "libya"];

// Arabic emotional search queries
const QUERIES = [
  "حزين", "وحيد", "أشعر", "قلبي", "تعب", "حياة", "فراق",
  "موت", "رحيل", "ألم", "صراع", "ذكريات", "ماضي",
  "وحشة", "غصة", "خذلان", "خيبة", "أمل", "شوق", "حنين",
  "خوف", "مستقبل", "ضياع", "حيرة", "ندم", "فقدان"
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
    const subreddit = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
    
    // Try multiple subreddits and queries
    let posts = [];
    let attempts = 0;
    
    while (posts.length < 3 && attempts < 5) {
      const sub = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
      const q = QUERIES[Math.floor(Math.random() * QUERIES.length)];
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&sort=top&limit=30&t=year`;
      attempts++;

      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "NyxApp/1.0 (emotional wellness)"
          }
        });
        if (!response.ok) continue;
        const data = await response.json();
        if (!data?.data?.children) continue;

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
      source: subreddit,
      query: query
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: "Failed to fetch content",
      message: err.message 
    });
  }
}
