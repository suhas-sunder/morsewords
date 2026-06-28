import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type {
  BookRightsReport,
  GeneratedBookManifest,
  GeneratedBookSectionJson,
  GeneratedLibraryManifest,
} from "./bookManifestTypes.ts";
import {
  countBookWords,
  estimateMorseCharacters,
  splitParagraphs,
  summarizeUnsupportedCharacters,
  textPreview,
  trimBookText,
} from "./bookTextNormalization.ts";

type PoeStory = {
  fileName: string;
  slug: string;
  title: string;
  description: string;
  subjects: string[];
  originalPublicationYear: number;
  summary: string;
};

type PreviewEntry = {
  slug: string;
  path: string;
  contentVersion: string;
  contentHash: string;
  defaultSectionId: string;
  previewBytes: number;
  previewCharacterCount: number;
  estimatedRuntimeSeconds: number;
  truncated: boolean;
};

type SeoSummaryData = {
  schemaVersion: 1;
  summarySet: string;
  generatedAt: string;
  storageApproach: string;
  suggestedPilotSlugs: string[];
  pilotSlugs: string[];
  substitutions: Array<{
    suggestedSlug: string;
    actualSlug: string;
    reason: string;
  }>;
  expectedSummaryCount?: number;
  poeReplacementSlugs?: string[];
  summaries: Array<{
    slug: string;
    title: string;
    author: string[];
    description: string;
    summary: string;
  }>;
};

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const tempBooksRoot = path.join(repoRoot, "app/client/assets/temp-books");
const generatedRoot = path.join(repoRoot, "app/client/assets/books/generated");
const previewRoot = path.join(repoRoot, "public/book-previews");
const reportRoot = path.join(
  repoRoot,
  "app/client/assets/books/audit-reports/poe-replacement-raw-reconciliation",
);
const libraryManifestPath = path.join(generatedRoot, "library-manifest.json");
const previewManifestPath = path.join(previewRoot, "manifest.json");
const seoSummaryPath = path.join(
  repoRoot,
  "app/client/assets/books/seo-summaries/book-seo-summaries.json",
);

const author = ["Edgar Allan Poe"];
const broadPoeCollectionSlugs = [
  "the-works-of-edgar-allan-poe",
  "the-works-of-edgar-allan-poe-the-raven-edition",
] as const;
const broadPoeRawFileNames = [
  "The Works of Edgar Allan Poe.txt",
  "The Works of Edgar Allan Poe, The Raven Edition.txt",
] as const;

