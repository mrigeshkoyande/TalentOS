const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { isHoneypot, evaluateCandidate, generateReasoning } = require('./rank.cjs');

const sampleFile = path.join(__dirname, "[PUB] India_runs_data_and_ai_challenge", "India_runs_data_and_ai_challenge", "sample_candidates.json");
const outFileRoot = path.join(__dirname, "recommended_candidates_submission.xlsx");
const outFileDataset = path.join(__dirname, "[PUB] India_runs_data_and_ai_challenge", "India_runs_data_and_ai_challenge", "recommended_candidates_submission.xlsx");

console.log(`Loading sample candidates from: ${sampleFile}`);
const rawData = fs.readFileSync(sampleFile, 'utf8');
const candidates = JSON.parse(rawData);

console.log(`Total sample candidates loaded: ${candidates.length}`);

const validCandidates = [];
let honeypotsCount = 0;

candidates.forEach(candidate => {
    if (isHoneypot(candidate)) {
        honeypotsCount++;
        return;
    }

    const evaluation = evaluateCandidate(candidate);
    if (evaluation.score <= 0.2) {
        return;
    }

    validCandidates.push({
        id: candidate.candidate_id,
        name: candidate.profile ? candidate.profile.anonymized_name : "",
        title: candidate.profile ? candidate.profile.current_title : "",
        yoe: evaluation.yoe,
        skillsCount: evaluation.skillsCount,
        requiredCount: evaluation.requiredCount,
        desiredCount: evaluation.desiredCount,
        score: evaluation.score,
        evaluation,
        raw: candidate
    });
});

console.log(`Honeypots detected and filtered: ${honeypotsCount}`);
console.log(`Valid recommended candidates evaluated: ${validCandidates.length}`);

validCandidates.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 1e-9) {
        return b.score - a.score;
    }
    return a.id.localeCompare(b.id);
});

const top100 = validCandidates.slice(0, 100);

// Sheet 1: Official Top 100 Validator Format
const sheet1Rows = top100.map((c, idx) => ({
    candidate_id: c.id,
    rank: idx + 1,
    score: Number(c.score.toFixed(4)),
    reasoning: generateReasoning(c)
}));

// Sheet 2: Detailed Job Portal View (All Recommended Candidates)
const sheet2Rows = validCandidates.map((c, idx) => ({
    Rank: idx + 1,
    Candidate_ID: c.id,
    Match_Score_Pct: `${Math.round(c.score * 100)}%`,
    Score_Raw: Number(c.score.toFixed(4)),
    Name: c.name,
    Current_Title: c.title,
    Years_of_Exp: c.yoe,
    Location: c.raw.profile ? `${c.raw.profile.location || ''}, ${c.raw.profile.country || ''}` : '',
    Company: c.raw.profile ? c.raw.profile.current_company : '',
    Top_Skills: c.raw.skills ? c.raw.skills.slice(0, 8).map(s => s.name).join(', ') : '',
    AI_Reasoning: generateReasoning(c),
    Summary: c.raw.profile ? c.raw.profile.summary : ''
}));

const wb = xlsx.utils.book_new();

const ws1 = xlsx.utils.json_to_sheet(sheet1Rows);
xlsx.utils.book_append_sheet(wb, ws1, "Top 100 Submission");

const ws2 = xlsx.utils.json_to_sheet(sheet2Rows);
xlsx.utils.book_append_sheet(wb, ws2, "Job Portal Recommended");

xlsx.writeFile(wb, outFileRoot);
xlsx.writeFile(wb, outFileDataset);

console.log(`Successfully generated XLSX files:`);
console.log(` -> ${outFileRoot}`);
console.log(` -> ${outFileDataset}`);
