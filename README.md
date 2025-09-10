# SWGoH Raid Analysis Tool

> 📋 **This is a template repository** - Click "Use this template" to create your own guild analysis

A web application for analyzing guild raid data from Star Wars: Galaxy of Heroes using Wookiebot.

🚀 **Live Demo**: [https://dennisbecker.github.io/swgoh-raid-analysis/](https://dennisbecker.github.io/swgoh-raid-analysis/) (Example with sample guild data)

## Features

- 📊 Interactive charts for visualizing raid performance
- 🏆 Performance points tracking over time
- 📈 Detailed player statistics
- 🔍 Filterable and sortable tables
- 📥 Data export as CSV
- 🌟 Star Wars-inspired dark design

## Getting Started


### 1. Fork This Repository
1. Go to [https://github.com/bataillon-swgoh/swgoh-raid-analysis](https://github.com/bataillon-swgoh/swgoh-raid-analysis)
2. Click the **"Fork"** button in the top right to create your own copy of the repository
3. Give your repository a name (e.g., `my-guild-raids`, `guild-name-analysis`)
4. Make sure it's set to **Public** (required for GitHub Pages)
5. Click **"Create fork"**

#### Keeping Your Fork Up to Date
To get new features and bugfixes, you should regularly update your fork from the original repository:

**Recommended:**
1. Go to your forked repository on GitHub


2. Click the **"Sync fork"** button (usually above the file list or in the "Contribute" dropdown)
3. In the dialog, click the **"Update branch"** button to sync your fork with the latest changes from the original repository.

**Warning:** Never click **"Discard Commits"** when syncing your fork! This will permanently delete your own raid results and data. Always use the **"Update branch"** option to keep your changes.



### 2. Enable GitHub Pages & Actions
1. Go to your new repository on GitHub
2. Navigate to **Settings** → **Pages** (in the left sidebar)
3. Under **Source**, select **"GitHub Actions"**
4. **Important:** After forking, GitHub Actions workflows are disabled by default. Go to the **Actions** tab and click **"I understand my workflows, go ahead and enable them"** to activate the workflows for your fork.
5. The workflow will be automatically detected

### 3. Add Your Guild Data
1. In Star Wars: Galaxy of Heroes, use the Wookiebot command:
   ```
   /raid guild
   ```
   Add your desired parameters (effort level, etc.)
2. Download the generated CSV file from Wookiebot

### 4. Upload Your Data
1. In your GitHub repository, navigate to the `/data` folder
2. Click **"Add file"** → **"Upload files"**
3. Upload your downloaded CSV file(s)
4. Commit the changes with a message like "Add raid data"

### 5. Automatic Deployment
- GitHub Actions will automatically build and deploy your site
- Your analysis will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/`
- The build process takes 2-3 minutes

### 6. Adding More Data
- Repeat steps 3-4 whenever you want to add new raid data
- The site automatically updates with each new CSV file upload

### 7. Guild Customization (Optional)

You can personalize your guild's site with custom branding:

#### Create Guild Configuration
1. Copy `data/guild-config.example.json` to `data/guild-config.json`
2. Edit the configuration with your guild information
3. **Important**: Remove any optional fields you don't want to use

##### Minimal Example (only guild name):
```json
{
  "guildName": "Your Guild Name"
}
```

##### Full Example (all options):
```json
{
  "guildName": "Your Guild Name",
  "title": "Your Guild - Raid Analysis",
  "description": "Your guild motto or description",
  "logo": "your-logo.png"
}
```

**Note**: All fields except `guildName` are optional. Delete any lines you don't need from your configuration.

#### Add Custom Logo
1. Upload your logo image (PNG, JPG, or SVG) to the `/data` folder
2. Reference the filename in your `guild-config.json`
3. Recommended size: 150x150 pixels (square aspect ratio)

#### Example Structure
```
/data/
├── guild-config.json
├── your-guild-logo.png
├── raid_data_1.csv
└── raid_data_2.csv
```

Your customizations will be applied automatically during the next build.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Format

CSV files from Wookiebot should follow this format:
```csv
name,allycode,estimatedScore,lastActualScore,diff,diffPercent
"Player Name",123456789,1500000,1450000,-50000,-3.33
```

### Wookiebot Command Examples
```
/raid guild
/raid guild effort:high
```

**Parameters:**
- `effort`: Analysis effort level - `low`, `medium` (default), `high`

## Troubleshooting

### Site Not Loading
- Check that GitHub Pages is enabled in your repository settings
- Verify that GitHub Actions completed successfully (check the "Actions" tab)
- Wait 2-3 minutes after upload for the build to complete

### No Data Showing
- Ensure CSV files are uploaded to the `/data` folder (not the root)
- Check that CSV files follow the Wookiebot format
- Verify that the CSV files contain actual data (not empty)

### Build Failures
- Check the "Actions" tab in your GitHub repository for error details
- Ensure CSV files are valid and not corrupted
- Try re-uploading the CSV files

## Technology Stack

- **Astro.js 5.12.2** - Static Site Generator
- **Chart.js 4.4.0** - Data visualization
- **TypeScript** - Type safety
- **GitHub Actions** - Automatic deployment
- **GitHub Pages** - Hosting


## License

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and redistribute this project, including for commercial and private purposes. See the LICENSE file for details.
