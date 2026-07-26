// Automated Daily Anonymous Vents Seeding Utility (3 Vents / 24 Hours)
// 100% Free, Zero-Knowledge Privacy Compliant
// Primary source: Reddit API via Vercel proxy (real user content)
// Fallback: Curated Arabic emotional texts

import { checkSafety } from "./moderation";
import { saveNewPost } from "./storage";

// ====== API ENDPOINT ======
const REDDIT_API = "/api/reddit-proxy";

// ====== FALLBACK CURATED FEED (60 texts) ======
const CURATED_DAILY_FEED = [
  // === silent-grief (غصّة مكتومة) ===
  { content: "أحياناً نعتاد الصمت حتى يصبح لغة الروح الوحيدة التي تحمينا من الشرح الطويل للناس.", tagId: "unspoken-choke" },
  { content: "تعتاد أن تبتسم رغم الألم، لأن شرح ما بداخلك مرهق أكثر من تحمله وحدك.", tagId: "silent-grief" },
  { content: "أصعب شيء أن تتظاهر بالثبات وأنت تنهمر دمعاً وسككاً في داخلك كل ليلة.", tagId: "silent-grief" },
  { content: "الغصة ليست في الكلام المحبوس، بل في أن لا أحد يلاحظ صمتك الثقيل.", tagId: "silent-grief" },
  { content: "تبتسم للناس وفي داخك بحر من الدموع لا يراه أحد.", tagId: "silent-grief" },
  { content: "أقسى أنواع الوحدة أن تكون بين جمع من الناس وتشعر بأنك وحدك تماماً.", tagId: "silent-grief" },
  { content: "أحياناً البكاء دون سبب هو بكاء الروح التي تعبت من الصمود.", tagId: "silent-grief" },

  // === future-anxiety (خوف من المجهول) ===
  { content: "أخاف جداً من الخطوة القادمة في حياتي، لا أحد يعلم مقدار الرعب الذي ينتابني عند التفكير في المستقبل، لكنني أحاول التظاهر بالتماسك كل يوم.", tagId: "future-anxiety" },
  { content: "القلق لا يمنع ألم الغد، ولكنه يسرق متعة اليوم.", tagId: "future-anxiety" },
  { content: "الخوف من المجهول يثقل الروح، لا لأن المستقبل مخيف، بل لأننا لا نملك خريطة له.", tagId: "future-anxiety" },
  { content: "التفكير الزائد في الغد يسرق سلام اليوم، لكن كيف نوقفه ونحن لا نرى الطريق؟", tagId: "future-anxiety" },
  { content: "الليل يحمل معه كل مخاوف النهار التي أخفيناها عن الجميع.", tagId: "future-anxiety" },
  { content: "ليس الخوف من الفشل بل من التوقف عن المحاولة، من أن تستسلم الروح قبل الجسد.", tagId: "future-anxiety" },
  { content: "أسال ربي كل يوم أن يكتب لي الخير حيث كان، وأنا أسير في الظلام أثق بأن النور آت.", tagId: "faltering-hope" },

  // === longing (اشتياق صامت) ===
  { content: "الحنين هو العطر الذي يفوح من روح من رحلوا، يملأ المكان بذكراهم ولا يفارق القلب أبداً.", tagId: "longing" },
  { content: "الاشتياق لمن لا يستطيع العودة هو إقامة داخل القلب لشبح يعيش بين الضلوع.", tagId: "longing" },
  { content: "في زحام الحياة، يبقى أشخاص لا تكف عن البحث عنهم في تفاصيل يومك.", tagId: "longing" },
  { content: "الشوق هو رفيق الليل الوحيد الذي لا يمل من زيارتي كلما أظلمت الدنيا.", tagId: "longing" },
  { content: "أتساءل إن كانوا يشعرون بمدى اشتياقنا لهم هناك، حيث هم الآن.", tagId: "longing" },
  { content: "الذكريات الجميلة مؤلمة، لأنها تذكرك بأيام مضت وتؤكد لك أنها لن تعود.", tagId: "longing" },
  { content: "أشتاق لأيام كانت الحياة فيها أبسط والقلوب أصفى والأيادي لا تترك بعضها.", tagId: "longing" },

  // === disappointment (خيبة رقيقة) ===
  { content: "الخذلان لا يأتي دائمًا بصوتٍ عالٍ… أحيانا يأتي على هيئة صمتٍ طويل، أو وعدٍ لم يتم.", tagId: "disappointment" },
  { content: "الخذلان هو أن تختار شخصاً لتحارب به الدنيا، فيحاربك هو والدنيا.", tagId: "disappointment" },
  { content: "شيء ينكسر في القلب عند الخيبة لا يمكن إصلاحه ولو بخيوط من ذهب.", tagId: "disappointment" },
  { content: "مرارة الخذلان تجرح لأنها تأتي ممن أمنّاهم على أرواحنا.", tagId: "disappointment" },
  { content: "أصعب شيء أن يموت في عينيك إنسان وهو ما زال حياً.", tagId: "disappointment" },
  { content: "الخذلان المتكرر يعلّمك ألا تتعلق بأحد، حتى لا تؤلمك الغصة من جديد.", tagId: "disappointment" },
  { content: "ما يوجع أكثر من الخيبة نفسها هو أنك كنت على يقين بأن هذه المرة مختلفة.", tagId: "disappointment" },

  // === soul-exhaustion (تعب الروح) ===
  { content: "التعب الجسدي يزول بالنوم، لكن تعب الروح يحتاج لسكينة وأرواح تفهم دون أن تطالب بالشرح.", tagId: "soul-exhaustion" },
  { content: "أحياناً أشعر أنني أنفق كل طاقتي في مساعدة الآخرين، لكن لا أحد يسأل كيف قلبي.", tagId: "soul-exhaustion" },
  { content: "أحملُ في داخلي عناء سنين، لا يُخففه نوم ولا يمحوه يقين.", tagId: "soul-exhaustion" },
  { content: "صدّقوني أنا بخير... فقط أعاني القليل من وجع القلب، وموجات من الاختناق، والكثير من الخذلان صامتاً.", tagId: "soul-exhaustion" },
  { content: "تعب الروح لا يُرى بالعين المجردة، لكنه يوجع أكثر من أي مرض جسدي.", tagId: "soul-exhaustion" },
  { content: "أحياناً أريد الاختفاء عن العالم، وعن الجميع، وعن نفسي أيضاً.", tagId: "soul-exhaustion" },
  { content: "أحتاج يوماً طويلاً من النوم العميق الذي لا تزعجه الذكريات.", tagId: "soul-exhaustion" },

  // === departed-loved-ones (شوق لمن رحلوا) ===
  { content: "مر عام كامل على رحيل الشخص الذي كان ملاذي الوحيد، ما زلت أبحث عن صوته في زوايا البيت.", tagId: "departed-loved-ones" },
  { content: "رحيل الأحبة لا يعلّمنا الصبر فقط، بل يعلمنا أن الحياة قصيرة جداً لنضيعها في الخلافات.", tagId: "departed-loved-ones" },
  { content: "في كل عيد ومناسبة، أفتقد مقعداً فارغاً لن يمتلئ أبداً.", tagId: "departed-loved-ones" },
  { content: "الموت ليس نهاية، لكنه بداية شوق لا ينتهي ومكان في القلب لا يسدّه أحد.", tagId: "departed-loved-ones" },
  { content: "أشتاق لمن رحلوا، وأعلم أنهم يرونني من حيث لا أراهم، وأن دموعي تصلهم.", tagId: "departed-loved-ones" },
  { content: "ذكراهم عطر لا يزول، وجرح لا يندمل، ودرس لا يُنسى.", tagId: "departed-loved-ones" },
  { content: "كل شيء يذكرني بهم، حتى الأماكن التي لم نزرها معاً تحمل شيئاً منهم.", tagId: "departed-loved-ones" },

  // === faltering-hope (أمل يترنح) ===
  { content: "سأنتظر أكثر، فروحي تتشبث وتخبرني بأن الأشياء الجميلة ستأتي بعد هذه العتمة.", tagId: "faltering-hope" },
  { content: "يا رب يدُك أرحم من يدي ولُطفك أعظم من خوفي.. أصارع الحياة والأيام والناس.", tagId: "faltering-hope" },
  { content: "أتمسك بأمل واهن كخيط رفيع، أعرف أنه قد ينقطع لكنه كل ما تبقى لي.", tagId: "faltering-hope" },
  { content: "يأتيني الأمل في صورة أشياء صغيرة جداً لا يراها أحد، لكنها تنعش قلبي.", tagId: "faltering-hope" },
  { content: "لا أدري كيف ستنتهي القصة، لكنني أريد أن أصدق أن النهايات جميلة.", tagId: "faltering-hope" },
  { content: "بين اليأس والأمل مسافة نبضة واحدة، وفي تلك النبضة أعيش كل يوم.", tagId: "faltering-hope" },
  { content: "ما زلت أؤمن أن للصبر حدوداً، وأن الفرج قادم ولو بعد حين.", tagId: "faltering-hope" },

  // === path-confusion (حيرة الطريق) ===
  { content: "حولي ألف شخص، وفي قلبي غربة شديدة.. أسوأ أنواع الوحدة التي تجتاحك وأنت بين أهلك.", tagId: "path-confusion" },
  { content: "يقولون الحياة أمامك، وأنا أمامي ألف طريق ولا أعرف أياً منها هو طريقي.", tagId: "path-confusion" },
  { content: "الضياع ليس في أن لا تعرف أين تذهب، بل في أن تعرف وتحتار إن كان يستحق.", tagId: "path-confusion" },
  { content: "أحتاج بصمة نور في هذا الظلام الذي يلف طريقي، دليلاً يضمني إلى بر الأمان.", tagId: "path-confusion" },
  { content: "كلما ظننت أنني وجدت طريقي، أدركت أنني سرت في دائرة عدت منها حيث بدأت.", tagId: "path-confusion" },
  { content: "أكبر حيرة هي حين تكتشف أن كل الخيارات أمامك مؤلمة، وعليك اختيار أقلها ألماً.", tagId: "path-confusion" },

  // === unspoken-choke (كلام خنقته العبرة) ===
  { content: "ما أصعب أن تقف الكلمة بين الفم والحنجرة.. إن أظهرتها فقدت من تُحب، وإن أبقيتها خنقت نفسك.", tagId: "unspoken-choke" },
  { content: "رغم الصمت الذي نعيشه، إلا أن في قلوبنا كلمات لها أصوات عالية جداً لا يسمعها أحد.", tagId: "unspoken-choke" },
  { content: "أصعب كلمة هي التي تقف على شفتيك ولا تستطيع قولها خوفاً من ردة الفعل.", tagId: "unspoken-choke" },
  { content: "أكتب ما لا أستطيع قوله، لأن الحروف أصدق من اللسان.", tagId: "unspoken-choke" },
  { content: "كم من كلمة دفنت في صدري لأن الأرض التي ستنبت فيها لم تعد صالحة للزرع.", tagId: "unspoken-choke" },
  { content: "أتمنى لو يستطيع الناس سماع أفكاري، ليعرفوا كم أحبهم وكم يوجعني بعدهم.", tagId: "unspoken-choke" },
  // === silent-grief ===
  { content: "تتظاهر بأنك بخير مرات كثيرة، حتى تنسى أن من حقك ألا تكون بخير أحياناً.", tagId: "silent-grief" },
  { content: "في كل صباح أرتدي قناع الثبات، وفي كل ليلة أخلعه وأواجه نفسي.", tagId: "silent-grief" },
  { content: "الجراح التي لا يراها أحد هي الأكثر إيلاماً لأنها بلا ضمادة.", tagId: "silent-grief" },
  { content: "لا أعرف متى بدأ هذا الثقل في صدري، لكني أعرف أنه لم يغب منذ زمن.", tagId: "silent-grief" },
  { content: "أبكي بصمت كي لا يقلق أحد، وأضحك بصوت كي لا يشك أحد.", tagId: "silent-grief" },
  // === soul-exhaustion ===
  { content: "أريد يوماً لا أفكر فيه بأحد، ولا أحد يفكر بي. فقط أنا وروحي في سكون.", tagId: "soul-exhaustion" },
  { content: "أعطي الجميع من روحي حتى صارت روحي في need إلى مدد.", tagId: "soul-exhaustion" },
  { content: "التعب ليس جسدياً فقط.. هناك تعب في الروح لا يزيله إلا احتضان صادق.", tagId: "soul-exhaustion" },
  { content: "أن تكون قوياً طوال الوقت.. تلك هي أتعس وظيفة في العالم.", tagId: "soul-exhaustion" },
  { content: "أحتاج إلى إجازة من حياتي، ولو ليوم واحد.", tagId: "soul-exhaustion" },
  // === disappointment ===
  { content: "ليس كل من قال 'أنا معك' كان صادقاً. بعضهم كان فقط يراقب سقوطك.", tagId: "disappointment" },
  { content: "الخذلان لا يأتي من عدو، فالعدو لا نتوقع منه شيئاً. الخذلان ممن نحب.", tagId: "disappointment" },
  { content: "سامحت كثيرين، ليس لأنهم يستحقون، بل لأنني أستحق السلام.", tagId: "disappointment" },
  { content: "أتعلمت أن لا أضع كل آمالي بشخص واحد، فالجميع يخطئون.", tagId: "disappointment" },
  { content: "أصعب لحظة حين تدرك أن الشخص الذي ضحيت من أجله لم يضحِ من أجلك يوماً.", tagId: "disappointment" },
  // === future-anxiety ===
  { content: "الخوف من المجهول يثقل الخطى، لكن التوقف أخطر من السير في الظلام.", tagId: "future-anxiety" },
  { content: "أسئلة المستقبل ترعبني: هل سأكون بخير؟ هل سأنجح؟ هل سأكون سعيداً؟", tagId: "future-anxiety" },
  { content: "القلق كرسي هزاز، يحركك كثيراً لكنه لا يوصلك إلى أي مكان.", tagId: "future-anxiety" },
  { content: "أحتاج يقيناً واحداً في هذه الحياة المليئة بالشكوك.", tagId: "future-anxiety" },
  { content: "كلما كبرت، زادت الأسئلة وقلت الإجابات.", tagId: "future-anxiety" },
  // === longing ===
  { content: "الحنين وجع جميل، مؤلم لكنه يثبت أننا أحببنا بصدق.", tagId: "longing" },
  { content: "في كل أغنية أسمعها، هناك مقطع يجرجر معه ذاكرة كاملة.", tagId: "longing" },
  { content: "أشتاق لأشخاص لم يعودوا موجودين، ولأيام لن تعود أبداً.", tagId: "longing" },
  // === departed-loved-ones ===
  { content: "الموت لا ينهي الحكاية، بل يبدأ فصلاً جديداً من الشوق الذي لا ينتهي.", tagId: "departed-loved-ones" },
  { content: "كل عيد يمر يذكرني بكرسي أصبح فارغاً.", tagId: "departed-loved-ones" },
  { content: "ما زلت أدعو لهم في صلاتي، كأنهم مسافرون سيعودون.", tagId: "departed-loved-ones" },
  // === faltering-hope ===
  { content: "الرجاء شمعة صغيرة في ليل طويل. قد لا تضيء كل الظلام، لكنها تكفي لترينا خطوة واحدة قادمة.", tagId: "faltering-hope" },
  { content: "كل صباح أقول: لعل اليوم يحمل شيئاً مختلفاً.", tagId: "faltering-hope" },
  { content: "ربما الغد يحمل ما لم تحلم به اليوم.", tagId: "faltering-hope" },
  // === path-confusion ===
  { content: "أكبر حيرة في الحياة: حين تعرف ما تريد لكنك لا تعرف كيف تصل إليه.", tagId: "path-confusion" },
  { content: "الضياع ليس نقصاً في الذكاء، بل كثرة في الطرق.", tagId: "path-confusion" },
  { content: "مشيت في دروب كثيرة، وكلها أوصلتني إلى سؤال واحد: من أنا حقاً؟", tagId: "path-confusion" },
  // === unspoken-choke ===
  { content: "الكلمات التي لم تُقل أثقل من تلك التي قيلت.", tagId: "unspoken-choke" },
  { content: "أتمنى لو يقرأ الناس ما في قلبي لا ما ينطق به لساني.", tagId: "unspoken-choke" },
  { content: "أكتب لأتنفس. الحروف هي أكسجيني حين يضيق بي الهواء.", tagId: "unspoken-choke" },
];

