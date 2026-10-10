import { TutorResponse, VisionTranscription, QuizGeneration } from './schemas/tutorResponse.js';

/**
 * Intelligent Socratic Demo Engine
 * Generates verified, curriculum-aligned educational responses for school students (Grades 6-12)
 * when live Gemini API key is not configured or in Demo Mode.
 * Distinctly identifies itself with demo indicators as required by hackathon rules.
 */

export function getMockTutorResponse(
  question: string,
  subject: string,
  grade: number,
  language: string = 'en'
): TutorResponse {
  const qLower = question.toLowerCase();

  // Mathematics: Quadratic Equations
  if (qLower.includes('quadratic') || qLower.includes('root') || qLower.includes('x^2') || qLower.includes('2x^2')) {
    if (language === 'te') {
      return {
        questionIntent: "వర్గ సమీకరణం $2x^2 - 7x + 3 = 0$ యొక్క మూలాలను (roots) కనుగొనడం.",
        requiredConcepts: ["వర్గ సూత్రం (Quadratic Formula)", "విచక్షణి (Discriminant $D = b^2 - 4ac$)", "బీజగణిత పద్ధతులు"],
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
            title: "వర్గ సూత్రాన్ని ఉపయోగించి మూలాలను సాధించడం",
            explanation: "విచక్షణి వర్గమూలం $\\sqrt{25} = 5$ ను సూత్రంలో ప్రతిక్షేపించండి.",
            mathExpression: "x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}"
          },
          {
            stepNumber: 4,
            title: "రెండు మూలాలను వేరు చేయడం",
            explanation: "ప్లస్ మరియు మైనస్ గుర్తులను విడివిడిగా లెక్కించండి.",
            mathExpression: "x_1 = \\frac{7+5}{4} = 3,\\quad x_2 = \\frac{7-5}{4} = \\frac{2}{4} = \\frac{1}{2}"
          }
        ],
        finalAnswer: "సమీకరణం యొక్క మూలాలు $x = 3$ మరియు $x = \\frac{1}{2}$.",
        whyMethodWorks: "వర్గ సమీకరణాలను సాధించడానికి వర్గ సూత్రం ఎల్లప్పుడూ పనిచేస్తుంది, ఎందుకంటే ఇది వర్గాన్ని పూర్తిచేసే పద్ధతి (completing the square) నుండి తీసుకోబడింది.",
        realWorldAnalogy: "ఒక బంతిని పైకి విసిరినప్పుడు అది నేలను ఎప్పుడు తాకుతుందో లెక్కించడానికి ఈ పద్ధతి ఉపయోగపడుతుంది.",
        commonMistakes: "గుణకం $b$ రుణాత్మకమైనప్పుడు $-b$ గుర్తులో తప్పులు చేయడం (ఉదా: $-(-7) = +7$ అని గుర్తుంచుకోవాలి).",
        understandingCheckQuestion: {
          question: "ఒక వర్గ సమీకరణంలో $D = b^2 - 4ac < 0$ అయితే మూలాల స్వభావం ఏమిటి?",
          options: [
            "రెండు సమాన వాస్తవ మూలాలు",
            "వాస్తవ మూలాలు ఉండవు (సంకీర్ణ మూలాలు)",
            "రెండు వేర్వేరు ధన మూలాలు",
            "మూలం ఎల్లప్పుడూ సున్నా"
          ],
          correctOptionIndex: 1,
          explanation: "విచక్షణి రుణాత్మకం అయితే వాస్తవ సంఖ్యలలో వర్గమూలం ఉండదు, కాబట్టి వాస్తవ మూలాలు ఉండవు."
        },
        suggestedNextTopic: "విచక్షణి ఆధారంగా మూలాల స్వభావం మరియు గ్రాఫ్ పరరూపం"
      };
    }

    return {
      questionIntent: "Find the roots of the quadratic equation $2x^2 - 7x + 3 = 0$ using algebraic principles.",
      requiredConcepts: [
        "Standard quadratic form: $ax^2 + bx + c = 0$",
        "Discriminant calculation: $D = b^2 - 4ac$",
        "Quadratic formula: $x = \\frac{-b \\pm \\sqrt{D}}{2a}$"
      ],
      stepByStepReasoning: [
        {
          stepNumber: 1,
          title: "Identify standard coefficients",
          explanation: "Compare the given equation with $ax^2 + bx + c = 0$ to extract coefficients.",
          mathExpression: "a = 2,\\quad b = -7,\\quad c = 3"
        },
        {
          stepNumber: 2,
          title: "Compute the discriminant (D)",
          explanation: "Calculate the value under the square root. Since $D > 0$, there are two distinct real roots.",
          mathExpression: "D = b^2 - 4ac = (-7)^2 - 4(2)(3) = 49 - 24 = 25"
        },
        {
          stepNumber: 3,
          title: "Apply the quadratic formula",
          explanation: "Substitute the identified values into the master formula.",
          mathExpression: "x = \\frac{-(-7) \\pm \\sqrt{25}}{2(2)} = \\frac{7 \\pm 5}{4}"
        },
        {
          stepNumber: 4,
          title: "Calculate individual root solutions",
          explanation: "Evaluate both positive and negative branches of the square root.",
          mathExpression: "x_1 = \\frac{7 + 5}{4} = \\frac{12}{4} = 3,\\quad x_2 = \\frac{7 - 5}{4} = \\frac{2}{4} = \\frac{1}{2}"
        }
      ],
      finalAnswer: "The roots of the equation are $x = 3$ and $x = \\frac{1}{2}$.",
      whyMethodWorks: "The quadratic formula directly solves any polynomial of degree 2 by completing the square algebraically, eliminating the need to guess factorization pairs.",
      realWorldAnalogy: "Like finding the exact two moments an archer's arrow crosses a specific height on its trajectory.",
      commonMistakes: "Sign errors when evaluating $-b$ when $b$ is already negative: $-(-7) = +7$, not $-7$.",
      understandingCheckQuestion: {
        question: "If the discriminant $D = b^2 - 4ac = 0$, what does this tell us about the roots?",
        options: [
          "The equation has two equal, repeated real roots",
          "The equation has no real roots",
          "Both roots are strictly negative",
          "One root must be zero"
        ],
        correctOptionIndex: 0,
        explanation: "When $D = 0$, $\\pm \\sqrt{0} = 0$, which yields a single repeated root $x = -b / (2a)$."
      },
      suggestedNextTopic: "Factoring quadratics by grouping & graphical parabola vertices"
    };
  }

  // Physics: Ohm's Law & Circuits
  if (qLower.includes('ohm') || qLower.includes('resistor') || qLower.includes('circuit') || qLower.includes('voltage') || qLower.includes('current')) {
    return {
      questionIntent: "Determine equivalent resistance and electric current in an electrical circuit.",
      requiredConcepts: [
        "Ohm's Law: $V = IR$",
        "Equivalent resistance in parallel: $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$",
        "Total current distribution"
      ],
      stepByStepReasoning: [
        {
          stepNumber: 1,
          title: "Identify given circuit parameters",
          explanation: "We are given two resistors in parallel connected across a known potential difference.",
          mathExpression: "R_1 = 6\\,\\Omega,\\quad R_2 = 3\\,\\Omega,\\quad V = 12\\,\\text{V}"
        },
        {
          stepNumber: 2,
          title: "Calculate equivalent parallel resistance",
          explanation: "In parallel, reciprocal resistances add up. Notice that the combined resistance is always less than the smallest individual branch.",
          mathExpression: "\\frac{1}{R_{eq}} = \\frac{1}{6} + \\frac{1}{3} = \\frac{1 + 2}{6} = \\frac{3}{6} = \\frac{1}{2}\\,\\Omega^{-1} \\implies R_{eq} = 2\\,\\Omega"
        },
        {
          stepNumber: 3,
          title: "Calculate total current using Ohm's Law",
          explanation: "Divide the supply voltage by the total equivalent circuit resistance.",
          mathExpression: "I_{total} = \\frac{V}{R_{eq}} = \\frac{12\\,\\text{V}}{2\\,\\Omega} = 6\\,\\text{A}"
        }
      ],
      finalAnswer: "The equivalent resistance is $2\\,\\Omega$ and the total circuit current is $6\\,\\text{A}$.",
      whyMethodWorks: "In a parallel arrangement, each resistor experiences the full battery voltage ($12\\,\\text{V}$), providing two parallel paths for charge carriers, which increases total current flow.",
      realWorldAnalogy: "Like opening a second checkout lane at a supermarket—more lanes reduce overall bottleneck resistance for customers.",
      commonMistakes: "Forgetting to take the reciprocal at the end of $\\frac{1}{R_{eq}}$ calculations.",
      understandingCheckQuestion: {
        question: "What is the current passing specifically through the $3\\,\\Omega$ resistor branch?",
        options: ["2 A", "4 A", "6 A", "12 A"],
        correctOptionIndex: 1,
        explanation: "By Ohm's Law on that branch: $I_2 = V / R_2 = 12\\,\\text{V} / 3\\,\\Omega = 4\\,\\text{A}$."
      },
      suggestedNextTopic: "Series vs Parallel circuit power consumption and heating effect ($H = I^2Rt$)"
    };
  }

  // Chemistry: Balancing Equations & Redox
  if (qLower.includes('balance') || qLower.includes('chemical') || qLower.includes('reaction') || qLower.includes('fe3o4') || qLower.includes('h2o') || qLower.includes('acid')) {
    return {
      questionIntent: "Balance the chemical equation $\\text{Fe} + \\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + \\text{H}_2$ obeying the Law of Conservation of Mass.",
      requiredConcepts: [
        "Law of Conservation of Mass (atoms cannot be created or destroyed)",
        "Balancing oxygen and hydrogen using stoichiometric coefficients",
        "Reactants vs Products atom inventory"
      ],
      stepByStepReasoning: [
        {
          stepNumber: 1,
          title: "Write down the initial atom inventory",
          explanation: "Count each element on the Reactant (left) and Product (right) sides.",
          mathExpression: "\\text{Reactants: } \\text{Fe}=1,\\; \\text{H}=2,\\; \\text{O}=1 \\quad|\\quad \\text{Products: } \\text{Fe}=3,\\; \\text{H}=2,\\; \\text{O}=4"
        },
        {
          stepNumber: 2,
          title: "Balance the oxygen atoms first",
          explanation: "Product has 4 oxygen atoms in $\\text{Fe}_3\\text{O}_4$. Multiply $\\text{H}_2\\text{O}$ by 4 on the reactant side.",
          mathExpression: "\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + \\text{H}_2"
        },
        {
          stepNumber: 3,
          title: "Balance the hydrogen atoms",
          explanation: "Reactants now have $4 \\times 2 = 8$ hydrogen atoms. Multiply $\\text{H}_2$ by 4 on the products side.",
          mathExpression: "\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2"
        },
        {
          stepNumber: 4,
          title: "Balance the iron (Fe) atoms",
          explanation: "Product has 3 iron atoms. Multiply $\\text{Fe}$ by 3 on the reactant side.",
          mathExpression: "3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2"
        }
      ],
      finalAnswer: "The balanced chemical equation is: $3\\text{Fe} + 4\\text{H}_2\\text{O} \\rightarrow \\text{Fe}_3\\text{O}_4 + 4\\text{H}_2$.",
      whyMethodWorks: "According to Dalton's atomic theory and conservation of mass, the total number of atoms of each element must remain constant before and after a chemical reaction.",
      realWorldAnalogy: "Like building toy cars: if you have 3 chassis and 4 sets of wheels, your final assembled cars must account for every single wheel.",
      commonMistakes: "Changing chemical subscripts (like writing $\\text{H}_2\\text{O}_4$) instead of modifying stoichiometric coefficients in front.",
      understandingCheckQuestion: {
        question: "Why are chemical formulas (subscripts) never changed while balancing an equation?",
        options: [
          "It is too messy to rewrite",
          "Changing subscripts alters the chemical identity of the substance",
          "Subscripts only indicate temperature",
          "There is no rule against changing subscripts"
        ],
        correctOptionIndex: 1,
        explanation: "Subscripts define the chemical formula and identity of a molecule (e.g., $H_2O$ is water, while $H_2O_2$ is hydrogen peroxide)."
      },
      suggestedNextTopic: "Types of chemical reactions: Combination, Decomposition, Displacement, and Redox"
    };
  }

  // General Socratic fallback for any other question
  return {
    questionIntent: `Analyze and understand the problem: "${question.slice(0, 100)}"`,
    requiredConcepts: [
      `${subject.toUpperCase()} Core Principles`,
      "Fundamental Definitions & Units",
      "Systematic Step-by-Step Problem Solving"
    ],
    stepByStepReasoning: [
      {
        stepNumber: 1,
        title: "Define given quantities and constraints",
        explanation: `Identify what is explicitly given in the problem for Grade ${grade} and what needs to be determined.`,
        mathExpression: "\\text{Given} \\rightarrow \\text{Formula} \\rightarrow \\text{Solution}"
      },
      {
        stepNumber: 2,
        title: "Select the appropriate governing formula",
        explanation: "Connect the known quantities to the unknown using verified physical/mathematical laws.",
        mathExpression: "\\text{Output} = f(\\text{Inputs})"
      },
      {
        stepNumber: 3,
        title: "Execute calculations with dimensional checks",
        explanation: "Substitute numbers carefully, checking unit consistency at every step.",
        mathExpression: "\\text{Result with units}"
      }
    ],
    finalAnswer: `Step-by-step resolution completed for Grade ${grade} ${subject}.`,
    whyMethodWorks: "Socratic systematic derivation guarantees accuracy and deep conceptual mastery rather than rote memorization.",
    realWorldAnalogy: "Like following a recipe: measuring ingredients in correct order ensures the final result turns out perfect every time.",
    commonMistakes: "Skipping unit conversions or jumping straight to numbers without stating the formula.",
    understandingCheckQuestion: {
      question: "Which of the following is the most important first step when approaching any STEM problem?",
      options: [
        "Immediately guess the final numerical answer",
        "Write down the given quantities and state the governing formula",
        "Use a calculator without understanding the formula",
        "Skip the problem if it involves fractions"
      ],
      correctOptionIndex: 1,
      explanation: "Writing given parameters and the formula organizes your thought process and prevents arithmetic errors."
    },
    suggestedNextTopic: `Core Grade ${grade} ${subject} Foundation Exercises`
  };
}

