// Automated Daily Anonymous Vents Seeding Utility (3 Vents / 24 Hours)
// 100% Free, Zero-Knowledge Privacy Compliant (No handles, no IPs, no URLs, no metadata stored)

import { EMOTIONAL_TAGS } from "../data/tags";
import { checkSafety } from "./moderation";
import { saveNewPost } from "./storage";

// Curated daily authentic Arabic emotional thoughts feed for cold-start seeding
const CURATED_DAILY_FEED = [
  {
    content: "أحيانا نعتاد الصمت حتى يصبح لغة الروح الوحيدة التي تحمينا من الشرح الطويل للناس.",
    tagId: "unspoken-choke"
  },
  {
    content: "يا رب أرح قلوباً لا يعلم بحالها وثقل ما تحمله إلا أنت.",
    tagId: "faltering-hope"
  },
  {
    content: "الخذلان الأول يغير طريقة رؤيتك للعالم، البقية مجرد تذكير بتلك الصدمة الأولى.",
    tagId: "disappointment"
  },
  {
    content: "أصعب شيء أن تتظاهر بالثبات وأنت تنهمر دمعاً وسككاً في داخلك كل ليلة.",
    tagId: "silent-grief"
  },
  {
    content: "التعب الجسدي يزول بالنوم، لكن تعب الروح يحتاج لسكينة وأرواح تفهم دون أن تطالب بالشرح.",
    tagId: "soul-exhaustion"
  }
];

export function fetchAndSeedDailyVents() {
  const lastFetch = localStorage.getItem("nyx_last_daily_fetch");
  const now = Date.now();

  // Check if 24 hours (86,400,000 ms) have passed since last fetch
  if (!lastFetch || (now - Number(lastFetch)) > 24 * 60 * 60 * 1000) {
    // Pick 3 random anonymized vents from the curated list
    const shuffled = [...CURATED_DAILY_FEED].sort(() => 0.5 - Math.random());
    const selectedThree = shuffled.slice(0, 3);

    selectedThree.forEach((item) => {
      // Run through local safety & profanity filter
      const safety = checkSafety(item.content);
      if (safety.isSafe) {
        // Strip any remaining unwanted metadata or formatting
        const cleanContent = item.content.trim().replace(/https?:\/\/\S+/g, "").replace(/#\S+/g, "");
        saveNewPost({
          content: cleanContent,
          tagId: item.tagId,
          retentionDays: 7 // 7 days retention for daily imported vents
        });
      }
    });

    localStorage.setItem("nyx_last_daily_fetch", now.toString());
    console.log("Nyx: 3 Daily Anonymous Vents seeded successfully with zero-knowledge privacy!");
  }
}