export async function fetchAndSeedDailyVents() {
  const lastFetch = localStorage.getItem("nyx_last_daily_fetch");
  const now = Date.now();

  // Check if 24 hours have passed
  if (!lastFetch || (now - Number(lastFetch)) > 24 * 60 * 60 * 1000) {
    
    // Try Reddit API first (1 post)
    let seeded = false;
    try {
      const response = await fetch(REDDIT_API);
      const data = await response.json();
      
      if (data.success && data.posts && data.posts.length > 0) {
        const post = data.posts[0]; // Take only 1
        const safety = checkSafety(post.content);
        if (safety.isSafe) {
          saveNewPost({
            content: post.content.trim(),
            tagId: inferTag(post.content),
            retentionDays: 7
          });
          seeded = true;
        }
      }
    } catch (_e) { /* Reddit unavailable */ }

    // Fallback: 1 curated text
    if (!seeded) {
      const chosen = CURATED_DAILY_FEED[Math.floor(Math.random() * CURATED_DAILY_FEED.length)];
      const safety = checkSafety(chosen.content);
      if (safety.isSafe) {
        saveNewPost({
          content: chosen.content.trim(),
          tagId: chosen.tagId,
          retentionDays: 7
        });
      }
    }

    localStorage.setItem("nyx_last_daily_fetch", now.toString());
  }
}

