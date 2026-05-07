export type Difficulty = "easy" | "medium" | "hard";

export type SentenceDrill = {
  text: string;
  difficulty: Difficulty;
  focus: string;
  note: string;
};

export type PracticeSet = {
  title: string;
  description: string;
  items: string[];
};

export const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

export const sentenceDrills: SentenceDrill[] = [
  {
    text: "I CAN COPY MORSE CODE NOW",
    difficulty: "easy",
    focus: "Beginner confidence",
    note: "A simple full sentence with short words and a clear ending.",
  },
  {
    text: "PLEASE SEND THE MESSAGE AGAIN",
    difficulty: "easy",
    focus: "Repeat request",
    note: "Useful for practicing a complete polite request instead of a short phrase.",
  },
  {
    text: "THE SIGNAL IS CLEAR TODAY",
    difficulty: "easy",
    focus: "Plain language",
    note: "A practical sentence with familiar words and steady spacing.",
  },
  {
    text: "I AM READY TO COPY",
    difficulty: "easy",
    focus: "Copy practice",
    note: "A short complete sentence that works well for early sentence drills.",
  },
  {
    text: "WE CAN START THE PRACTICE",
    difficulty: "easy",
    focus: "Practice setup",
    note: "Good for training word gaps in a natural five-word sentence.",
  },
  {
    text: "SEND THE WORDS MORE SLOWLY",
    difficulty: "easy",
    focus: "Speed control",
    note: "A realistic request that helps learners practice sentence rhythm.",
  },
  {
    text: "MY RADIO IS WORKING WELL",
    difficulty: "easy",
    focus: "Station update",
    note: "Simple vocabulary with a complete subject and action.",
  },
  {
    text: "YOUR MESSAGE WAS EASY TO COPY",
    difficulty: "easy",
    focus: "Feedback sentence",
    note: "A useful sentence for practicing common communication feedback.",
  },
  {
    text: "THE WEATHER IS GOOD HERE",
    difficulty: "easy",
    focus: "Everyday sentence",
    note: "Common conversation content with clear word boundaries.",
  },
  {
    text: "I WILL SEND IT AGAIN",
    difficulty: "easy",
    focus: "Repeat action",
    note: "Short and natural, with enough words to practice sentence spacing.",
  },
  {
    text: "THIS IS A SHORT TEST",
    difficulty: "easy",
    focus: "Basic test sentence",
    note: "A compact sentence that helps beginners focus on clean spacing.",
  },
  {
    text: "WE ARE LEARNING MORSE CODE",
    difficulty: "easy",
    focus: "Training sentence",
    note: "A natural learning sentence with common words and predictable rhythm.",
  },
  {
    text: "THE NEXT WORD IS READY",
    difficulty: "easy",
    focus: "Instruction sentence",
    note: "Good for drilling a simple sentence with a clear structure.",
  },
  {
    text: "PLEASE COPY THIS SHORT MESSAGE",
    difficulty: "easy",
    focus: "Copy instruction",
    note: "Practical training language for sending or decoding a full sentence.",
  },
  {
    text: "I HEAR YOUR SIGNAL NOW",
    difficulty: "easy",
    focus: "Signal copy",
    note: "A complete sentence that introduces signal language without being too hard.",
  },
  {
    text: "THE CALL SIGN IS CORRECT",
    difficulty: "easy",
    focus: "Call sign confirmation",
    note: "Useful for basic radio-contact style practice.",
  },
  {
    text: "WE WILL TRY AGAIN SOON",
    difficulty: "easy",
    focus: "Plain conversation",
    note: "A normal sentence with short words and a steady rhythm.",
  },
  {
    text: "THE TONE SOUNDS CLEAR",
    difficulty: "easy",
    focus: "Audio description",
    note: "Helpful for practicing common listening and tone-related words.",
  },
  {
    text: "PLEASE CHECK YOUR ANSWER",
    difficulty: "easy",
    focus: "Training instruction",
    note: "A practical classroom-style sentence for Morse practice pages.",
  },
  {
    text: "I NEED MORE PRACTICE",
    difficulty: "easy",
    focus: "Learner sentence",
    note: "Short enough for beginners while still being a proper sentence.",
  },

  {
    text: "CALLING ANY STATION ON THIS FREQUENCY",
    difficulty: "medium",
    focus: "Calling sentence",
    note: "A realistic radio sentence with several longer words and clear word gaps.",
  },
  {
    text: "YOUR CALL SIGN WAS COPIED CORRECTLY",
    difficulty: "medium",
    focus: "Contact flow",
    note: "Useful for practicing a full confirmation sentence during copy drills.",
  },
  {
    text: "THE BAND CONDITIONS ARE GOOD TONIGHT",
    difficulty: "medium",
    focus: "Radio conditions",
    note: "Adds longer vocabulary while keeping the sentence natural and practical.",
  },
  {
    text: "I AM OPERATING FROM MY HOME STATION",
    difficulty: "medium",
    focus: "Station detail",
    note: "A practical operating sentence with a mix of short and medium-length words.",
  },
  {
    text: "PLEASE MOVE TO A CLEAR FREQUENCY",
    difficulty: "medium",
    focus: "Frequency change",
    note: "Good for practicing instructions that include multiple word boundaries.",
  },
  {
    text: "THE MESSAGE CONTAINS FIVE WORDS",
    difficulty: "medium",
    focus: "Number context",
    note: "Introduces a number word inside a full sentence without making it too complex.",
  },
  {
    text: "MY ANTENNA IS WORKING BETTER TODAY",
    difficulty: "medium",
    focus: "Equipment update",
    note: "A complete equipment-related sentence with slightly harder word shapes.",
  },
  {
    text: "I MISSED THE LAST TWO WORDS",
    difficulty: "medium",
    focus: "Copy correction",
    note: "A realistic sentence for practicing copy recovery and repeat requests.",
  },
  {
    text: "YOUR SIGNAL REPORT IS FIVE NINE",
    difficulty: "medium",
    focus: "Signal report",
    note: "A practical report sentence with repeated word spacing and radio vocabulary.",
  },
  {
    text: "PLEASE STAND BY FOR MY NEXT CALL",
    difficulty: "medium",
    focus: "Operating instruction",
    note: "Useful for training sentence rhythm in a common operating instruction.",
  },
  {
    text: "THE STATION IS LOCATED NEAR TORONTO",
    difficulty: "medium",
    focus: "Location sentence",
    note: "Adds a place name while keeping the overall sentence structure readable.",
  },
  {
    text: "I WILL SEND THE DETAILS SLOWLY",
    difficulty: "medium",
    focus: "Detail sending",
    note: "Good for practicing a natural sentence used before transmitting information.",
  },
  {
    text: "THE OPERATOR ASKED FOR A REPEAT",
    difficulty: "medium",
    focus: "Plain copy",
    note: "A complete sentence with a clear subject, verb, and object.",
  },
  {
    text: "WE ARE TESTING THE NEW ANTENNA",
    difficulty: "medium",
    focus: "Equipment test",
    note: "A practical radio sentence with medium-length words and steady rhythm.",
  },
  {
    text: "THE AUDIO TONE IS TOO FAST",
    difficulty: "medium",
    focus: "Speed feedback",
    note: "Good for practicing feedback sentences related to Morse listening.",
  },
  {
    text: "I CAN COPY MOST OF THE MESSAGE",
    difficulty: "medium",
    focus: "Partial copy",
    note: "A realistic learning sentence for describing imperfect copy.",
  },
  {
    text: "PLEASE CONFIRM THE TIME AND DATE",
    difficulty: "medium",
    focus: "Confirmation request",
    note: "A clear request sentence that trains several common service words.",
  },
  {
    text: "THE FIRST SENTENCE WAS SENT CLEANLY",
    difficulty: "medium",
    focus: "Sentence feedback",
    note: "Useful for sentence-level practice because it directly references clean sending.",
  },
  {
    text: "I WILL LISTEN BEFORE I TRANSMIT",
    difficulty: "medium",
    focus: "Operating discipline",
    note: "A practical full sentence with a helpful operating habit.",
  },
  {
    text: "THE PRACTICE SESSION IS GOING WELL",
    difficulty: "medium",
    focus: "Training progress",
    note: "A natural practice sentence with longer word spacing demands.",
  },
  {
    text: "YOUR SPACING BETWEEN WORDS IS CLEAR",
    difficulty: "medium",
    focus: "Spacing feedback",
    note: "Directly helps learners focus on the key sentence Morse skill.",
  },
  {
    text: "THE NEXT MESSAGE WILL BE LONGER",
    difficulty: "medium",
    focus: "Progression sentence",
    note: "A useful bridge from short beginner sentences into harder drills.",
  },
  {
    text: "I AM SENDING THIS AT LOW SPEED",
    difficulty: "medium",
    focus: "Speed control",
    note: "Good for practicing a normal sentence with several short connector words.",
  },
  {
    text: "THE RECEIVED TEXT MATCHES THE MESSAGE",
    difficulty: "medium",
    focus: "Accuracy check",
    note: "A practical sentence for checking copied Morse against the original text.",
  },

  {
    text: "THE SIGNAL IS FADING IN AND OUT TONIGHT",
    difficulty: "hard",
    focus: "Changing signal",
    note: "Harder because the sentence is longer and easy to collapse without clean spacing.",
  },
  {
    text: "IS THIS FREQUENCY CURRENTLY IN USE",
    difficulty: "hard",
    focus: "Frequency check",
    note: "A realistic operating question with multiple medium-length words.",
  },
  {
    text: "I AM LISTENING FOR WEAK SIGNALS THROUGH THE NOISE",
    difficulty: "hard",
    focus: "Weak signal copy",
    note: "A longer sentence that trains focus across several natural word groups.",
  },
  {
    text: "THE ANTENNA NEEDS CAREFUL ADJUSTMENT BEFORE TRANSMITTING",
    difficulty: "hard",
    focus: "Equipment sentence",
    note: "Longer vocabulary makes this useful after medium drills feel comfortable.",
  },
  {
    text: "INTERFERENCE FROM THE POWER LINE IS MAKING COPY DIFFICULT",
    difficulty: "hard",
    focus: "Problem report",
    note: "A realistic troubleshooting sentence with difficult word shapes and spacing.",
  },
  {
    text: "PLEASE REPEAT THE LAST PART OF YOUR TRANSMISSION",
    difficulty: "hard",
    focus: "Repeat request",
    note: "A practical longer request that is useful in real Morse exchanges.",
  },
  {
    text: "THE OPERATOR CHANGED SPEED DURING THE MESSAGE",
    difficulty: "hard",
    focus: "Speed variation",
    note: "Good for practicing longer sentence copy while tracking meaning.",
  },
  {
    text: "WE SHOULD REDUCE THE SPEED UNTIL THE COPY IS CLEAN",
    difficulty: "hard",
    focus: "Training advice",
    note: "A complete sentence with several short words that require accurate spacing.",
  },
  {
    text: "THE FIRST HALF OF THE MESSAGE WAS MUCH EASIER",
    difficulty: "hard",
    focus: "Copy comparison",
    note: "Useful for practicing natural sentence structure with a comparative idea.",
  },
  {
    text: "I CAN COPY THE WORDS BUT MISS THE SPACES",
    difficulty: "hard",
    focus: "Spacing weakness",
    note: "A sentence specifically designed to train word gaps and spacing awareness.",
  },
  {
    text: "THE STATION WAS TRANSMITTING FROM A PORTABLE LOCATION",
    difficulty: "hard",
    focus: "Portable operation",
    note: "Longer words create a harder rhythm while remaining realistic.",
  },
  {
    text: "PLEASE SEND THE CALL SIGN AGAIN AT A LOWER SPEED",
    difficulty: "hard",
    focus: "Call sign repeat",
    note: "A longer practical request with several common Morse operating words.",
  },
  {
    text: "THE WEATHER REPORT WAS COPIED WITHOUT ANY ERRORS",
    difficulty: "hard",
    focus: "Report copy",
    note: "A natural sentence that combines everyday content with copy accuracy.",
  },
  {
    text: "I LOST THE WORD BREAKS NEAR THE END OF THE SENTENCE",
    difficulty: "hard",
    focus: "Word breaks",
    note: "Targets the exact problem many learners face when decoding long Morse sentences.",
  },
  {
    text: "THE MESSAGE SHOULD BE SENT WITH CONSISTENT TIMING",
    difficulty: "hard",
    focus: "Timing control",
    note: "A useful advanced practice sentence for rhythm and clean transmission.",
  },
  {
    text: "YOUR TRANSMISSION WAS STRONG BUT THE SPACING WAS UNEVEN",
    difficulty: "hard",
    focus: "Transmission feedback",
    note: "A realistic feedback sentence with several longer words.",
  },
  {
    text: "THE EMERGENCY MESSAGE MUST BE COPIED EXACTLY AS SENT",
    difficulty: "hard",
    focus: "Accurate copy",
    note: "A serious full sentence that emphasizes careful decoding and exact copying.",
  },
  {
    text: "I WILL RECORD THE AUDIO AND CHECK THE COPY LATER",
    difficulty: "hard",
    focus: "Review workflow",
    note: "Good for practicing longer sentence meaning across multiple clauses.",
  },
  {
    text: "THE PRACTICE DRILL INCLUDES NUMBERS WORDS AND SPACING",
    difficulty: "hard",
    focus: "Mixed drill",
    note: "Longer sentence structure with multiple key Morse learning concepts.",
  },
  {
    text: "PLEASE CONFIRM WHETHER THE COMPLETE MESSAGE WAS RECEIVED",
    difficulty: "hard",
    focus: "Confirmation request",
    note: "A practical confirmation sentence with longer vocabulary.",
  },
  {
    text: "THE FINAL SENTENCE SHOULD BE COPIED WITHOUT LOOKING",
    difficulty: "hard",
    focus: "Memory challenge",
    note: "A good final drill because it requires confidence with full-sentence rhythm.",
  },
  {
    text: "WE ARE PRACTICING LONGER SENTENCES TO IMPROVE COPY SPEED",
    difficulty: "hard",
    focus: "Training purpose",
    note: "A natural advanced sentence that matches the intent of this page.",
  },
  {
    text: "THE RECEIVER PICKED UP A WEAK SIGNAL AFTER SUNSET",
    difficulty: "hard",
    focus: "Receiver sentence",
    note: "A realistic radio sentence with harder vocabulary and clear meaning.",
  },
  {
    text: "I NEED TO CHECK THE LOG BEFORE I SEND THE REPORT",
    difficulty: "hard",
    focus: "Operating workflow",
    note: "A practical longer sentence that still uses plain words.",
  },
  {
    text: "THE LAST TRANSMISSION INCLUDED A MISTAKE IN THE CALL SIGN",
    difficulty: "hard",
    focus: "Error correction",
    note: "Good for practicing a complete correction sentence with many word breaks.",
  },
];

