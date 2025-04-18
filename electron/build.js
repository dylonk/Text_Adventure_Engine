require('dotenv').config(); // Loads .env

const { execSync } = require('child_process');

try {
  execSync('npm run prebuild && npm run vite-build && electron-builder --publish always', { stdio: 'inherit', shell: true });
} catch (err) {
  console.error(err);
  process.exit(1);
}