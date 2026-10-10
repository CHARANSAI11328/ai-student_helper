import {
  StudentProfile,
  Subject,
  Topic,
  TutorExplanation,
  VisionTranscription,
  QuizGeneration,
  SavedNote,
  Achievement
} from '../types/index.js';

export const fallbackProfile: StudentProfile = {
  id: 'student-aarav-10',
  name: 'Aarav Sharma',
  grade: 10,
  language: 'en',
  strongSubjects: ['physics', 'chemistry'],
  weakSubjects: ['math'],
  learningGoals: 'Master Class 10 STEM board exam concepts and prepare for competitive science olympiads',
  explanationStyle: 'step_by_step',
  confidenceLevel: 'moderate',
  streakCount: 4,
  totalStudyMinutes: 185,
  xpPoints: 380,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export const fallbackSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    icon: 'Calculator',
    description: 'Algebra, Quadratic Equations, Coordinate Geometry, Trigonometry, and Statistics',
    curriculumStandards: ['CBSE Class 10', 'ICSE Grade 10', 'State Boards'],
    colorTheme: 'blue',
  },
  {
    id: 'physics',
    name: 'Physics',
    icon: 'Atom',
    description: "Light Reflection & Refraction, Electricity, Ohm's Law, and Magnetic Effects of Current",
    curriculumStandards: ['CBSE Class 10', 'ICSE Grade 10'],
    colorTheme: 'purple',
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: 'FlaskConical',
    description: 'Chemical Reactions, Acids, Bases & Salts, Metals & Non-metals, Carbon Compounds',
    curriculumStandards: ['CBSE Class 10', 'ICSE Grade 10'],
    colorTheme: 'emerald',
  },
];

export const fallbackTopics: Topic[] = [
  {
    id: 'math-alg-quad',
    subjectId: 'math',
    title: 'Quadratic Equations & Roots',
    gradeLevel: 10,
    orderIndex: 1,
    prerequisites: ['Linear Equations in Two Variables', 'Polynomials'],
    keyFormulas: ['ax^2 + bx + c = 0', 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}', 'D = b^2 - 4ac'],
    learningObjectives: [
      'Identify quadratic equations in standard form',
      'Compute the discriminant D to classify root nature',
      'Solve equations using factorization and quadratic formula',
    ],
  },
  {
    id: 'math-trig-intro',
    subjectId: 'math',
    title: 'Introduction to Trigonometry',
    gradeLevel: 10,
    orderIndex: 2,
    prerequisites: ['Similar Triangles', 'Pythagorean Theorem'],
    keyFormulas: ['\\sin \\theta = \\frac{opp}{hyp}', '\\cos^2 \\theta + \\sin^2 \\theta = 1', '\\tan \\theta = \\frac{\\sin \\theta}{\\cos \\theta}'],
    learningObjectives: [
      'Define sine, cosine, tangent ratios in right-angled triangles',
      'Memorize specific angle trigonometric values (0, 30, 45, 60, 90 degrees)',
      'Apply standard Pythagorean identities',
    ],
  },
  {
    id: 'phys-elec-ohm',
    subjectId: 'physics',
    title: "Electric Current & Ohm's Law",
    gradeLevel: 10,
    orderIndex: 1,
    prerequisites: ['Electric Potential', 'Conductors and Insulators'],
    keyFormulas: ['V = I \\cdot R', 'R = \\rho \\frac{l}{A}', 'P = V \\cdot I = I^2 R = \\frac{V^2}{R}'],
    learningObjectives: [
      'State and verify Ohm’s Law experimentally',
      'Understand resistivity dependence on length and cross-section area',
      'Calculate equivalent resistance in series and parallel networks',
    ],
  },
  {
    id: 'phys-opt-refl',
    subjectId: 'physics',
    title: 'Light Reflection & Spherical Mirrors',
    gradeLevel: 10,
    orderIndex: 2,
    prerequisites: ['Plane Mirrors', 'Laws of Reflection'],
    keyFormulas: ['\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}', 'm = -\\frac{v}{u} = \\frac{h_i}{h_o}', 'f = \\frac{R}{2}'],
    learningObjectives: [
      'Draw ray diagrams for concave and convex mirrors',
      'Apply Cartesian sign conventions correctly',
      'Calculate image position, nature, and magnification',
    ],
  },
  {
    id: 'chem-rxn-eq',
    subjectId: 'chemistry',
    title: 'Chemical Reactions & Balancing Equations',
    gradeLevel: 10,
    orderIndex: 1,
    prerequisites: ['Valency', 'Chemical Formulas of Compounds'],
    keyFormulas: ['\\text{Law of Conservation of Mass}', 'a A + b B \\rightarrow c C + d D'],
    learningObjectives: [
      'Balance chemical equations satisfying mass conservation',
      'Classify reaction types: combination, decomposition, displacement, redox',
      'Identify oxidation and reduction states',
    ],
  },
  {
    id: 'chem-acid-base',
    subjectId: 'chemistry',
    title: 'Acids, Bases, Salts & pH Scale',
    gradeLevel: 10,
    orderIndex: 2,
    prerequisites: ['Chemical Reactions', 'Ions in Solution'],
    keyFormulas: ['\\text{pH} = -\\log_{10}[H^+]', '\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}'],
    learningObjectives: [
      'Understand hydrogen and hydroxide ion concentration in water',
      'Interpret the 0–14 pH scale and universal indicators',
      'Explain everyday applications of neutralization',
    ],
  },
];

