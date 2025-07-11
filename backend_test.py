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
        self.test_room_id = None

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
        """Test retrieving dashboard analytics with specific expected numbers"""
        success, response = self.run_test(
            "Get Dashboard Analytics",
            "GET",
            "api/analytics/dashboard",
            200
        )
        
        if success:
            # Expected numbers from the implementation
            expected_values = {
                'total_candidates': 2847,
                'total_jobs': 193,
                'total_matches': 5624,
                'success_rate': 91.2,
                'candidates_with_video': 1289,
                'video_completion_rate': 94.2
            }
            
            print(f"📊 Dashboard Analytics Results:")
            all_correct = True
            
            for key, expected in expected_values.items():
                actual = response.get(key)
                status = "✅" if actual == expected else "❌"
                print(f"  {status} {key}: {actual} (expected: {expected})")
                if actual != expected:
                    all_correct = False
            
            # Check niche distribution
            niche_stats = response.get('niche_distribution', {})
            expected_tech_candidates = 1247
            actual_tech_candidates = niche_stats.get('tech', {}).get('candidates', 0)
            tech_status = "✅" if actual_tech_candidates == expected_tech_candidates else "❌"
            print(f"  {tech_status} tech_candidates: {actual_tech_candidates} (expected: {expected_tech_candidates})")
            
            if actual_tech_candidates != expected_tech_candidates:
                all_correct = False
            
            if all_correct:
                print("🎉 All dashboard numbers are correct!")
            else:
                print("⚠️  Some dashboard numbers don't match expected values")
        
        return success

    def test_get_video_analytics(self):
        """Test retrieving video analytics with specific expected numbers"""
        success, response = self.run_test(
            "Get Video Analytics",
            "GET",
            "api/analytics/video",
            200
        )
        
        if success:
            # Expected numbers from the implementation
            expected_values = {
                'total_videos': 1289,
                'avg_communication_score': 87.3,
                'avg_confidence_score': 82.1,
                'avg_professionalism_score': 91.8,
                'avg_energy_level': 78.5
            }
            
            print(f"🎥 Video Analytics Results:")
            all_correct = True
            
            for key, expected in expected_values.items():
                actual = response.get(key)
                status = "✅" if actual == expected else "❌"
                print(f"  {status} {key}: {actual} (expected: {expected})")
                if actual != expected:
                    all_correct = False
            
            if all_correct:
                print("🎉 All video analytics numbers are correct!")
            else:
                print("⚠️  Some video analytics numbers don't match expected values")
        
        return success

    def test_sector_distribution(self):
        """Test sector distribution numbers in dashboard analytics"""
        success, response = self.run_test(
            "Get Dashboard Analytics for Sector Distribution",
            "GET",
            "api/analytics/dashboard",
            200
        )
        
        if success:
            niche_stats = response.get('niche_distribution', {})
            expected_distribution = {
                'tech': {'candidates': 1247, 'jobs': 89},
                'creative': {'candidates': 521, 'jobs': 34},
                'health': {'candidates': 389, 'jobs': 28},
                'finance': {'candidates': 278, 'jobs': 19},
                'marketing': {'candidates': 234, 'jobs': 15},
                'sales': {'candidates': 178, 'jobs': 8},
                'operations': {'candidates': 156, 'jobs': 7},
                'education': {'candidates': 89, 'jobs': 3}
            }
            
            print(f"🏢 Sector Distribution Results:")
            all_correct = True
            
            for sector, expected_data in expected_distribution.items():
                actual_data = niche_stats.get(sector, {})
                actual_candidates = actual_data.get('candidates', 0)
                actual_jobs = actual_data.get('jobs', 0)
                
                candidates_status = "✅" if actual_candidates == expected_data['candidates'] else "❌"
                jobs_status = "✅" if actual_jobs == expected_data['jobs'] else "❌"
                
                print(f"  {sector.title()}:")
                print(f"    {candidates_status} Candidates: {actual_candidates} (expected: {expected_data['candidates']})")
                print(f"    {jobs_status} Jobs: {actual_jobs} (expected: {expected_data['jobs']})")
                
                if actual_candidates != expected_data['candidates'] or actual_jobs != expected_data['jobs']:
                    all_correct = False
            
            if all_correct:
                print("🎉 All sector distribution numbers are correct!")
            else:
                print("⚠️  Some sector distribution numbers don't match expected values")
        
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

    # ============================================================================
    # CHAT SYSTEM TESTS
    # ============================================================================
    
    def test_chat_analytics(self):
        """Test chat analytics endpoint"""
        success, response = self.run_test(
            "Chat Analytics",
            "GET",
            "api/chat/analytics",
            200
        )
        
        if success:
            print(f"📊 Chat Analytics Results:")
            print(f"  Total rooms: {response.get('total_rooms', 0)}")
            print(f"  Total messages: {response.get('total_messages', 0)}")
            print(f"  Active users: {response.get('active_users', 0)}")
            print(f"  Recent messages (24h): {response.get('recent_messages_24h', 0)}")
            
            room_types = response.get('room_types', {})
            print(f"  Room types:")
            print(f"    Support: {room_types.get('support', 0)}")
            print(f"    General: {room_types.get('general', 0)}")
            print(f"    Candidate-Employer: {room_types.get('candidate_employer', 0)}")
            print(f"    Custom: {room_types.get('custom', 0)}")
            
            # Check expected default rooms
            expected_total_rooms = 2  # general-chat and support-chat
            expected_support = 1
            expected_general = 1
            
            if (response.get('total_rooms') == expected_total_rooms and 
                room_types.get('support') == expected_support and 
                room_types.get('general') == expected_general):
                print("✅ Default rooms created correctly!")
            else:
                print("⚠️  Default rooms may not be set up correctly")
        
        return success

    def test_create_chat_room(self):
        """Test creating a custom chat room"""
        room_data = {
            "name": f"Test Room {datetime.now().strftime('%H%M%S')}",
            "room_type": "custom",
            "participants": ["user123", "user456"],
            "metadata": {
                "description": "Test room for API testing",
                "created_for": "testing"
            }
        }
        
        success, response = self.run_test(
            "Create Chat Room",
            "POST",
            "api/chat/rooms",
            200,
            data=room_data
        )
        
        if success and 'room_id' in response:
            self.test_room_id = response['room_id']
            print(f"Created test room with ID: {self.test_room_id}")
        
        return success

    def test_get_user_rooms(self):
        """Test getting rooms for a user"""
        test_user_id = "user123"
        
        success, response = self.run_test(
            "Get User Rooms",
            "GET",
            f"api/chat/rooms/{test_user_id}",
            200
        )
        
        if success:
            print(f"Retrieved {len(response)} rooms for user {test_user_id}")
            for room in response:
                print(f"  Room: {room.get('name')} (Type: {room.get('room_type')})")
        
        return success

    def test_join_chat_room(self):
        """Test joining a chat room"""
        # Try to join the general chat room
        room_id = "general-chat"
        user_id = "testuser789"
        
        # Use query parameter for user_id
        success, response = self.run_test(
            "Join Chat Room",
            "POST",
            f"api/chat/rooms/{room_id}/join?user_id={user_id}",
            200
        )
        
        if success:
            print(f"Successfully joined room {room_id}")
        
        return success

    def test_get_room_participants(self):
        """Test getting participants in a room"""
        room_id = "general-chat"
        
        success, response = self.run_test(
            "Get Room Participants",
            "GET",
            f"api/chat/rooms/{room_id}/participants",
            200
        )
        
        if success:
            participants = response.get('participants', [])
            print(f"Room {room_id} has {len(participants)} participants")
            for participant in participants:
                print(f"  User: {participant.get('user_id')} (Online: {participant.get('is_online')})")
        
        return success

    def test_get_room_messages(self):
        """Test getting messages from a room"""
        room_id = "general-chat"
        
        success, response = self.run_test(
            "Get Room Messages",
            "GET",
            f"api/chat/messages/{room_id}",
            200
        )
        
        if success:
            messages = response.get('messages', [])
            print(f"Room {room_id} has {len(messages)} messages")
            if messages:
                latest_message = messages[-1]
                print(f"  Latest message from {latest_message.get('user_name')}: {latest_message.get('message')[:50]}...")
        
        return success

    def test_leave_chat_room(self):
        """Test leaving a chat room"""
        room_id = "general-chat"
        user_id = "testuser789"
        
        # Use the run_delete_test method with proper parameters
        success, response = self.run_delete_test(
            "Leave Chat Room",
            f"api/chat/rooms/{room_id}/leave",
            200,
            params={"user_id": user_id}
        )
        
        if success:
            print(f"Successfully left room {room_id}")
        
        return success

    def test_chat_room_types(self):
        """Test that all expected chat room types are supported"""
        expected_types = ["support", "candidate_employer", "general", "custom"]
        
        # Test creating rooms of different types
        for room_type in expected_types:
            room_data = {
                "name": f"Test {room_type.title()} Room",
                "room_type": room_type,
                "participants": ["testuser"],
                "metadata": {"test": True}
            }
            
            success, response = self.run_test(
                f"Create {room_type.title()} Room",
                "POST",
                "api/chat/rooms",
                200,
                data=room_data
            )
            
            if not success:
                return False
        
        print("✅ All chat room types supported")
        return True

    def run_delete_test(self, name, endpoint, expected_status, params=None):
        """Run a DELETE API test"""
        url = f"{self.base_url}/{endpoint}"
        if params:
            url += "?" + "&".join([f"{k}={v}" for k, v in params.items()])
        
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            response = requests.delete(url, headers=headers)
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

    # ============================================================================
    # NEWS API TESTS
    # ============================================================================
    
    def test_get_news(self):
        """Test retrieving all news articles"""
        success, response = self.run_test(
            "Get All News Articles",
            "GET",
            "api/news",
            200
        )
        
        if success:
            news_articles = response.get('news', [])
            print(f"📰 Retrieved {len(news_articles)} news articles")
            
            if len(news_articles) > 0:
                article = news_articles[0]
                expected_fields = ['id', 'title', 'summary', 'content', 'image', 'date', 'category', 'author', 'tags']
                
                print(f"📋 Checking article structure:")
                all_fields_present = True
                for field in expected_fields:
                    if field in article:
                        print(f"  ✅ {field}: Present")
                    else:
                        print(f"  ❌ {field}: Missing")
                        all_fields_present = False
                
                if all_fields_present:
                    print("🎉 All required fields present in news articles!")
                else:
                    print("⚠️  Some required fields missing from news articles")
                    
                # Check specific EMPLEATEAI article content
                empleateai_article = next((art for art in news_articles if art['id'] == 'empleateai-revolucion-dominicana'), None)
                if empleateai_article:
                    print(f"📄 EMPLEATEAI Article Verification:")
                    expected_values = {
                        'title': 'EMPLEATEAI: Agencia de Empleo creada por estudiantes de San José de Ocoa',
                        'category': 'Tecnología',
                        'author': 'Instituto Social de Tecnificación Moderna (ISTEM)',
                        'date': '2024-07-15',
                        'image': 'https://www.totalcash.xyz/images/agenciai.jpg'
                    }
                    
                    for field, expected_value in expected_values.items():
                        actual_value = empleateai_article.get(field)
                        status = "✅" if actual_value == expected_value else "❌"
                        print(f"  {status} {field}: {actual_value}")
                    
                    # Check tags
                    expected_tags = ["inteligencia artificial", "empleo", "educación", "república dominicana", "innovación"]
                    actual_tags = empleateai_article.get('tags', [])
                    tags_match = all(tag in actual_tags for tag in expected_tags)
                    tags_status = "✅" if tags_match else "❌"
                    print(f"  {tags_status} tags: {actual_tags}")
                    
                    if tags_match and all(empleateai_article.get(field) == expected_value for field, expected_value in expected_values.items()):
                        print("🎉 EMPLEATEAI article content verified successfully!")
                    else:
                        print("⚠️  EMPLEATEAI article content doesn't match expected values")
                else:
                    print("❌ EMPLEATEAI article not found in news list")
        
        return success

    def test_get_specific_news_article(self):
        """Test retrieving the specific EMPLEATEAI news article"""
        news_id = "empleateai-revolucion-dominicana"
        
        success, response = self.run_test(
            "Get Specific News Article (EMPLEATEAI)",
            "GET",
            f"api/news/{news_id}",
            200
        )
        
        if success:
            print(f"📰 Retrieved specific article: {response.get('title', 'Unknown')}")
            
            # Verify all expected fields are present
            expected_fields = ['id', 'title', 'summary', 'content', 'image', 'date', 'category', 'author', 'tags']
            all_fields_present = True
            
            print(f"📋 Article structure verification:")
            for field in expected_fields:
                if field in response:
                    print(f"  ✅ {field}: Present")
                else:
                    print(f"  ❌ {field}: Missing")
                    all_fields_present = False
            
            # Verify specific content
            expected_values = {
                'id': 'empleateai-revolucion-dominicana',
                'title': 'EMPLEATEAI: Agencia de Empleo creada por estudiantes de San José de Ocoa',
                'category': 'Tecnología',
                'author': 'Instituto Social de Tecnificación Moderna (ISTEM)',
                'date': '2024-07-15',
                'image': 'https://www.totalcash.xyz/images/agenciai.jpg'
            }
            
            print(f"📄 Content verification:")
            content_correct = True
            for field, expected_value in expected_values.items():
                actual_value = response.get(field)
                status = "✅" if actual_value == expected_value else "❌"
                print(f"  {status} {field}: {actual_value}")
                if actual_value != expected_value:
                    content_correct = False
            
            # Check tags
            expected_tags = ["inteligencia artificial", "empleo", "educación", "república dominicana", "innovación"]
            actual_tags = response.get('tags', [])
            tags_match = all(tag in actual_tags for tag in expected_tags)
            tags_status = "✅" if tags_match else "❌"
            print(f"  {tags_status} tags: Contains all expected tags")
            
            # Check content length (should be substantial)
            content = response.get('content', '')
            content_length_ok = len(content) > 1000  # Should be a substantial article
            content_status = "✅" if content_length_ok else "❌"
            print(f"  {content_status} content_length: {len(content)} characters")
            
            if all_fields_present and content_correct and tags_match and content_length_ok:
                print("🎉 EMPLEATEAI article retrieved and verified successfully!")
            else:
                print("⚠️  Some issues found with the EMPLEATEAI article")
        
        return success

    def test_get_invalid_news_article(self):
        """Test retrieving a non-existent news article (should return 404)"""
        invalid_news_id = "invalid-article-id"
        
        success, response = self.run_test(
            "Get Invalid News Article (404 Test)",
            "GET",
            f"api/news/{invalid_news_id}",
            404
        )
        
        if success:
            print("✅ Correctly returned 404 for invalid news article ID")
        else:
            print("❌ Should have returned 404 for invalid news article ID")
        
        return success

def main():
    # Get the backend URL from the frontend .env file
    backend_url = "https://ca4681fc-5333-4e13-9e57-bfa98537b98b.preview.emergentagent.com"
    
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
        tester.test_get_dashboard_analytics,
        tester.test_get_video_analytics,
        tester.test_sector_distribution,
        # Chat System Tests
        tester.test_chat_analytics,
        tester.test_create_chat_room,
        tester.test_get_user_rooms,
        tester.test_join_chat_room,
        tester.test_get_room_participants,
        tester.test_get_room_messages,
        tester.test_leave_chat_room,
        tester.test_chat_room_types,
        # News API Tests
        tester.test_get_news,
        tester.test_get_specific_news_article,
        tester.test_get_invalid_news_article
    ]
    
    for test in tests:
        test()
        time.sleep(0.5)  # Small delay between tests
    
    # Print results
    print(f"\n📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())