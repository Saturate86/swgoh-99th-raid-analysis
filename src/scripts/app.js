// Main application logic for SWGoH Raid Analysis

let raidData = [];
let playerStats = new Map();
let filteredData = [];
let raidTotalChart = null;
let rankingChart = null;

export function initializeApp(allRaidData) {
  raidData = allRaidData;
  
  try {
    if (raidData.length === 0) {
      throw new Error('No CSV files found. Make sure the files are located in the data/ directory.');
    }

    processPlayerStats();
    updateUI();

  } catch (error) {
    showError(error.message);
  }
}

function processPlayerStats() {
  playerStats.clear();
  
  const allPlayers = new Set();
  raidData.forEach(raid => {
    raid.data.forEach(player => {
      allPlayers.add(player.allycode);
    });
  });

  allPlayers.forEach(allycode => {
    const playerRaids = [];
    let name = '';
    
    raidData.forEach(raid => {
      const playerData = raid.data.find(p => p.allycode === allycode);
      if (playerData) {
        name = playerData.name;
        playerRaids.push({
          date: raid.date,
          score: playerData.lastActualScore,
          participated: playerData.participated,
          estimatedScore: playerData.estimatedScore
        });
      } else {
        playerRaids.push({
          date: raid.date,
          score: 0,
          participated: false,
          estimatedScore: 0
        });
      }
    });

    const totalRaids = raidData.length;
    const participatedRaids = playerRaids.filter(r => r.participated).length;
    const participationRate = (participatedRaids / totalRaids) * 100;
    const totalScore = playerRaids.reduce((sum, r) => sum + r.score, 0);
    const avgScore = participatedRaids > 0 ? totalScore / participatedRaids : 0;
    const bestScore = Math.max(...playerRaids.map(r => r.score));
    const lastActivity = getLastActivity(playerRaids);
    const trend = calculateTrend(playerRaids);

    playerStats.set(allycode, {
      name: name,
      allycode: allycode,
      participation: participationRate,
      raidsParticipated: participatedRaids,
      totalRaids: totalRaids,
      totalScore: totalScore,
      avgScore: avgScore,
      bestScore: bestScore,
      lastActivity: lastActivity,
      trend: trend,
      raids: playerRaids
    });
  });
}

function getLastActivity(playerRaids) {
  const activeRaids = playerRaids.filter(r => r.participated);
  if (activeRaids.length === 0) return 'Never';
  
  const lastActiveRaid = activeRaids[activeRaids.length - 1];
  return lastActiveRaid.date;
}

function calculateTrend(playerRaids) {
  const activeRaids = playerRaids.filter(r => r.participated);
  if (activeRaids.length < 2) return 'No Data';
  
  const recent = activeRaids.slice(-2);
  const diff = recent[1].score - recent[0].score;
  
  if (diff > 0) return 'Rising';
  if (diff < 0) return 'Falling';
  return 'Stable';
}

function updateUI() {
  document.getElementById('totalRaids').textContent = raidData.length;
  document.getElementById('activePlayers').textContent = playerStats.size;
  
  const avgParticipation = Array.from(playerStats.values())
    .reduce((sum, p) => sum + p.participation, 0) / playerStats.size;
  document.getElementById('avgParticipation').textContent = avgParticipation.toFixed(1) + '%';
  
  const lastRaid = raidData[raidData.length - 1];
  document.getElementById('lastRaidDate').textContent = lastRaid.date;

  createCharts();
  applyFilters();
}

export function applyFilters() {
  const sortBy = document.getElementById('sortBy').value;
  const minParticipation = parseFloat(document.getElementById('minParticipation').value) || 0;
  const nameFilter = document.getElementById('nameFilter').value.toLowerCase();

  filteredData = Array.from(playerStats.values()).filter(player => {
    return player.participation >= minParticipation &&
           player.name.toLowerCase().includes(nameFilter);
  });

  sortData(sortBy);
  updateTable();
}

function sortData(criteria) {
  filteredData.sort((a, b) => {
    switch (criteria) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'participation':
        return b.participation - a.participation;
      case 'totalScore':
        return b.totalScore - a.totalScore;
      case 'avgScore':
        return b.avgScore - a.avgScore;
      case 'lastActivity':
        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
      default:
        return b.participation - a.participation;
    }
  });
}

