const fs = require('fs');
const readline = require('readline');
const path = require('path');

const candidatesFile = path.join(__dirname, "[PUB] India_runs_data_and_ai_challenge", "India_runs_data_and_ai_challenge", "candidates.jsonl");
const submissionFile = path.join(__dirname, "submission.csv");
const mockJsonFile = path.join(__dirname, "src", "lib", "ranked_candidates_mock.json");

const CONSULTING_FIRMS = new Set([
    'tcs', 'tata consultancy services', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini'
]);

const REQUIRED_SKILLS = {
    vector_db: ['pinecone', 'weaviate', 'qdrant', 'milvus', 'opensearch', 'elasticsearch', 'faiss'],
    embeddings: ['sentence-transformers', 'openai-embeddings', 'bge', 'e5', 'embeddings', 'retrieval', 'vector-search', 'semantic-search'],
    python: ['python'],
    evaluation: ['ndcg', 'mrr', 'map', 'evaluation', 'ab-testing', 'a-b-testing', 'eval-frameworks']
};

const DESIRED_SKILLS = {
    llm: ['lora', 'qlora', 'peft', 'fine-tuning-llms', 'llm-fine-tuning', 'fine-tuning'],
    ltr: ['xgboost', 'learning-to-rank', 'neural-ranking']
};

const DISQUALIFIED_TITLES = new Set([
    'marketing manager', 'sales executive', 'civil engineer', 'hr manager', 'qa engineer', 
    'accountant', 'graphic designer', 'ux designer', 'operations manager', 'operations',
    'sales', 'marketing', 'hr', 'designer', 'accountant', 'product manager'
]);

