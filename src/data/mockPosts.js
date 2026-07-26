import { COMFORT_QUOTES } from "./quotes";

export const MOCK_POSTS = [
  {
    id: "nyx-post-1",
    tagId: "soul-exhaustion",
    content: "أحياناً أشعر أنني أنفق كل طاقتي في مساعدة الآخرين والابتسام في وجوههم، لكن حين أعود إلى غرفتي ليلاً لا أجد من يسألني كيف حال قلبي بحق.",
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[0],
    reactions: { "not-alone": 28, "i-feel-you": 45, "sending-peace": 19, "stay-strong": 33, "same-story": 12, "god-bless": 24 }
  },
  {
    id: "nyx-post-2",
    tagId: "future-anxiety",
    content: "أخاف جداً من الخطوة القادمة في حياتي، لا أحد يعلم مقدار الرعب الذي ينتابني عند التفكير في المستقبل، لكنني أحاول التظاهر بالتماسك كل يوم.",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    retentionDays: 1,
    quote: COMFORT_QUOTES[1],
    reactions: { "not-alone": 62, "i-feel-you": 80, "sending-peace": 30, "stay-strong": 51, "same-story": 44, "god-bless": 39 }
  },
  {
    id: "nyx-post-3",
    tagId: "disappointment",
    content: "الخذلان لا يأتي دائمًا بصوتٍ عالٍ… أحيانا يأتي على هيئة صمتٍ طويل، أو وعدٍ لم يتم، أو حضورٍ ناقص يتركك في منتصف الطريق.",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[2],
    reactions: { "not-alone": 45, "i-feel-you": 78, "sending-peace": 22, "stay-strong": 36, "same-story": 51, "god-bless": 30 }
  },
  {
    id: "nyx-post-4",
    tagId: "unspoken-choke",
    content: "ما أصعب أن تقف الكلمة بين الفم والحنجرة.. إن أظهرتها فقدت من تُحب، وإن أبقيتها خنقت نفسك بالصمت والسلام على ما كان.",
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    retentionDays: 30,
    quote: COMFORT_QUOTES[3],
    reactions: { "not-alone": 50, "i-feel-you": 67, "sending-peace": 22, "stay-strong": 19, "same-story": 38, "god-bless": 41 }
  },
  {
    id: "nyx-post-5",
    tagId: "disappointment",
    content: "الخذلان هو أن تختار شخصاً لتحارب به الدنيا، فيحاربك هو والدنيا.. وأصعب شيء أن يموت في عينيك إنسان وهو ما زال حياً.",
    createdAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[4],
    reactions: { "not-alone": 68, "i-feel-you": 95, "sending-peace": 18, "stay-strong": 41, "same-story": 62, "god-bless": 34 }
  },
  {
    id: "nyx-post-6",
    tagId: "silent-grief",
    content: "الخذلان هو شعور الغُصّة في حلقك الذي يُلازمك طوال حياتك وإن مرّ طَيف ذكراهم فقط.",
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    retentionDays: 3,
    quote: COMFORT_QUOTES[5],
    reactions: { "not-alone": 73, "i-feel-you": 92, "sending-peace": 40, "stay-strong": 61, "same-story": 36, "god-bless": 58 }
  },
  {
    id: "nyx-post-7",
    tagId: "soul-exhaustion",
    content: "صدّقوني أنا بخير... فقط أعاني القليل من وجع القلب، وموجات من الاختناق، والكثير من الخذلان صامتاً.",
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[6],
    reactions: { "not-alone": 88, "i-feel-you": 104, "sending-peace": 31, "stay-strong": 47, "same-story": 60, "god-bless": 72 }
  },
  {
    id: "nyx-post-8",
    tagId: "path-confusion",
    content: "حولي ألف شخص، وفي قلبي غربة شديدة.. أسوأ أنواع الوحدة هي التي تجتاحك وأنت بين ناسك لكنك تشعر أنك غريب عنهم تماماً.",
    createdAt: new Date(Date.now() - 1000 * 60 * 1100).toISOString(),
    retentionDays: 30,
    quote: COMFORT_QUOTES[7],
    reactions: { "not-alone": 65, "i-feel-you": 78, "sending-peace": 29, "stay-strong": 38, "same-story": 42, "god-bless": 34 }
  },
  {
    id: "nyx-post-9",
    tagId: "faltering-hope",
    content: "يا رب يدُك أرحم من يدي ولُطفك أعظم من خوفي.. أصارع الحياة والأيام والناس وروحي على سبيل أن أبقى بكل هذا الثبات.",
    createdAt: new Date(Date.now() - 1000 * 60 * 1300).toISOString(),
    retentionDays: 0,
    quote: COMFORT_QUOTES[0],
    reactions: { "not-alone": 54, "i-feel-you": 69, "sending-peace": 44, "stay-strong": 81, "same-story": 27, "god-bless": 63 }
  },
  {
    id: "nyx-post-10",
    tagId: "longing",
    content: "أشعر بعبءٍ كبير، حين أفكر بأن كل ما حدث وقيل سيعلق في ذاكرتي إلى الأبد دون أن أستطيع محوه.",
    createdAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[1],
    reactions: { "not-alone": 91, "i-feel-you": 115, "sending-peace": 36, "stay-strong": 50, "same-story": 70, "god-bless": 45 }
  },
  {
    id: "nyx-post-11",
    tagId: "unspoken-choke",
    content: "رغم الصمت الذي نعيشه، إلا أن في قلوبنا كلمات لها أصوات عالية جداً تزعجنا نحن فقط ولا يسمعها أحد.",
    createdAt: new Date(Date.now() - 1000 * 60 * 1700).toISOString(),
    retentionDays: 1,
    quote: COMFORT_QUOTES[2],
    reactions: { "not-alone": 77, "i-feel-you": 94, "sending-peace": 28, "stay-strong": 43, "same-story": 51, "god-bless": 38 }
  },
  {
    id: "nyx-post-12",
    tagId: "future-anxiety",
    content: "القلق لا يمنع ألم الغد، ولكنه يسرق متعة اليوم.. تعبت من كثرة التفكير والتوقعات في رعب المجهول.",
    createdAt: new Date(Date.now() - 1000 * 60 * 1900).toISOString(),
    retentionDays: 3,
    quote: COMFORT_QUOTES[3],
    reactions: { "not-alone": 60, "i-feel-you": 83, "sending-peace": 25, "stay-strong": 39, "same-story": 33, "god-bless": 49 }
  },
  {
    id: "nyx-post-13",
    tagId: "silent-grief",
    content: "في داخلي مدينة مهجورة، تسكنها ذكريات متباهية بالألم، ولا يبقى سوى الوحدة والحنين المؤلم.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2100).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[4],
    reactions: { "not-alone": 48, "i-feel-you": 72, "sending-peace": 50, "stay-strong": 35, "same-story": 29, "god-bless": 56 }
  },
  {
    id: "nyx-post-14",
    tagId: "soul-exhaustion",
    content: "أحملُ في داخلي عناء سنين، لا يُخففه نوم ولا يمحوه يقين.. أرواحنا تئن من التعب، وأجسادنا منهكة من ركضٍ بلا فائدة.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2300).toISOString(),
    retentionDays: 30,
    quote: COMFORT_QUOTES[5],
    reactions: { "not-alone": 95, "i-feel-you": 120, "sending-peace": 38, "stay-strong": 67, "same-story": 74, "god-bless": 82 }
  },
  {
    id: "nyx-post-15",
    tagId: "departed-loved-ones",
    content: "مر عام كامل على رحيل الشخص الذي كان ملاذي الوحيد.. ما زلت أبحث عن صوته في زوايا البيت وأكتفي بالبكاء الصامت حتى لا أنكُد على من حولي.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2500).toISOString(),
    retentionDays: 0,
    quote: COMFORT_QUOTES[6],
    reactions: { "not-alone": 83, "i-feel-you": 105, "sending-peace": 90, "stay-strong": 58, "same-story": 46, "god-bless": 110 }
  },
  {
    id: "nyx-post-16",
    tagId: "disappointment",
    content: "شيء ينكسر في القلب عند الخيبة لا يمكن إصلاحه ولو بخيوط من ذهب.. الخذلان ممن وضعتهم في أولوياتك كسر لا يعود.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2700).toISOString(),
    retentionDays: 7,
    quote: COMFORT_QUOTES[7],
    reactions: { "not-alone": 59, "i-feel-you": 87, "sending-peace": 20, "stay-strong": 42, "same-story": 48, "god-bless": 31 }
  },
  {
    id: "nyx-post-17",
    tagId: "silent-grief",
    content: "أحياناً تكون الغصة في الحلق ليست مرضاً، بل هي تراكم لمشاعر لم نجد لها اسماً، وكلمات لم نجد لها متلقياً صريحاً.",
    createdAt: new Date(Date.now() - 1000 * 60 * 2900).toISOString(),
    retentionDays: 3,
    quote: COMFORT_QUOTES[0],
    reactions: { "not-alone": 68, "i-feel-you": 91, "sending-peace": 33, "stay-strong": 52, "same-story": 39, "god-bless": 44 }
  },
  {
    id: "nyx-post-18",
    tagId: "faltering-hope",
    content: "سأنتظر أكثر، فروحي تتشبث وتخبرني بأن الأشياء الجميلة والسكينة ستأتي حتماً بعد كل هذه العتمة والوجع المكتوم.",
    createdAt: new Date(Date.now() - 1000 * 60 * 3100).toISOString(),
    retentionDays: 0,
    quote: COMFORT_QUOTES[1],
    reactions: { "not-alone": 72, "i-feel-you": 84, "sending-peace": 66, "stay-strong": 90, "same-story": 30, "god-bless": 88 }
  }
];
