import esbuild from 'esbuild';

try {
  esbuild.buildSync({
    entryPoints: ['server/src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: 'server/dist/index.js',
    external: [
      '@google/generative-ai',
      'express',
      'cors',
      'helmet',
      'multer',
      'dotenv',
      'canvas-confetti',
      'katex',
      'express-rate-limit'
    ]
  });
  console.log('⚡ Server build complete: server/dist/index.js');
} catch (err) {
  console.error('Server build failed:', err);
  process.exit(1);
}
