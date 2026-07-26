import { getDb } from "./db.js";

// Nyx API — Shared posts with zero-knowledge privacy
// No emails, no passwords, no IP logging. Just anonymous vents.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const sql = getDb();

    if (req.method === "GET") {
      // Return all posts, newest first
      const posts = await sql`
        SELECT id, content, tag_id, device_uuid, created_at, reactions
        FROM posts
        ORDER BY created_at DESC
        LIMIT 100
      `;

      return res.status(200).json({ success: true, posts });
    }

    if (req.method === "POST") {
      const { content, tagId, deviceUUID } = req.body || {};

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: "Content is required" });
      }

      const id = "post_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);
      const defaultReactions = {
        "not-alone": 0,
        "i-feel-you": 0,
        "sending-peace": 0,
        "stay-strong": 0,
        "same-story": 0,
        "god-bless": 0
      };

      await sql`
        INSERT INTO posts (id, content, tag_id, device_uuid, reactions)
        VALUES (${id}, ${content.trim()}, ${tagId || "silent-grief"}, ${deviceUUID || "anonymous"}, ${JSON.stringify(defaultReactions)})
      `;

      return res.status(201).json({ success: true, id });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
