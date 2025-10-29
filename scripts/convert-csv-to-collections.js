#!/usr/bin/env node


import fs from 'fs';
import path from 'path';

console.log('[convert-csv-to-collections] Script started');

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (const element of line) {
    const char = element;
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.replace(/"/g, ''));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.replace(/"/g, ''));
  return result;
}

function parseCSV(csvText, raidDate) {
  const lines = csvText.trim().split('\n');
  const players = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length >= 4) {
      const player = {
        name: values[0] || '',
        allycode: values[1] || '',
        estimatedScore: parseFloat(values[2]) || 0,
        lastActualScore: parseFloat(values[3]) || 0,
        diff: parseFloat(values[4]) || 0,
        diffPercent: parseFloat(values[5]) || 0,
        participated: values[3] !== '' && values[3] !== '0'
      };
      players.push(player);
    }
  }
  return players;
}

function extractDateFromFilename(filename) {
  // New format with RET (Raid Ending Time): {raid}_{guildId}_RET{timestamp}_{creationTimestamp}.csv
  // Priority: Use RET timestamp when available
  const retMatch = filename.match(/_RET(\d{10,13})_/);
  if (retMatch) {
    const timestamp = retMatch[1];
    // Handle both 10-digit (seconds) and 13-digit (milliseconds) timestamps
    const timestampMs = timestamp.length === 10 ? parseInt(timestamp) * 1000 : parseInt(timestamp);
    const date = new Date(timestampMs);
    return date.toISOString().split('T')[0];
  }

  // Old format: {raid}_{guildId}_{timestamp}.csv
  const timestampMatch = filename.match(/_(\d{13})\.csv$/);
  if (timestampMatch) {
    const timestamp = timestampMatch[1];
    const date = new Date(parseInt(timestamp));
    return date.toISOString().split('T')[0];
  }

  // Fallback: try to match old format YYYY-MM-DD
  const oldFormatMatch = filename.match(/(\d{4}-\d{2}-\d{2})/);
  if (oldFormatMatch) {
    return oldFormatMatch[1];
  }

  return 'Unknown';
}

// Convert CSV files to JSON for Astro collections
function convertCSVsToCollections() {
  const dataDir = path.join(process.cwd(), 'data');
  const contentRaidsDir = path.join(process.cwd(), 'src', 'content', 'raids');

  // Ensure content directory exists
  if (!fs.existsSync(contentRaidsDir)) {
    fs.mkdirSync(contentRaidsDir, { recursive: true });
  }

  // Clean existing JSON files to ensure fresh generation
  if (fs.existsSync(contentRaidsDir)) {
    const existingFiles = fs.readdirSync(contentRaidsDir);
    const jsonFiles = existingFiles.filter(file => file.endsWith('.json'));
    for (const file of jsonFiles) {
      fs.unlinkSync(path.join(contentRaidsDir, file));
    }
    if (jsonFiles.length > 0) {
      console.log(`🧹 Cleaned ${jsonFiles.length} existing JSON files`);
    }
  }

  try {
    const files = fs.readdirSync(dataDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));

    console.log(`Found ${csvFiles.length} CSV files to convert...`);

    for (const file of csvFiles) {
      const filePath = path.join(dataDir, file);
      const csvContent = fs.readFileSync(filePath, 'utf-8');
      const raidDate = extractDateFromFilename(file);
      const players = parseCSV(csvContent, raidDate);
      
      const raidData = {
        date: raidDate,
        filename: file,
        players: players
      };

      // Create JSON file for collection
      const jsonFilename = file.replace('.csv', '.json');
      const jsonFilePath = path.join(contentRaidsDir, jsonFilename);
      
      fs.writeFileSync(jsonFilePath, JSON.stringify(raidData, null, 2));
      console.log(`Converted ${file} -> ${jsonFilename}`);
    }

    console.log('✅ All CSV files converted to collections!');
  } catch (error) {
    console.error('❌ Error converting CSV files:', error);
  }
}

// Run the conversion
convertCSVsToCollections();
console.log('[convert-csv-to-collections] Script finished');