export function getFallbackTutorExplanation(
  question: string,
  subject: string,
  grade: number,
  language: string = 'en'
): TutorExplanation {
  const q = question.toLowerCase();

  // Mathematics: Quadratic
  if (q.includes('quadratic') || q.includes('2x^2') || q.includes('formula') || q.includes('root')) {
    if (language === 'te') {
      return {
        questionIntent: "వర్గ సమీకరణం $2x^2 - 7x + 3 = 0$ యొక్క మూలాలను కనుగొనడం.",
        requiredConcepts: ["వర్గ సూత్రం (Quadratic Formula)", "విచక్షణి ($D = b^2 - 4ac$)", "గుణకాలు గుర్తించడం"],
        stepByStepReasoning: [
          {
            stepNumber: 1,
            title: "ప్రామాణిక రూపంతో పోల్చడం",
            explanation: "సమీకరణాన్ని $ax^2 + bx + c = 0$ తో పోల్చగా గుణకాలు లభిస్తాయి.",
            mathExpression: "a = 2,\\; b = -7,\\; c = 3"
          },
          {
            stepNumber: 2,
            title: "విచక్షణి (Discriminant) లెక్కింపు",
            explanation: "విచక్షణి ధనాత్మకం కాబట్టి సమీకరణానికి రెండు వేర్వేరు వాస్తవ మూలాలు ఉంటాయి.",
            mathExpression: "D = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25"
          },
          {
            stepNumber: 3,
            title: "వర్గ సూత్రంలో ప్రతిక్షేపించడం",
            explanation: "విచక్షణి వర్గమూలం $\\sqrt{25} = 5$ ను సూత్రంలో ప్రతిక్షేపించండి.",
            mathExpression: "x = \\frac{-(-7) \\pm 5}{2(2)} = \\frac{7 \\pm 5}{4}"
          },
          {
            stepNumber: 4,
            title: "రెండు మూలాలను సాధించడం",
            explanation: "ప్లస్ మరియు మైనస్ విలువలను విడివిడిగా లెక్కించండి.",
            mathExpression: "x_1 = \\frac{12}{4} = 3,\\quad x_2 = \\frac{2}{4} = \\frac{1}{2}"
          }
        ],
        finalAnswer: "సమీకరణం యొక్క మూలాలు: $x = 3$ మరియు $x = \\frac{1}{2}$.",
        whyMethodWorks: "వర్గ సూత్రం వర్గాన్ని పూర్తి చేసే పద్ధతి ఆధారంగా తీసుకోబడింది కాబట్టి ఏ వర్గ సమీకరణానికైనా పరిష్కారం ఇస్తుంది.",
        realWorldAnalogy: "ఒక బంతిని పైకి విసిరినప్పుడు అది ఎప్పుడు నేలను తాకుతుందో లెక్కించడానికి ఈ సూత్రం ఉపయోగపడుతుంది.",
        commonMistakes: "గుణకం $b$ రుణాత్మకమైనప్పుడు $-b$ రాసేటప్పుడు తప్పు చేయడం: $-(-7) = +7$.",
        understandingCheckQuestion: {
          question: "ఒక వర్గ సమీకరణంలో $D = b^2 - 4ac = 0$ అయితే మూలాల స్వభావం ఏమిటి?",
          options: [
            "రెండు సమాన వాస్తవ మూలాలు",
            "వాస్తవ మూలాలు ఉండవు",
            "రెండు వేర్వేరు మూలాలు",
            "మూలం ఎల్లప్పుడూ 1"
          ],
          correctAnswerIndex: 0,
          explanation: "విచక్షణి $D = 0$ అయినప్పుడు $\\pm \\sqrt{0} = 0$ అవుతుంది, కాబట్టి రెండు మూలాలు సమానంగా $-\\frac{b}{2a}$ అవుతాయి."
        },
        suggestedNextTopic: "వర్గ సమీకరణాల రేఖాచిత్రాలు మరియు పారాబోలా లక్షణాలు."
      };
    }

    if (language === 'hi') {
      return {
        questionIntent: "द्विघात समीकरण $2x^2 - 7x + 3 = 0$ के मूल ज्ञात करना।",
        requiredConcepts: ["द्विघात सूत्र (Quadratic Formula)", "विविक्तकर ($D = b^2 - 4ac$)", "गुणांकों की पहचान"],
        stepByStepReasoning: [
          {
            stepNumber: 1,
            title: "मानक रूप से तुलना",
            explanation: "समीकरण की $ax^2 + bx + c = 0$ से तुलना करने पर गुणांक प्राप्त होते हैं।",
            mathExpression: "a = 2,\\; b = -7,\\; c = 3"
          },
          {
            stepNumber: 2,
            title: "विविक्तकर (Discriminant) की गणना",
            explanation: "विविक्तकर धनात्मक है, इसलिए समीकरण के दो भिन्न वास्तविक मूल होंगे।",
            mathExpression: "D = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25"
          },
          {
            stepNumber: 3,
            title: "द्विघात सूत्र में मान प्रतिस्थापित करना",
            explanation: "विविक्तकर का वर्गमूल $\\sqrt{25} = 5$ सूत्र में रखें।",
            mathExpression: "x = \\frac{-(-7) \\pm 5}{2(2)} = \\frac{7 \\pm 5}{4}"
          },
          {
            stepNumber: 4,
            title: "दोनों मूल ज्ञात करना",
            explanation: "धन और ऋण चिन्हों को अलग-अलग हल करें।",
            mathExpression: "x_1 = \\frac{12}{4} = 3,\\quad x_2 = \\frac{2}{4} = \\frac{1}{2}"
          }
        ],
        finalAnswer: "समीकरण के मूल हैं: $x = 3$ और $x = \\frac{1}{2}$।",
        whyMethodWorks: "द्विघात सूत्र पूर्ण वर्ग विधि से प्राप्त होता है, इसलिए यह प्रत्येक द्विघात समीकरण को सटीक हल करता है।",
        realWorldAnalogy: "गेंद के परवलयाकार मार्ग में जमीन छूने का समय निकालने के लिए यह प्रयुक्त होता है।",
        commonMistakes: "ऋणात्मक $b$ के समय $-b$ लिखने में त्रुटि: $-(-7) = +7$ ध्यान रखें।",
        understandingCheckQuestion: {
          question: "यदि $D = b^2 - 4ac = 0$ हो, तो मूलों की प्रकृति कैसी होगी?",
          options: [
            "दो बराबर वास्तविक मूल",
            "कोई वास्तविक मूल नहीं",
            "दो भिन्न वास्तविक मूल",
            "मूल हमेशा शून्य होगा"
          ],
          correctAnswerIndex: 0,
          explanation: "जब $D = 0$ होता है, तो $\\pm \\sqrt{0} = 0$ होता है, जिससे दोनों मूल $-\\frac{b}{2a}$ के बराबर होते हैं।"
        },
        suggestedNextTopic: "परवलय का आलेख और ज्यामितीय अनुप्रयोग।"
      };
    }

    // Default English
    return {
      questionIntent: "Solve the quadratic equation $2x^2 - 7x + 3 = 0$ step-by-step using the quadratic formula.",
      requiredConcepts: [
        "Standard Quadratic Form $ax^2 + bx + c = 0$",
        "Discriminant Definition $D = b^2 - 4ac$",
        "Quadratic Formula $x = \\frac{-b \\pm \\sqrt{D}}{2a}$"
      ],
      stepByStepReasoning: [
        {
          stepNumber: 1,
          title: "Identify Coefficients from Standard Form",
          explanation: "Compare $2x^2 - 7x + 3 = 0$ to $ax^2 + bx + c = 0$. Pay close attention to negative signs.",
          mathExpression: "a = 2,\\quad b = -7,\\quad c = 3"
        },
        {
          stepNumber: 2,
          title: "Evaluate the Discriminant (D)",
          explanation: "Since $D > 0$, the equation possesses two distinct, real roots.",
          mathExpression: "D = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25"
        },
        {
          stepNumber: 3,
          title: "Substitute into the Quadratic Formula",
          explanation: "Substitute $a=2$, $b=-7$, and $\\sqrt{D} = \\sqrt{25} = 5$. Notice $-(-7) = +7$.",
          mathExpression: "x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}"
        },
        {
          stepNumber: 4,
          title: "Separate the Plus and Minus Branches",
          explanation: "Compute both root branches individually to find the exact solutions.",
          mathExpression: "x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3,\\qquad x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = \\frac{1}{2}"
        }
      ],
      finalAnswer: "The roots are $x = 3$ and $x = \\frac{1}{2}$ (or $0.5$).",
      whyMethodWorks: "The quadratic formula is algebraically derived by completing the square on the general quadratic equation $ax^2 + bx + c = 0$. It guarantees a systematic solution for every quadratic equation without requiring guessing factors.",
      realWorldAnalogy: "When an athlete throws a javelin or kicks a football, its height over time traces a parabolic trajectory $h(t) = -gt^2 + v_0 t + h_0$. The quadratic roots tell us the exact moment the ball hits the ground.",
      commonMistakes: "The most frequent error is neglecting the double negative in $-b$: when $b = -7$, evaluating $-b$ yields $-(-7) = +7$, NOT $-7$.",
      understandingCheckQuestion: {
        question: "If a quadratic equation has discriminant $D = b^2 - 4ac = 0$, what does this reveal about its roots?",
        options: [
          "It has two identical, repeated real roots (one unique solution)",
          "It has no real roots (complex roots only)",
          "It has two distinct positive roots",
          "The roots are always integers"
        ],
        correctAnswerIndex: 0,
        explanation: "When $D = 0$, the $\\pm \\sqrt{D}$ term vanishes, leaving exactly one repeated root: $x = -\\frac{b}{2a}$."
      },
      suggestedNextTopic: "Graphing Quadratic Parabolas and Analyzing the Vertex."
    };
  }

  // Physics: Ohm's Law
  if (q.includes('ohm') || q.includes('current') || q.includes('resistance') || q.includes('circuit')) {
    return {
      questionIntent: "Understand and apply Ohm's Law ($V = IR$) to calculate electrical circuit parameters.",
      requiredConcepts: [
        "Ohm's Law: $V = I \\cdot R$",
        "SI Units: Volts ($V$), Amperes ($A$), Ohms ($\\Omega$)",
        "Resistance proportionality with conductor properties: $R = \\rho \\frac{l}{A}$"
      ],
      stepByStepReasoning: [
        {
          stepNumber: 1,
          title: "State the Fundamental Principle",
          explanation: "At constant temperature, the electric current flowing through a conductor is directly proportional to the potential difference across its terminals.",
          mathExpression: "V \\propto I \\implies V = I \\cdot R"
        },
        {
          stepNumber: 2,
          title: "Rearrange for the Desired Quantity",
          explanation: "Depending on what is unknown, rearrange the formula algebraically.",
          mathExpression: "I = \\frac{V}{R},\\qquad R = \\frac{V}{I}"
        },
        {
          stepNumber: 3,
          title: "Substitute Known Circuit Parameters",
          explanation: "For example, across a 12V battery with a $4\\Omega$ resistor:",
          mathExpression: "I = \\frac{12\\text{ V}}{4\\ \\Omega} = 3\\text{ A}"
        }
      ],
      finalAnswer: "Current is $I = 3\\text{ A}$, directly derived from $V = IR$.",
      whyMethodWorks: "Voltage represents the electrical push (potential difference), while resistance opposes electron flow. Ohm's law quantifies this linear equilibrium.",
      realWorldAnalogy: "Think of water flowing through a garden pipe: Voltage is water pressure from the tap, current is the volume of water flowing per second, and resistance is the narrowness of the nozzle.",
      commonMistakes: "Forgetting that Ohm's law strictly holds only when temperature remains constant. If a filament lamp heats up, its resistance increases dynamically.",
      understandingCheckQuestion: {
        question: "If the resistance of a circuit is doubled while the applied voltage remains constant, what happens to the electric current?",
        options: [
          "The current is halved ($I/2$)",
          "The current is doubled ($2I$)",
          "The current remains unchanged",
          "The current drops to zero"
        ],
        correctAnswerIndex: 0,
        explanation: "Since $I = V/R$, current is inversely proportional to resistance. Doubling resistance cuts current by half."
      },
      suggestedNextTopic: "Resistors in Series and Parallel Combinations."
    };
  }

  // Chemistry or General STEM
  return {
    questionIntent: `Understand and solve "${question}" with Socratic derivation.`,
    requiredConcepts: ["Conservation Principles", "Systematic Problem Formulation", "Verification"],
    stepByStepReasoning: [
      {
        stepNumber: 1,
        title: "Identify Knowns & Target Unknowns",
        explanation: "Break the problem down into given parameters and fundamental scientific laws.",
        mathExpression: "\\text{Given: } \\text{Problem constraints} \\implies \\text{Apply foundational axioms}"
      },
      {
        stepNumber: 2,
        title: "Apply Core Governing Formula",
        explanation: "Select the precise mathematical relation governing this STEM phenomenon.",
        mathExpression: "\\text{Relationship established: } y = f(x)"
      },
      {
        stepNumber: 3,
        title: "Calculate & Verify Dimensions",
        explanation: "Compute the result ensuring all physical dimensions and units balance correctly.",
        mathExpression: "\\text{Result Verified}"
      }
    ],
    finalAnswer: "The step-by-step conceptual derivation resolves the problem systematically.",
    whyMethodWorks: "Scientific laws are mathematically consistent; applying first principles guarantees correct solutions.",
    realWorldAnalogy: "Like building a bridge, every scientific answer stands on firm foundational pillars rather than guesswork.",
    commonMistakes: "Jumping directly to a numerical answer without checking unit consistency.",
    understandingCheckQuestion: {
      question: "Which of the following is the most important step before completing a calculation?",
      options: [
        "Verifying unit consistency and physical boundary conditions",
        "Rounding numbers early to save calculation steps",
        "Skipping intermediate algebraic steps",
        "Assuming zero resistance or friction in all real-world cases"
      ],
      correctAnswerIndex: 0,
      explanation: "Dimensional analysis and unit checks prevent standard calculation errors."
    },
    suggestedNextTopic: "Related Practice Problems & Interactive Labs."
  };
}

