import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('[process-guild-config] Starting guild configuration processing...');

// Default configuration
const DEFAULT_CONFIG = {
  guildName: "SWGoH Guild",
  title: "SWGoH Raid Analysis",
  description: "Advanced Guild Raid Analytics for Star Wars: Galaxy of Heroes",
  theme: {
    primaryColor: "#00d4ff",
    accentColor: "#ffd700"
  }
};

// Paths
const dataDir = path.join(rootDir, 'data');
const publicDir = path.join(rootDir, 'public');
const srcDir = path.join(rootDir, 'src');
const configJsonPath = path.join(dataDir, 'guild-config.json');
const generatedConfigPath = path.join(srcDir, 'config', 'guild.json');

// Ensure directories exist
if (!fs.existsSync(path.join(srcDir, 'config'))) {
  fs.mkdirSync(path.join(srcDir, 'config'), { recursive: true });
}

// Process configuration
let finalConfig = { ...DEFAULT_CONFIG };

if (fs.existsSync(configJsonPath)) {
  try {
    const userConfig = JSON.parse(fs.readFileSync(configJsonPath, 'utf-8'));
    finalConfig = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      theme: {
        ...DEFAULT_CONFIG.theme,
        ...(userConfig.theme || {})
      }
    };
    console.log('✅ Loaded custom guild configuration');
  } catch (error) {
    console.error('❌ Error reading guild-config.json:', error.message);
    console.log('   Using default configuration');
  }
} else {
  console.log('ℹ️  No guild-config.json found, using defaults');
}

// Process logo
let logoFileName = 'bataillon-logo.png'; // Default logo

// Check if there's a custom logo specified in the config
if (finalConfig.logo) {
  const customLogoPath = path.join(dataDir, finalConfig.logo);
  if (fs.existsSync(customLogoPath)) {
    // Copy custom logo to public directory
    const targetPath = path.join(publicDir, 'custom-logo' + path.extname(finalConfig.logo));
    try {
      fs.copyFileSync(customLogoPath, targetPath);
      logoFileName = 'custom-logo' + path.extname(finalConfig.logo);
      console.log(`✅ Copied custom logo: ${finalConfig.logo} -> public/custom-logo${path.extname(finalConfig.logo)}`);
    } catch (error) {
      console.error('❌ Error copying custom logo:', error.message);
      console.log('   Using default logo');
    }
  } else {
    console.log(`⚠️  Custom logo '${finalConfig.logo}' not found in data directory`);
    console.log('   Using default logo');
  }
} else {
  console.log('ℹ️  No custom logo specified, using default');
}

// Update the final config with the actual logo file name to use
finalConfig.logoFile = logoFileName;

// Write the processed configuration to src/config/guild.json
fs.writeFileSync(generatedConfigPath, JSON.stringify(finalConfig, null, 2));
console.log('✅ Generated guild configuration at src/config/guild.json');

console.log('[process-guild-config] Configuration processing complete!');