// On-Device Local NLP Compassionate Reflection Engine
// Deeply tender, warm, comforting, and empathetic tone (حميمي ومواسي)

import { EMOTIONAL_TAGS } from "../data/tags";

export async function analyzePostEmotionsLocally(postContent, tagId) {
  // Simulate natural brief reflective pause (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const text = postContent || "";
  const tag = EMOTIONAL_TAGS.find((t) => t.id === tagId) || EMOTIONAL_TAGS[0];
  // tag unused; kept for future multi-emotion scoring

  let emotionTone = "حالة شائكة وتحتاج للمواساة والاحتواء";
  let tenderReflection = "";
  let gentleWhisper = "";

  if (tagId === "future-anxiety" || text.includes("خوف") || text.includes("مستقبل") || text.includes("رعب")) {
    emotionTone = "رجفةٌ في الروح تجاه الغد والمجهول";
    tenderReflection = "أحسّ بالرعب الحقيقي الذي تنبض به كلماتك.. التفكير في المستقبل عندما يكون غائماً يُشعر المرء وكأنه يسير في مهبّ الريح بلا سند. لكن اطمئن يا صديقي، ليس مطلوباً منك أن تحلّ أزمات الغد كله اليوم، يكفيك جداً أن تتنفس بسلام الآن، وأن تشعر بأنك محاطٌ بالدعوات.";
    gentleWhisper = "همسة حنونة: أغمض عينيك، وضع يدك على قلبك، وقُل لنفسك برفْق: 'أنا أستحقّ الراحة في هذه اللحظة، والطقس سيهدأ حتماً'.";
  } else if (tagId === "silent-grief" || text.includes("غصّة") || text.includes("رحيل") || text.includes("ألم")) {
    emotionTone = "غصّة مكتومة وشوقٌ أضناه الصمت";
    tenderReflection = "حروفك تنبض بوفاء وألمٍ شفاف يلامس الروح.. هناك حزنٌ رقيق لا يستطيع أي كلام في الدنيا أن يصفه، حزنٌ يختار الصمت كي لا يُتعب من حوله. أودّ أن أعانق روحك في هذه اللحظة وأخبرك أن دموعك وحزنك مقدّسان وحقيقيان جداً.";
    gentleWhisper = "همسة حنونة: لا تحبس هذه الغصّة.. دع قلبك يبكي إن أراد، فالبكاء ليس ضعفاً بل هو الطريقة التي يغسل بها القلب آلامه.";
  } else if (tagId === "disappointment" || text.includes("خيبة") || text.includes("خذلان") || text.includes("تغير")) {
    emotionTone = "مرارة خيبة أمل صامتة بعد صدق المعطاء";
    tenderReflection = "مرارة الخذلان تجرح أعمق ما فينا، لأنها تأتي دائماً ممن أمنّاهم على أرواحنا وفتحنا لهم أبواب قلوبنا. انكماشك وسكوتك الآن ليس هزيمة، بل هو ملجأ دافئ تحمي فيه ما تبقى من رقة قلبك من قسوة العالم.";
    gentleWhisper = "همسة حنونة: تذكّر دائماً أن صدقك ورقتك ليسا خطأً، وعطاءك الشريف يشرّفك أنت، حتى وإن لم يحسن الآخرون قدره.";
  } else if (tagId === "longing" || tagId === "departed-loved-ones" || text.includes("اشتياق") || text.includes("رحلوا")) {
    emotionTone = "حنينٌ دافئ وشوقٌ لمن غابوا عن العَين";
    tenderReflection = "الشوق لمن رحلوا هو العذاب الأرقّ في هذه الحياة.. تظل أطيافهم تعيش في زوايا روحك، وصوتهم يتردد في أعماقك. هذا الحنين الدائم هو دليل على أن المحبة الحقيقية لا تموت برحيل الأجساد.";
    gentleWhisper = "همسة حنونة: ابعث لهم الآن دعوة دافئة ومغلفة بالسلام، واشعر بأن ذكراهم الطيبة هي نورٌ يضيء عتمة ليلك.";
  } else {
    emotionTone = "ثقلٌ خفي ورغبة في الطمأنينة والتفرّغ";
    tenderReflection = "أسمع صدى التعب في كل حرفٍ كتبته.. ما تحمله ليس هيناً، ومجرد شجاعتك في سكب هذه المشاعر هنا هو خطوة شريفة وجميلة نحو التحرر من هذا الثقل. خذ كل الوقت الذي تحتاجه لتستريح، فلا أحد يعجلُك.";
    gentleWhisper = "همسة حنونة: دع الأيام تداوي ما انكسر برفْق، واعلم أن هناك أشخاصاً لم يروك قط، لكنهم يدعون لك بالسكينة والفرج.";
  }

  return {
    emotionTone,
    tenderReflection,
    gentleWhisper
  };
}
