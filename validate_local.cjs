const fs = require('fs');
const lines = fs.readFileSync('submission.csv', 'utf8').split('\n').filter(l => l.trim());
const header = lines[0];
const dataRows = lines.slice(1);
const errors = [];

if (header !== 'candidate_id,rank,score,reasoning') {
    errors.push('Bad header: ' + header);
}
if (dataRows.length !== 100) {
    errors.push('Expected 100 rows, got ' + dataRows.length);
}

const seenIds = new Set();
const seenRanks = new Set();
let prevScore = Infinity;

dataRows.forEach((row, i) => {
    const rowNum = i + 2;
    const firstComma = row.indexOf(',');
    const secondComma = row.indexOf(',', firstComma + 1);
    const thirdComma = row.indexOf(',', secondComma + 1);
    const cid = row.substring(0, firstComma);
    const rank = parseInt(row.substring(firstComma + 1, secondComma));
    const score = parseFloat(row.substring(secondComma + 1, thirdComma));
    const reasoning = row.substring(thirdComma + 1);

    if (!/^CAND_[0-9]{7}$/.test(cid)) errors.push('Row ' + rowNum + ': Bad candidate_id: ' + cid);
    if (seenIds.has(cid)) errors.push('Row ' + rowNum + ': Duplicate candidate_id ' + cid);
    seenIds.add(cid);

    if (isNaN(rank) || rank < 1 || rank > 100) errors.push('Row ' + rowNum + ': Bad rank: ' + rank);
    if (seenRanks.has(rank)) errors.push('Row ' + rowNum + ': Duplicate rank ' + rank);
    seenRanks.add(rank);

    if (isNaN(score)) errors.push('Row ' + rowNum + ': Bad score: ' + score);
    if (score > prevScore + 1e-6) errors.push('Row ' + rowNum + ': Score not non-increasing: ' + score + ' > ' + prevScore);
    prevScore = score;

    if (!reasoning || reasoning.trim().length === 0) errors.push('Row ' + rowNum + ': Missing reasoning');
});

const missingRanks = [];
for (let r = 1; r <= 100; r++) {
    if (!seenRanks.has(r)) missingRanks.push(r);
}
if (missingRanks.length > 0) errors.push('Missing ranks: ' + missingRanks.join(','));

if (errors.length === 0) {
    console.log('Submission is VALID! 100 rows, all checks passed.');
} else {
    console.log('ERRORS FOUND:');
    errors.forEach(e => console.log('  - ' + e));
    process.exit(1);
}
