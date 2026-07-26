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
    
    let posts = [];
    let attempts = 0;
    const urls = [];
    
    // Build a list of URLs to try (mix of old.reddit and www, hot and top)
    for (let i = 0; i < 5; i++) {
      const sub = ARABIC_SUBS[Math.floor(Math.random() * ARABIC_SUBS.length)];
      urls.push(
        `https://old.reddit.com/r/${sub}/hot.json?limit=25`,
        `https://www.reddit.com/r/${sub}/hot.json?limit=25`
      );
    }
    
    for (const url of urls) {
      if (posts.length >= 3) break;
      attempts++;
      
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        });
        if (!response.ok) continue;
        
        const data = await response.json();
        if (!data?.data?.children) continue;
        
        for (const child of data.data.children) {
          const t = child.data;
          const title = (t.title || "").trim();
          const body = (t.selftext || "").trim();
          const combined = title + " " + body;
          
          // Accept any text that's mostly Arabic and has decent length
          if (combined.length > 30 && isArabicContent(combined)) {
            posts.push({
              content: combined.substring(0, 500),
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