export function getFallbackVisionTranscription(subject: string): VisionTranscription {
  return {
    extractedText: "Solve: 3x^2 + 5x - 2 = 0 using the quadratic formula",
    confidenceScore: 0.96,
    hasAmbiguities: false,
    ambiguousSymbols: [],
    clarificationPrompt: undefined,
  };
}

export function getFallbackQuiz(topicId: string): QuizGeneration {
  return {
    topicId,
    topicTitle: "Quadratic Equations Diagnostic Assessment",
    questions: [
      {
        id: "q1",
        question: "For the quadratic equation $3x^2 - 5x + 2 = 0$, what is the discriminant value $D = b^2 - 4ac$?",
        options: ["D = 1", "D = -1", "D = 49", "D = 25"],
        correctOptionIndex: 0,
        conceptualExplanation: "Calculate: $b^2 - 4ac = (-5)^2 - 4(3)(2) = 25 - 24 = 1$. Since $D = 1 > 0$, the equation has two distinct real rational roots.",
        conceptTested: "Discriminant calculation with negative b coefficient"
      },
      {
        id: "q2",
        question: "If a quadratic equation $ax^2 + bx + c = 0$ has discriminant $D < 0$, what is the nature of its roots?",
        options: [
          "No real roots (two complex conjugate roots)",
          "Two equal real roots",
          "Two distinct real roots",
          "One root is always zero"
        ],
        correctOptionIndex: 0,
        conceptualExplanation: "Because the square root of a negative number is not real, $D < 0$ implies there are no real solutions.",
        conceptTested: "Root nature classification via discriminant sign"
      },
      {
        id: "q3",
        question: "What are the roots of $x^2 - 9 = 0$?",
        options: ["x = 3 and x = -3", "x = 9 and x = -9", "x = 3 only", "x = 0 and x = 3"],
        correctOptionIndex: 0,
        conceptualExplanation: "Rearrange: $x^2 = 9 \\implies x = \\pm \\sqrt{9} = \\pm 3$. Remember both positive and negative roots.",
        conceptTested: "Difference of squares and root signs"
      }
    ]
  };
}
