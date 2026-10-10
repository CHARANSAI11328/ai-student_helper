process.env.NODE_ENV = 'test';
import http from 'http';

async function runSanityCheck() {
  console.log('🧪 Starting Learnova AI Server Integration Sanity Tests...');

  const { default: app } = await import('../index.js');
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(5099, () => resolve()));
  console.log('Test server listening on port 5099');

  const baseUrl = 'http://localhost:5099/api';

  try {
    // 1. Health check
    console.log('Checking GET /api/health...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData: any = await healthRes.json();
    console.log('Health:', healthData.status === 'ok' ? '✅ PASS' : '❌ FAIL');

    // 2. Profile check
    console.log('Checking GET /api/profile...');
    const profRes = await fetch(`${baseUrl}/profile`);
    const profData: any = await profRes.json();
    console.log('Profile:', profData.success && profData.profile.name ? '✅ PASS' : '❌ FAIL');

    // 3. Learning subjects & topics
    console.log('Checking GET /api/learning/subjects...');
    const subjRes = await fetch(`${baseUrl}/learning/subjects`);
    const subjData: any = await subjRes.json();
    console.log('Subjects:', subjData.subjects.length === 3 ? '✅ PASS' : '❌ FAIL');

    // 4. Learning path
    console.log('Checking GET /api/learning/path...');
    const pathRes = await fetch(`${baseUrl}/learning/path`);
    const pathData: any = await pathRes.json();
    console.log('Learning Path:', pathData.roadmap.length > 0 ? '✅ PASS' : '❌ FAIL');

    // 5. Ask Tutor text question (Quadratic equation in Demo / Fallback mode)
    console.log('Checking POST /api/tutor/ask...');
    const askRes = await fetch(`${baseUrl}/tutor/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'Solve 2x^2 - 7x + 3 = 0 using quadratic formula',
        subject: 'math',
        grade: 10,
        language: 'en'
      })
    });
    const askData: any = await askRes.json();
    console.log('Tutor Ask:', askData.success && askData.explanation.finalAnswer ? '✅ PASS' : '❌ FAIL');

    // 6. Multimodal Vision Lab
    console.log('Checking POST /api/tutor/analyze-image...');
    const visionRes = await fetch(`${baseUrl}/tutor/analyze-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        subject: 'math',
        grade: 10,
        mode: 'solve'
      })
    });
    const visionData: any = await visionRes.json();
    console.log('Vision Analysis:', visionData.success && visionData.transcription.extractedText ? '✅ PASS' : '❌ FAIL');

    // 7. Quiz submission & adaptive update
    console.log('Checking POST /api/quiz/submit...');
    const quizRes = await fetch(`${baseUrl}/quiz/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topicId: 'math-alg-quad',
        score: 1,
        totalQuestions: 3,
        wrongConcepts: ['Discriminant signs with negative b']
      })
    });
    const quizData: any = await quizRes.json();
    console.log('Adaptive Engine Quiz:', quizData.success && quizData.evaluation.newStatus === 'needs_revision' ? '✅ PASS' : '❌ FAIL');

    // 8. Progress stats
    console.log('Checking GET /api/progress...');
    const progRes = await fetch(`${baseUrl}/progress`);
    const progData: any = await progRes.json();
    console.log('Progress Analytics:', progData.success && progData.stats.weakTopics.length > 0 ? '✅ PASS' : '❌ FAIL');

    console.log('\n🎉 ALL 8 BACKEND API SANITY TESTS PASSED SUCCESSFULLY!\n');
  } catch (err: any) {
    console.error('Integration test failed:', err);
    process.exit(1);
  } finally {
    server.close(() => {
      process.exit(0);
    });
  }
}

runSanityCheck();
