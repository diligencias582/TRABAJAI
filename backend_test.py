import requests
import json
import time
import sys
from datetime import datetime

class TrabajaAITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.candidate_id = None
        self.job_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.text}")
                    return False, response.json()
                except:
                    return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        if success:
            print(f"Health check response: {response}")
        return success

    def test_create_candidate(self):
        """Test creating a candidate"""
        candidate_data = {
            "name": f"Test Candidate {datetime.now().strftime('%H%M%S')}",
            "email": f"test{datetime.now().strftime('%H%M%S')}@example.com",
            "phone": "123-456-7890",
            "skills": ["Python", "React", "FastAPI", "MongoDB"],
            "experience_level": "senior",
            "salary_expectation": 120000,
            "location": "Remote",
            "niche": "tech",
            "bio": "Experienced developer with a passion for AI and machine learning.",
            "soft_skills": ["Communication", "Leadership", "Problem Solving"],
            "languages": ["English", "Spanish"],
            "culture_preferences": ["Remote-first", "Flexible hours", "Learning culture"]
        }
        
        success, response = self.run_test(
            "Create Candidate",
            "POST",
            "api/candidates",
            200,
            data=candidate_data
        )
        
        if success and 'candidate_id' in response:
            self.candidate_id = response['candidate_id']
            print(f"Created candidate with ID: {self.candidate_id}")
        
        return success

    def test_get_candidates(self):
        """Test retrieving all candidates"""
        success, response = self.run_test(
            "Get All Candidates",
            "GET",
            "api/candidates",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} candidates")
        
        return success

    def test_get_candidate(self):
        """Test retrieving a specific candidate"""
        if not self.candidate_id:
            print("❌ Cannot test get_candidate: No candidate ID available")
            return False
        
        success, response = self.run_test(
            "Get Specific Candidate",
            "GET",
            f"api/candidates/{self.candidate_id}",
            200
        )
        
        if success:
            print(f"Retrieved candidate: {response['name']}")
        
        return success

    def test_create_job(self):
        """Test creating a job"""
        job_data = {
            "title": f"Senior Developer {datetime.now().strftime('%H%M%S')}",
            "company": "TechCorp",
            "description": "We're looking for an experienced developer to join our team.",
            "required_skills": ["Python", "React", "FastAPI", "MongoDB"],
            "experience_level": "senior",
            "salary_range_min": 100000,
            "salary_range_max": 150000,
            "location": "Remote",
            "niche": "tech",
            "company_culture": ["Remote-first", "Flexible hours", "Learning culture"],
            "benefits": ["Health insurance", "401k", "Unlimited PTO"],
            "required_soft_skills": ["Communication", "Leadership", "Problem Solving"]
        }
        
        success, response = self.run_test(
            "Create Job",
            "POST",
            "api/jobs",
            200,
            data=job_data
        )
        
        if success and 'job_id' in response:
            self.job_id = response['job_id']
            print(f"Created job with ID: {self.job_id}")
        
        return success

    def test_get_jobs(self):
        """Test retrieving all jobs"""
        success, response = self.run_test(
            "Get All Jobs",
            "GET",
            "api/jobs",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} jobs")
        
        return success

    def test_get_job(self):
        """Test retrieving a specific job"""
        if not self.job_id:
            print("❌ Cannot test get_job: No job ID available")
            return False
        
        success, response = self.run_test(
            "Get Specific Job",
            "GET",
            f"api/jobs/{self.job_id}",
            200
        )
        
        if success:
            print(f"Retrieved job: {response['title']}")
        
        return success

    def test_generate_matches(self):
        """Test generating AI matches for a job"""
        if not self.job_id:
            print("❌ Cannot test generate_matches: No job ID available")
            return False
        
        success, response = self.run_test(
            "Generate AI Matches",
            "POST",
            f"api/matches/generate/{self.job_id}",
            200
        )
        
        if success:
            print(f"Generated {len(response.get('matches', []))} matches")
            if 'matches' in response and len(response['matches']) > 0:
                match = response['matches'][0]
                print(f"Top match score: {match.get('overall_score', 'N/A')}")
                print(f"Skills match: {match.get('skills_match', 'N/A')}")
                print(f"Culture match: {match.get('culture_match', 'N/A')}")
                print(f"Salary match: {match.get('salary_match', 'N/A')}")
        
        return success

    def test_get_job_matches(self):
        """Test retrieving matches for a job"""
        if not self.job_id:
            print("❌ Cannot test get_job_matches: No job ID available")
            return False
        
        success, response = self.run_test(
            "Get Job Matches",
            "GET",
            f"api/matches/job/{self.job_id}",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} matches for job")
        
        return success

    def test_get_dashboard_analytics(self):
        """Test retrieving dashboard analytics"""
        success, response = self.run_test(
            "Get Dashboard Analytics",
            "GET",
            "api/analytics/dashboard",
            200
        )
        
        if success:
            print(f"Dashboard stats: {response.get('total_candidates', 0)} candidates, {response.get('total_jobs', 0)} jobs, {response.get('total_matches', 0)} matches")
        
        return success

    def test_get_niches(self):
        """Test retrieving available niches"""
        success, response = self.run_test(
            "Get Niches",
            "GET",
            "api/niches",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} niches")
            print(f"Available niches: {', '.join([niche['value'] for niche in response])}")
        
        return success

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://bec4bcd7-73a8-4923-9ab9-718ae830ca89.preview.emergentagent.com"
    
    print(f"🚀 Starting TRABAJAI API tests using URL: {backend_url}")
    
    tester = TrabajaAITester(backend_url)
    
    # Run tests
    tests = [
        tester.test_health_check,
        tester.test_get_niches,
        tester.test_create_candidate,
        tester.test_get_candidates,
        tester.test_get_candidate,
        tester.test_create_job,
        tester.test_get_jobs,
        tester.test_get_job,
        tester.test_generate_matches,
        tester.test_get_job_matches,
        tester.test_get_dashboard_analytics
    ]
    
    for test in tests:
        test()
        time.sleep(0.5)  # Small delay between tests
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())