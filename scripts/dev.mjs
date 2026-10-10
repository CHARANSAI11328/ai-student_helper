import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Starting Learnova AI (Server + Client)...\n');

const tsxCli = path.join(rootDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
const viteCli = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

// Spawn Backend Server (ignore stdin, stream stdout and stderr to terminal)
const serverProc = spawn(process.execPath, [tsxCli, 'watch', 'server/src/index.ts'], {
  cwd: rootDir,
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: false,
});

// Spawn Frontend Client (ignore stdin, stream stdout and stderr to terminal)
const clientProc = spawn(process.execPath, [viteCli, 'client', '--port', '5173'], {
  cwd: rootDir,
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: false,
});

serverProc.on('error', (err) => console.error('Server error:', err));
serverProc.on('exit', (code) => {
  if (code !== null && code !== 0) console.log('Server process exited with code:', code);
});

clientProc.on('error', (err) => console.error('Client error:', err));
clientProc.on('exit', (code) => {
  if (code !== null && code !== 0) console.log('Client process exited with code:', code);
});

const cleanup = () => {
  console.log('\n🛑 Shutting down Learnova AI services...');
  try { serverProc.kill(); } catch {}
  try { clientProc.kill(); } catch {}
};

process.on('SIGINT', () => {
  cleanup();
  process.exit(0);
});
process.on('SIGTERM', () => {
  cleanup();
  process.exit(0);
});
process.on('exit', cleanup);