export const commonPracticeSets: PracticeSet[] = [
  {
    title: "Beginner sentence set",
    description:
      "Use this set when you are moving from individual Morse words into complete sentences.",
    items: [
      "I CAN COPY MORSE CODE NOW",
      "I AM READY TO COPY",
      "THIS IS A SHORT TEST",
      "WE ARE LEARNING MORSE CODE",
      "PLEASE COPY THIS SHORT MESSAGE",
      "I NEED MORE PRACTICE",
    ],
  },
  {
    title: "Everyday plain-language set",
    description:
      "Simple complete sentences that help learners practice meaning, rhythm, and word spacing.",
    items: [
      "THE WEATHER IS GOOD HERE",
      "WE WILL TRY AGAIN SOON",
      "I WILL SEND IT AGAIN",
      "THE NEXT WORD IS READY",
      "PLEASE CHECK YOUR ANSWER",
      "THE TONE SOUNDS CLEAR",
    ],
  },
  {
    title: "Radio contact set",
    description:
      "A practical set for common QSO-style sentence patterns and simple contact flow.",
    items: [
      "CALLING ANY STATION ON THIS FREQUENCY",
      "YOUR CALL SIGN WAS COPIED CORRECTLY",
      "I AM OPERATING FROM MY HOME STATION",
      "THE STATION IS LOCATED NEAR TORONTO",
      "PLEASE STAND BY FOR MY NEXT CALL",
      "PLEASE SEND THE CALL SIGN AGAIN AT A LOWER SPEED",
    ],
  },
  {
    title: "Signal report set",
    description:
      "Use this set to practice sentences with reports, changing conditions, and received-signal feedback.",
    items: [
      "YOUR SIGNAL REPORT IS FIVE NINE",
      "THE SIGNAL IS CLEAR TODAY",
      "THE BAND CONDITIONS ARE GOOD TONIGHT",
      "THE SIGNAL IS FADING IN AND OUT TONIGHT",
      "I AM LISTENING FOR WEAK SIGNALS THROUGH THE NOISE",
      "YOUR TRANSMISSION WAS STRONG BUT THE SPACING WAS UNEVEN",
    ],
  },
  {
    title: "Spacing control set",
    description:
      "A focused set for hearing and preserving the difference between letters, words, and full sentences.",
    items: [
      "SEND THE WORDS MORE SLOWLY",
      "YOUR MESSAGE WAS EASY TO COPY",
      "I MISSED THE LAST TWO WORDS",
      "YOUR SPACING BETWEEN WORDS IS CLEAR",
      "I CAN COPY THE WORDS BUT MISS THE SPACES",
      "I LOST THE WORD BREAKS NEAR THE END OF THE SENTENCE",
    ],
  },
  {
    title: "Copy recovery set",
    description:
      "Practice realistic sentences for asking someone to repeat, slow down, or confirm a message.",
    items: [
      "PLEASE SEND THE MESSAGE AGAIN",
      "I WILL SEND THE DETAILS SLOWLY",
      "THE OPERATOR ASKED FOR A REPEAT",
      "PLEASE REPEAT THE LAST PART OF YOUR TRANSMISSION",
      "PLEASE CONFIRM THE TIME AND DATE",
      "PLEASE CONFIRM WHETHER THE COMPLETE MESSAGE WAS RECEIVED",
    ],
  },
  {
    title: "Equipment and station set",
    description:
      "Sentence drills built around antennas, radios, receivers, and station operation.",
    items: [
      "MY RADIO IS WORKING WELL",
      "MY ANTENNA IS WORKING BETTER TODAY",
      "WE ARE TESTING THE NEW ANTENNA",
      "THE ANTENNA NEEDS CAREFUL ADJUSTMENT BEFORE TRANSMITTING",
      "THE STATION WAS TRANSMITTING FROM A PORTABLE LOCATION",
      "THE RECEIVER PICKED UP A WEAK SIGNAL AFTER SUNSET",
    ],
  },
  {
    title: "Advanced long-sentence set",
    description:
      "Longer sentence drills for learners who can already copy short sentences reliably.",
    items: [
      "WE SHOULD REDUCE THE SPEED UNTIL THE COPY IS CLEAN",
      "THE MESSAGE SHOULD BE SENT WITH CONSISTENT TIMING",
      "THE EMERGENCY MESSAGE MUST BE COPIED EXACTLY AS SENT",
      "I WILL RECORD THE AUDIO AND CHECK THE COPY LATER",
      "THE PRACTICE DRILL INCLUDES NUMBERS WORDS AND SPACING",
      "WE ARE PRACTICING LONGER SENTENCES TO IMPROVE COPY SPEED",
    ],
  },
];

