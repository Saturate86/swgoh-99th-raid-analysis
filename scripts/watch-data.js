// scripts/watch-data.js
// Watches the data/ folder for changes and runs the CSV-to-JSON conversion automatically.
// Usage: node scripts/watch-data.js

import { watch } from 'fs';
import { exec } from 'child_process';
import path from 'path';

const dataDir = path.resolve('data');
const convertScript = 'npm run convert-csv';
const processConfigScript = 'npm run process-config';

console.log(`[watch-data] Watching for changes in ${dataDir} ...`);

function runConvertScript(reason) {
  console.log(`[watch-data] Triggering CSV conversion (${reason})...`);
  exec(convertScript, (err, stdout, stderr) => {
    if (err) {
      console.error('[watch-data] Error running conversion:', err);
    } else {
      console.log('[watch-data] Conversion complete.');
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
  });
}

function runProcessConfig(reason) {
  console.log(`[watch-data] Triggering config processing (${reason})...`);
  exec(processConfigScript, (err, stdout, stderr) => {
    if (err) {
      console.error('[watch-data] Error running config processing:', err);
    } else {
      console.log('[watch-data] Config processing complete.');
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);
    }
  });
}

// Run conversion once at startup to ensure collections are always generated
runConvertScript('startup');

let csvTimeout = null;
let configTimeout = null;

// Function to check if a file is a logo file
function isLogoFile(filename) {
  const logoExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp'];
  const ext = path.extname(filename).toLowerCase();
  const basename = path.basename(filename, ext).toLowerCase();
  
  // Match common logo patterns or specifically named files in guild config
  return logoExtensions.includes(ext) && (
    basename.includes('logo') || 
    basename.includes('guild') || 
    filename === 'guild-logo.png' ||
    filename === 'logo.png'
  );
}

watch(dataDir, { recursive: true }, (eventType, filename) => {
  console.log(`[watch-data] File event: ${eventType} - ${filename}`);
  
  if (!filename) return;
  
  // Handle CSV file changes
  if (filename.endsWith('.csv') || filename.endsWith('.CSV')) {
    console.log(`[watch-data] Detected CSV change: ${filename} (${eventType})`);
    if (csvTimeout) clearTimeout(csvTimeout);
    csvTimeout = setTimeout(() => {
      runConvertScript('CSV file change');
    }, 300);
  }
  
  // Handle guild config or logo file changes
  if (filename === 'guild-config.json' || isLogoFile(filename)) {
    console.log(`[watch-data] Detected config/logo change: ${filename} (${eventType})`);
    if (configTimeout) clearTimeout(configTimeout);
    configTimeout = setTimeout(() => {
      runProcessConfig('config/logo file change');
    }, 300);
  }
});
