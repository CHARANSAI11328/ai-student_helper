import fs from 'fs';
import path from 'path';

export interface StudentProfile {
  id: string;
  name: string;
  grade: number;
  language: string; // 'en' | 'te' | 'hi'
  strongSubjects: string[];
  weakSubjects: string[];
  learningGoals: string;
  explanationStyle: 'simple' | 'step_by_step' | 'visual_detailed';
  confidenceLevel: 'beginner' | 'moderate' | 'confident';
  streakCount: number;
  totalStudyMinutes: number;
  xpPoints: number;
  lastActiveDate: string;
}

export interface Topic {
  id: string;
  subjectId: 'math' | 'physics' | 'chemistry';
  grade: number;
  title: string;
  slug: string;
  orderIndex: number;
  description: string;
  prerequisites: string[];
  keyFormulas: Array<{ name: string; latex: string }>;
}

export interface TopicProgress {
  topicId: string;
  status: 'not_started' | 'in_progress' | 'needs_revision' | 'mastered';
  masteryScore: number; // 0.0 to 1.0
  attemptsCount: number;
  correctCount: number;
  lastMistakeConcept?: string;
  lastPracticedAt: string;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  subject: string;
  topicId: string;
  topicTitle: string;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  weakConcepts: string[];
  createdAt: string;
}

