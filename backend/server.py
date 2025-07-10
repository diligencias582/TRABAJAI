from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pymongo
import os
import uuid
from datetime import datetime
import google.generativeai as genai
import json
import asyncio
from enum import Enum

app = FastAPI(title="TRABAJAI API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY', 'AIzaSyDFjNriW8ZeH0WkGn1B3EfU7yLqi3mM0Hs')
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')  # Using the faster model for better performance

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = pymongo.MongoClient(MONGO_URL)
db = client.trabajai_db

# Collections
candidates_collection = db.candidates
jobs_collection = db.jobs
matches_collection = db.matches
analytics_collection = db.analytics

class JobNiche(str, Enum):
    TECH = "tech"
    CREATIVE = "creative"
    HEALTH = "health"
    FINANCE = "finance"
    MARKETING = "marketing"
    SALES = "sales"
    OPERATIONS = "operations"
    EDUCATION = "education"

class ExperienceLevel(str, Enum):
    ENTRY = "entry"
    JUNIOR = "junior"
    MIDDLE = "middle"
    SENIOR = "senior"
    LEAD = "lead"
    EXECUTIVE = "executive"

class CandidateCreate(BaseModel):
    name: str
    email: str
    phone: str
    skills: List[str]
    experience_level: ExperienceLevel
    salary_expectation: float
    location: str
    niche: JobNiche
    bio: str
    soft_skills: List[str]
    languages: List[str]
    video_pitch_url: Optional[str] = None
    culture_preferences: List[str] = []

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    required_skills: List[str]
    experience_level: ExperienceLevel
    salary_range_min: float
    salary_range_max: float
    location: str
    niche: JobNiche
    company_culture: List[str]
    benefits: List[str]
    required_soft_skills: List[str] = []

class MatchResult(BaseModel):
    candidate_id: str
    job_id: str
    overall_score: float
    skills_match: float
    culture_match: float
    salary_match: float
    ai_analysis: str
    match_reasons: List[str]
    gaps_identified: List[str]
    success_projection: float

# AI Matching System
async def analyze_candidate_job_match(candidate: Dict, job: Dict) -> MatchResult:
    """AI-powered matching using Google Gemini"""
    
    prompt = f"""
    Analyze this candidate-job match for a recruitment platform. Provide detailed scoring and insights:

    CANDIDATE:
    - Name: {candidate.get('name')}
    - Skills: {', '.join(candidate.get('skills', []))}
    - Soft Skills: {', '.join(candidate.get('soft_skills', []))}
    - Experience: {candidate.get('experience_level')}
    - Salary Expectation: ${candidate.get('salary_expectation', 0):,.2f}
    - Bio: {candidate.get('bio', '')}
    - Culture Preferences: {', '.join(candidate.get('culture_preferences', []))}

    JOB:
    - Title: {job.get('title')}
    - Company: {job.get('company')}
    - Required Skills: {', '.join(job.get('required_skills', []))}
    - Required Soft Skills: {', '.join(job.get('required_soft_skills', []))}
    - Experience Level: {job.get('experience_level')}
    - Salary Range: ${job.get('salary_range_min', 0):,.2f} - ${job.get('salary_range_max', 0):,.2f}
    - Company Culture: {', '.join(job.get('company_culture', []))}
    - Description: {job.get('description', '')}

    Analyze and provide scores (0-100) for:
    1. SKILLS_MATCH: Technical/hard skills alignment
    2. CULTURE_MATCH: Cultural fit and soft skills
    3. SALARY_MATCH: Salary expectation vs offer alignment
    4. SUCCESS_PROJECTION: Likelihood of success in role

    Also provide:
    - OVERALL_SCORE: Weighted average (40% skills, 30% culture, 20% salary, 10% success projection)
    - MATCH_REASONS: Top 3 reasons why this is a good match
    - GAPS_IDENTIFIED: Areas where candidate needs improvement
    - AI_ANALYSIS: Detailed paragraph analysis

    Respond in JSON format:
    {{
        "skills_match": 0-100,
        "culture_match": 0-100,
        "salary_match": 0-100,
        "success_projection": 0-100,
        "overall_score": 0-100,
        "match_reasons": ["reason1", "reason2", "reason3"],
        "gaps_identified": ["gap1", "gap2"],
        "ai_analysis": "detailed analysis paragraph"
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean the response text to extract JSON
        response_text = response.text.strip()
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
        
        ai_result = json.loads(response_text)
        
        return MatchResult(
            candidate_id=candidate['id'],
            job_id=job['id'],
            overall_score=ai_result.get('overall_score', 0),
            skills_match=ai_result.get('skills_match', 0),
            culture_match=ai_result.get('culture_match', 0),
            salary_match=ai_result.get('salary_match', 0),
            ai_analysis=ai_result.get('ai_analysis', ''),
            match_reasons=ai_result.get('match_reasons', []),
            gaps_identified=ai_result.get('gaps_identified', []),
            success_projection=ai_result.get('success_projection', 0)
        )
    except Exception as e:
        print(f"AI analysis error: {e}")
        # Fallback basic scoring
        return MatchResult(
            candidate_id=candidate['id'],
            job_id=job['id'],
            overall_score=50.0,
            skills_match=50.0,
            culture_match=50.0,
            salary_match=50.0,
            ai_analysis="Basic analysis due to AI service unavailability",
            match_reasons=["Skills alignment", "Experience level match"],
            gaps_identified=["AI analysis pending"],
            success_projection=50.0
        )

# API Endpoints
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "TRABAJAI API"}

@app.post("/api/candidates")
async def create_candidate(candidate: CandidateCreate):
    candidate_data = candidate.dict()
    candidate_data['id'] = str(uuid.uuid4())
    candidate_data['created_at'] = datetime.utcnow()
    candidate_data['updated_at'] = datetime.utcnow()
    
    candidates_collection.insert_one(candidate_data)
    return {"message": "Candidate created", "candidate_id": candidate_data['id']}

@app.get("/api/candidates")
async def get_candidates():
    candidates = list(candidates_collection.find({}, {"_id": 0}))
    return candidates

@app.get("/api/candidates/{candidate_id}")
async def get_candidate(candidate_id: str):
    candidate = candidates_collection.find_one({"id": candidate_id}, {"_id": 0})
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@app.post("/api/jobs")
async def create_job(job: JobCreate):
    job_data = job.dict()
    job_data['id'] = str(uuid.uuid4())
    job_data['created_at'] = datetime.utcnow()
    job_data['updated_at'] = datetime.utcnow()
    job_data['status'] = 'active'
    
    jobs_collection.insert_one(job_data)
    return {"message": "Job created", "job_id": job_data['id']}

@app.get("/api/jobs")
async def get_jobs():
    jobs = list(jobs_collection.find({}, {"_id": 0}))
    return jobs

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: str):
    job = jobs_collection.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.post("/api/matches/generate/{job_id}")
async def generate_matches(job_id: str, background_tasks: BackgroundTasks):
    """Generate AI-powered matches for a job"""
    job = jobs_collection.find_one({"id": job_id}, {"_id": 0})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get all candidates in the same niche
    candidates = list(candidates_collection.find({"niche": job['niche']}, {"_id": 0}))
    
    matches = []
    for candidate in candidates:
        try:
            match_result = await analyze_candidate_job_match(candidate, job)
            
            # Save match to database
            match_data = {
                "id": str(uuid.uuid4()),
                "candidate_id": match_result.candidate_id,
                "job_id": match_result.job_id,
                "overall_score": match_result.overall_score,
                "skills_match": match_result.skills_match,
                "culture_match": match_result.culture_match,
                "salary_match": match_result.salary_match,
                "ai_analysis": match_result.ai_analysis,
                "match_reasons": match_result.match_reasons,
                "gaps_identified": match_result.gaps_identified,
                "success_projection": match_result.success_projection,
                "created_at": datetime.utcnow().isoformat()
            }
            
            matches_collection.insert_one(match_data)
            # Remove the MongoDB _id for response
            match_data.pop("_id", None)
            matches.append(match_data)
            
        except Exception as e:
            print(f"Error processing candidate {candidate.get('name', 'unknown')}: {e}")
            continue
    
    # Sort by overall score
    matches.sort(key=lambda x: x['overall_score'], reverse=True)
    
    return {"message": f"Generated {len(matches)} matches", "matches": matches}

@app.get("/api/matches/job/{job_id}")
async def get_job_matches(job_id: str):
    """Get all matches for a specific job, sorted by score"""
    matches = list(matches_collection.find({"job_id": job_id}, {"_id": 0}))
    matches.sort(key=lambda x: x['overall_score'], reverse=True)
    return matches

@app.get("/api/matches/candidate/{candidate_id}")
async def get_candidate_matches(candidate_id: str):
    """Get all matches for a specific candidate, sorted by score"""
    matches = list(matches_collection.find({"candidate_id": candidate_id}, {"_id": 0}))
    matches.sort(key=lambda x: x['overall_score'], reverse=True)
    return matches

@app.get("/api/analytics/dashboard")
async def get_dashboard_analytics():
    """Get live metrics for the dashboard"""
    total_candidates = candidates_collection.count_documents({})
    total_jobs = jobs_collection.count_documents({})
    total_matches = matches_collection.count_documents({})
    
    # Get top performing matches
    top_matches = list(matches_collection.find({}, {"_id": 0}).sort("overall_score", -1).limit(10))
    
    # Get niche distribution
    niche_stats = {}
    for niche in JobNiche:
        niche_stats[niche.value] = {
            "candidates": candidates_collection.count_documents({"niche": niche.value}),
            "jobs": jobs_collection.count_documents({"niche": niche.value})
        }
    
    return {
        "total_candidates": total_candidates,
        "total_jobs": total_jobs,
        "total_matches": total_matches,
        "top_matches": top_matches,
        "niche_distribution": niche_stats,
        "success_rate": 85.7,  # Mock success rate
        "avg_match_score": 78.3  # Mock average match score
    }

@app.get("/api/niches")
async def get_niches():
    """Get all available job niches"""
    return [{"value": niche.value, "label": niche.value.title()} for niche in JobNiche]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)