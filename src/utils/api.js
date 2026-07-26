// Nyx API Client
// Connects to the shared Neon Postgres database via Vercel serverless functions
// All posts and reactions are synced across all users

const API_BASE = ""; // same origin

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/api/posts`);
  const data = await res.json();
  if (data.success) return data.posts;
  throw new Error(data.error || "Failed to fetch posts");
}

export async function createPost(content, tagId, deviceUUID) {
  const res = await fetch(`${API_BASE}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, tagId, deviceUUID })
  });
  const data = await res.json();
  if (data.success) return data.id;
  throw new Error(data.error || "Failed to create post");
}

export async function addReaction(postId, reaction) {
  const res = await fetch(`${API_BASE}/api/reactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, reaction })
  });
  const data = await res.json();
  if (data.success) return data.reactions;
  throw new Error(data.error || "Failed to add reaction");
}