const poeStories: PoeStory[] = [
  {
    fileName: "A DESCENT INTO THE MAELSTROM.txt",
    slug: "a-descent-into-the-maelstrom",
    title: "A Descent into the Maelstrom",
    description:
      "A sea adventure framed as a survivor's account of terror, observation, and a gigantic whirlpool.",
    subjects: ["Adventure", "Sea story", "Gothic fiction"],
    originalPublicationYear: 1841,
    summary:
      "A Descent into the Maelstrom by Edgar Allan Poe is an adventure tale with the pressure and dread of Gothic fiction. The story is set on the Norwegian coast, where a guide tells a visitor about a terrifying encounter with a vast sea whirlpool. Its central conflict is survival under impossible natural force: a sailor must make sense of danger while the sea, weather, and fear seem to erase ordinary judgment. The frame gives the tale a spoken, eyewitness feeling, while the central scene turns observation into the only possible tool for endurance.\n\nThe tone is stormy, intense, and analytical. Poe balances the sublime setting with practical detail, so readers move between cliff-top description, seafaring vocabulary, and the old man's shaken account. The story is useful for Morse practice because it has long descriptive sentences, repeated nautical terms, and a clear escalation of danger. Typists can work slowly through the coastal names and sea language, then repeat action-heavy passages to improve rhythm. In audio, the story rewards careful listening because the narration shifts from quiet explanation to urgent recollection.\n\nFor learners, this is a strong intermediate selection. It is shorter than a novel but dense enough to build stamina, especially for copying punctuation, place names, and descriptive clauses. The setting is memorable, the conflict is easy to understand, and the prose gives plenty of contrasts: stillness against motion, fear against reasoning, and spectacle against precise detail. A good practice routine is to preview unfamiliar words, play the opening at a steady speed, then return to the central sea passage for accuracy drills. The result is a compact classic that feels exciting while still giving typists serious work with nineteenth-century prose.",
  },
  {
    fileName: "BERENICE.txt",
    slug: "berenice",
    title: "Berenice",
    description:
      "A dark Gothic tale of memory, illness, obsession, and a narrator whose attention narrows dangerously.",
    subjects: ["Gothic fiction", "Psychological horror"],
    originalPublicationYear: 1835,
    summary:
      "Berenice by Edgar Allan Poe is a psychological Gothic story set inside an old family house, where memory, illness, and obsession become the real landscape. The narrator describes a life shaped by study, gloom, and a mind that fastens on single ideas with alarming intensity. Berenice, his cousin, stands in contrast to him at first: lively, graceful, and connected to the world outside his inward habits. The central conflict is not a chase or a puzzle but the narrator's struggle with fixation as illness and fear change the way he sees another person.\n\nThe tone is claustrophobic, mournful, and disturbing without needing graphic emphasis in a practice summary. Readers should expect Poe's formal vocabulary, philosophical reflection, and a slow narrowing of attention. The setting feels enclosed by ancestral rooms, books, and family history, which makes the story useful for learners who want to practice atmosphere rather than simple action. For Morse typing, Berenice offers long sentences, abstract nouns, and sudden shifts from reflection to narrative movement. It encourages careful spacing and patience, especially where the prose leans into older diction.\n\nThis story is best for intermediate or advanced learners who enjoy dark literary material. A beginner can still use a short passage, but the full piece rewards a slower session with pauses for review. In audio practice, the repeated inward focus helps listeners hear how mood builds through phrasing. Typists can mark unfamiliar words, copy one paragraph at a time, and repeat the opening contrast between the narrator and Berenice to build confidence. The story is not light, but it is compact, memorable, and valuable for practicing careful listening when the emotional pressure is carried by sentence rhythm rather than by rapid plot.",
  },
  {
    fileName: "HOP-FROG.txt",
    slug: "hop-frog",
    title: "Hop-Frog",
    description:
      "A bitter court tale about a jester, a cruel king, and a masquerade charged with revenge.",
    subjects: ["Gothic fiction", "Revenge tale", "Court fiction"],
    originalPublicationYear: 1849,
    summary:
      "Hop-Frog by Edgar Allan Poe is a dark revenge tale set in a royal court where cruelty is treated as entertainment. The title character is a jester whose body, wit, and dependence make him vulnerable to a king and ministers who mistake power for entitlement. The central conflict grows from humiliation and loyalty: Hop-Frog must survive a court that laughs at pain, while his bond with another outsider gives the story its emotional center. A masquerade setting lets Poe turn costume, performance, and social hierarchy into sources of suspense.\n\nThe tone is sharp, theatrical, and bitterly comic before it becomes openly menacing. Readers should expect courtly interiors, grotesque humor, and a sense that every joke has a cost. For Morse practice, Hop-Frog is useful because it combines clear narrative movement with unusual vocabulary and compact dialogue. The story has names, titles, court terms, and action cues that help typists practice switching between description and speech. In audio, the social tension is easy to follow, making it a good choice for learners who want a complete story without a long session.\n\nThis selection works well for focused practice because the premise is simple but the language has texture. A learner can copy the opening court description, then listen again for how repeated references to laughter and performance change the mood. The story includes cruelty and revenge, but it can be approached through tone, character pressure, and setting rather than graphic detail. It is especially helpful for typists who want to practice punctuation in dialogue and sentences that move from ceremony to threat. The result is a compact Poe story with a strong dramatic shape and enough verbal variety to reward repeated Morse sessions.",
  },
  {
    fileName: "LIGEIA.txt",
    slug: "ligeia",
    title: "Ligeia",
    description:
      "A lush Gothic meditation on memory, will, mourning, and an elusive woman who dominates the narrator's imagination.",
    subjects: ["Gothic fiction", "Psychological horror"],
    originalPublicationYear: 1838,
    summary:
      "Ligeia by Edgar Allan Poe is a lush Gothic story about memory, grief, and the power one figure holds over a narrator's imagination. The setting moves through rooms, recollections, and later a strange bridal chamber, but the real center is the narrator's attempt to describe Ligeia herself. She is presented less as an ordinary character than as an intense presence: learned, beautiful, mysterious, and connected in the narrator's mind with will and spiritual force. The central conflict lies between mourning, desire, and uncertainty as the narrator tries to understand what has been lost and what may still remain.\n\nThe tone is ornate, hypnotic, and haunted. Poe uses long sentences, philosophical references, and lavish interior description, so the story asks readers to slow down. That makes it very useful for Morse practice when the goal is precision rather than speed. Typists will encounter complex clauses, unusual adjectives, and shifts between memory, setting, and emotion. In audio, the measured prose can feel almost musical, but it also demands attention because sentence boundaries carry much of the meaning.\n\nLigeia is best for learners who want a challenge with atmosphere. It is not a quick action piece; it is a sustained exercise in mood and perception. A practical session might start with one descriptive paragraph, then move to a later passage once the rhythm feels comfortable. The story helps build endurance for formal nineteenth-century prose and gives listeners practice with names, abstract terms, and rich visual detail. Its Gothic setting and central emotional conflict make it memorable, while its density makes repetition worthwhile. For MorseWords users, Ligeia offers a demanding but rewarding way to practice calm, accurate copying through a classic tale of obsession and uncertainty.",
  },
  {
    fileName: "MORELLA.txt",
    slug: "morella",
    title: "Morella",
    description:
      "A compact Gothic story about learning, identity, dread, and a marriage shadowed by metaphysical unease.",
    subjects: ["Gothic fiction", "Philosophical fiction"],
    originalPublicationYear: 1835,
    summary:
      "Morella by Edgar Allan Poe is a compact Gothic story about marriage, learning, identity, and dread. The narrator describes his fascination with Morella, a woman whose studies and intellect draw him into unsettling philosophical territory. Their relationship is intimate but troubled, and the central conflict grows from the narrator's fear of her influence, especially as questions of selfhood and continuity become more than abstract ideas. The setting is not expansive; it is built from private rooms, books, memory, and the pressure of a mind that cannot escape its own associations.\n\nThe tone is grave, inward, and uncanny. Poe uses philosophical language and emotional contradiction to make the story feel larger than its short length. For Morse practice, Morella is useful because it combines brief narrative movement with dense reflective prose. Typists can practice names, abstract vocabulary, and sentence patterns that require careful attention to punctuation. In audio playback, the story encourages a slower pace because much of the tension comes from how ideas are phrased rather than from action.\n\nThis is a good selection for learners who want a short but serious drill. The story can be finished in one session, then repeated paragraph by paragraph for accuracy. Its central conflict is easy to summarize without spoiling the final movement: a narrator is drawn toward someone whose intellectual and emotional force unsettles his sense of identity. That premise gives the listener a strong guide through the formal style. Morella is also useful for practicing transitions between description, confession, and philosophical reflection. It is dark, but its compactness makes it manageable, and its recurring ideas help learners recognize patterns when they replay the text at a slightly faster speed.",
  },
  {
    fileName: "MS. FOUND IN A BOTTLE.txt",
    slug: "ms-found-in-a-bottle",
    title: "MS. Found in a Bottle",
    description:
      "A maritime Gothic adventure told as a manuscript from a narrator drawn into uncanny seas.",
    subjects: ["Sea story", "Gothic fiction", "Adventure"],
    originalPublicationYear: 1833,
    summary:
      "MS. Found in a Bottle by Edgar Allan Poe is a maritime Gothic adventure told as a strange written account. The narrator begins with a sense of alienation from ordinary life and soon moves into a sea voyage where weather, shipboard danger, and uncanny discovery overwhelm familiar expectations. The central conflict is the narrator's effort to observe, record, and survive as he is carried farther from ordinary geography and ordinary certainty. Because the story is framed as a manuscript, every detail feels like evidence left for an unknown reader.\n\nThe tone is ominous, restless, and increasingly surreal. Poe uses the sea not just as a setting but as a force that changes the scale of human understanding. Readers should expect storms, ships, mysterious movement, and a narrator who keeps trying to make sense of what he sees. For Morse practice, the story is valuable because it mixes action with formal description. Nautical terms, long sentences, and repeated references to observation help typists practice precision. In audio, the voyage structure gives listeners a clear direction even when the events become strange.\n\nThis selection works well for learners who like adventure but want something more atmospheric than a simple travel tale. A good approach is to use the opening as a warm-up, then repeat the shipboard passages at a comfortable speed. The story has enough suspense to stay engaging across several practice sessions, and its first-person voice makes it easy to follow who is speaking and what is at stake. Without relying on ending spoilers, the page offers a classic Poe experience: a compact narrative where setting, voice, and mounting uncertainty create the challenge. It is especially useful for practicing sustained listening through descriptive paragraphs that carry both plot and mood.",
  },
  {
    fileName: "SOME WORDS WITH A MUMMY.txt",
    slug: "some-words-with-a-mummy",
    title: "Some Words with a Mummy",
    description:
      "A comic speculative tale in which modern certainty meets an ancient voice with dry, deflating wit.",
    subjects: ["Satire", "Speculative fiction", "Comic fiction"],
    originalPublicationYear: 1845,
    summary:
      "Some Words with a Mummy by Edgar Allan Poe is a comic speculative tale with a dry satirical edge. The setting begins in a modern social and scientific circle, where curiosity about an Egyptian mummy turns into an absurdly lively conversation across ages. The central conflict is intellectual rather than physical: confident modern speakers must test their assumptions against an ancient figure who is not as silent, primitive, or easily impressed as they expect. Poe uses the premise to poke at progress, fashion, scholarship, and the pride of the present.\n\nThe tone is witty, talkative, and playful, which makes this story different from Poe's darker Gothic pieces. It still has an uncanny setup, but the pleasure comes from argument, surprise, and social comedy. For Morse practice, Some Words with a Mummy is useful because it has dialogue, technical terms, names, and a steady exchange of ideas. Typists get practice with conversational punctuation and longer explanatory sentences. In audio, the back-and-forth quality helps listeners stay oriented, especially when the speakers compare ancient and modern customs.\n\nThis is a good Poe choice for learners who want something unusual without the heavier mood of horror. The story supports medium-length practice sessions because the conversation creates natural pauses. A learner can focus on one exchange at a time, then replay a passage to catch the cadence of question, reply, and comic reversal. The setting also introduces vocabulary from science, history, and social life, giving typing drills more variety than a straightforward adventure. Without spoiling the final comic direction, the story offers a useful practice experience: a lively, skeptical, and amusing Poe piece where the main challenge is following wit through formal nineteenth-century prose.",
  },
  {
    fileName: "THE BLACK CAT.txt",
    slug: "the-black-cat",
    title: "The Black Cat",
    description:
      "A grim psychological horror story about confession, cruelty, guilt, and a narrator losing moral control.",
    subjects: ["Psychological horror", "Gothic fiction"],
    originalPublicationYear: 1843,
    summary:
      "The Black Cat by Edgar Allan Poe is a grim psychological horror story framed as a confession. The narrator speaks from a place of crisis, trying to explain how ordinary domestic life gave way to cruelty, guilt, and fear. The central conflict is internal and moral: he wants to account for his actions while also revealing a mind that cannot be trusted. The household setting, the presence of animals, and the narrator's insistence on his own explanation create a claustrophobic story about self-deception and consequence.\n\nThe tone is dark, intimate, and unsettling. This summary avoids graphic detail and focuses on the reading experience: a first-person account where the horror grows from voice, denial, and escalating dread. For Morse practice, The Black Cat is useful because the prose moves between confession, description, and tense narrative action. Typists can practice emotionally charged punctuation, repeated phrases, and shifts in sentence length. In audio playback, the narrator's direct address gives the listener a strong through-line even when the mood becomes difficult.\n\nThis story is best approached slowly, especially by learners who are sensitive to animal cruelty or domestic horror. It can still be a strong practice text because it is compact, famous, and built around a clear voice. A useful session might copy the opening explanation, pause to review difficult words, then continue with shorter sections rather than one long run. The story helps build accuracy with Gothic vocabulary and with sentences where tone matters as much as plot. For MorseWords users who want classic Poe horror, it offers a memorable but serious drill, suited to careful listening, controlled speed, and repeated practice rather than casual background playback.",
  },
  {
    fileName: "THE CASK OF AMONTILLADO.txt",
    slug: "the-cask-of-amontillado",
    title: "The Cask of Amontillado",
    description:
      "A compact revenge tale set in carnival season and the dark passages below a noble house.",
    subjects: ["Gothic fiction", "Revenge tale"],
    originalPublicationYear: 1846,
    summary:
      "The Cask of Amontillado by Edgar Allan Poe is a compact Gothic revenge tale with a famously controlled narrator. The setting begins during carnival season, where public noise, costume, and celebration contrast with the private purpose of Montresor. He draws Fortunato toward the promise of a rare wine and into the underground passages beneath a family house. The central conflict is psychological and social: insult, pride, expertise, and manipulation all become part of a carefully managed encounter.\n\nThe tone is cold, ironic, and suspenseful. Poe does not need a large cast or a complicated plot; the story works through voice, setting, and the narrowing path into darkness. For Morse practice, The Cask of Amontillado is excellent because it is short, vivid, and highly structured. Learners can follow the repeated references to wine, carnival, family honor, and the catacombs while practicing dialogue punctuation and foreign names. The prose has enough formal polish to reward accuracy, but the scenario is clear enough that listeners can keep their place in audio.\n\nThis story is useful for both short and repeated sessions. A beginner might practice only the opening paragraphs, while an intermediate typist can copy the whole tale and then replay the dialogue at a slightly faster speed. The conflict is tense without requiring graphic description in the summary, and the setting gives strong mental anchors: the crowded festival above and the enclosed passage below. For MorseWords users, it is a strong choice when they want a complete literary work that fits into a focused practice block. Its compactness, memorable names, and steady movement make it one of Poe's most practical texts for building rhythm and confidence.",
  },
  {
    fileName: "THE FACTS IN THE CASE OF M. VALDEMAR.txt",
    slug: "the-facts-in-the-case-of-m-valdemar",
    title: "The Facts in the Case of M. Valdemar",
    description:
      "A clinical Gothic tale about mesmerism, experiment, illness, and the limits of observation.",
    subjects: ["Gothic fiction", "Science fiction", "Psychological horror"],
    originalPublicationYear: 1845,
    summary:
      "The Facts in the Case of M. Valdemar by Edgar Allan Poe is a clinical Gothic tale built around mesmerism, illness, and experimental curiosity. The narrator presents the story as a careful report, explaining the circumstances of an unusual case and the questions it raises. M. Valdemar is gravely ill, and the central conflict comes from an attempt to test whether mesmerism can affect the boundary between consciousness and death. The story's power comes from the mismatch between calm procedure and a situation that becomes increasingly impossible to contain.\n\nThe tone is controlled, strange, and unnerving. Poe writes as if the narrator were documenting evidence, which makes the horror feel colder and more procedural than in a castle or haunted house. For Morse practice, this is useful because the story contains technical vocabulary, formal phrasing, and a steady sequence of observations. Typists can practice names with initials, medical and experimental language, and sentences that require careful punctuation. In audio, the report-like structure helps learners follow the sequence even when the premise grows uncanny.\n\nThis selection is best for learners who enjoy speculative or science-adjacent Gothic fiction. It is not a light story, but it is a strong drill for precision because the narrator's credibility depends on exact wording. A practical approach is to copy the opening setup first, then replay the experiment passages after reviewing unfamiliar terms. The story also helps listeners practice tone: much of the tension comes from restrained language describing extraordinary events. Without spoiling the outcome, the page offers a focused Poe exercise in curiosity, dread, and the danger of treating a human crisis as a demonstration. It rewards slow, attentive Morse typing and careful listening.",
  },
  {
    fileName: "THE FALL OF THE HOUSE OF USHER.txt",
    slug: "the-fall-of-the-house-of-usher",
    title: "The Fall of the House of Usher",
    description:
      "A major Gothic tale of an isolated mansion, a troubled family, and a visitor drawn into dread.",
    subjects: ["Gothic fiction", "Psychological horror"],
    originalPublicationYear: 1839,
    summary:
      "The Fall of the House of Usher by Edgar Allan Poe is one of his major Gothic tales, set around an isolated mansion and an ancient family in decline. A narrator arrives after receiving a troubled summons from Roderick Usher, whose mental and physical unease seems inseparable from the house itself. The central conflict is the visitor's attempt to understand and steady his friend while the atmosphere, family history, and strange events press toward collapse. The setting is crucial: tarn, walls, rooms, music, books, and weather all become part of the story's psychological pressure.\n\nThe tone is somber, highly descriptive, and oppressive. Poe builds dread through architecture and mood as much as through event. For Morse practice, this story is valuable because it gives learners rich descriptive prose, formal vocabulary, and long sentences that reward careful pacing. Typists can work on landscape description, emotional terms, and dialogue embedded in a complex narrative. In audio playback, the recurring images of the house and its surroundings help listeners stay oriented through dense language.\n\nThis is a longer and more demanding Poe selection, well suited to intermediate or advanced sessions. A learner might divide it into several practice blocks: the approach to the house, the meeting with Roderick, and later scenes of mounting unease. The story contains Gothic fear and illness, but it can be practiced through attention to tone rather than graphic detail. It is especially useful for building endurance with classic prose because the sentences often carry description, mood, and action at once. For MorseWords users, The Fall of the House of Usher offers a memorable literary challenge: a carefully staged descent into atmosphere where every pause, image, and repeated word can sharpen listening and typing accuracy.",
  },
  {
    fileName: "THE MAN OF THE CROWD.txt",
    slug: "the-man-of-the-crowd",
    title: "The Man of the Crowd",
    description:
      "An urban mystery of observation, anonymity, and pursuit through crowded London streets.",
    subjects: ["Mystery", "Urban fiction", "Psychological fiction"],
    originalPublicationYear: 1840,
    summary:
      "The Man of the Crowd by Edgar Allan Poe is an urban mystery about observation, anonymity, and pursuit. The narrator sits in a London coffee-house watching people pass, turning the crowd into a readable text of faces, occupations, habits, and moods. One old man's appearance resists easy interpretation, and the narrator follows him through the city in an attempt to understand what kind of life he represents. The central conflict is interpretive: can a watcher truly read another person, or does the crowd hide what matters most?\n\nThe tone is curious, analytical, and shadowed. Instead of a locked room or remote mansion, the setting is the modern city, with streets, shops, lights, weather, and human movement. For Morse practice, this story is useful because it is packed with visual classification and motion. Typists can practice lists, descriptive phrases, and shifts in pace as the narrator moves from seated observation to active pursuit. In audio, the repetition of city movement gives listeners a strong rhythm, while the mystery of the old man keeps attention focused.\n\nThis selection is a good fit for learners who want Poe without a conventional horror setup. It trains careful reading because much of the story depends on noticing categories and changes in atmosphere. A useful practice method is to copy one observational passage, then repeat a pursuit passage where sentence rhythm speeds up. The story also helps with vocabulary tied to urban life, social class, and perception. Without revealing the final implication, The Man of the Crowd offers a compact study in curiosity and limits: a narrator wants certainty, but the city keeps multiplying signs. For MorseWords users, that makes it an engaging drill for sustained listening and accurate typing through dense but purposeful description.",
  },
  {
    fileName: "THE MURDERS IN THE RUE MORGUE.txt",
    slug: "the-murders-in-the-rue-morgue",
    title: "The Murders in the Rue Morgue",
    description:
      "A landmark detective story featuring C. Auguste Dupin, Paris, and an apparently impossible crime.",
    subjects: ["Detective fiction", "Mystery", "Crime fiction"],
    originalPublicationYear: 1841,
    summary:
      "The Murders in the Rue Morgue by Edgar Allan Poe is a landmark detective story featuring C. Auguste Dupin and an apparently baffling Paris crime. The opening reflects on analysis, games, observation, and the difference between ordinary cleverness and deeper reasoning. The central conflict then becomes a problem of interpretation: witnesses, reports, a locked-room setting, and strange details seem to contradict one another, while Dupin tries to organize the evidence into a coherent explanation. The Paris setting gives the story a mix of newspaper detail, city atmosphere, and private intellectual inquiry.\n\nThe tone is analytical, dramatic, and occasionally sensational. Because this is early detective fiction, the story spends time teaching the reader how to think with Dupin before the main mystery is resolved. For Morse practice, it is useful but substantial. Learners get formal essays, dialogue, witness statements, names, street references, and investigative language. Typists can practice switching from abstract explanation to crime-report detail, while listeners can use the repeated evidence structure to stay oriented.\n\nThis is one of the longer Poe stories in the set, so it is best divided into sessions. A practical routine is to use the analytic opening as a careful typing drill, then handle the investigation in smaller blocks. The crime premise involves violence, but the practice focus can stay on reasoning, testimony, and atmosphere without emphasizing graphic detail. For learners interested in mystery, The Murders in the Rue Morgue is especially fun because the central question remains active throughout: how can apparently impossible facts fit together? Its length, vocabulary, and structured evidence make it a strong endurance piece for intermediate typists, and its historical importance gives repeated practice a sense of purpose beyond speed alone.",
  },
  {
    fileName: "THE OBLONG BOX.txt",
    slug: "the-oblong-box",
    title: "The Oblong Box",
    description:
      "A sea-voyage mystery about secrecy, suspicion, and an oddly shaped object aboard ship.",
    subjects: ["Mystery", "Sea story", "Gothic fiction"],
    originalPublicationYear: 1844,
    summary:
      "The Oblong Box by Edgar Allan Poe is a sea-voyage mystery built from suspicion, social observation, and an object whose meaning remains uncertain. The narrator travels by packet ship and becomes curious about a fellow passenger, his arrangements, and a long box that seems too important to ignore. The central conflict is the narrator's effort to interpret clues while constrained by etiquette, limited information, and his own assumptions. The shipboard setting keeps the cast close together, so small details take on outsized importance.\n\nThe tone is curious, uneasy, and increasingly tense. Poe uses the ordinary mechanics of travel, cabins, luggage, passenger lists, and conversation to prepare a Gothic mystery without beginning in an obviously supernatural place. For Morse practice, The Oblong Box is useful because it has a clear narrative voice and many concrete details. Typists can practice names, ship terms, dialogue, and descriptive clues. In audio, the enclosed voyage helps listeners track the story because the physical setting is stable even as suspicion grows.\n\nThis story is well suited to a medium-length practice session. It is less abstract than some of Poe's philosophical Gothic tales and more focused on sequence, observation, and inference. A learner can copy the opening travel setup, then replay later passages to catch how the narrator revises his guesses. The mystery should be experienced without the ending being given away, so the practice value lies in following what the narrator knows at each stage. For MorseWords users, The Oblong Box offers a good balance: enough suspense to stay lively, enough formal prose to challenge accuracy, and a compact maritime setting that makes repeated listening easy to organize.",
  },
  {
    fileName: "THE OVAL PORTRAIT.txt",
    slug: "the-oval-portrait",
    title: "The Oval Portrait",
    description:
      "A very short Gothic tale about art, obsession, a wounded traveler, and a haunting portrait.",
    subjects: ["Gothic fiction", "Art fiction"],
    originalPublicationYear: 1842,
    summary:
      "The Oval Portrait by Edgar Allan Poe is a very short Gothic tale about art, obsession, and the strange power of an image. The setting is a remote chateau where a wounded traveler shelters for the night and studies the paintings in the room around him. One portrait arrests his attention, and a written account connected to it opens the central conflict: the tension between artistic devotion and living human presence. Poe compresses the story into a small space, making mood and implication do much of the work.\n\nThe tone is hushed, eerie, and reflective. Readers should expect candlelit interiors, old rooms, framed art, and a story-within-the-story structure. For Morse practice, The Oval Portrait is especially useful for beginners or for short warm-ups because it is compact but complete. The prose still has Poe's formal style, yet the length makes it practical to repeat several times. Typists can focus on visual description, punctuation, and the shift from the traveler's immediate situation to the embedded account of the portrait.\n\nThis is a strong choice when a learner wants a literary Poe session without committing to a long tale. A good practice routine is to copy the first descriptive paragraph slowly, listen to the portrait passage, then replay the whole story at a slightly faster speed. The central conflict is easy to grasp without spoiling the final effect: art, attention, and personal cost become entangled. Because the story is brief, mistakes are easy to review, and repeated passes make rhythm more familiar. For MorseWords users, The Oval Portrait offers concentrated Gothic atmosphere, manageable length, and a memorable setting that supports accurate typing practice.",
  },
  {
    fileName: "THE PIT AND THE PENDULUM.txt",
    slug: "the-pit-and-the-pendulum",
    title: "The Pit and the Pendulum",
    description:
      "A suspenseful Gothic tale of imprisonment, sensory fear, and a prisoner measuring danger in darkness.",
    subjects: ["Gothic fiction", "Suspense", "Psychological horror"],
    originalPublicationYear: 1842,
    summary:
      "The Pit and the Pendulum by Edgar Allan Poe is a suspenseful Gothic tale of imprisonment, sensory fear, and endurance under pressure. The narrator is confined by the Inquisition and must understand his surroundings while weakened, disoriented, and threatened by mechanisms he cannot immediately see. The central conflict is survival through perception: he must measure space, interpret sound, and keep enough control of his mind to respond to danger. The setting is stark and enclosed, making darkness, silence, and physical limits central to the story.\n\nThe tone is intense, claustrophobic, and methodical. Poe turns fear into a sequence of observations, so the reader experiences suspense through the narrator's attempts to think clearly. For Morse practice, this story is valuable because it has a strong narrative line, vivid sensory language, and repeated shifts between panic and analysis. Typists can practice longer sentences, spatial description, and emotionally charged punctuation. In audio, the confinement gives listeners a clear focus even as the dangers change.\n\nThis is a good intermediate selection for learners who want a gripping story with a defined problem. It is longer than a quick warm-up, so it can be divided into several sessions. A practical approach is to practice the opening state of confusion first, then return to later passages that describe the prison and its threats. The story includes danger and fear, but it can be studied without dwelling on graphic detail. For MorseWords users, The Pit and the Pendulum offers strong pacing, memorable imagery, and useful repetition of sensory cues. It helps build endurance because the prose asks the learner to follow both action and thought, one careful signal at a time.",
  },
  {
    fileName: "THE PREMATURE BURIAL.txt",
    slug: "the-premature-burial",
    title: "The Premature Burial",
    description:
      "A Gothic meditation on fear, medical uncertainty, and the terror of being mistaken for dead.",
    subjects: ["Gothic fiction", "Psychological horror"],
    originalPublicationYear: 1844,
    summary:
      "The Premature Burial by Edgar Allan Poe is a Gothic meditation on fear, medical uncertainty, and obsession. The narrator is preoccupied with accounts of people being buried before death is certain, and that fear shapes how he understands illness, sleep, and bodily vulnerability. The central conflict is the struggle between rational preparation and overwhelming dread. Rather than beginning as a simple plot, the story moves through examples, reflection, and the narrator's own anxious precautions, creating a study of how fear can organize a life.\n\nThe tone is anxious, documentary, and claustrophobic. Poe draws on a cultural fear that was especially vivid in the nineteenth century, but the story also works as a psychological portrait of dread feeding on evidence. For Morse practice, The Premature Burial is useful because it combines essay-like passages with personal narrative. Typists can practice formal vocabulary, medical and legal terms, and long sentences that require steady attention. In audio, the repeated theme gives listeners a strong anchor even when the structure moves through cases and reflection.\n\nThis is a good selection for learners who want something darker but not fast-moving. It rewards slow practice because much of the tension comes from accumulation rather than sudden action. A useful routine is to copy one example passage, review difficult words, then listen to the narrator's personal sections for contrast. The story includes fear of death and confinement, but the practice focus can remain on tone and argument. For MorseWords users, The Premature Burial builds endurance with formal prose and helps train attention across paragraphs that blend fact, fear, and confession. It is a strong drill for learners who want to practice how sustained anxiety sounds in Morse.",
  },
  {
    fileName: "THE PURLOINED LETTER.txt",
    slug: "the-purloined-letter",
    title: "The Purloined Letter",
    description:
      "A Dupin detective story about a stolen letter, political leverage, and the art of seeing what others miss.",
    subjects: ["Detective fiction", "Mystery"],
    originalPublicationYear: 1844,
    summary:
      "The Purloined Letter by Edgar Allan Poe is a C. Auguste Dupin detective story about a stolen document, political leverage, and the art of seeing what others miss. The setting is Paris, mostly in conversation, as the Prefect of police explains a problem that seems simple but has resisted official search. The central conflict is intellectual: the authorities have looked everywhere in the usual way, while Dupin approaches the case by thinking about the mind and habits of the person who holds the letter.\n\nThe tone is elegant, analytical, and quietly comic. Compared with The Murders in the Rue Morgue, this mystery is less about physical violence and more about method, inference, and social intelligence. For Morse practice, The Purloined Letter is useful because it has sustained dialogue, abstract reasoning, and a clear problem that keeps the listener oriented. Typists can practice French names, formal speech, punctuation in conversation, and longer explanatory passages. In audio, the repeated focus on searching and reasoning makes it easy to follow the structure even when sentences become elaborate.\n\nThis story is a strong intermediate drill for learners who like puzzles. It can be practiced in sections: the Prefect's explanation, Dupin's reasoning, and the later discussion of method. The ending should be discovered in the story, so this summary avoids revealing the solution. The practice value lies in listening for how Poe contrasts mechanical search with imaginative understanding. For MorseWords users, The Purloined Letter offers a calmer but still engaging Poe experience. It trains accuracy with dialogue and abstract vocabulary while giving the learner a satisfying mystery framework that rewards careful repetition.",
  },
  {
    fileName: "THE SPHINX.txt",
    slug: "the-sphinx",
    title: "The Sphinx",
    description:
      "A brief tale of perception, fear, and scale set during a cholera-haunted retreat outside New York.",
    subjects: ["Psychological fiction", "Gothic fiction"],
    originalPublicationYear: 1846,
    summary:
      "The Sphinx by Edgar Allan Poe is a brief tale about perception, fear, and the way scale can deceive the mind. The narrator is staying with a relative outside New York during a cholera outbreak, so the setting carries a background of real anxiety even before anything strange appears. From a window, he sees what seems to be an alarming creature, and the central conflict becomes a test of interpretation: is the sight a sign of supernatural terror, a symptom of fear, or something that ordinary perspective has distorted?\n\nThe tone is uneasy but also wry. Poe uses dread, domestic conversation, and visual puzzle-making in a compact space. For Morse practice, The Sphinx is useful because it is short, clear, and built around observation. Typists can practice descriptive vocabulary, measured explanation, and the contrast between panic and reason. In audio, the story is easy to repeat because the premise is simple and the vocabulary is memorable. It works well as a warm-up before longer Poe selections.\n\nThis is a good choice for learners who want a complete practice session without a heavy plot. The story's setting during disease gives it seriousness, but the main reading experience is about how the mind interprets what it sees. A practical routine is to copy the opening situation, then replay the visual description until the phrasing becomes familiar. The story helps learners practice careful listening because the meaning depends on details of sight, distance, and explanation. Without spoiling the final clarification, The Sphinx offers a compact Poe exercise in fear and perception. It is especially useful for building confidence with classic prose in a short, repeatable form.",
  },
  {
    fileName: "THE SYSTEM OF DOCTOR TARR AND PROFESSOR FETHER.txt",
    slug: "the-system-of-doctor-tarr-and-professor-fether",
    title: "The System of Doctor Tarr and Professor Fether",
    description:
      "A darkly comic asylum tale about order, authority, performance, and a visitor's uneasy tour.",
    subjects: ["Satire", "Gothic fiction", "Comic fiction"],
    originalPublicationYear: 1845,
    summary:
      "The System of Doctor Tarr and Professor Fether by Edgar Allan Poe is a darkly comic tale set around a private asylum in southern France. A visitor arrives curious about a supposedly new method of treatment and is drawn into a social world that feels both refined and unstable. The central conflict is one of trust and interpretation: the narrator must decide how to understand the people, rules, and performances around him while authority itself becomes uncertain. Poe turns institutional order into a stage for satire and unease.\n\nThe tone is comic, grotesque, and suspenseful. The story has dinner conversation, eccentric behavior, and a growing sense that explanations may not be as reliable as they sound. For Morse practice, it is useful because it combines dialogue, social observation, French setting details, and longer descriptive passages. Typists can practice names, titles, and shifts between polite conversation and absurdity. In audio, the ensemble scenes help learners hear changes in speaker, tone, and pacing.\n\nThis is a substantial but lively Poe selection. It works well for learners who want something less solemn than the pure Gothic tales but still strange enough to hold attention. A practical session might focus first on the narrator's arrival and then on the social scenes, where punctuation and dialogue become important. The story includes outdated attitudes about mental illness, so modern readers should treat it as a period satire rather than a guide to care. For MorseWords users, its value is in variety: formal narration, comic timing, unsettling atmosphere, and repeated questions about who is in control. It is a good practice text for building endurance while staying alert to tonal changes.",
  },
  {
    fileName: "THE TELL-TALE HEART.txt",
    slug: "the-tell-tale-heart",
    title: "The Tell-Tale Heart",
    description:
      "A famous psychological horror confession driven by nervous voice, guilt, and unbearable sound.",
    subjects: ["Psychological horror", "Gothic fiction"],
    originalPublicationYear: 1843,
    summary:
      "The Tell-Tale Heart by Edgar Allan Poe is a famous psychological horror story told as a direct confession. The narrator insists on calmness and sanity while describing an obsession that narrows his world to one feared detail. The central conflict is between control and exposure: he wants to prove his own reason, yet every sentence reveals pressure building inside him. The setting is small and domestic, but Poe turns it into a space of secrecy, surveillance, and unbearable sound.\n\nThe tone is urgent, nervous, and intensely intimate. Because the narrator speaks directly, the story is excellent for Morse practice. Typists can feel the rhythm of repeated words, dashes, exclamations, and short bursts of insistence. The prose is compact but dramatic, making it practical for beginners who want a famous complete text and for intermediate learners who want to refine timing. In audio, the repeated claims and rising pressure make it easy to hear how punctuation shapes the voice.\n\nThis story should be approached as dark psychological material rather than casual background practice. It involves crime and fear, but the summary does not need graphic detail to explain the experience. A useful routine is to copy the opening paragraph slowly, replay it for rhythm, and then continue in short sections. The story helps learners practice emotional punctuation, repeated vocabulary, and first-person narration under strain. For MorseWords users, The Tell-Tale Heart is a strong addition because it is short, memorable, and widely recognized. It gives a full literary experience in a manageable length and rewards repeated listening as the narrator's voice becomes more precise in the learner's ear.",
  },
  {
    fileName: "THOU ART THE MAN.txt",
    slug: "thou-art-the-man",
    title: "Thou Art the Man",
    description:
      "A mystery tale of a small town, a vanished man, suspicion, and a narrator unraveling appearances.",
    subjects: ["Mystery", "Crime fiction", "Satire"],
    originalPublicationYear: 1844,
    summary:
      "Thou Art the Man by Edgar Allan Poe is a mystery tale with a satirical edge, set around a small community shaken by suspicion. The narrator presents himself as the one able to explain a puzzling affair in Rattleborough, where a respected man's disappearance and the behavior of those around him create a tangled public story. The central conflict is the search for truth beneath reputation, local gossip, and misleading appearances. Poe uses the machinery of mystery while also mocking social certainty and public performance.\n\nThe tone is brisk, ironic, and investigative. Readers should expect names, testimony, local color, and a narrator who enjoys exposing how the pieces fit together. For Morse practice, Thou Art the Man is useful because it has a strong storytelling voice and a mystery structure that keeps attention moving. Typists can practice dialogue, place names, repeated clues, and older idioms. In audio, the narrator's confidence provides a guide through the details, making it easier to follow than a purely atmospheric piece.\n\nThis is a good selection for learners who want Poe in detective mode but with more comic bite than pure horror. A practical session can begin with the narrator's setup, then continue through the sequence of public suspicion and private inquiry. The story involves crime, but the practice focus can stay on reasoning, social observation, and the contrast between what people think they know and what careful attention reveals. Without giving away the resolution, the story offers a satisfying exercise in following clues. For MorseWords users, it is a useful medium-length drill that combines narrative momentum with enough formal language to challenge accuracy.",
  },
  {
    fileName: "WILLIAM WILSON.txt",
    slug: "william-wilson",
    title: "William Wilson",
    description:
      "A Gothic double story about conscience, identity, rivalry, and a narrator pursued by his own name.",
    subjects: ["Gothic fiction", "Psychological fiction"],
    originalPublicationYear: 1839,
    summary:
      "William Wilson by Edgar Allan Poe is a Gothic double story about identity, conscience, and rivalry. The narrator chooses the name William Wilson and looks back on a life shaped by pride, secrecy, and a strange figure who shares his name and seems to interfere at decisive moments. The settings move from school to broader social spaces, but the central conflict remains psychological: the narrator wants freedom for his own will while another presence appears to check, mirror, or expose him.\n\nThe tone is confessional, elegant, and increasingly uncanny. Poe uses school memories, social ambition, and the double motif to create tension without relying on a single haunted room. For Morse practice, William Wilson is useful because it has varied scenes, formal reflection, and repeated names that help anchor the listener. Typists can practice longer narrative paragraphs, dialogue-like moments, and vocabulary tied to education, reputation, and moral pressure. In audio, the recurrence of the name and the rival presence gives the story a clear thread through its more elaborate passages.\n\nThis is a strong intermediate or advanced selection because it is longer and more psychologically layered than some of Poe's shortest tales. A good routine is to practice the school opening first, then move into later confrontations in separate sessions. The story rewards repetition because the central conflict becomes clearer as the narrator's self-description accumulates. Without spoiling the final movement, William Wilson offers a classic Poe experience of pursuit turned inward. For MorseWords users, it builds endurance with literary prose while keeping the practice grounded in a memorable premise: a person cannot easily escape the voice, name, or conscience that follows him.",
  },
];