export interface SavedNote {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  topicId?: string;
  contentMarkdown: string;
  isPinned: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  xpReward: number;
  category: string;
  unlockedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'student' | 'tutor';
  content: string;
  structuredResponse?: any;
  imageUrl?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  grade: number;
  language: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export class DataStore {
  private static instance: DataStore;
  private filePath = path.resolve(process.cwd(), 'data', 'store.json');

  public profile: StudentProfile;
  public topics: Topic[] = [];
  public progress: Record<string, TopicProgress> = {};
  public quizAttempts: QuizAttempt[] = [];
  public savedNotes: SavedNote[] = [];
  public achievements: Achievement[] = [];
  public unlockedAchievementIds: Set<string> = new Set();
  public conversations: Conversation[] = [];

  private constructor() {
    this.profile = this.getDefaultDemoProfile();
    this.initDefaultTopics();
    this.initDefaultAchievements();
    this.initDefaultDemoData();
    this.loadFromFile();
  }

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  public getDefaultDemoProfile(): StudentProfile {
    return {
      id: 'demo-student-aarav',
      name: 'Aarav Sharma',
      grade: 10,
      language: 'en',
      strongSubjects: ['physics'],
      weakSubjects: ['math'],
      learningGoals: 'Master Class 10 Board Exam STEM fundamentals and score 95%+',
      explanationStyle: 'step_by_step',
      confidenceLevel: 'moderate',
      streakCount: 4,
      totalStudyMinutes: 185,
      xpPoints: 420,
      lastActiveDate: new Date().toISOString().split('T')[0]
    };
  }

  private initDefaultTopics() {
    this.topics = [
      // Mathematics (Grade 9 & 10)
      {
        id: 'math-alg-lin',
        subjectId: 'math',
        grade: 9,
        title: 'Linear Equations in Two Variables',
        slug: 'linear-equations',
        orderIndex: 1,
        description: 'Simultaneous equations, graphical solutions, and algebraic word problems.',
        prerequisites: ['Basic Algebraic Operations'],
        keyFormulas: [{ name: 'Standard Form', latex: 'ax + by + c = 0' }]
      },
      {
        id: 'math-alg-quad',
        subjectId: 'math',
        grade: 10,
        title: 'Quadratic Equations',
        slug: 'quadratic-equations',
        orderIndex: 2,
        description: 'Roots of quadratics, discriminant nature, factoring, and formula method.',
        prerequisites: ['Linear Equations in Two Variables'],
        keyFormulas: [
          { name: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
          { name: 'Discriminant', latex: 'D = b^2 - 4ac' }
        ]
      },
      {
        id: 'math-arith-prog',
        subjectId: 'math',
        grade: 10,
        title: 'Arithmetic Progressions',
        slug: 'arithmetic-progressions',
        orderIndex: 3,
        description: 'Sequences, nth term formula, sum of first n terms, and real-life patterns.',
        prerequisites: ['Linear Equations in Two Variables'],
        keyFormulas: [
          { name: 'nth Term', latex: 'a_n = a + (n-1)d' },
          { name: 'Sum of n terms', latex: 'S_n = \\frac{n}{2}[2a + (n-1)d]' }
        ]
      },
      {
        id: 'math-geom-tri',
        subjectId: 'math',
        grade: 9,
        title: 'Triangles & Similarity',
        slug: 'triangles-similarity',
        orderIndex: 4,
        description: 'Pythagorean theorem, congruence criteria, and similar triangles.',
        prerequisites: ['Lines and Angles'],
        keyFormulas: [{ name: 'Pythagorean Theorem', latex: 'a^2 + b^2 = c^2' }]
      },
      {
        id: 'math-trig-intro',
        subjectId: 'math',
        grade: 10,
        title: 'Introduction to Trigonometry',
        slug: 'intro-trigonometry',
        orderIndex: 5,
        description: 'Trigonometric ratios (sin, cos, tan), standard values, and identity proofs.',
        prerequisites: ['Triangles & Similarity'],
        keyFormulas: [{ name: 'Trig Identity 1', latex: '\\sin^2\\theta + \\cos^2\\theta = 1' }]
      },

      // Physics (Grade 9 & 10)
      {
        id: 'phys-motion-1d',
        subjectId: 'physics',
        grade: 9,
        title: 'Motion & Kinematics',
        slug: 'motion-kinematics',
        orderIndex: 1,
        description: 'Uniform motion, acceleration, distance-time graphs, and equations of motion.',
        prerequisites: ['Basic Units and Measurements'],
        keyFormulas: [
          { name: 'First Equation of Motion', latex: 'v = u + at' },
          { name: 'Second Equation of Motion', latex: 's = ut + \\frac{1}{2}at^2' },
          { name: 'Third Equation of Motion', latex: 'v^2 = u^2 + 2as' }
        ]
      },
      {
        id: 'phys-force-laws',
        subjectId: 'physics',
        grade: 9,
        title: 'Force & Newton\'s Laws',
        slug: 'force-newtons-laws',
        orderIndex: 2,
        description: 'Inertia, momentum, action-reaction pairs, and friction fundamentals.',
        prerequisites: ['Motion & Kinematics'],
        keyFormulas: [
          { name: 'Newton\'s Second Law', latex: 'F = ma' },
          { name: 'Momentum', latex: 'p = mv' }
        ]
      },
      {
        id: 'phys-elec-circuits',
        subjectId: 'physics',
        grade: 10,
        title: 'Electricity & Ohm\'s Law',
        slug: 'electricity-ohms-law',
        orderIndex: 3,
        description: 'Electric current, potential difference, Ohm\'s law, series & parallel circuits, electrical power.',
        prerequisites: ['Force & Newton\'s Laws'],
        keyFormulas: [
          { name: 'Ohm\'s Law', latex: 'V = IR' },
          { name: 'Parallel Resistors', latex: '\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}' },
          { name: 'Electrical Power', latex: 'P = VI = I^2R = \\frac{V^2}{R}' }
        ]
      },
      {
        id: 'phys-light-optics',
        subjectId: 'physics',
        grade: 10,
        title: 'Light: Reflection & Refraction',
        slug: 'light-optics',
        orderIndex: 4,
        description: 'Spherical mirrors, mirror formula, refractive index, Snell\'s law, and lenses.',
        prerequisites: ['Motion & Kinematics'],
        keyFormulas: [
          { name: 'Mirror Formula', latex: '\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}' },
          { name: 'Snell\'s Law', latex: 'n = \\frac{\\sin i}{\\sin r}' }
        ]
      },

      // Chemistry (Grade 9 & 10)
      {
        id: 'chem-reac-eq',
        subjectId: 'chemistry',
        grade: 10,
        title: 'Chemical Reactions & Balancing',
        slug: 'chemical-reactions',
        orderIndex: 1,
        description: 'Balancing chemical equations, combination, decomposition, displacement, and redox.',
        prerequisites: ['Elements and Compounds'],
        keyFormulas: [{ name: 'Conservation of Mass', latex: '\\sum m_{\\text{reactants}} = \\sum m_{\\text{products}}' }]
      },
      {
        id: 'chem-acids-bases',
        subjectId: 'chemistry',
        grade: 10,
        title: 'Acids, Bases & Salts',
        slug: 'acids-bases-salts',
        orderIndex: 2,
        description: 'pH scale, indicator reactions, neutralization, and practical salt applications.',
        prerequisites: ['Chemical Reactions & Balancing'],
        keyFormulas: [{ name: 'pH Scale', latex: '\\text{pH} = -\\log[H^+]' }]
      },
      {
        id: 'chem-atom-struc',
        subjectId: 'chemistry',
        grade: 9,
        title: 'Structure of the Atom',
        slug: 'structure-of-atom',
        orderIndex: 3,
        description: 'Subatomic particles (electrons, protons, neutrons), Bohr model, valency, isotopes.',
        prerequisites: ['Matter in Surroundings'],
        keyFormulas: [{ name: 'Mass Number', latex: 'A = Z + N' }]
      },
      {
        id: 'chem-carbon-comp',
        subjectId: 'chemistry',
        grade: 10,
        title: 'Carbon and its Compounds',
        slug: 'carbon-compounds',
        orderIndex: 4,
        description: 'Covalent bonding, homologous series, functional groups, and carbon versatility.',
        prerequisites: ['Structure of the Atom'],
        keyFormulas: [{ name: 'Alkane General Formula', latex: 'C_n H_{2n+2}' }]
      }
    ];
  }

  private initDefaultAchievements() {
    this.achievements = [
      { id: 'ach-first-step', title: 'Curious Step', description: 'Asked your first question to Learnova AI', badgeIcon: 'Sparkles', xpReward: 50, category: 'learning' },
      { id: 'ach-math-solver', title: 'Algebra Master', description: 'Completed quadratic equation breakdown', badgeIcon: 'Brain', xpReward: 100, category: 'math' },
      { id: 'ach-streak-3', title: '3-Day Fire', description: 'Maintained a 3-day active study streak', badgeIcon: 'Flame', xpReward: 150, category: 'streak' },
      { id: 'ach-vision-lab', title: 'Vision Pioneer', description: 'Transcribed handwritten problem in Vision Lab', badgeIcon: 'Camera', xpReward: 120, category: 'vision' },
      { id: 'ach-quiz-champion', title: 'Quiz Ace', description: 'Scored 100% on a diagnostic topic quiz', badgeIcon: 'Trophy', xpReward: 200, category: 'quiz' }
    ];
  }

  public initDefaultDemoData() {
    // Populate realistic progress state showing active learning & clear adaptive targets
    this.progress = {
      'math-alg-lin': {
        topicId: 'math-alg-lin',
        status: 'mastered',
        masteryScore: 0.92,
        attemptsCount: 8,
        correctCount: 8,
        lastPracticedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      'math-alg-quad': {
        topicId: 'math-alg-quad',
        status: 'needs_revision',
        masteryScore: 0.45,
        attemptsCount: 6,
        correctCount: 2,
        lastMistakeConcept: 'Discriminant signs when b is negative',
        lastPracticedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      'phys-motion-1d': {
        topicId: 'phys-motion-1d',
        status: 'mastered',
        masteryScore: 0.88,
        attemptsCount: 5,
        correctCount: 5,
        lastPracticedAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      'phys-elec-circuits': {
        topicId: 'phys-elec-circuits',
        status: 'in_progress',
        masteryScore: 0.65,
        attemptsCount: 4,
        correctCount: 3,
        lastMistakeConcept: 'Parallel equivalent resistance reciprocal',
        lastPracticedAt: new Date(Date.now() - 3600000 * 8).toISOString()
      },
      'chem-reac-eq': {
        topicId: 'chem-reac-eq',
        status: 'mastered',
        masteryScore: 0.95,
        attemptsCount: 6,
        correctCount: 6,
        lastPracticedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      'chem-acids-bases': {
        topicId: 'chem-acids-bases',
        status: 'not_started',
        masteryScore: 0.0,
        attemptsCount: 0,
        correctCount: 0,
        lastPracticedAt: new Date().toISOString()
      }
    };

    this.unlockedAchievementIds = new Set(['ach-first-step', 'ach-streak-3']);

    this.quizAttempts = [
      {
        id: 'quiz-att-1',
        studentId: 'demo-student-aarav',
        subject: 'math',
        topicId: 'math-alg-quad',
        topicTitle: 'Quadratic Equations',
        score: 1,
        totalQuestions: 3,
        timeSpentSeconds: 140,
        weakConcepts: ['Discriminant calculation with negative coefficients'],
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'quiz-att-2',
        studentId: 'demo-student-aarav',
        subject: 'physics',
        topicId: 'phys-elec-circuits',
        topicTitle: 'Electricity & Ohm\'s Law',
        score: 2,
        totalQuestions: 3,
        timeSpentSeconds: 120,
        weakConcepts: ['Parallel resistor reciprocal formula'],
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ];

    this.savedNotes = [
      {
        id: 'note-1',
        studentId: 'demo-student-aarav',
        title: 'Quadratic Formula & Discriminant Rules',
        subject: 'math',
        topicId: 'math-alg-quad',
        contentMarkdown: `### Quadratic Roots Summary\nFor $ax^2 + bx + c = 0$:\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n- $D > 0$: Two distinct real roots\n- $D = 0$: Two equal real roots (perfect square)\n- $D < 0$: No real roots (complex)\n\n*Common mistake*: When $b = -7$, $-b = -(-7) = +7$.`,
        isPinned: true,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: 'note-2',
        studentId: 'demo-student-aarav',
        title: 'Ohm\'s Law and Parallel Resistors',
        subject: 'physics',
        topicId: 'phys-elec-circuits',
        contentMarkdown: `### Resistor Rules\n- **Series**: $R_{eq} = R_1 + R_2$\n- **Parallel**: $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$\n- Remember: Parallel resistance is ALWAYS less than the smallest resistor!`,
        isPinned: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }

  public resetDemoData() {
    this.profile = this.getDefaultDemoProfile();
    this.initDefaultDemoData();
    this.saveToFile();
  }

  private saveToFile() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = {
        profile: this.profile,
        progress: this.progress,
        quizAttempts: this.quizAttempts,
        savedNotes: this.savedNotes,
        unlockedAchievementIds: Array.from(this.unlockedAchievementIds),
        conversations: this.conversations
      };
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to persist data store to disk:', err);
    }
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (data.profile) this.profile = data.profile;
        if (data.progress) this.progress = data.progress;
        if (data.quizAttempts) this.quizAttempts = data.quizAttempts;
        if (data.savedNotes) this.savedNotes = data.savedNotes;
        if (data.unlockedAchievementIds) this.unlockedAchievementIds = new Set(data.unlockedAchievementIds);
        if (data.conversations) this.conversations = data.conversations;
      }
    } catch (err) {
      console.warn('Could not load data store from disk, using in-memory state:', err);
    }
  }

  public updateProfile(updates: Partial<StudentProfile>): StudentProfile {
    this.profile = { ...this.profile, ...updates };
    this.saveToFile();
    return this.profile;
  }

  public addQuizAttempt(attempt: QuizAttempt) {
    this.quizAttempts.unshift(attempt);
    this.saveToFile();
  }

  public updateTopicProgress(progress: TopicProgress) {
    this.progress[progress.topicId] = progress;
    this.saveToFile();
  }

  public addSavedNote(note: SavedNote) {
    this.savedNotes.unshift(note);
    this.saveToFile();
  }

  public deleteSavedNote(id: string) {
    this.savedNotes = this.savedNotes.filter(n => n.id !== id);
    this.saveToFile();
  }

  public unlockAchievement(id: string): boolean {
    if (!this.unlockedAchievementIds.has(id)) {
      this.unlockedAchievementIds.add(id);
      const ach = this.achievements.find(a => a.id === id);
      if (ach) {
        this.profile.xpPoints += ach.xpReward;
      }
      this.saveToFile();
      return true;
    }
    return false;
  }
}
