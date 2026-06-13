#!/usr/bin/env python3
import json
import csv
import argparse
import sys
import re
from datetime import datetime
from pathlib import Path

# Consulting firms to filter out if career is consulting-only
CONSULTING_FIRMS = {'tcs', 'tata consultancy services', 'infosys', 'wipro', 'accenture', 'cognizant', 'capgemini'}

REQUIRED_SKILLS = {
    'vector_db': ['pinecone', 'weaviate', 'qdrant', 'milvus', 'opensearch', 'elasticsearch', 'faiss'],
    'embeddings': ['sentence-transformers', 'openai-embeddings', 'bge', 'e5', 'embeddings', 'retrieval', 'vector-search', 'semantic-search'],
    'python': ['python'],
    'evaluation': ['ndcg', 'mrr', 'map', 'evaluation', 'ab-testing', 'a-b-testing', 'eval-frameworks']
}

DESIRED_SKILLS = {
    'llm': ['lora', 'qlora', 'peft', 'fine-tuning-llms', 'llm-fine-tuning', 'fine-tuning'],
    'ltr': ['xgboost', 'learning-to-rank', 'neural-ranking']
}

DISQUALIFIED_TITLES = {
    'marketing manager', 'sales executive', 'civil engineer', 'hr manager', 'qa engineer', 
    'accountant', 'graphic designer', 'ux designer', 'operations manager', 'operations',
    'sales', 'marketing', 'hr', 'designer', 'accountant', 'product manager'
}

def normalize_skill(name):
    if not name:
        return ""
    # Lowercase, replace spaces with hyphens, remove non-alphanumeric/hyphen
    val = name.lower()
    val = re.sub(r'\s+', '-', val)
    val = re.sub(r'[^a-z0-9-]', '', val)
    return val

def is_honeypot(c):
    # 1. Zero duration skills
    skills = c.get('skills', [])
    if skills and any(s.get('duration_months', 0) == 0 for s in skills):
        return True
    
    # 2. Experience mismatch
    career_history = c.get('career_history', [])
    total_months = sum(job.get('duration_months', 0) for job in career_history)
    total_years = total_months / 12.0
    
    profile = c.get('profile', {})
    profile_years = profile.get('years_of_experience', 0.0)
    
    if abs(profile_years - total_years) > 0.5:
        return True
        
    # 3. Future certifications
    certs = c.get('certifications', [])
    if certs and any(cert.get('year', 0) > 2026 for cert in certs):
        return True
        
    return False

def evaluate_candidate(c):
    profile = c.get('profile', {})
    if not profile:
        return {'score': 0.0}
        
    title_lower = profile.get('current_title', '').lower()
    
    # Disqualifier Check 1: Title Check
    is_disqualified = False
    for t in DISQUALIFIED_TITLES:
        if t in title_lower:
            # check if it also has developer/engineer
            if 'engineer' not in title_lower and 'developer' not in title_lower and 'architect' not in title_lower:
                is_disqualified = True
                break
    if is_disqualified:
        return {'score': 0.0}
        
    # Disqualifier Check 2: Consulting Only
    career_history = c.get('career_history', [])
    if career_history:
        only_consulting = True
        for job in career_history:
            co = job.get('company', '').lower()
            is_consultant = False
            for firm in CONSULTING_FIRMS:
                if firm in co:
                    is_consultant = True
                    break
            if not is_consultant:
                only_consulting = False
                break
        if only_consulting:
            return {'score': 0.0}
            
    # 1. Experience Score (Weight: 30%)
    yoe = profile.get('years_of_experience', 0.0)
    if 6.0 <= yoe <= 8.0:
        exp_score = 1.0
    elif 5.0 <= yoe <= 9.0:
        exp_score = 0.8
    elif 4.0 <= yoe <= 10.0:
        exp_score = 0.5
    else:
        exp_score = 0.2
        
    # ML career specific experience
    ml_jobs_count = 0
    for job in career_history:
        desc = job.get('description', '').lower()
        title = job.get('title', '').lower()
        if any(kw in title for kw in ['ml', 'machine learning', 'ai', 'nlp', 'retrieval', 'search']) or \
           any(kw in desc for kw in ['recommendation', 'retrieval', 'ranking', 'embedding', 'vector search']):
            ml_jobs_count += 1
            
    ml_exp_score = min(ml_jobs_count / 2.0, 1.0) if ml_jobs_count > 0 else 0.0
    combined_exp_score = 0.6 * exp_score + 0.4 * ml_exp_score
    
    # 2. Skills Score (Weight: 45%)
    skills = c.get('skills', [])
    candidate_skills = [normalize_skill(s.get('name', '')) for s in skills]
    
    required_count = 0
    for cat, aliases in REQUIRED_SKILLS.items():
        if any(skill in candidate_skills for skill in aliases):
            required_count += 1
            
    desired_count = 0
    for cat, aliases in DESIRED_SKILLS.items():
        if any(skill in candidate_skills for skill in aliases):
            desired_count += 1
            
    req_score = required_count / 4.0
    des_score = desired_count / 2.0
    combined_skills_score = 0.7 * req_score + 0.3 * des_score
    
    # Domain Mismatch Penalty
    has_nlp_ir = any(skill in candidate_skills for skill in ['nlp', 'natural-language-processing', 'information-retrieval', 'retrieval', 'vector-search', 'semantic-search'])
    has_cv_sr = any(skill in candidate_skills for skill in ['computer-vision', 'speech-recognition', 'robotics', 'image-classification', 'object-detection'])
    if has_cv_sr and not has_nlp_ir:
        combined_skills_score *= 0.5
        
    # 3. Behavioral Score (Weight: 25%)
    loc_score = 0.5
    np_score = 0.5
    response_rate = 0.5
    active_score = 0.5
    otw = 0.6
    
    signals = c.get('redrob_signals', {})
    if signals:
        country = profile.get('country', '').lower()
        loc = profile.get('location', '').lower()
        
        if 'india' in country:
            if 'pune' in loc or 'noida' in loc:
                loc_score = 1.0
            elif any(city in loc for city in ['hyderabad', 'mumbai', 'bangalore', 'delhi', 'ncr', 'gurgaon', 'chennai']):
                loc_score = 0.8
            else:
                loc_score = 0.6
        else:
            if signals.get('willing_to_relocate', False):
                loc_score = 0.4
            else:
                loc_score = 0.1
                
        np = signals.get('notice_period_days', 0)
        if np <= 30:
            np_score = 1.0
        elif np <= 60:
            np_score = 0.8
        elif np <= 90:
            np_score = 0.5
        else:
            np_score = 0.2
            
        response_rate = signals.get('recruiter_response_rate', 0.0)
        
        last_active_str = signals.get('last_active_date', '2025-01-01')
        try:
            last_active = datetime.strptime(last_active_str, '%Y-%m-%d')
            if last_active >= datetime(2025, 12, 1):
                active_score = 1.0
            elif last_active >= datetime(2025, 6, 1):
                active_score = 0.7
            else:
                active_score = 0.3
        except ValueError:
            active_score = 0.5
            
        otw = 1.0 if signals.get('open_to_work_flag', False) else 0.6
        
    behavior_score = (loc_score + np_score + response_rate + active_score + otw) / 5.0
    total_score = 0.3 * combined_exp_score + 0.45 * combined_skills_score + 0.25 * behavior_score
    
    return {
        'score': total_score,
        'yoe': yoe,
        'required_count': required_count,
        'desired_count': desired_count,
        'np_score': np_score
    }