export const spacingExamples = [
  {
    label: "Inside a letter",
    plain: "S",
    explanation:
      "Dots and dashes inside one character stay close together. S is three dits: ...",
  },
  {
    label: "Between letters",
    plain: "SOS",
    explanation:
      "Letters need a clear letter gap. SOS is S, then O, then S, not one long symbol.",
  },
  {
    label: "Between words",
    plain: "SEND HELP",
    explanation:
      "Words need a larger gap so the listener hears two separate words instead of one run-on group.",
  },
  {
    label: "Across a sentence",
    plain: "PLEASE SEND HELP",
    explanation:
      "A sentence needs both letter gaps and word gaps. The goal is to preserve the full meaning, not just identify individual characters.",
  },
];

export const faqItems = [
  {
    q: "What is Morse code sentence practice for?",
    a: "Sentence practice helps you move from isolated characters and words into full-message flow. It trains word gaps, phrase rhythm, and meaning across a complete prompt.",
  },
  {
    q: "Should I practice words before sentences?",
    a: "Yes, if single words still feel slow. Use the word trainer first, then move to sentence practice when short words are readable enough to combine into phrases.",
  },
  {
    q: "Does sentence practice help with real messages?",
    a: "Yes. Real Morse messages depend on context, word spacing, and steady rhythm. Sentence drills make those skills visible in a way single-character practice cannot.",
  },
  {
    q: "How is sentence practice different from the word trainer?",
    a: "The word trainer repeats individual words and weak vocabulary. Sentence practice adds complete phrases, word boundaries, punctuation-like spacing decisions, and longer memory load.",
  },
  {
    q: "What should I use after sentence practice?",
    a: "Move to audio practice when you want to hear full messages, or use the decoder and word separator pages when spacing in pasted Morse is the main problem.",
  },
];
