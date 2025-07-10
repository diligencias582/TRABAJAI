import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [niches, setNiches] = useState([]);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
    loadNiches();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [candidatesRes, jobsRes, analyticsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/candidates`),
        fetch(`${API_BASE_URL}/api/jobs`),
        fetch(`${API_BASE_URL}/api/analytics/dashboard`)
      ]);

      const candidatesData = await candidatesRes.json();
      const jobsData = await jobsRes.json();
      const analyticsData = await analyticsRes.json();

      setCandidates(candidatesData);
      setJobs(jobsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNiches = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/niches`);
      const data = await response.json();
      setNiches(data);
    } catch (error) {
      console.error('Error loading niches:', error);
    }
  };

  const generateMatches = async (jobId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/matches/generate/${jobId}`, {
        method: 'POST'
      });
      const data = await response.json();
      setMatches(data.matches);
      alert(`Generated ${data.matches.length} AI-powered matches!`);
    } catch (error) {
      console.error('Error generating matches:', error);
      alert('Error generating matches');
    } finally {
      setLoading(false);
    }
  };

  const CandidateForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      skills: '',
      experience_level: 'junior',
      salary_expectation: '',
      location: '',
      niche: 'tech',
      bio: '',
      soft_skills: '',
      languages: '',
      culture_preferences: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const payload = {
          ...formData,
          skills: formData.skills.split(',').map(s => s.trim()),
          soft_skills: formData.soft_skills.split(',').map(s => s.trim()),
          languages: formData.languages.split(',').map(s => s.trim()),
          culture_preferences: formData.culture_preferences.split(',').map(s => s.trim()),
          salary_expectation: parseFloat(formData.salary_expectation)
        };

        const response = await fetch(`${API_BASE_URL}/api/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert('Candidate created successfully!');
          setFormData({
            name: '', email: '', phone: '', skills: '', experience_level: 'junior',
            salary_expectation: '', location: '', niche: 'tech', bio: '',
            soft_skills: '', languages: '', culture_preferences: ''
          });
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error creating candidate:', error);
        alert('Error creating candidate');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            🎯 Register Candidate
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Expectation ($)
                </label>
                <input
                  type="number"
                  value={formData.salary_expectation}
                  onChange={(e) => setFormData({...formData, salary_expectation: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niche
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {niches.map(niche => (
                    <option key={niche.value} value={niche.value}>{niche.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="React, Node.js, Python, AWS"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Soft Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.soft_skills}
                onChange={(e) => setFormData({...formData, soft_skills: e.target.value})}
                placeholder="Leadership, Communication, Problem Solving"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating...' : '🚀 Create Candidate'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const JobForm = () => {
    const [formData, setFormData] = useState({
      title: '',
      company: '',
      description: '',
      required_skills: '',
      experience_level: 'junior',
      salary_range_min: '',
      salary_range_max: '',
      location: '',
      niche: 'tech',
      company_culture: '',
      benefits: '',
      required_soft_skills: ''
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const payload = {
          ...formData,
          required_skills: formData.required_skills.split(',').map(s => s.trim()),
          company_culture: formData.company_culture.split(',').map(s => s.trim()),
          benefits: formData.benefits.split(',').map(s => s.trim()),
          required_soft_skills: formData.required_soft_skills.split(',').map(s => s.trim()),
          salary_range_min: parseFloat(formData.salary_range_min),
          salary_range_max: parseFloat(formData.salary_range_max)
        };

        const response = await fetch(`${API_BASE_URL}/api/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          alert('Job created successfully!');
          setFormData({
            title: '', company: '', description: '', required_skills: '',
            experience_level: 'junior', salary_range_min: '', salary_range_max: '',
            location: '', niche: 'tech', company_culture: '', benefits: '',
            required_soft_skills: ''
          });
          loadDashboardData();
        }
      } catch (error) {
        console.error('Error creating job:', error);
        alert('Error creating job');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            💼 Post New Job
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Salary ($)
                </label>
                <input
                  type="number"
                  value={formData.salary_range_min}
                  onChange={(e) => setFormData({...formData, salary_range_min: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Salary ($)
                </label>
                <input
                  type="number"
                  value={formData.salary_range_max}
                  onChange={(e) => setFormData({...formData, salary_range_max: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience Level
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Niche
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {niches.map(niche => (
                    <option key={niche.value} value={niche.value}>{niche.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                value={formData.required_skills}
                onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                placeholder="React, Node.js, Python, AWS"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Job Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                placeholder="Describe the job role and responsibilities..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? 'Creating...' : '📝 Post Job'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const Dashboard = () => {
    if (!analytics) {
      return <div className="text-center text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
    }

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 TRABAJAI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AI-Powered Recruitment Platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
            <div className="text-3xl font-bold">{analytics.total_candidates}</div>
            <div className="text-blue-100">Total Candidates</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="text-3xl font-bold">{analytics.total_jobs}</div>
            <div className="text-green-100">Active Jobs</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <div className="text-3xl font-bold">{analytics.total_matches}</div>
            <div className="text-orange-100">AI Matches</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="text-3xl font-bold">{analytics.success_rate}%</div>
            <div className="text-purple-100">Success Rate</div>
          </div>
        </div>

        {/* Niche Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📊 Talent Distribution by Niche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analytics.niche_distribution).map(([niche, data]) => (
              <div key={niche} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="font-semibold text-gray-900 dark:text-white capitalize">
                  {niche}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {data.candidates} candidates, {data.jobs} jobs
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💼 Recent Jobs
          </h2>
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {job.title} at {job.company}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {job.location} • {job.experience_level} • {job.niche}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-2">
                      ${job.salary_range_min?.toLocaleString()} - ${job.salary_range_max?.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => generateMatches(job.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
                  >
                    {loading ? '🔄' : '🎯 Generate Matches'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matches */}
        {matches.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🤖 AI-Generated Matches
            </h2>
            <div className="space-y-4">
              {matches.slice(0, 5).map((match) => (
                <div key={match.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Match Score: {match.overall_score.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Skills: {match.skills_match.toFixed(1)}% • Culture: {match.culture_match.toFixed(1)}% • Salary: {match.salary_match.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                        {match.ai_analysis}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${match.overall_score >= 80 ? 'bg-green-500' : match.overall_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {match.overall_score >= 80 ? 'Excellent' : match.overall_score >= 60 ? 'Good' : 'Fair'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Navigation = () => (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              🤖 TRABAJAI
            </div>
            <div className="flex space-x-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'dashboard'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setCurrentView('candidates')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'candidates'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
                }`}
              >
                🎯 Candidates
              </button>
              <button
                onClick={() => setCurrentView('jobs')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'jobs'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
                }`}
              >
                💼 Jobs
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-200">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'candidates' && <CandidateForm />}
          {currentView === 'jobs' && <JobForm />}
        </div>
      </div>
    </div>
  );
}

export default App;