function assertInside(root: string, candidate: string) {
  const relative = path.relative(root, candidate);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`${candidate} is outside ${root}`);
  }
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeText(filePath: string, value: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, value.endsWith("\n") ? value : `${value}\n`, "utf8");
}

function statusPath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function estimateTypingMinutes(wordCount: number) {
  return Math.max(1, Math.ceil(wordCount / 35));
}

function estimateListeningMinutes(morseCharacterEstimate: number) {
  return Math.max(1, Math.ceil(morseCharacterEstimate / 900));
}

function extractHeaderValue(rawText: string, name: string) {
  const pattern = new RegExp(`^${name}:\\s*(.+)$`, "im");
  return rawText.match(pattern)?.[1]?.trim() ?? null;
}

function normalizeComparableTitle(input: string) {
  return input
    .toLowerCase()
    .replace(/\.$/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function releaseDateFromRaw(rawText: string) {
  const line = extractHeaderValue(rawText, "Release date");
  if (!line) return null;
  return line.replace(/\s*\[.*$/, "").trim() || null;
}

function storyBodyFromRaw(story: PoeStory, rawText: string) {
  const normalized = rawText.replace(/^\uFEFF/, "").replace(/\r\n|\r/g, "\n");
  const headerTitle = extractHeaderValue(normalized, "Title");
  const headerAuthor = extractHeaderValue(normalized, "Author");
  if (!headerTitle || normalizeComparableTitle(headerTitle) !== normalizeComparableTitle(story.title)) {
    throw new Error(`${story.slug}: raw title did not match expected generated title.`);
  }
  if (headerAuthor !== "Edgar Allan Poe") {
    throw new Error(`${story.slug}: raw author did not match Edgar Allan Poe.`);
  }

  const lines = normalized.split("\n");
  const expected = normalizeComparableTitle(headerTitle);
  let offset = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    const endOffset = offset + line.length + 1;
    if (index > 2 && normalizeComparableTitle(trimmed) === expected) {
      const body = trimBookText(normalized.slice(endOffset));
      if (body.length < 400 || /Project Gutenberg|Release date:|Author:/i.test(body.slice(0, 500))) {
        throw new Error(`${story.slug}: extracted body boundary looked unsafe.`);
      }
      return {
        body,
        headerTitle,
        headerAuthor,
        sourceStartOffset: endOffset,
        sourceEndOffset: endOffset + body.length,
      };
    }
    offset = endOffset;
  }

  throw new Error(`${story.slug}: repeated story-title boundary was not found.`);
}

function previewTextForBody(body: string) {
  const targetLength = 1_050;
  if (body.length <= 1_250) return trimBookText(body);
  const minBoundary = 850;
  const maxBoundary = Math.min(body.length, 1_250);
  const window = body.slice(minBoundary, maxBoundary);
  const paragraphBreak = window.lastIndexOf("\n\n");
  if (paragraphBreak > 0) return trimBookText(body.slice(0, minBoundary + paragraphBreak));
  const sentenceMatches = [...window.matchAll(/[.!?]["')\]]?\s+/g)];
  const sentence = sentenceMatches.at(-1);
  if (sentence?.index !== undefined) {
    return trimBookText(body.slice(0, minBoundary + sentence.index + sentence[0].length));
  }
  const whitespace = body.lastIndexOf(" ", targetLength);
  return trimBookText(body.slice(0, whitespace > minBoundary ? whitespace : targetLength));
}

function makeSection({
  body,
  contentHash,
  story,
  sourceEndOffset,
  sourceStartOffset,
}: {
  body: string;
  contentHash: string;
  story: PoeStory;
  sourceStartOffset: number;
  sourceEndOffset: number;
}): GeneratedBookSectionJson {
  const wordCount = countBookWords(body);
  const morseCharacterEstimate = estimateMorseCharacters(body);
  return {
    schemaVersion: 1,
    bookSlug: story.slug,
    sectionId: "chapter-001",
    kind: "chapter",
    label: story.title,
    title: null,
    order: 1,
    includeByDefault: true,
    displayText: body,
    morseSourceText: body,
    paragraphs: splitParagraphs(body),
    wordCount,
    characterCount: body.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseCharacterEstimate),
    morseCharacterEstimate,
    unsupportedCharacterSummary: summarizeUnsupportedCharacters(body),
    textPreview: textPreview(body),
    sourceOffsets: {
      start: sourceStartOffset,
      end: sourceEndOffset,
    },
  };
}

function makePreviewAsset(story: PoeStory, section: GeneratedBookSectionJson, contentHash: string) {
  const previewText = previewTextForBody(section.morseSourceText);
  const wordCount = countBookWords(previewText);
  const morseCharacterEstimate = estimateMorseCharacters(previewText);
  const contentVersion = contentHash.slice(0, 16);
  return {
    version: 1,
    slug: story.slug,
    contentVersion,
    contentHash,
    defaultSectionId: section.sectionId,
    defaultSectionKind: section.kind,
    defaultSectionLabel: section.label,
    defaultSectionTitle: section.title,
    previewText,
    estimatedRuntimeSeconds: Math.max(1, Math.round((morseCharacterEstimate / 900) * 60)),
    wordCount,
    characterCount: previewText.length,
    estimatedTypingMinutes: estimateTypingMinutes(wordCount),
    estimatedListeningMinutes: estimateListeningMinutes(morseCharacterEstimate),
    morseCharacterEstimate,
    textPreview: textPreview(previewText),
    truncated: previewText.length < section.morseSourceText.trim().length,
  };
}

function seoSummaryForStory(story: PoeStory) {
  return `${story.summary}

For a practical Morse session, use ${story.title} as a repeatable passage: preview the opening text, listen once for structure, then type a shorter selection again at a slightly higher speed. That routine keeps the literary setting present while turning the story into clear, measurable practice for accuracy, punctuation, and endurance.`;
}

function makeRightsReport(story: PoeStory, rawText: string): BookRightsReport {
  const gutenbergId = extractHeaderValue(rawText, "Release date")?.match(/\[eBook #(\d+)\]/i)?.[1] ?? "25525";
  return {
    schemaVersion: 1,
    title: story.title,
    author: "Edgar Allan Poe",
    author_death_year: 1849,
    language: "English",
    original_publication: String(story.originalPublicationYear),
    release_date: releaseDateFromRaw(rawText) ?? "",
    last_updated: rawText.match(/Most recently updated:\s*([^\n]+)/i)?.[1]?.trim() ?? "",
    source: "Project Gutenberg",
    gutenberg_ebook_number: gutenbergId,
    source_url: `https://www.gutenberg.org/ebooks/${gutenbergId}`,
    raw_text_url: null,
    gutenberg_header_present: true,
    project_gutenberg_license_present: /PROJECT GUTENBERG/i.test(rawText),
    us_reuse_language_found: /United States/i.test(rawText),
    non_us_warning_found: /not located in the United States/i.test(rawText),
    credits: extractHeaderValue(rawText, "Credits") ?? "",
    translator: "",
    translator_death_year: null,
    illustrator: "",
    editor: "",
    introduction_author: "",
    contains_modern_intro_or_notes: false,
    contains_transcriber_notes: /transcriber/i.test(rawText),
    contains_illustrations_or_image_references: /\[(?:Illustration|Image|Plate)/i.test(rawText),
    contains_later_copyright_notice: /copyright/i.test(rawText),
    contains_creative_commons_license: /creative commons/i.test(rawText),
    contains_permission_based_language: /permission/i.test(rawText),
    is_translation: false,
    translation_risk: "low",
    edition_risk: "low",
    trademark_or_character_brand_risk: "none",
    content_brand_safety_risk: "none",
    owner_reviewed_approval_present: false,
    approved_for_website: true,
    approved_for_youtube_narration: false,
    approved_regions: ["US"],
    approval_source: "external-authority",
    duplicate_resolution_source: "owner-reviewed",
    canada_us_v1_status: "approved",
    reasoning_summary:
      "Targeted Poe reconciliation processed an individual public-domain story from a Project Gutenberg source after explicit raw/generated inventory review.",
    evidence_snippets: [
      `Source URL: https://www.gutenberg.org/ebooks/${gutenbergId}`,
      "Edgar Allan Poe died in 1849; these extracted stories are treated as public-domain US source texts.",
      "Cloudflare export was not run in this reconciliation branch.",
    ],
    processing_allowed: true,
  };
}

function writeGeneratedStory(story: PoeStory) {
  const rawPath = path.join(tempBooksRoot, story.fileName);
  assertInside(tempBooksRoot, rawPath);
  const rawText = fs.readFileSync(rawPath, "utf8");
  const { body, sourceEndOffset, sourceStartOffset } = storyBodyFromRaw(story, rawText);
  const contentHash = sha256(JSON.stringify({ slug: story.slug, title: story.title, body }));
  const contentVersion = contentHash.slice(0, 16);
  const section = makeSection({
    body,
    contentHash,
    story,
    sourceEndOffset,
    sourceStartOffset,
  });
  const gutenbergId =
    rawText.match(/\[eBook #(\d+)\]/i)?.[1] ??
    rawText.match(/ebooks\/(\d+)/i)?.[1] ??
    null;
  const releaseDate = releaseDateFromRaw(rawText);
  const duplicateReason =
    "Individual Poe story extracted from the current replacement source set; multiple accepted Poe story pages share Project Gutenberg ebook #25525 by design.";
  const rightsNotes =
    "Targeted Poe replacement reconciliation processed this individual story from the audited raw text. Review generated output before any Cloudflare export.";
  const manifest: GeneratedBookManifest = {
    schemaVersion: 1,
    slug: story.slug,
    title: story.title,
    author,
    contentVersion,
    contentHash,
    language: "en",
    description: story.description,
    subjects: story.subjects,
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      releaseDate,
      sourceUrl: gutenbergId ? `https://www.gutenberg.org/ebooks/${gutenbergId}` : null,
      rawTextUrl: null,
      rightsBasis: "public-domain-us",
      rightsReviewed: true,
      publishReady: true,
      rightsStatus: "approved",
      processingAllowed: true,
      approvalSource: "external-authority",
      duplicateResolutionSource: "owner-reviewed",
      rightsReportPath: "rights_report.json",
      processedBookPath: "processed_book.json",
      cleanedBookPath: "cleaned_book.json",
      rightsNotes,
      allowDuplicateGutenbergId: true,
      duplicateReason,
    },
    cover: {
      src: null,
      placeholder: true,
      alt: `Placeholder cover for ${story.title}`,
    },
    stats: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: body.length,
      wordCount: section.wordCount,
      sectionCount: 1,
      includedSectionCount: 1,
    },
    defaults: {
      includeKinds: ["chapter"],
      preferredPreset: "main-narrative",
    },
    sections: [
      {
        id: section.sectionId,
        kind: section.kind,
        label: section.label,
        title: section.title,
        order: section.order,
        includeByDefault: section.includeByDefault,
        sectionJsonPath: "sections/chapter-001.json",
        characterCount: section.characterCount,
        wordCount: section.wordCount,
        estimatedTypingMinutes: section.estimatedTypingMinutes,
        estimatedListeningMinutes: section.estimatedListeningMinutes,
        morseCharacterEstimate: section.morseCharacterEstimate,
        textPreview: section.textPreview,
      },
    ],
    cleaning: {
      originalCharacterCount: rawText.length,
      cleanedCharacterCount: body.length,
      headerStripped: true,
      footerStripped: false,
      confidence: "medium",
      warnings: [
        "Targeted Poe reconciliation used the repeated story-title line as the explicit body boundary.",
        "The extracted individual story file does not include a normal Project Gutenberg start/end marker pair.",
      ],
    },
    warnings: [
      "Generated by targeted Poe replacement reconciliation; review before Cloudflare export.",
      "Local startup preview intentionally stores only starter text, not the full story.",
      duplicateReason,
    ],
  };
  const processedBook = {
    schemaVersion: 1,
    id: story.slug,
    title: story.title,
    author: "Edgar Allan Poe",
    content_version: contentVersion,
    content_hash: contentHash,
    source: {
      name: "Project Gutenberg",
      ebook_number: gutenbergId ?? "",
      source_url: manifest.source.sourceUrl,
      raw_text_url: null,
      original_publication: String(story.originalPublicationYear),
      release_date: releaseDate ?? "",
      last_updated: rawText.match(/Most recently updated:\s*([^\n]+)/i)?.[1]?.trim() ?? "",
    },
    rights: {
      status: "approved",
      approved_for_website: true,
      approved_for_youtube_narration: false,
      approved_regions: ["US"],
      needs_manual_review: false,
      notes: rightsNotes,
    },
    content: {
      chapters: [
        {
          chapter_number: 1,
          title: story.title,
          sections: [
            {
              section_number: 1,
              text: body,
              word_count: section.wordCount,
              character_count: section.characterCount,
              estimated_typing_minutes: section.estimatedTypingMinutes,
              estimated_listening_minutes: section.estimatedListeningMinutes,
            },
          ],
        },
      ],
    },
  };
  const cleanedBook = {
    schemaVersion: 1,
    id: story.slug,
    title: story.title,
    author: "Edgar Allan Poe",
    contentVersion,
    contentHash,
    source: {
      provider: "Project Gutenberg",
      gutenbergId,
      sourceUrl: manifest.source.sourceUrl,
      rawTextUrl: null,
      originalPublication: String(story.originalPublicationYear),
      releaseDate,
      lastUpdated: rawText.match(/Most recently updated:\s*([^\n]+)/i)?.[1]?.trim() ?? "",
    },
    stats: {
      wordCount: section.wordCount,
      characterCount: section.characterCount,
      sectionCount: 1,
      estimatedTypingMinutes: section.estimatedTypingMinutes,
      estimatedListeningMinutes: section.estimatedListeningMinutes,
    },
    sections: [
      {
        id: section.sectionId,
        kind: section.kind,
        label: section.label,
        title: section.title,
        order: section.order,
        includeByDefault: section.includeByDefault,
        text: body,
        paragraphs: section.paragraphs,
        wordCount: section.wordCount,
        characterCount: section.characterCount,
        estimatedTypingMinutes: section.estimatedTypingMinutes,
        estimatedListeningMinutes: section.estimatedListeningMinutes,
      },
    ],
  };
  const rightsReport = makeRightsReport(story, rawText);
  const preview = makePreviewAsset(story, section, contentHash);
  const bookRoot = path.join(generatedRoot, story.slug);
  const sectionRoot = path.join(bookRoot, "sections");
  assertInside(generatedRoot, bookRoot);
  fs.mkdirSync(sectionRoot, { recursive: true });
  writeJson(path.join(bookRoot, "manifest.json"), manifest);
  writeJson(path.join(bookRoot, "cleaned_book.json"), cleanedBook);
  writeJson(path.join(bookRoot, "processed_book.json"), processedBook);
  writeJson(path.join(bookRoot, "rights_report.json"), rightsReport);
  writeJson(path.join(sectionRoot, "chapter-001.json"), section);
  writeText(
    path.join(bookRoot, "processing_notes.md"),
    `# ${story.slug}

Processed by targeted Poe replacement reconciliation.

- Source: app/client/assets/temp-books/${story.fileName}
- Boundary: repeated story-title line followed by readable story text
- Sections after processing: 1
- Local preview: starter text only, roughly 1 KB
- Cloudflare export: not run

This output is intentionally review-gated before Cloudflare export.
`,
  );
  const previewPath = path.join(previewRoot, `${story.slug}.preview.json`);
  writeJson(previewPath, preview);
  const previewBytes = fs.statSync(previewPath).size;

  return {
    body,
    contentHash,
    contentVersion,
    filesChanged: [
      path.join(bookRoot, "manifest.json"),
      path.join(bookRoot, "cleaned_book.json"),
      path.join(bookRoot, "processed_book.json"),
      path.join(bookRoot, "rights_report.json"),
      path.join(bookRoot, "processing_notes.md"),
      path.join(sectionRoot, "chapter-001.json"),
      previewPath,
    ].map(statusPath),
    manifest,
    previewEntry: {
      slug: story.slug,
      path: `/book-previews/${story.slug}.preview.json`,
      contentVersion,
      contentHash,
      defaultSectionId: preview.defaultSectionId,
      previewBytes,
      previewCharacterCount: preview.characterCount,
      estimatedRuntimeSeconds: preview.estimatedRuntimeSeconds,
      truncated: preview.truncated,
    } satisfies PreviewEntry,
    previewPolicy: {
      previewCharacterCount: preview.characterCount,
      previewBytes,
      previewTextWordCount: preview.wordCount,
      truncated: preview.truncated,
    },
    section,
    summaryWordCount: countBookWords(seoSummaryForStory(story)),
  };
}

function removeBroadCollectionArtifacts() {
  const removed: string[] = [];
  for (const slug of broadPoeCollectionSlugs) {
    const generatedDir = path.join(generatedRoot, slug);
    if (fs.existsSync(generatedDir)) {
      fs.rmSync(generatedDir, { recursive: true, force: true });
      removed.push(statusPath(generatedDir));
    }
    const previewPath = path.join(previewRoot, `${slug}.preview.json`);
    if (fs.existsSync(previewPath)) {
      fs.rmSync(previewPath, { force: true });
      removed.push(statusPath(previewPath));
    }
  }
  return removed;
}

function updatePreviewManifest(entries: PreviewEntry[]) {
  const manifest = readJson<{
    version: number;
    assetBasePath: string;
    targetRuntimeSeconds: number;
    books: PreviewEntry[];
    missing: Array<{ slug: string; reason: string }>;
  }>(previewManifestPath);
  const bySlug = new Map(manifest.books.map((entry) => [entry.slug, entry]));
  for (const slug of broadPoeCollectionSlugs) bySlug.delete(slug);
  for (const entry of entries) bySlug.set(entry.slug, entry);
  const existingOrder = manifest.books
    .map((entry) => entry.slug)
    .filter((slug) => !broadPoeCollectionSlugs.includes(slug as (typeof broadPoeCollectionSlugs)[number]));
  const appended = entries.map((entry) => entry.slug).filter((slug) => !existingOrder.includes(slug));
  const ordered = [...existingOrder, ...appended].map((slug) => bySlug.get(slug)).filter(Boolean);
  writeJson(previewManifestPath, {
    ...manifest,
    books: ordered,
    missing: manifest.missing.filter(
      (entry) => !broadPoeCollectionSlugs.includes(entry.slug as (typeof broadPoeCollectionSlugs)[number]),
    ),
  });
}

function updateLibraryManifest(manifests: GeneratedBookManifest[]) {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const bySlug = new Map(library.books.map((book) => [book.slug, book]));
  for (const slug of broadPoeCollectionSlugs) bySlug.delete(slug);
  for (const manifest of manifests) {
    bySlug.set(manifest.slug, {
      slug: manifest.slug,
      title: manifest.title,
      author: manifest.author,
      contentVersion: manifest.contentVersion,
      contentHash: manifest.contentHash,
      language: manifest.language,
      description: manifest.description,
      subjects: manifest.subjects,
      source: manifest.source,
      cover: manifest.cover,
      stats: manifest.stats,
      defaults: manifest.defaults,
      manifestPath: `${manifest.slug}/manifest.json`,
    });
  }
  const existingOrder = library.books
    .map((book) => book.slug)
    .filter((slug) => !broadPoeCollectionSlugs.includes(slug as (typeof broadPoeCollectionSlugs)[number]));
  const appended = manifests.map((manifest) => manifest.slug).filter((slug) => !existingOrder.includes(slug));
  const ordered = [...existingOrder, ...appended].map((slug) => bySlug.get(slug)).filter(Boolean);
  writeJson(libraryManifestPath, {
    schemaVersion: 1,
    books: ordered,
  });
}

function updateSeoSummaries(stories: PoeStory[], newExpectedSummaryCount: number) {
  const data = readJson<SeoSummaryData>(seoSummaryPath);
  const newSlugSet = new Set(stories.map((story) => story.slug));
  const summaries = data.summaries.filter(
    (summary) =>
      !newSlugSet.has(summary.slug) &&
      !broadPoeCollectionSlugs.includes(summary.slug as (typeof broadPoeCollectionSlugs)[number]),
  );
  for (const story of stories) {
    summaries.push({
      slug: story.slug,
      title: story.title,
      author,
      description: story.description,
      summary: seoSummaryForStory(story),
    });
  }
  const substitutions = data.substitutions.map((item) =>
    item.suggestedSlug === "the-tell-tale-heart"
      ? {
          ...item,
          reason:
            "The original pilot used The Masque of the Red Death before the individual Tell-Tale Heart page was generated; the Poe reconciliation now adds The Tell-Tale Heart separately.",
        }
      : item,
  );
  writeJson(seoSummaryPath, {
    ...data,
    summarySet: "poe-replacement-raw-reconciliation",
    generatedAt: "2026-06-28",
    expectedSummaryCount: newExpectedSummaryCount,
    substitutions,
    poeReplacementSlugs: stories.map((story) => story.slug),
    summaries,
  });
}

function rawPoeInventory() {
  const entries = fs
    .readdirSync(tempBooksRoot)
    .filter((name) => name.toLowerCase().endsWith(".txt"))
    .sort((left, right) => left.localeCompare(right))
    .map((name) => {
      const rawText = fs.readFileSync(path.join(tempBooksRoot, name), "utf8");
      return {
        name,
        title: extractHeaderValue(rawText, "Title") ?? name.replace(/\.txt$/i, ""),
        author: extractHeaderValue(rawText, "Author"),
        gutenbergId:
          rawText.match(/\[eBook #(\d+)\]/i)?.[1] ??
          rawText.match(/ebooks\/(\d+)/i)?.[1] ??
          null,
        bytes: fs.statSync(path.join(tempBooksRoot, name)).size,
      };
    });
  return entries.filter((entry) => entry.author === "Edgar Allan Poe");
}

function generatedPoeEntries(library: GeneratedLibraryManifest) {
  return library.books
    .filter((book) => book.author.includes("Edgar Allan Poe"))
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      author: book.author,
      manifestPath: book.manifestPath,
      sourceUrl: book.source.sourceUrl,
      gutenbergId: book.source.gutenbergId,
    }));
}

function makeMarkdownReport(report: Record<string, unknown>) {
  const selected = report.newIndividualPoeStoriesAcceptedGenerated as Array<{ slug: string; title: string }>;
  const already = report.poeStoriesAlreadyPresentLeftUntouched as Array<{ slug: string; title: string }>;
  const skipped = report.poeFilesSkippedOrManualReview as Array<{ fileName: string; reason: string }>;
  return `# Poe Replacement Raw Reconciliation

## Counts

- Previous generated count: ${report.previousGeneratedCount}
- New generated count: ${report.newGeneratedCount}
- Previous SEO summary count: ${report.previousSeoSummaryCount}
- Summaries removed with broad Poe entries: ${report.summariesRemovedWithBroadPoeEntries}
- Summaries added for new Poe entries: ${report.summariesAddedForNewPoeEntries}
- New SEO summary count: ${report.newSeoSummaryCount}
- Missing summaries after branch: ${report.missingSummaryCountAfterBranch}

## Broad Poe Collections

- Found in generated output: ${(report.broadPoeCollectionEntriesFound as string[]).join(", ") || "none"}
- Removed from generated output: ${(report.broadPoeCollectionEntriesRemoved as string[]).join(", ") || "none"}
- Raw broad collection files absent from current temp-books: ${(report.rawPoeFilesRemovedSinceLastTriage as string[]).join(", ") || "none"}

## New Poe Stories

${selected.map((item) => `- ${item.slug}: ${item.title}`).join("\n")}

## Already Present

${already.map((item) => `- ${item.slug}: ${item.title}`).join("\n") || "- None"}

## Skipped Or Manual Review

${skipped.map((item) => `- ${item.fileName}: ${item.reason}`).join("\n") || "- None"}

## Preview Policy

- New/changed preview policy: starter text only, roughly around 1 KB where practical.
- Existing preview/loading architecture blocker: ${report.existingPreviewLoadingArchitectureBlockerFound ? "yes" : "no"}
- Blocker note: ${report.existingPreviewLoadingArchitectureBlockerNote}

## Checkpoints

- Remaining raw-candidate checkpoint: ${report.remainingRawCandidateCheckpoint}
- Unresolved-source generated-book checkpoint: ${report.unresolvedSourceGeneratedBookCheckpoint}
- URL/page/indexability blocker: ${report.urlPageIndexabilityBlockerCheckpoint}
- Cloudflare export checkpoint: ${report.cloudflareExportCheckpoint}
- Mobile final-stage checkpoint: ${report.mobileFinalStageCheckpoint}

## Recommended Next Major Phase

Do not start export yet. Next major phase should handle remaining raw-candidate review and unresolved-source generated-book review.

## Validation Results

${JSON.stringify(report.validationResults, null, 2)}
`;
}

function refreshSummariesOnly() {
  const library = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  updateSeoSummaries(poeStories, library.books.length);
  const reportPath = path.join(reportRoot, "poe-replacement-raw-reconciliation.json");
  if (fs.existsSync(reportPath)) {
    const report = readJson<Record<string, unknown>>(reportPath);
    const wordCounts = new Map(
      poeStories.map((story) => [story.slug, countBookWords(seoSummaryForStory(story))]),
    );
    report.newIndividualPoeStoriesAcceptedGenerated = (
      report.newIndividualPoeStoriesAcceptedGenerated as Array<Record<string, unknown>>
    ).map((item) => ({
      ...item,
      summaryWordCount: wordCounts.get(String(item.slug)) ?? item.summaryWordCount,
    }));
    writeJson(reportPath, report);
    writeText(
      path.join(reportRoot, "poe-replacement-raw-reconciliation.md"),
      makeMarkdownReport(report),
    );
  }
  console.log("Refreshed Poe summary text and report word counts.");
}

function main() {
  if (process.argv.includes("--refresh-summaries-only")) {
    refreshSummariesOnly();
    return;
  }

  const rawPoeFiles = rawPoeInventory();
  const libraryBefore = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  const seoBefore = readJson<SeoSummaryData>(seoSummaryPath);
  const previewBefore = readJson<{ books: PreviewEntry[] }>(previewManifestPath);
  const broadFound = broadPoeCollectionSlugs.filter(
    (slug) =>
      libraryBefore.books.some((book) => book.slug === slug) ||
      fs.existsSync(path.join(generatedRoot, slug)) ||
      fs.existsSync(path.join(previewRoot, `${slug}.preview.json`)) ||
      seoBefore.summaries.some((summary) => summary.slug === slug) ||
      previewBefore.books.some((entry) => entry.slug === slug),
  );
  const rawBroadAbsent = broadPoeRawFileNames.filter(
    (fileName) => !fs.existsSync(path.join(tempBooksRoot, fileName)),
  );
  const alreadyPresent = libraryBefore.books
    .filter((book) => book.author.includes("Edgar Allan Poe"))
    .map((book) => ({ slug: book.slug, title: book.title }));
  const existingSlugSet = new Set(libraryBefore.books.map((book) => book.slug));
  const selectedStories = poeStories.filter((story) => !existingSlugSet.has(story.slug));
  const skipped = poeStories
    .filter((story) => existingSlugSet.has(story.slug))
    .map((story) => ({
      fileName: story.fileName,
      reason: `generated slug ${story.slug} already exists; left untouched`,
    }));

  const removedArtifacts = removeBroadCollectionArtifacts();
  const generated = selectedStories.map(writeGeneratedStory);
  updateLibraryManifest(generated.map((item) => item.manifest));
  updatePreviewManifest(generated.map((item) => item.previewEntry));

  const libraryAfter = readJson<GeneratedLibraryManifest>(libraryManifestPath);
  updateSeoSummaries(selectedStories, libraryAfter.books.length);
  const seoAfter = readJson<SeoSummaryData>(seoSummaryPath);
  const generatedSlugSet = new Set(libraryAfter.books.map((book) => book.slug));
  const summarySlugSet = new Set(seoAfter.summaries.map((summary) => summary.slug));
  const missingSummarySlugs = libraryAfter.books
    .filter((book) => book.source.publishReady && book.source.rightsStatus === "approved")
    .map((book) => book.slug)
    .filter((slug) => !summarySlugSet.has(slug));
  const newPreviewPolicy = Object.fromEntries(
    generated.map((item) => [item.manifest.slug, item.previewPolicy]),
  );
  const report = {
    schemaVersion: 1,
    reportName: "poe-replacement-raw-reconciliation",
    generatedAt: new Date().toISOString(),
    branch: "morsewords-poe-replacement-raw-reconciliation-jun-2026",
    sourcePaths: {
      rawInput: "app/client/assets/temp-books",
      generatedLibrary: "app/client/assets/books/generated",
      libraryManifest: "app/client/assets/books/generated/library-manifest.json",
      seoSummaries: "app/client/assets/books/seo-summaries/book-seo-summaries.json",
      previews: "public/book-previews",
    },
    previousGeneratedCount: libraryBefore.books.length,
    broadPoeCollectionEntriesFound: broadFound,
    broadPoeCollectionEntriesRemoved: removedArtifacts,
    rawPoeFilesCurrentlyPresentInTempBooks: rawPoeFiles,
    rawPoeFilesRemovedSinceLastTriage: rawBroadAbsent,
    generatedPoeEntriesBefore: generatedPoeEntries(libraryBefore),
    generatedPoeEntriesAfter: generatedPoeEntries(libraryAfter),
    individualPoeShortStoriesAlreadyGeneratedBefore: alreadyPresent,
    newIndividualPoeRawFilesDetected: selectedStories.map((story) => ({
      fileName: story.fileName,
      slug: story.slug,
      title: story.title,
    })),
    newIndividualPoeStoriesAcceptedGenerated: generated.map((item) => ({
      slug: item.manifest.slug,
      title: item.manifest.title,
      wordCount: item.section.wordCount,
      characterCount: item.section.characterCount,
      previewCharacterCount: item.previewPolicy.previewCharacterCount,
      previewBytes: item.previewPolicy.previewBytes,
      summaryWordCount: item.summaryWordCount,
    })),
    poeStoriesAlreadyPresentLeftUntouched: alreadyPresent,
    poeFilesSkippedOrManualReview: skipped,
    duplicateOrConflictingPoeSlugs: [],
    nonPoeRavenFileNote:
      "Current temp-books/THE RAVEN.txt is Grimms' Fairy Tales by Jacob Grimm and Wilhelm Grimm, not Edgar Allan Poe; existing generated the-raven remains the Grimm story.",
    newGeneratedCount: libraryAfter.books.length,
    previousSeoSummaryCount: seoBefore.summaries.length,
    summariesRemovedWithBroadPoeEntries:
      seoBefore.summaries.length -
      seoBefore.summaries.filter(
        (summary) => !broadPoeCollectionSlugs.includes(summary.slug as (typeof broadPoeCollectionSlugs)[number]),
      ).length,
    summariesAddedForNewPoeEntries: selectedStories.length,
    newSeoSummaryCount: seoAfter.summaries.length,
    missingSummaryCountAfterBranch: missingSummarySlugs.length,
    missingSummarySlugsAfterBranch: missingSummarySlugs,
    previewSizePolicyResultForNewChangedEntries: newPreviewPolicy,
    existingPreviewLoadingArchitectureBlockerFound: true,
    existingPreviewLoadingArchitectureBlockerNote:
      "Existing broad preview builder/audit defaults still target long local previews (3600 seconds). This branch writes small starter previews only for new Poe entries and does not rewrite the global preview/loading architecture.",
    remainingRawCandidateCheckpoint:
      "44 prior tracked raw candidates still require later review after the two broad Poe collection raw files were removed from current temp-books; newly accepted Poe individual stories are generated in this branch.",
    unresolvedSourceGeneratedBookCheckpoint:
      "11 unresolved-source generated books remain documented and were not processed in this branch.",
    urlPageIndexabilityBlockerCheckpoint:
      "URL/page/indexability/planned-page implementation remains a final-release blocker; no planned URL policy work was started.",
    cloudflareExportCheckpoint:
      "Cloudflare export was not run and app/client/assets/books/cloudflare-export remains outside this branch's changes.",
    mobileFinalStageCheckpoint:
      "Broad mobile optimization remains the very last stage and was not started.",
    filesChangedByScript: [
      ...generated.flatMap((item) => item.filesChanged),
      statusPath(libraryManifestPath),
      statusPath(previewManifestPath),
      statusPath(seoSummaryPath),
      ...removedArtifacts,
    ].sort((left, right) => left.localeCompare(right)),
    validationResults: {
      status: "pending",
      note: "Updated after Part 7 validation commands complete.",
    },
    recommendedNextMajorPhase: [
      "Do not start export yet.",
      "Next major phase should handle remaining raw-candidate review.",
      "Next major phase should handle unresolved-source generated-book review.",
    ],
    invariants: {
      allGeneratedSlugsExistInManifest: selectedStories.every((story) => generatedSlugSet.has(story.slug)),
      allNewSummarySlugsExistInGeneratedManifest: selectedStories.every((story) => generatedSlugSet.has(story.slug)),
      allNewSummariesPresent: selectedStories.every((story) => summarySlugSet.has(story.slug)),
      cloudflareExportNotTouched: true,
    },
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  writeJson(path.join(reportRoot, "poe-replacement-raw-reconciliation.json"), report);
  writeText(
    path.join(reportRoot, "poe-replacement-raw-reconciliation.md"),
    makeMarkdownReport(report),
  );

  console.log(`Poe raw files authored by Poe: ${rawPoeFiles.length}`);
  console.log(`Generated Poe stories added: ${selectedStories.length}`);
  console.log(`Generated count: ${libraryBefore.books.length} -> ${libraryAfter.books.length}`);
  console.log(`SEO summaries: ${seoBefore.summaries.length} -> ${seoAfter.summaries.length}`);
  console.log(`Missing summaries after branch: ${missingSummarySlugs.length}`);
  console.log(`Report: ${statusPath(path.join(reportRoot, "poe-replacement-raw-reconciliation.json"))}`);
}

main();
