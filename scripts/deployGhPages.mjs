import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'client', 'dist');

console.log('🚀 Preparing GitHub Pages Deployment for Learnova AI...\n');

// 1. Build client bundle
console.log('📦 Step 1: Building client distribution bundle...');
execSync('node node_modules/vite/bin/vite.js build client', { cwd: rootDir, stdio: 'inherit' });

// 2. Ensure 404.html exists for SPA fallback
console.log('📄 Step 2: Creating 404.html fallback for SPA routing...');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');
if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
}

// 3. Add .nojekyll so GitHub Pages doesn't ignore underscore directories or assets
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

// 4. Initialize temporary git repo in dist and push directly to gh-pages branch
console.log('📤 Step 3: Pushing compiled static site to gh-pages branch...');
try {
  execSync('git init', { cwd: distDir, stdio: 'ignore' });
  execSync('git config --add safe.directory ' + JSON.stringify(distDir), { cwd: distDir, stdio: 'ignore' });
  execSync('git checkout -B gh-pages', { cwd: distDir, stdio: 'ignore' });
  execSync('git add -A', { cwd: distDir, stdio: 'ignore' });
  execSync('git commit -m "Deploy Learnova AI to GitHub Pages"', { cwd: distDir, stdio: 'ignore' });
  
  // Set remote to repo
  try {
    execSync('git remote remove origin', { cwd: distDir, stdio: 'ignore' });
  } catch {}
  execSync('git remote add origin https://github.com/CHARANSAI11328/ai-student_helper.git', { cwd: distDir, stdio: 'ignore' });

  // Push to gh-pages branch
  execSync('git push -f origin gh-pages', { cwd: distDir, stdio: 'inherit' });

  console.log('\n🎉 SUCCESS: Deployed to gh-pages branch!');
  console.log('🌐 Your website will be live in ~60 seconds at:');
  console.log('   https://charansai11328.github.io/ai-student_helper/\n');
} catch (err) {
  console.error('\n❌ Deployment push failed:', err.message);
  console.log('You can run the push command manually from your terminal.');
  process.exit(1);
}
