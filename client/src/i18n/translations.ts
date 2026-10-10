export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    dashboard: string;
    tutor: string;
    visionLab: string;
    learningHub: string;
    learningPath: string;
    quizCenter: string;
    analytics: string;
    notes: string;
    settings: string;
  };
  subjects: {
    math: string;
    physics: string;
    chemistry: string;
  };
  common: {
    grade: string;
    streak: string;
    points: string;
    minutes: string;
    askTutor: string;
    submit: string;
    loading: string;
    demoMode: string;
    liveMode: string;
    offline: string;
    online: string;
    save: string;
    copy: string;
    listen: string;
    stopAudio: string;
    retry: string;
  };
  tutor: {
    inputPlaceholder: string;
    styleSimple: string;
    styleStepByStep: string;
    styleVisual: string;
    whatIsAsking: string;
    conceptsNeeded: string;
    stepByStepReasoning: string;
    finalAnswer: string;
    whyMethodWorks: string;
    realWorldAnalogy: string;
    commonMistake: string;
    checkUnderstanding: string;
    suggestedNext: string;
    practiceSimilar: string;
    savedToNotes: string;
  };
  vision: {
    title: string;
    subtitle: string;
    uploadButton: string;
    dragDropText: string;
    transcriptionResult: string;
    clarificationWarning: string;
    solveNow: string;
  };
  quiz: {
    title: string;
    instantFeedback: string;
    correct: string;
    incorrect: string;
    explanation: string;
    score: string;
    masteryUpdated: string;
    recommendedTopic: string;
  };
}