def generate_reasoning(c, evaluation):
    profile = c.get('profile', {})
    title = profile.get('current_title', '')
    yoe = evaluation['yoe']
    skills = c.get('skills', [])
    skills_list = ', '.join(s.get('name', '') for s in skills[:3])
    location = profile.get('location', '')
    signals = c.get('redrob_signals', {})
    np = signals.get('notice_period_days', 0)
    
    first_part = f"{yoe} YoE as a {title}."
    if evaluation['required_count'] >= 3:
        first_part += f" Strong technical fit with vector databases and embeddings experience (e.g. {skills_list})."
    else:
        first_part += f" Decent technical foundation with skills including {skills_list}."
        
    second_part = f" Based in {location}."
    if np <= 30:
        second_part += f" Highly available with a short {np}-day notice period."
    elif np >= 90:
        second_part += f" Notice period is {np} days (slight concern)."
    else:
        second_part += f" Notice period is {np} days."
        
    if signals.get('recruiter_response_rate', 0.0) > 0.8:
        second_part += " Highly active and responsive to recruiters."
        
    return f"{first_part}{second_part}"

def main():
    parser = argparse.ArgumentParser(description="Rank candidates for Senior AI Engineer JD.")
    parser.add_argument("--candidates", required=True, help="Path to candidates.jsonl file.")
    parser.add_argument("--out", required=True, help="Path to write submission.csv.")
    args = parser.parse_args()

    candidates_path = Path(args.candidates)
    out_path = Path(args.out)

    if not candidates_path.exists():
        print(f"Candidates file not found: {candidates_path}")
        sys.exit(1)

    print(f"Reading candidates from {candidates_path}...")
    valid_candidates = []

    # Read candidates line-by-line
    with open(candidates_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            c = json.loads(line)
            
            if is_honeypot(c):
                continue
                
            evaluation = evaluate_candidate(c)
            if evaluation['score'] <= 0.2:
                continue
                
            valid_candidates.append({
                'id': c.get('candidate_id', ''),
                'score': evaluation['score'],
                'evaluation': evaluation,
                'raw': c
            })

    # Sort: score descending, tie-break by candidate_id ascending
    valid_candidates.sort(key=lambda x: (-x['score'], x['id']))

    top_100 = valid_candidates[:100]

    # Write CSV
    print(f"Writing top 100 candidates to {out_path}...")
    with open(out_path, "w", encoding="utf-8", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["candidate_id", "rank", "score", "reasoning"])
        
        for idx, c in enumerate(top_100):
            rank = idx + 1
            reasoning = generate_reasoning(c['raw'], c['evaluation'])
            # Score formatted to 4 decimal places
            writer.writerow([c['id'], rank, f"{c['score']:.4f}", reasoning])

    print("Ranking successfully completed.")

if __name__ == "__main__":
    main()