function updateTable() {
  const tbody = document.getElementById('playersTableBody');
  tbody.innerHTML = '';

  filteredData.forEach(player => {
    const row = document.createElement('tr');
    
    let participationClass = '';
    if (player.participation >= 80) participationClass = 'participation-good';
    else if (player.participation >= 50) participationClass = 'participation-warning';
    else participationClass = 'participation-poor';

    let trendClass = '';
    if (player.trend === 'Rising') trendClass = 'trend-positive';
    else if (player.trend === 'Falling') trendClass = 'trend-negative';
    else if (player.trend === 'Stable') trendClass = 'trend-stable';

    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.allycode}</td>
      <td class="${participationClass}">${player.participation.toFixed(1)}%</td>
      <td>${player.raidsParticipated}/${player.totalRaids}</td>
      <td>${formatNumber(player.totalScore)}</td>
      <td>${formatNumber(player.avgScore)}</td>
      <td>${formatNumber(player.bestScore)}</td>
      <td>${player.lastActivity}</td>
      <td class="${trendClass}">${player.trend}</td>
    `;
    tbody.appendChild(row);
  });
}

function formatNumber(num) {
  if (num === 0) return '-';
  // Verwende die Sprache des Browsers für die Formatierung
  return new Intl.NumberFormat(navigator.language).format(Math.round(num));
}

export function sortTable(column) {
  document.getElementById('sortBy').value = column;
  applyFilters();
}

export function exportData() {
  let csv = 'Name,Ally Code,Participation %,Raids Participated,Total Score,Average Score,Best Score,Last Activity,Trend\n';
  
  filteredData.forEach(player => {
    csv += `"${player.name}","${player.allycode}",${player.participation.toFixed(1)},${player.raidsParticipated},${player.totalScore},${player.avgScore.toFixed(0)},${player.bestScore},${player.lastActivity},${player.trend}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `swgoh-raid-analysis_export_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
}

function createCharts() {
  createRaidTotalChart();
  createRankingChart();
  updateRaidTable();
}

// Chart creation functions and other utilities...
// (For brevity, I'll keep the main chart functions in the main file for now)

function preparePlayersData() {
  const allPlayersData = [];
  const allRaidDates = raidData.map(raid => raid.date).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  for (let [allycode, playerStat] of playerStats) {
    const playerData = {
      name: playerStat.name,
      participation: playerStat.participation,
      totalScore: playerStat.totalScore,
      avgScore: playerStat.avgScore,
      raids: {}
    };
    
    for (let raidDate of allRaidDates) {
      const raid = raidData.find(r => r.date === raidDate);
      const playerInRaid = raid ? raid.data.find(p => p.allycode === allycode) : null;
      playerData.raids[raidDate] = playerInRaid ? playerInRaid.lastActualScore : null;
    }
    
    allPlayersData.push(playerData);
  }
  
  return { allPlayersData, allRaidDates };
}

function filterAndSortPlayers(allPlayersData, filterText, sortBy) {
  let filteredDataLocal = allPlayersData;
  if (filterText) {
    filteredDataLocal = allPlayersData.filter(p => p.name.toLowerCase().includes(filterText));
  }
  
  filteredDataLocal.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'totalScore':
        return b.totalScore - a.totalScore;
      case 'avgScore':
        return b.avgScore - a.avgScore;
      case 'participation':
        return b.participation - a.participation;
      default:
        return 0;
    }
  });
  
  return filteredDataLocal;
}

function calculateRaidAverages(allPlayersData, allRaidDates) {
  const raidAverages = {};
  for (let raidDate of allRaidDates) {
    const raidScores = allPlayersData
      .map(p => p.raids[raidDate])
      .filter(score => score !== null);
    raidAverages[raidDate] = raidScores.length > 0 ? 
      raidScores.reduce((sum, score) => sum + score, 0) / raidScores.length : 0;
  }
  return raidAverages;
}

function generateTableHTML(filteredDataLocal, allRaidDates, raidAverages) {
  let html = '';
  
  for (let player of filteredDataLocal) {
    html += `<tr class="table-row">`;
    html += `<td class="table-cell-sticky">${player.name}</td>`;
    html += `<td class="table-cell-center">${player.participation.toFixed(1)}%</td>`;
    html += `<td class="table-cell-center-bold">${player.totalScore.toLocaleString()}</td>`;
    html += `<td class="table-cell-center">${Math.round(player.avgScore).toLocaleString()}</td>`;
    
    for (let raidDate of allRaidDates) {
      const score = player.raids[raidDate];
      const avgScore = raidAverages[raidDate];
      
      if (score === null) {
        html += `<td class="table-cell-inactive">-</td>`;
      } else {
        const isAboveAvg = score > avgScore;
        const cellClass = isAboveAvg ? 'table-cell-above-avg' : 'table-cell-below-avg';
        html += `<td class="${cellClass}">${score.toLocaleString()}</td>`;
      }
    }
    
    html += `</tr>`;
  }
  
  return html;
}

function updateTableHeaders(allRaidDates, raidAverages) {
  const tableHeader = document.querySelector('#raidTable thead tr');
  const existingRaidHeaders = tableHeader.querySelectorAll('th[data-raid-date]');
  
  if (existingRaidHeaders.length === 0) {
    for (let raidDate of allRaidDates) {
      const th = document.createElement('th');
      th.setAttribute('data-raid-date', raidDate);
      th.className = 'table-header text-center min-w-[100px]';
      th.innerHTML = `${raidDate}<br><small class="text-gray-400">(Ø ${Math.round(raidAverages[raidDate]).toLocaleString()})</small>`;
      tableHeader.appendChild(th);
    }
  }
}

export function updateRaidTable() {
  const sortBy = document.getElementById('raidTableSort').value;
  const filterText = document.getElementById('raidTableFilter').value.toLowerCase();
  const raidTableBody = document.getElementById('raidTableBody');
  
  const { allPlayersData, allRaidDates } = preparePlayersData();
  const filteredDataLocal = filterAndSortPlayers(allPlayersData, filterText, sortBy);
  const raidAverages = calculateRaidAverages(allPlayersData, allRaidDates);
  
  const html = generateTableHTML(filteredDataLocal, allRaidDates, raidAverages);
  raidTableBody.innerHTML = html;
  
  updateTableHeaders(allRaidDates, raidAverages);
}

// Make functions globally available
if (typeof window !== 'undefined') {
  window.applyFilters = applyFilters;
  window.sortTable = sortTable;
  window.exportData = exportData;
  window.updateRaidTable = updateRaidTable;
}