export const translations: Record<'en' | 'te' | 'hi', Translations> = {
  en: {
    appName: "Learnova AI",
    tagline: "Your Personal Socratic STEM Companion",
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      tutor: "AI Tutor",
      visionLab: "Vision & Handwriting Lab",
      learningHub: "Subject Hub",
      learningPath: "Learning Path",
      quizCenter: "Practice & Quizzes",
      analytics: "Analytics",
      notes: "Saved Notes",
      settings: "Settings",
    },
    subjects: {
      math: "Mathematics",
      physics: "Physics",
      chemistry: "Chemistry",
    },
    common: {
      grade: "Grade",
      streak: "Day Streak",
      points: "XP Points",
      minutes: "Mins Learned",
      askTutor: "Ask Learnova",
      submit: "Submit",
      loading: "Thinking step-by-step...",
      demoMode: "Demo Mode (Mock Socratic Engine)",
      liveMode: "Live Gemini AI Active",
      offline: "Offline Mode",
      online: "Online",
      save: "Save to Notes",
      copy: "Copy Answer",
      listen: "Listen",
      stopAudio: "Stop",
      retry: "Retry",
    },
    tutor: {
      inputPlaceholder: "Ask any math, physics, or chemistry question (e.g., 'Solve 2x^2 - 7x + 3 = 0 step-by-step')...",
      styleSimple: "Simple & Intuitive",
      styleStepByStep: "Step-by-Step Rigorous",
      styleVisual: "Visual & Detailed",
      whatIsAsking: "Problem Intent & Goal",
      conceptsNeeded: "Key Concepts Required",
      stepByStepReasoning: "Step-by-Step Derivation",
      finalAnswer: "Final Answer",
      whyMethodWorks: "Why This Method Works",
      realWorldAnalogy: "Everyday Connection",
      commonMistake: "Common Pitfall to Avoid",
      checkUnderstanding: "Quick Understanding Check",
      suggestedNext: "Recommended Next Concept",
      practiceSimilar: "Practice a Similar Question",
      savedToNotes: "Saved to Notes!",
    },
    vision: {
      title: "Multimodal Vision & Handwriting Lab",
      subtitle: "Upload handwritten equations, textbook pages, or scientific diagrams",
      uploadButton: "Choose Image or Snap Photo",
      dragDropText: "Drop handwritten work, diagram, or textbook page here",
      transcriptionResult: "Transcribed Problem & Recognized Equations",
      clarificationWarning: "Unclear or ambiguous handwriting detected. Please review before solving.",
      solveNow: "Solve Socratic Problem Step-by-Step",
    },
    quiz: {
      title: "Adaptive STEM Quiz & Mastery Check",
      instantFeedback: "Instant Diagnostic Feedback",
      correct: "Correct! Outstanding work.",
      incorrect: "Not quite, but here is where the concept clicks:",
      explanation: "Conceptual Breakdown:",
      score: "Your Score",
      masteryUpdated: "Mastery Updated!",
      recommendedTopic: "Recommended Next Step:",
    },
  },
  te: {
    appName: "లెర్నోవా AI (Learnova)",
    tagline: "మీ వ్యక్తిగత సోక్రటిక్ సైన్స్ & మ్యాథ్స్ ట్యూటర్",
    nav: {
      home: "హోమ్",
      dashboard: "డాష్‌బోర్డ్",
      tutor: "AI ట్యూటర్",
      visionLab: "విజన్ & చేతిరాత ల్యాబ్",
      learningHub: "సబ్జెక్ట్ హబ్",
      learningPath: "లెర్నింగ్ పాత్",
      quizCenter: "ప్రాక్టీస్ & క్విజ్‌లు",
      analytics: "పురోగతి",
      notes: "సేవ్ చేసిన నోట్స్",
      settings: "సెట్టింగులు",
    },
    subjects: {
      math: "గణితం (Mathematics)",
      physics: "భౌతిక శాస్త్రం (Physics)",
      chemistry: "రసాయన శాస్త్రం (Chemistry)",
    },
    common: {
      grade: "తరగతి",
      streak: "రోజుల స్ట్రీక్",
      points: "XP పాయింట్లు",
      minutes: "నేర్చుకున్న సమయం (నిమి)",
      askTutor: "ట్యూటర్‌ని అడగండి",
      submit: "సమర్పించు",
      loading: "వివరణ సిద్ధమవుతోంది...",
      demoMode: "డెమో మోడ్ (ఆఫ్‌లైన్ సోక్రటిక్ ఇంజిన్)",
      liveMode: "లైవ్ జెమినీ AI అనుసంధానించబడింది",
      offline: "ఆఫ్‌లైన్ మోడ్",
      online: "ఆన్‌లైన్",
      save: "నోట్స్‌లో భద్రపరచు",
      copy: "సమాధానం కాపీ చేయి",
      listen: "వినండి",
      stopAudio: "ఆపండి",
      retry: "మళ్ళీ ప్రయత్నించు",
    },
    tutor: {
      inputPlaceholder: "గణితం, భౌతిక లేదా రసాయన శాస్త్ర ప్రశ్నను అడగండి...",
      styleSimple: "సరళమైన వివరణ",
      styleStepByStep: "దశలవారీగా వివరణ",
      styleVisual: "దృశ్యరూప వివరణ",
      whatIsAsking: "ప్రశ్న యొక్క ఉద్దేశ్యం",
      conceptsNeeded: "అవసరమైన ముఖ్య భావనలు",
      stepByStepReasoning: "దశలవారీ సాధన & లెక్కలు",
      finalAnswer: "తుది సమాధానం",
      whyMethodWorks: "ఈ పద్ధతి ఎందుకు పనిచేస్తుంది?",
      realWorldAnalogy: "నిత్యజీవిత ఉదాహరణ",
      commonMistake: "సాధారణంగా చేసే తప్పు",
      checkUnderstanding: "అవగాహన పరీక్ష ప్రశ్న",
      suggestedNext: "తదుపరి అధ్యయనం చేయవలసిన అంశం",
      practiceSimilar: "ఇలాంటి ప్రశ్నను సాధించండి",
      savedToNotes: "నోట్స్‌లో భద్రపరచబడింది!",
    },
    vision: {
      title: "విజన్ & చేతిరాత ల్యాబ్",
      subtitle: "చేతిరాతతో రాసిన సమీకరణాలు లేదా రేఖాచిత్రాలను అప్‌లోడ్ చేయండి",
      uploadButton: "చిత్రాన్ని ఎంచుకోండి",
      dragDropText: "చిత్రాన్ని ఇక్కడ డ్రాగ్ చేయండి",
      transcriptionResult: "గుర్తించిన సమీకరణాలు & పాఠ్యం",
      clarificationWarning: "చేతిరాత స్పష్టంగా లేదు. దయచేసి సమీక్షించండి.",
      solveNow: "దశలవారీగా సాధించు",
    },
    quiz: {
      title: "అడాప్టివ్ క్విజ్ & నైపుణ్య పరీక్ష",
      instantFeedback: "వెంటనే వివరణతో కూడిన ఫలితం",
      correct: "సరైన సమాధానం! అద్భుతం.",
      incorrect: "తప్పు సమాధానం, కానీ భావనను అర్థం చేసుకోండి:",
      explanation: "వివరణ:",
      score: "మీ స్కోరు",
      masteryUpdated: "నైపుణ్యం అప్‌డేట్ చేయబడింది!",
      recommendedTopic: "సిఫార్సు చేయబడిన తదుపరి అంశం:",
    },
  },
  hi: {
    appName: "लर्नोवा AI (Learnova)",
    tagline: "आपका व्यक्तिगत सोक्रेटिक STEM साथी",
    nav: {
      home: "होम",
      dashboard: "डैशबोर्ड",
      tutor: "AI ट्यूटर",
      visionLab: "विज़न व हस्तलेखन लैब",
      learningHub: "विषय हब",
      learningPath: "लर्निंग पाथ",
      quizCenter: "अभ्यास व क्विज़",
      analytics: "प्रगति व विश्लेषण",
      notes: "सहेजे गए नोट्स",
      settings: "सेटिंग्स",
    },
    subjects: {
      math: "गणित (Mathematics)",
      physics: "भौतिक विज्ञान (Physics)",
      chemistry: "रसायन विज्ञान (Chemistry)",
    },
    common: {
      grade: "कक्षा",
      streak: "दिनों की स्ट्रीक",
      points: "XP अंक",
      minutes: "अध्ययन मिनट",
      askTutor: "ट्यूटर से पूछें",
      submit: "जमा करें",
      loading: "कदम-दर-कदम समझ तैयार हो रही है...",
      demoMode: "डेमो मोड (ऑफलाइन सोक्रेटिक इंजन)",
      liveMode: "लाइव जेमिनी AI सक्रिय",
      offline: "ऑफलाइन मोड",
      online: "ऑनलाइन",
      save: "नोट्स में सहेजें",
      copy: "उत्तर कॉपी करें",
      listen: "सुनें",
      stopAudio: "रोकें",
      retry: "पुनः प्रयास करें",
    },
    tutor: {
      inputPlaceholder: "गणित, भौतिकी या रसायन विज्ञान का कोई भी प्रश्न पूछें...",
      styleSimple: "सरल व सहज",
      styleStepByStep: "कदम-दर-कदम विस्तृत",
      styleVisual: "चित्रात्मक व गहन",
      whatIsAsking: "प्रश्न का मुख्य उद्देश्य",
      conceptsNeeded: "आवश्यक मुख्य संकल्पनाएं",
      stepByStepReasoning: "कदम-दर-कदम गणना व तर्क",
      finalAnswer: "अंतिम उत्तर",
      whyMethodWorks: "यह विधि क्यों कार्य करती है?",
      realWorldAnalogy: "दैनिक जीवन का उदाहरण",
      commonMistake: "सामान्य गलती जिससे बचें",
      checkUnderstanding: "समझ की त्वरित जांच",
      suggestedNext: "सुझाया गया अगला विषय",
      practiceSimilar: "समान प्रश्न का अभ्यास करें",
      savedToNotes: "नोट्स में सहेज लिया गया!",
    },
    vision: {
      title: "विज़न व हस्तलेखन लैब",
      subtitle: "हाथ से लिखे समीकरण, आरेख या पुस्तक पृष्ठ अपलोड करें",
      uploadButton: "छवि चुनें",
      dragDropText: "छवि को यहाँ खींचकर लाएँ",
      transcriptionResult: "पहचाने गए समीकरण व पाठ्य",
      clarificationWarning: "हस्तलेखन कुछ अस्पष्ट है। कृपया हल करने से पहले पुष्टि करें।",
      solveNow: "कदम-दर-कदम हल करें",
    },
    quiz: {
      title: "अनुकूली क्विज़ व महारत परीक्षण",
      instantFeedback: "त्वरित संकल्पनात्मक फीडबैक",
      correct: "बिल्कुल सही! बहुत बढ़िया।",
      incorrect: "गलत, लेकिन यहाँ समझें कि सिद्धांत कैसे काम करता है:",
      explanation: "संकल्पनात्मक व्याख्या:",
      score: "आपका स्कोर",
      masteryUpdated: "महारत स्तर अपडेट हुआ!",
      recommendedTopic: "अनुशंसित अगला कदम:",
    },
  },
};
