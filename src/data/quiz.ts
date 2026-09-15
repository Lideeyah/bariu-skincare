export type QuizOption = {
  value: string;
  label: string;
  isOther?: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  /** Optional free-text follow-up shown under the question, e.g. "If yes, what do you use?" */
  followUp?: {
    id: string;
    prompt: string;
    options: QuizOption[];
    /** Only show the follow-up when the parent answer excludes these option values */
    hideWhenAnswerIncludesAny: string[];
  };
};

export type QuizSection = {
  id: string;
  title: string;
  questions: QuizQuestion[];
};

export const quizSections: QuizSection[] = [
  {
    id: "sweat-heat-humidity",
    title: "Sweat, Heat & Humidity",
    questions: [
      {
        id: "q1",
        prompt: "How much do you sweat on a normal day, even when you aren't exercising?",
        options: [
          { value: "very-heavily", label: "Very heavily" },
          { value: "heavily", label: "Heavily" },
          { value: "moderately", label: "Moderately" },
          { value: "a-little", label: "A little" },
          { value: "almost-never", label: "Almost never" },
        ],
      },
      {
        id: "q2",
        prompt: "Where do you sweat the most?",
        options: [
          { value: "forehead", label: "Forehead" },
          { value: "nose-upper-lip", label: "Nose/upper lip" },
          { value: "entire-face", label: "Entire face" },
          { value: "scalp-hairline", label: "Scalp/hairline" },
          { value: "neck", label: "Neck" },
          { value: "chest", label: "Chest" },
          { value: "back", label: "Back" },
          { value: "underarms", label: "Underarms" },
          { value: "hands", label: "Hands" },
          { value: "everywhere", label: "Everywhere" },
          { value: "other", label: "Other", isOther: true },
        ],
      },
      {
        id: "q3",
        prompt:
          "Does your face become noticeably oily after you sweat, or does it mostly just feel wet?",
        options: [
          { value: "very-oily", label: "Very oily" },
          { value: "somewhat-oily", label: "Somewhat oily" },
          { value: "mostly-wet", label: "Mostly just wet" },
          { value: "neither", label: "Neither" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "q4",
        prompt: "How quickly does your face start sweating after washing it?",
        options: [
          { value: "within-15", label: "Within 15 minutes" },
          { value: "within-30", label: "Within 30 minutes" },
          { value: "within-1-2-hours", label: "Within 1–2 hours" },
          { value: "only-outdoors-active", label: "Only after being outdoors/active" },
          { value: "varies", label: "It varies" },
        ],
      },
      {
        id: "q5",
        prompt: "What usually makes you sweat?",
        options: [
          { value: "lagos-heat", label: "Lagos heat" },
          { value: "walking", label: "Walking" },
          { value: "public-transportation", label: "Public transportation" },
          { value: "crowded-places", label: "Crowded places" },
          { value: "exercise-sports", label: "Exercise/sports" },
          { value: "stress-anxiety", label: "Stress/anxiety" },
          { value: "spicy-hot-food", label: "Spicy/hot food" },
          { value: "almost-anything", label: "Almost anything" },
          { value: "other", label: "Other", isOther: true },
        ],
      },
      {
        id: "q6",
        prompt: "What happens to your skin after you've been sweating for several hours?",
        options: [
          { value: "more-pimples", label: "More pimples" },
          { value: "more-tiny-bumps", label: "More tiny bumps" },
          { value: "more-blackheads-blocked-pores", label: "More blackheads/blocked pores" },
          { value: "itching", label: "Itching" },
          { value: "burning-stinging", label: "Burning/stinging" },
          { value: "redness", label: "Redness" },
          { value: "nothing-noticeable", label: "Nothing noticeable" },
          { value: "not-sure", label: "Not sure" },
        ],
      },
      {
        id: "q7",
        prompt:
          "Do you ever get pimples or bumps on your chest, shoulders, back, or neck after sweating?",
        options: [
          { value: "frequently", label: "Frequently" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
      },
      {
        id: "q8",
        prompt: "Do you stay in sweaty clothes for a long time after exercising or being outdoors?",
        options: [
          { value: "frequently", label: "Frequently" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
      },
      {
        id: "q9",
        prompt: "Do you wipe your face throughout the day because of sweat?",
        options: [
          { value: "frequently", label: "Frequently" },
          { value: "sometimes", label: "Sometimes" },
          { value: "rarely", label: "Rarely" },
          { value: "never", label: "Never" },
        ],
        followUp: {
          id: "q9-followup",
          prompt: "If yes, what do you use?",
          options: [
            { value: "handkerchief", label: "Handkerchief" },
            { value: "towel", label: "Towel" },
            { value: "tissue", label: "Tissue" },
            { value: "wet-wipes", label: "Wet wipes" },
            { value: "my-hands", label: "My hands" },
            { value: "something-else", label: "Something else", isOther: true },
          ],
          hideWhenAnswerIncludesAny: ["never"],
        },
      },
      {
        id: "q10",
        prompt: "Do you wash your face during the day because of sweating?",
        options: [
          { value: "yes-once", label: "Yes, once" },
          { value: "yes-multiple-times", label: "Yes, multiple times" },
          { value: "sometimes", label: "Sometimes" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "q11",
        prompt: "Does sunscreen tend to:",
        options: [
          { value: "slide-run-off", label: "Slide/run off when you sweat" },
          { value: "sting-eyes", label: "Get into your eyes and sting" },
          { value: "feel-hotter", label: "Make you feel hotter" },
          { value: "significantly-more-oily", label: "Make you significantly more oily" },
          { value: "break-you-out", label: "Break you out" },
          { value: "white-cast", label: "Leave a white cast when mixed with sweat" },
          { value: "stay-comfortable", label: "Stay comfortable" },
          { value: "dont-use-sunscreen", label: "I don't use sunscreen" },
        ],
      },
      {
        id: "q12",
        prompt: "Do moisturizers or creams feel uncomfortable when you're hot or sweating?",
        options: [
          { value: "hate-heavy-sticky", label: "Yes, I hate the heavy/sticky feeling" },
          { value: "sometimes", label: "Sometimes" },
          { value: "no", label: "No" },
          { value: "never-noticed", label: "I've never noticed" },
        ],
      },
      {
        id: "q13",
        prompt: "When choosing skincare, how important is a lightweight, non-sticky feel?",
        options: [
          { value: "extremely-important", label: "Extremely important" },
          { value: "very-important", label: "Very important" },
          { value: "somewhat-important", label: "Somewhat important" },
          { value: "dont-care", label: "I don't care as long as it works" },
        ],
      },
    ],
  },
];

export const allQuestions: (QuizQuestion & { sectionId: string; sectionTitle: string })[] =
  quizSections.flatMap((section) =>
    section.questions.map((q) => ({ ...q, sectionId: section.id, sectionTitle: section.title })),
  );

export type ResolvedQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  sectionTitle: string;
};

/** Lookup by question id, including follow-up sub-questions, for rendering saved answers. */
export const questionById: Record<string, ResolvedQuestion> = (() => {
  const map: Record<string, ResolvedQuestion> = {};
  for (const q of allQuestions) {
    map[q.id] = { id: q.id, prompt: q.prompt, options: q.options, sectionTitle: q.sectionTitle };
    if (q.followUp) {
      map[q.followUp.id] = {
        id: q.followUp.id,
        prompt: q.followUp.prompt,
        options: q.followUp.options,
        sectionTitle: q.sectionTitle,
      };
    }
  }
  return map;
})();

/** Question ids (including follow-ups) in the order they're shown in the test. */
export const orderedQuestionIds: string[] = allQuestions.flatMap((q) =>
  q.followUp ? [q.id, q.followUp.id] : [q.id],
);