// Infer emotional tag from text content
function inferTag(text) {
  const lower = text.toLowerCase();
  if (lower.includes("خوف") || lower.includes("مستقبل") || lower.includes("قلق") || lower.includes("مجهول")) return "future-anxiety";
  if (lower.includes("غص") || lower.includes("غصة") || lower.includes("بكاء") || lower.includes("دموع")) return "silent-grief";
  if (lower.includes("خذلان") || lower.includes("خيبة") || lower.includes("غدر") || lower.includes("خان")) return "disappointment";
  if (lower.includes("اشتياق") || lower.includes("حنين") || lower.includes("شوق") || lower.includes("نشتاق")) return "longing";
  if (lower.includes("تعب") || lower.includes("إرهاق") || lower.includes("منهك") || lower.includes("مرهق")) return "soul-exhaustion";
  if (lower.includes("رحل") || lower.includes("مات") || lower.includes("فقد") || lower.includes("توفي") || lower.includes("غاب")) return "departed-loved-ones";
  if (lower.includes("أمل") || lower.includes("صبر") || lower.includes("انتظار") || lower.includes("فرج")) return "faltering-hope";
  if (lower.includes("حيرة") || lower.includes("ضياع") || lower.includes("طريق") || lower.includes("غربة")) return "path-confusion";
  if (lower.includes("صمت") || lower.includes("كلام") || lower.includes("كلمة") || lower.includes("عجز")) return "unspoken-choke";
  // Default: silent-grief (most common emotional tag)
  return "silent-grief";
}