export function getMockVisionTranscription(
  subject: string = 'math',
  fileName: string = 'image.png'
): VisionTranscription {
  return {
    extractedText: "Solve the quadratic equation: 3x^2 + 5x - 2 = 0",
    identifiedSubject: subject as any,
    equationsDetected: ["3x^2 + 5x - 2 = 0"],
    diagramElements: ["Handwritten algebraic notation", "Grade 10 polynomial form"],
    confidenceLevel: "high",
    uncertaintyNotes: "All symbols clearly resolved. Leading coefficient is 3, linear coefficient is 5, constant is -2.",
    clarificationNeeded: false,
    suggestedClarificationQuestion: ""
  };
}

export function getMockQuiz(topicId: string, topicTitle: string, grade: number): QuizGeneration {
  return {
    topicId,
    title: `${topicTitle} Diagnostic Quiz`,
    questions: [
      {
        id: "q-demo-1",
        concept: "Standard Form & Coefficients",
        difficulty: "easy",
        question: "In the quadratic equation $3x^2 - 5x + 2 = 0$, what are the values of $a$, $b$, and $c$?",
        options: [
          "a = 3, b = 5, c = 2",
          "a = 3, b = -5, c = 2",
          "a = -3, b = -5, c = 2",
          "a = 3, b = -5, c = -2"
        ],
        correctAnswerIndex: 1,
        explanation: "Comparing with $ax^2 + bx + c = 0$, the coefficient of $x$ carries the negative sign, so $b = -5$.",
        hint: "Don't forget to include the negative sign with the coefficient of x."
      },
      {
        id: "q-demo-2",
        concept: "Discriminant Nature of Roots",
        difficulty: "medium",
        question: "What is the discriminant $D = b^2 - 4ac$ for the equation $x^2 - 4x + 4 = 0$?",
        options: [
          "D = 16",
          "D = -16",
          "D = 0 (Roots are real and equal)",
          "D = 8"
        ],
        correctAnswerIndex: 2,
        explanation: "Here $a = 1, b = -4, c = 4$. $D = (-4)^2 - 4(1)(4) = 16 - 16 = 0$. Since $D = 0$, the roots are real and equal.",
        hint: "Calculate (-4)^2 first, then subtract 4 * 1 * 4."
      },
      {
        id: "q-demo-3",
        concept: "Root Solving Application",
        difficulty: "medium",
        question: "What are the roots of the equation $x^2 - 5x + 6 = 0$?",
        options: [
          "x = 2 and x = 3",
          "x = -2 and x = -3",
          "x = 1 and x = 6",
          "x = -1 and x = -6"
        ],
        correctAnswerIndex: 0,
        explanation: "Factoring: $(x - 2)(x - 3) = 0 \\implies x = 2$ or $x = 3$. Both satisfy the equation.",
        hint: "Find two numbers that multiply to +6 and add up to -5."
      }
    ]
  };
}
