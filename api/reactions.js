import { getDb } from "./db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const sql = getDb();
    const { postId, reaction } = req.body || {};

    if (!postId || !reaction) {
      return res.status(400).json({ success: false, error: "postId and reaction are required" });
    }

    // Increment the reaction counter
    const updated = await sql`
      UPDATE posts
      SET reactions = jsonb_set(
        COALESCE(reactions, '{}'),
        ${[reaction]},
        ((COALESCE(reactions->>${reaction}, '0')::int + 1)::text)::jsonb
      )
      WHERE id = ${postId}
      RETURNING id, reactions
    `;

    if (updated.length === 0) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    return res.status(200).json({ success: true, reactions: updated[0].reactions });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
