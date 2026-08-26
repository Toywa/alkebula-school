export type ExamSeries = {
  slug: string;
  title: string;
  shortTitle: string;
  board: string;
  session: string;
  urgency: "Immediate" | "Next" | "Planning";
  description: string;
  heroLine: string;
  audience: string[];
  subjects: string[];
  revisionFocus: string[];
  weeklyPlan: string[];
  ctaNote: string;
};

export const examSeries: ExamSeries[] = [
  {
    slug: "edexcel-ial-october-2026",
    title: "Edexcel International A Level October 2026 Revision",
    shortTitle: "Edexcel IAL October 2026",
    board: "Pearson Edexcel",
    session: "October 2026",
    urgency: "Immediate",
    description:
      "Urgent online revision support for Pearson Edexcel International A Level students preparing for the October 2026 exam series.",
    heroLine:
      "A focused revision pathway for IAL candidates who need structure, past-paper discipline, and exam confidence before October.",
    audience: [
      "Pearson Edexcel International A Level students",
      "AS and A2 candidates preparing for October 2026 papers",
      "Students needing resit support or final topic recovery",
      "Schools seeking focused revision support for small groups",
    ],
    subjects: [
      "Mathematics",
      "Further Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Business",
      "Economics",
      "Accounting",
      "English",
    ],
    revisionFocus: [
      "Specification-by-specification topic audit",
      "Weak-topic recovery before the exam window",
      "Past-paper practice under timed conditions",
      "Mark-scheme language and examiner expectations",
      "Calculator, formula, graph and data interpretation technique",
      "Final-week revision planning",
    ],
    weeklyPlan: [
      "Week 1: Diagnose weak units and rank topics by urgency.",
      "Week 2: Rebuild core concepts and practise high-frequency question types.",
      "Week 3: Complete timed past-paper sections with tutor feedback.",
      "Week 4: Focus on exam technique, accuracy, time management and final confidence.",
    ],
    ctaNote:
      "Best for students already registered for the October 2026 Edexcel IAL series who need immediate revision support.",
  },
  {
    slug: "cambridge-igcse-november-2026",
    title: "Cambridge IGCSE October/November 2026 Revision",
    shortTitle: "Cambridge IGCSE Oct/Nov 2026",
    board: "Cambridge International",
    session: "October/November 2026",
    urgency: "Immediate",
    description:
      "Structured online revision for Cambridge IGCSE learners preparing for the October/November 2026 examination series.",
    heroLine:
      "Close gaps, practise past papers, strengthen exam technique, and prepare calmly for the Cambridge IGCSE Oct/Nov series.",
    audience: [
      "Cambridge IGCSE candidates",
      "Private candidates preparing from home",
      "Homeschooling families using Cambridge pathways",
      "Schools looking for extra revision support for candidates",
    ],
    subjects: [
      "Mathematics",
      "Additional Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Business Studies",
      "Economics",
      "Geography",
      "Computer Science",
    ],
    revisionFocus: [
      "Full syllabus gap check",
      "Topic-by-topic revision timetable",
      "Past-paper drilling by paper type",
      "Command-word and mark-scheme training",
      "Data response, extended writing and calculation accuracy",
      "Confidence building before final papers",
    ],
    weeklyPlan: [
      "Week 1: Identify syllabus gaps and weak paper components.",
      "Week 2: Re-teach priority topics and complete targeted practice.",
      "Week 3: Attempt timed past papers and review examiner-style responses.",
      "Week 4: Refine exam technique, speed, accuracy and final revision notes.",
    ],
    ctaNote:
      "Best for Cambridge IGCSE learners sitting the October/November 2026 examination series.",
  },
  {
    slug: "cambridge-a-level-november-2026",
    title: "Cambridge International AS & A Level November 2026 Revision",
    shortTitle: "Cambridge A Level Nov 2026",
    board: "Cambridge International",
    session: "November 2026",
    urgency: "Immediate",
    description:
      "High-level online revision for Cambridge International AS & A Level students preparing for the November 2026 series.",
    heroLine:
      "Targeted support for serious AS and A Level candidates who need strong concepts, paper technique, and disciplined revision.",
    audience: [
      "Cambridge International AS Level candidates",
      "Cambridge International A Level candidates",
      "Students completing A2 components",
      "Candidates resitting specific papers or components",
    ],
    subjects: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Economics",
      "Business",
      "Accounting",
      "Computer Science",
      "English General Paper",
    ],
    revisionFocus: [
      "AS/A2 component-specific revision",
      "Advanced concept repair",
      "Timed paper practice",
      "Structured answer writing",
      "Graph, data, calculation and explanation technique",
      "Grade-boundary focused performance improvement",
    ],
    weeklyPlan: [
      "Week 1: Map weak components and urgent topic areas.",
      "Week 2: Rebuild high-value concepts and practise exam-style questions.",
      "Week 3: Complete full paper sections with marking and corrections.",
      "Week 4: Finalise exam strategy, timing, command words and confidence.",
    ],
    ctaNote:
      "Best for Cambridge AS and A Level candidates preparing for the November 2026 session.",
  },
  {
    slug: "edexcel-igcse-november-2026",
    title: "Edexcel International GCSE November 2026 Revision",
    shortTitle: "Edexcel IGCSE November 2026",
    board: "Pearson Edexcel",
    session: "November 2026",
    urgency: "Immediate",
    description:
      "Focused revision support for Pearson Edexcel International GCSE students preparing for the November 2026 exam series.",
    heroLine:
      "A clear revision route for Edexcel IGCSE learners who need stronger concepts, timed practice and exam confidence.",
    audience: [
      "Pearson Edexcel International GCSE candidates",
      "Students resitting November papers",
      "Private candidates and homeschool learners",
      "Schools arranging targeted revision support",
    ],
    subjects: [
      "Mathematics A",
      "Mathematics B",
      "English Language",
      "English Literature",
      "Physics",
      "Chemistry",
      "Biology",
      "Business",
      "Economics",
      "Accounting",
    ],
    revisionFocus: [
      "Specification-aligned topic review",
      "Paper strategy",
      "Past-paper correction and mark-scheme practice",
      "Writing, calculation and data-response support",
      "Timed practice and final revision planning",
    ],
    weeklyPlan: [
      "Week 1: Audit specification gaps and paper confidence.",
      "Week 2: Fix weak topics and build core exam responses.",
      "Week 3: Attempt timed papers with tutor review.",
      "Week 4: Finalise exam technique, timing and high-yield revision.",
    ],
    ctaNote:
      "Best for students sitting Pearson Edexcel International GCSE papers in November 2026.",
  },
  {
    slug: "ib-diploma-november-2026",
    title: "IB Diploma November 2026 Revision",
    shortTitle: "IB Diploma November 2026",
    board: "International Baccalaureate",
    session: "November 2026",
    urgency: "Immediate",
    description:
      "Structured online revision and academic support for IB Diploma Programme students preparing for the November 2026 examination session.",
    heroLine:
      "Support for IB learners who need conceptual clarity, disciplined revision, essay support and final exam readiness.",
    audience: [
      "IB Diploma candidates",
      "HL and SL subject learners",
      "Students needing final revision structure",
      "Families seeking focused academic support before the November session",
    ],
    subjects: [
      "Mathematics AA",
      "Mathematics AI",
      "Physics",
      "Chemistry",
      "Biology",
      "Business Management",
      "Economics",
      "Psychology",
      "English",
      "TOK and Extended Essay support",
    ],
    revisionFocus: [
      "HL/SL topic mastery",
      "Past-paper and question-bank practice",
      "Internal assessment review support",
      "Essay structure and academic writing",
      "Command terms and mark-scheme expectations",
      "Final revision calendar and exam confidence",
    ],
    weeklyPlan: [
      "Week 1: Identify weak topics, IA pressure points and paper priorities.",
      "Week 2: Rebuild subject concepts and practise structured responses.",
      "Week 3: Complete timed exam questions with tutor correction.",
      "Week 4: Consolidate high-yield revision, essays and final exam strategy.",
    ],
    ctaNote:
      "Best for IB Diploma learners preparing for the November 2026 session.",
  },
  {
    slug: "cambridge-checkpoint-october-2026",
    title: "Cambridge Checkpoint October 2026 Revision",
    shortTitle: "Cambridge Checkpoint October 2026",
    board: "Cambridge International",
    session: "October 2026",
    urgency: "Immediate",
    description:
      "Online revision support for Cambridge Primary and Lower Secondary Checkpoint learners preparing for the October 2026 test series.",
    heroLine:
      "Gentle but serious preparation for learners who need confidence in Maths, English, Science and Global Perspectives.",
    audience: [
      "Cambridge Primary Checkpoint learners",
      "Cambridge Lower Secondary Checkpoint learners",
      "Stage 6 and Stage 9 learners",
      "Homeschool families preparing for Checkpoint assessment",
    ],
    subjects: [
      "Mathematics",
      "English",
      "Science",
      "Global Perspectives",
      "Study skills",
      "Academic writing",
    ],
    revisionFocus: [
      "Core skill recovery",
      "Checkpoint-style question practice",
      "Reading, writing and problem-solving support",
      "Science reasoning and explanation",
      "Confidence building for younger learners",
      "Parent-friendly progress feedback",
    ],
    weeklyPlan: [
      "Week 1: Diagnose skill gaps in Maths, English and Science.",
      "Week 2: Rebuild weak skills using guided practice.",
      "Week 3: Practise Checkpoint-style questions with feedback.",
      "Week 4: Improve confidence, timing and test readiness.",
    ],
    ctaNote:
      "Best for Cambridge Primary and Lower Secondary learners preparing for the October 2026 Checkpoint series.",
  },
  {
    slug: "edexcel-ial-january-2027",
    title: "Edexcel International A Level January 2027 Revision",
    shortTitle: "Edexcel IAL January 2027",
    board: "Pearson Edexcel",
    session: "January 2027",
    urgency: "Next",
    description:
      "Early revision and resit support for Pearson Edexcel International A Level students preparing for the January 2027 exam series.",
    heroLine:
      "A smart preparation route for students who want to use the January 2027 IAL window well.",
    audience: [
      "Pearson Edexcel IAL candidates",
      "Students planning January 2027 resits",
      "AS and A2 learners needing structured preparation",
      "Schools planning holiday revision programmes",
    ],
    subjects: [
      "Mathematics",
      "Further Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Business",
      "Economics",
      "Accounting",
    ],
    revisionFocus: [
      "Unit-by-unit revision planning",
      "Resit recovery strategy",
      "Past-paper practice",
      "Mark-scheme technique",
      "Holiday revision structure",
      "Final exam-readiness coaching",
    ],
    weeklyPlan: [
      "Weeks 1–2: Diagnose weak units and rebuild concepts.",
      "Weeks 3–4: Complete topic practice and timed sections.",
      "Weeks 5–6: Move into full-paper practice and review.",
      "Final phase: Focus on timing, accuracy and exam-day confidence.",
    ],
    ctaNote:
      "Best for Pearson Edexcel International A Level students targeting January 2027.",
  },
  {
    slug: "may-june-2027",
    title: "May/June 2027 Exam Revision and Preparation",
    shortTitle: "May/June 2027 Exams",
    board: "Cambridge, Edexcel, IB and International Pathways",
    session: "May/June/Summer 2027",
    urgency: "Planning",
    description:
      "Longer-term online preparation for students targeting the May/June or Summer 2027 exam season.",
    heroLine:
      "Start early, build mastery steadily, and avoid last-minute exam panic before the 2027 summer exam season.",
    audience: [
      "Cambridge IGCSE and A Level learners",
      "Edexcel International GCSE learners",
      "Edexcel International A Level learners",
      "IB and homeschool learners preparing for 2027",
      "Schools planning structured revision support",
    ],
    subjects: [
      "Mathematics",
      "English",
      "Physics",
      "Chemistry",
      "Biology",
      "Business",
      "Economics",
      "Geography",
      "Computer Science",
      "IB subjects",
    ],
    revisionFocus: [
      "Long-term syllabus coverage",
      "Foundation strengthening",
      "Topic mastery before past-paper pressure",
      "Monthly progress reviews",
      "Exam technique development",
      "Parent-friendly reporting and accountability",
    ],
    weeklyPlan: [
      "Phase 1: Build foundations and close old learning gaps.",
      "Phase 2: Complete syllabus coverage with tutor support.",
      "Phase 3: Begin structured past-paper practice.",
      "Phase 4: Move into final revision, timing and exam technique.",
    ],
    ctaNote:
      "Best for families and schools planning ahead for the May/June or Summer 2027 exam season.",
  },
];

export function getExamSeries(slug: string) {
  return examSeries.find((series) => series.slug === slug);
}