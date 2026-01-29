#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

console.log('🔍 Verifying OGL Skill Evaluation Platform Setup...\n');

let hasErrors = false;

// Check Node.js version
try {
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    console.log(`✅ Node.js version: ${nodeVersion} (>= 18 required)`);
  } else {
    console.log(`❌ Node.js version: ${nodeVersion} (>= 18 required)`);
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Could not determine Node.js version');
  hasErrors = true;
}

// Check npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.log('❌ npm not found');
  hasErrors = true;
}

// Check client directory
if (fs.existsSync('client')) {
  console.log('✅ Client directory exists');
  
  // Check client node_modules
  if (fs.existsSync('client/node_modules')) {
    console.log('✅ Client dependencies installed');
  } else {
    console.log('⚠️  Client dependencies not installed (run: cd client && npm install)');
  }
  
  // Check client .env
  if (fs.existsSync('client/.env')) {
    console.log('✅ Client .env file exists');
  } else {
    console.log('⚠️  Client .env file missing (copy from .env.example)');
  }
} else {
  console.log('❌ Client directory not found');
  hasErrors = true;
}

// Check server directory
if (fs.existsSync('server')) {
  console.log('✅ Server directory exists');
  
  // Check server node_modules
  if (fs.existsSync('server/node_modules')) {
    console.log('✅ Server dependencies installed');
  } else {
    console.log('⚠️  Server dependencies not installed (run: cd server && npm install)');
  }
} else {
  console.log('❌ Server directory not found');
  hasErrors = true;
}

// Check root .env
if (fs.existsSync('.env')) {
  console.log('✅ Root .env file exists');
} else {
  console.log('⚠️  Root .env file missing (copy from .env.example)');
}

// Check scripts directory
if (fs.existsSync('scripts')) {
  console.log('✅ Scripts directory exists');
} else {
  console.log('⚠️  Scripts directory not found');
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Setup verification failed! Please fix the errors above.');
  process.exit(1);
} else {
  console.log('🎉 Setup verification complete!');
  console.log('\nNext steps:');
  console.log('1. Configure .env files with your Firebase and AI keys');
  console.log('2. Run: npm run seed:careers-client');
  console.log('3. Start client: cd client && npm run dev');
  console.log('4. Access: http://localhost:3000');
  process.exit(0);
}