function normalizeSkill(name) {
    if (!name) return "";
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function isHoneypot(c) {
    // 1. Zero duration skills
    if (c.skills && c.skills.some(s => s.duration_months === 0)) {
        return true;
    }
    
    // 2. Experience mismatch
    let totalJobMonths = 0;
    if (c.career_history) {
        c.career_history.forEach(job => {
            totalJobMonths += job.duration_months;
        });
    }
    const totalJobYears = totalJobMonths / 12;
    const profileYears = c.profile ? c.profile.years_of_experience : 0;
    if (Math.abs(profileYears - totalJobYears) > 0.5) {
        return true;
    }
    
    // 3. Future certifications
    if (c.certifications && c.certifications.some(cert => cert.year > 2026)) {
        return true;
    }
    
    return false;
}

function evaluateCandidate(c) {
    const { profile, career_history, skills, redrob_signals } = c;
    
    if (!profile) return { score: 0 };
    
    const titleLower = (profile.current_title || "").toLowerCase();
    
    // Disqualifier Check 1: Title check (exclude pure non-dev roles)
    let isDisqualifiedTitle = false;
    DISQUALIFIED_TITLES.forEach(t => {
        if (titleLower === t || titleLower.includes(t)) {
            // Check if it also has dev keywords like "developer", "engineer"
            if (!titleLower.includes('engineer') && !titleLower.includes('developer') && !titleLower.includes('architect')) {
                isDisqualifiedTitle = true;
            }
        }
    });
    if (isDisqualifiedTitle) return { score: 0 };
    
    // Disqualifier Check 2: consulting only
    if (career_history && career_history.length > 0) {
        let onlyConsulting = true;
        career_history.forEach(job => {
            const co = (job.company || "").toLowerCase();
            let isConsultant = false;
            CONSULTING_FIRMS.forEach(firm => {
                if (co === firm || co.includes(firm)) isConsultant = true;
            });
            if (!isConsultant) {
                onlyConsulting = false;
            }
        });
        if (onlyConsulting) return { score: 0 };
    }
    
    // 1. Experience Score (Weight: 30%)
    let expScore = 0;
    const yoe = profile.years_of_experience || 0;
    if (yoe >= 6 && yoe <= 8) {
        expScore = 1.0;
    } else if (yoe >= 5 && yoe <= 9) {
        expScore = 0.8;
    } else if (yoe >= 4 && yoe <= 10) {
        expScore = 0.5;
    } else {
        expScore = 0.2;
    }
    
    // ML Experience in career history
    let mlJobsCount = 0;
    if (career_history) {
        career_history.forEach(job => {
            const desc = (job.description || "").toLowerCase();
            const title = (job.title || "").toLowerCase();
            if (title.includes('ml') || title.includes('machine learning') || title.includes('ai') || title.includes('nlp') || title.includes('retrieval') || title.includes('search') || desc.includes('recommendation') || desc.includes('retrieval') || desc.includes('ranking') || desc.includes('embedding') || desc.includes('vector search')) {
                mlJobsCount++;
            }
        });
    }
    const mlExpScore = mlJobsCount > 0 ? Math.min(mlJobsCount / 2, 1.0) : 0;
    const combinedExpScore = 0.6 * expScore + 0.4 * mlExpScore;
    
    // 2. Skills Score (Weight: 45%)
    let requiredCount = 0;
    let desiredCount = 0;
    const candidateSkills = (skills || []).map(s => normalizeSkill(s.name));
    
    // Required skills mapping
    Object.keys(REQUIRED_SKILLS).forEach(cat => {
        let catFound = false;
        REQUIRED_SKILLS[cat].forEach(skill => {
            if (candidateSkills.includes(skill)) catFound = true;
        });
        if (catFound) requiredCount++;
    });
    
    // Desired skills mapping
    Object.keys(DESIRED_SKILLS).forEach(cat => {
        let catFound = false;
        DESIRED_SKILLS[cat].forEach(skill => {
            if (candidateSkills.includes(skill)) catFound = true;
        });
        if (catFound) desiredCount++;
    });
    
    const reqScore = requiredCount / 4; // 4 categories
    const desScore = desiredCount / 2; // 2 categories
    
    let combinedSkillsScore = 0.7 * reqScore + 0.3 * desScore;
    
    // CV/Speech/Robotics without NLP/IR penalty
    let hasDomainMismatch = false;
    let hasNLPIR = candidateSkills.includes('nlp') || candidateSkills.includes('natural-language-processing') || candidateSkills.includes('information-retrieval') || candidateSkills.includes('retrieval') || candidateSkills.includes('vector-search') || candidateSkills.includes('semantic-search');
    let hasCVSR = candidateSkills.includes('computer-vision') || candidateSkills.includes('speech-recognition') || candidateSkills.includes('robotics') || candidateSkills.includes('image-classification') || candidateSkills.includes('object-detection');
    if (hasCVSR && !hasNLPIR) {
        combinedSkillsScore *= 0.5; // penalize mismatch
        hasDomainMismatch = true;
    }
    
    // 3. Behavioral and Availability Signals (Weight: 25%)
    let behaviorScore = 0.5;
    let locScore = 0.5;
    let npScore = 0.5;
    let responseRate = 0.5;
    let activeScore = 0.5;
    let otw = 0.6;
    
    if (redrob_signals) {
        const country = (profile.country || "").toLowerCase();
        const loc = (profile.location || "").toLowerCase();
        
        if (country.includes('india')) {
            if (loc.includes('pune') || loc.includes('noida')) {
                locScore = 1.0;
            } else if (loc.includes('hyderabad') || loc.includes('mumbai') || loc.includes('bangalore') || loc.includes('delhi') || loc.includes('ncr') || loc.includes('gurgaon') || loc.includes('chennai') || loc.includes('pune') || loc.includes('noida')) {
                locScore = 0.8;
            } else {
                locScore = 0.6;
            }
        } else {
            if (redrob_signals.willing_to_relocate) {
                locScore = 0.4;
            } else {
                locScore = 0.1;
            }
        }
        
        const np = redrob_signals.notice_period_days || 0;
        if (np <= 30) {
            npScore = 1.0;
        } else if (np <= 60) {
            npScore = 0.8;
        } else if (np <= 90) {
            npScore = 0.5;
        } else {
            npScore = 0.2;
        }
        
        responseRate = redrob_signals.recruiter_response_rate || 0;
        
        const lastActiveStr = redrob_signals.last_active_date || "2025-01-01";
        const lastActive = new Date(lastActiveStr);
        const cutoffActive = new Date("2025-12-01");
        if (lastActive >= cutoffActive) {
            activeScore = 1.0;
        } else if (lastActive >= new Date("2025-06-01")) {
            activeScore = 0.7;
        } else {
            activeScore = 0.3;
        }
        
        otw = redrob_signals.open_to_work_flag ? 1.0 : 0.6;
        
        behaviorScore = (locScore + npScore + responseRate + activeScore + otw) / 5;
    }
    
    const totalScore = 0.3 * combinedExpScore + 0.45 * combinedSkillsScore + 0.25 * behaviorScore;
    
    return {
        score: totalScore,
        expScore: combinedExpScore,
        skillsScore: combinedSkillsScore,
        behaviorScore,
        yoe,
        skillsCount: skills ? skills.length : 0,
        requiredCount,
        desiredCount,
        locScore,
        npScore,
        responseRate,
        activeScore,
        otw,
        hasDomainMismatch
    };
}

function generateReasoning(c) {
    const { id, name, title, yoe, requiredCount, desiredCount, score, evaluation, raw } = c;
    
    const skillsList = raw.skills.slice(0, 3).map(s => s.name).join(', ');
    const location = raw.profile.location;
    const np = raw.redrob_signals.notice_period_days;
    
    let firstPart = `${yoe} YoE as a ${title}.`;
    if (evaluation.requiredCount >= 3) {
        firstPart += ` Strong technical fit with vector databases and embeddings experience (e.g. ${skillsList}).`;
    } else {
        firstPart += ` Decent technical foundation with skills including ${skillsList}.`;
    }
    
    let secondPart = ` Based in ${location}.`;
    if (np <= 30) {
        secondPart += ` Highly available with a short ${np}-day notice period.`;
    } else if (np >= 90) {
        secondPart += ` Notice period is ${np} days (slight concern).`;
    } else {
        secondPart += ` Notice period is ${np} days.`;
    }
    
    if (raw.redrob_signals.recruiter_response_rate > 0.8) {
        secondPart += ` Highly active and responsive to recruiters.`;
    }
    
    return `${firstPart}${secondPart}`;
}

async function runRanking() {
    const fileStream = fs.createReadStream(candidatesFile);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let count = 0;
    const validCandidates = [];

    for await (const line of rl) {
        if (!line.trim()) continue;
        count++;
        const candidate = JSON.parse(line);
        
        if (isHoneypot(candidate)) {
            continue;
        }
        
        const evaluation = evaluateCandidate(candidate);
        if (evaluation.score <= 0.2) {
            continue;
        }
        
        validCandidates.push({
            id: candidate.candidate_id,
            name: candidate.profile.anonymized_name,
            title: candidate.profile.current_title,
            yoe: evaluation.yoe,
            skillsCount: evaluation.skillsCount,
            requiredCount: evaluation.requiredCount,
            desiredCount: evaluation.desiredCount,
            score: evaluation.score,
            evaluation,
            raw: candidate
        });
    }

    validCandidates.sort((a, b) => {
        if (Math.abs(a.score - b.score) > 1e-9) {
            return b.score - a.score;
        }
        return a.id.localeCompare(b.id);
    });

    const top100 = validCandidates.slice(0, 100);

    const csvRows = ['candidate_id,rank,score,reasoning'];
    const mockJsonCandidates = [];

    top100.forEach((c, idx) => {
        const rank = idx + 1;
        const reasoning = generateReasoning(c);
        const escapedReasoning = `"${reasoning.replace(/"/g, '""')}"`;
        
        csvRows.push(`${c.id},${rank},${c.score.toFixed(4)},${escapedReasoning}`);

        const explicitSkills = c.raw.skills.map(s => s.name.toLowerCase());
        const hasBuzzwords = explicitSkills.some(s => s.includes('pytorch') || s.includes('llm') || s.includes('pinecone') || s.includes('weaviate'));
        const isHiddenGem = !hasBuzzwords && c.score > 0.65;

        let latentValueRationale = "";
        let omittedKeywords = [];
        if (isHiddenGem) {
            omittedKeywords = ['Pinecone', 'PyTorch', 'LLMs', 'Weaviate'].filter(kw => !explicitSkills.some(s => s.includes(kw.toLowerCase())));
            latentValueRationale = `Demonstrates strong applied software/data engineering experience at a product company, building high-throughput pipelines. While lacking high-level AI framework labels (omitting ${omittedKeywords.join(', ')}), their foundational engineering and retrieval capabilities represent a massive latent talent resource.`;
        }

        mockJsonCandidates.push({
            id: c.id,
            name: c.name,
            title: c.title,
            matchId: c.id,
            latentSignalPercent: c.raw.redrob_signals.profile_completeness_score,
            matchScore: Math.round(c.score * 100),
            isHiddenGem,
            omittedKeywords,
            latentValueRationale,
            alignmentProof: reasoning,
            unstructured_skills_narrative: c.raw.skills.slice(0, 3).map(s => s.name),
            technical_projects: c.raw.career_history.slice(0, 2).map(j => j.title),
            jobId: 'mock-1',
            rank
        });
    });

    fs.writeFileSync(submissionFile, csvRows.join('\n'), 'utf8');
    fs.writeFileSync(mockJsonFile, JSON.stringify(mockJsonCandidates, null, 2), 'utf8');

    console.log(`Successfully completed ranking!`);
    console.log(`Total candidates processed: ${count}`);
    console.log(`Top 100 generated at: ${submissionFile}`);
    console.log(`Mock JSON generated at: ${mockJsonFile}`);
}

if (require.main === module) {
    runRanking().catch(console.error);
}

module.exports = {
    isHoneypot,
    evaluateCandidate,
    generateReasoning
};
