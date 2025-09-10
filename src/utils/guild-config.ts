import fs from 'fs';
import path from 'path';

export interface GuildConfig {
  guildName?: string;
  title?: string;
  description?: string;
  logo?: string;
  theme?: {
    primaryColor?: string;
    accentColor?: string;
  };
}

const DEFAULT_CONFIG: GuildConfig = {
  guildName: "SWGoH Guild",
  title: "SWGoH Raid Analysis",
  description: "Advanced Guild Raid Analytics for Star Wars: Galaxy of Heroes",
  logo: "bataillon-logo.png",
  theme: {
    primaryColor: "#00d4ff",
    accentColor: "#ffd700"
  }
};

let cachedConfig: GuildConfig | null = null;

export function getGuildConfig(): GuildConfig {
  if (cachedConfig) return cachedConfig;

  try {
    const configPath = path.join(process.cwd(), 'data', 'guild-config.json');
    
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const userConfig = JSON.parse(configContent) as GuildConfig;
      
      // Merge with defaults
      cachedConfig = {
        ...DEFAULT_CONFIG,
        ...userConfig,
        theme: {
          ...DEFAULT_CONFIG.theme,
          ...userConfig.theme
        }
      };
    } else {
      cachedConfig = DEFAULT_CONFIG;
    }
  } catch (error) {
    console.warn('Failed to load guild config, using defaults:', error);
    cachedConfig = DEFAULT_CONFIG;
  }

  return cachedConfig;
}

export function getGuildLogoPath(): string {
  const config = getGuildConfig();
  
  // Check if custom logo exists in data directory
  if (config.logo && config.logo !== DEFAULT_CONFIG.logo) {
    const customLogoPath = path.join(process.cwd(), 'data', config.logo);
    if (fs.existsSync(customLogoPath)) {
      // Return path relative to public directory for web serving
      return `/data/${config.logo}`;
    }
  }
  
  // Fall back to default logo
  return `/${DEFAULT_CONFIG.logo}`;
}