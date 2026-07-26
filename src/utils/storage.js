// Zero-Knowledge Local Storage & Session Management Utility
import { MOCK_POSTS } from "../data/mockPosts";
import { getRandomQuote } from "../data/quotes";

const KEYS = {
  DEVICE_UUID: "nyx_device_uuid_v1",
  LOCAL_POSTS: "nyx_local_posts_v1",
  USER_REACTIONS: "nyx_user_reactions_v1",
  MY_SENT_POST_IDS: "nyx_my_sent_post_ids_v1"
};

// 1. Get or Generate Randomized Local Device UUID (Zero-Knowledge)
export function getOrCreateDeviceUUID() {
  let uuid = localStorage.getItem(KEYS.DEVICE_UUID);
  if (!uuid) {
    uuid = "nyx_" + crypto.randomUUID();
    localStorage.setItem(KEYS.DEVICE_UUID, uuid);
  }
  return uuid;
}

// Helper to filter out expired posts automatically
function cleanExpiredPosts(posts) {
  const now = Date.now();
  return posts.filter((post) => {
    if (!post.retentionDays || post.retentionDays === 0) return true; // 0 means Forever
    const createdTime = new Date(post.createdAt).getTime();
    const expiryTime = createdTime + post.retentionDays * 24 * 60 * 60 * 1000;
    return now < expiryTime;
  });
}

// 2. Local Posts Store Management
export function getStoredPosts() {
  try {
    const data = localStorage.getItem(KEYS.LOCAL_POSTS);
    if (data) {
      const parsed = JSON.parse(data);
      const cleaned = cleanExpiredPosts(parsed);
      localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(cleaned));
      return cleaned;
    }
  } catch (e) {
    console.error("Error reading local posts:", e);
  }
  localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(MOCK_POSTS));
  return MOCK_POSTS;
}

export function saveNewPost(postData) {
  const posts = getStoredPosts();
  const newPostId = "post_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);

  const newPost = {
    id: newPostId,
    tagId: postData.tagId,
    content: postData.content,
    retentionDays: postData.retentionDays || 0, // default 0 = forever
    quote: getRandomQuote(),
    createdAt: new Date().toISOString(),
    reactions: {
      "not-alone": 0,
      "i-feel-you": 0,
      "sending-peace": 0,
      "stay-strong": 0,
      "same-story": 0,
      "god-bless": 0
    }
  };

  const updated = [newPost, ...posts];
  localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(updated));

  const mySentIds = getMySentPostIds();
  localStorage.setItem(KEYS.MY_SENT_POST_IDS, JSON.stringify([newPostId, ...mySentIds]));

  return updated;
}

export function updatePostRetention(postId, retentionDays) {
  const posts = getStoredPosts();
  const updated = posts.map((p) => {
    if (p.id === postId) {
      return { ...p, retentionDays: Number(retentionDays) };
    }
    return p;
  });
  localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(updated));
  return updated;
}

export function getMySentPostIds() {
  try {
    const data = localStorage.getItem(KEYS.MY_SENT_POST_IDS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function getMySentPosts() {
  const posts = getStoredPosts();
  const myIds = getMySentPostIds();
  return posts.filter((p) => myIds.includes(p.id));
}

export function deleteMyPost(postId) {
  const posts = getStoredPosts();
  const updatedPosts = posts.filter((p) => p.id !== postId);
  localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(updatedPosts));

  const myIds = getMySentPostIds().filter((id) => id !== postId);
  localStorage.setItem(KEYS.MY_SENT_POST_IDS, JSON.stringify(myIds));

  return updatedPosts;
}

export function togglePostReaction(postId, reactionId) {
  const posts = getStoredPosts();
  const userReactions = getUserReactions();

  const userPostReactions = userReactions[postId] || {};
  const hasReacted = !!userPostReactions[reactionId];

  const updatedPosts = posts.map((post) => {
    if (post.id === postId) {
      const currentCount = post.reactions[reactionId] || 0;
      const newCount = hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1;
      return {
        ...post,
        reactions: {
          ...post.reactions,
          [reactionId]: newCount
        }
      };
    }
    return post;
  });

  if (hasReacted) {
    delete userPostReactions[reactionId];
  } else {
    userPostReactions[reactionId] = true;
  }
  userReactions[postId] = userPostReactions;

  localStorage.setItem(KEYS.LOCAL_POSTS, JSON.stringify(updatedPosts));
  localStorage.setItem(KEYS.USER_REACTIONS, JSON.stringify(userReactions));

  return { posts: updatedPosts, userReactions };
}

export function getUserReactions() {
  try {
    const data = localStorage.getItem(KEYS.USER_REACTIONS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}
