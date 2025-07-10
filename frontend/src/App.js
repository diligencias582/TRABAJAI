import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Premium Icon Components
const Icons = {
  ArrowRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Play: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 10l-2 2m2-2V7a2 2 0 114 0v3m-2 0l2 2" />
    </svg>
  ),
  Video: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
};

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [matches, setMatches] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [niches, setNiches] = useState([]);
  const [videoRecording, setVideoRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
    loadNiches();
    loadInterviews();
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

  const loadInterviews = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/interviews`);
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error loading interviews:', error);
    }
  };

  const startVideoRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }, 
        audio: true 
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
      };
      
      mediaRecorder.start();
      setVideoRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Error al acceder a la cámara. Por favor, permite el acceso.');
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && videoRecording) {
      mediaRecorderRef.current.stop();
      setVideoRecording(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
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

  const VideoInterviewModule = () => {
    return (
      <div className="max-w-6xl mx-auto p-6">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 px-8 py-16 text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              📱 Video Entrevistas Móviles
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Graba tu video-pitch desde cualquier lugar. IA analiza tu comunicación, 
              lenguaje corporal y soft skills para encontrar el trabajo perfecto.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={videoRecording ? stopVideoRecording : startVideoRecording}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  videoRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white'
                }`}
              >
                {videoRecording ? '🛑 Detener Grabación' : '🎬 Iniciar Video-Pitch'}
              </button>
            </div>
          </div>
          
          {/* Background Images */}
          <div className="absolute top-4 right-4 opacity-20">
            <img 
              src="https://images.pexels.com/photos/6954220/pexels-photo-6954220.jpeg" 
              alt="Mobile Interview" 
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <img 
              src="https://images.pexels.com/photos/7676408/pexels-photo-7676408.jpeg" 
              alt="Professional Setup" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Video Recording Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🎥 Estudio de Grabación
            </h3>
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video mb-4">
              {videoRecording || stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
              ) : recordedVideo ? (
                <video
                  src={recordedVideo}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">📹</div>
                    <p className="text-lg">Inicia tu grabación para previsualizar</p>
                  </div>
                </div>
              )}
              
              {videoRecording && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  REC
                </div>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={videoRecording ? stopVideoRecording : startVideoRecording}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  videoRecording 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {videoRecording ? '⏹️ Parar' : '▶️ Grabar'}
              </button>
              
              {recordedVideo && (
                <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200">
                  📤 Subir Video
                </button>
              )}
            </div>
          </div>

          {/* Interview Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              💡 Consejos para tu Video-Pitch
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Iluminación Natural</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Usa luz natural o un ring light para mejor calidad</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">2</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Fondo Profesional</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fondo limpio y sin distracciones</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">3</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Audio Claro</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Habla con claridad y evita ruidos de fondo</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">4</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Duración Ideal</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Entre 60-90 segundos para mantener atención</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Questions */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            🎯 Preguntas Sugeridas por IA
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Para Desarrolladores</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <li>• "Cuéntanos sobre tu proyecto más desafiante"</li>
                <li>• "¿Cómo te mantienes actualizado con nuevas tecnologías?"</li>
                <li>• "Describe tu proceso de debugging"</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Para Creativos</h4>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li>• "Muéstranos tu proceso creativo"</li>
                <li>• "¿Cómo manejas la crítica constructiva?"</li>
                <li>• "Describe un proyecto del que te sientes orgulloso"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile Features Showcase */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              📱 Características Móviles Avanzadas
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Graba desde cualquier lugar con tecnología de vanguardia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎥</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Grabación HD</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Calidad profesional desde tu smartphone con estabilización automática
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Análisis IA</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Evaluación automática de lenguaje corporal y comunicación
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">☁️</span>
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Sync Instantáneo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sincronización automática con tu perfil y matches en tiempo real
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
      culture_preferences: '',
      video_pitch_url: recordedVideo || ''
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
          salary_expectation: parseFloat(formData.salary_expectation),
          video_pitch_url: recordedVideo || ''
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
            soft_skills: '', languages: '', culture_preferences: '', video_pitch_url: ''
          });
          setRecordedVideo(null);
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
        {/* Video Section */}
        {recordedVideo && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🎬 Tu Video-Pitch
            </h3>
            <video
              src={recordedVideo}
              controls
              className="w-full max-w-md mx-auto rounded-lg"
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setCurrentView('video-interview')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                🎥 Grabar Nuevo Video
              </button>
            </div>
          </div>
        )}

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

            {!recordedVideo && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎬</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    ¿Quieres destacar? ¡Graba tu Video-Pitch!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Los candidatos con video tienen 5x más probabilidades de ser contactados
                  </p>
                  <button
                    type="button"
                    onClick={() => setCurrentView('video-interview')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    🎥 Grabar Video-Pitch
                  </button>
                </div>
              </div>
            )}

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
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="loading-shimmer w-32 h-32 rounded-full mx-auto mb-4"></div>
            <div className="text-lg font-medium text-gray-600 dark:text-gray-400">
              Cargando Dashboard Premium...
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-12 animate-fade-scale">
        {/* Premium Hero Section */}
        <div className="gradient-hero rounded-3xl overflow-hidden shadow-premium">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="relative z-20 px-8 py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div className="text-center lg:text-left animate-slide-up">
                <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium mb-6 glass-card">
                  <Icons.Sparkles />
                  <span className="ml-2">Powered by Advanced AI</span>
                </div>
                <h1 className="text-6xl lg:text-7xl font-black text-white mb-6 hero-title">
                  TRABAJAI
                  <span className="text-4xl lg:text-5xl block text-blue-200 font-light mt-2">
                    Premium Edition
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-10 hero-subtitle leading-relaxed">
                  La plataforma de reclutamiento más avanzada del mundo con IA de próxima generación 
                  y video-entrevistas inmersivas
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={() => setCurrentView('video-interview')}
                    className="btn-premium group px-8 py-4 text-lg font-bold flex items-center justify-center gap-3"
                  >
                    <Icons.Video />
                    <span>Comenzar Video-Pitch</span>
                    <Icons.ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => setCurrentView('candidates')}
                    className="btn-secondary px-8 py-4 text-lg font-bold flex items-center justify-center gap-3"
                  >
                    <Icons.Star />
                    <span>Únete Ahora</span>
                  </button>
                </div>
                
                {/* Trust Indicators */}
                <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-white opacity-80">
                  <div className="text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-sm">Precisión IA</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">5x</div>
                    <div className="text-sm">Más Rápido</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-sm">Disponible</div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-float">
                <div className="relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZWNydWl0bWVudHxlbnwwfHx8Ymx1ZXwxNzUyMTc4MDE3fDA&ixlib=rb-4.1.0&q=85" 
                    alt="Professional AI Recruitment" 
                    className="w-full max-w-lg mx-auto rounded-3xl shadow-glass glass-card p-4"
                  />
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse-premium"></div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse-premium" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-16 -right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 animate-pulse-premium" style={{animationDelay: '2s'}}></div>
                
                {/* AI Badge */}
                <div className="absolute top-8 left-8 glass-card px-4 py-2 text-white text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>IA Activa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{analytics.total_candidates}</div>
                <div className="text-blue-100">Total Candidates</div>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{analytics.total_jobs}</div>
                <div className="text-green-100">Active Jobs</div>
              </div>
              <div className="text-4xl opacity-80">💼</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{analytics.total_matches}</div>
                <div className="text-orange-100">AI Matches</div>
              </div>
              <div className="text-4xl opacity-80">🎯</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{analytics.success_rate}%</div>
                <div className="text-purple-100">Success Rate</div>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>
        </div>

        {/* Video Interview Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📱 Video Interview Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">47</div>
              <div className="text-sm text-blue-800 dark:text-blue-200">Videos Grabados Hoy</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">92%</div>
              <div className="text-sm text-green-800 dark:text-green-200">Calidad de Audio/Video</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">1.2m</div>
              <div className="text-sm text-purple-800 dark:text-purple-200">Tiempo Promedio</div>
            </div>
          </div>
        </div>

        {/* Niche Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            📊 Talent Distribution by Niche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(analytics.niche_distribution).map(([niche, data]) => (
              <div key={niche} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                <div className="font-semibold text-gray-900 dark:text-white capitalize flex items-center">
                  <span className="mr-2">
                    {niche === 'tech' && '💻'}
                    {niche === 'creative' && '🎨'}
                    {niche === 'health' && '⚕️'}
                    {niche === 'finance' && '💰'}
                    {niche === 'marketing' && '📢'}
                    {niche === 'sales' && '📈'}
                    {niche === 'operations' && '⚙️'}
                    {niche === 'education' && '📚'}
                  </span>
                  {niche}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {data.candidates} candidates, {data.jobs} jobs
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs with Enhanced UI */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            💼 Recent Jobs
          </h2>
          <div className="space-y-4">
            {jobs.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">
                        {job.niche === 'tech' && '💻'}
                        {job.niche === 'creative' && '🎨'}
                        {job.niche === 'health' && '⚕️'}
                        {job.niche === 'finance' && '💰'}
                      </span>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {job.title} at {job.company}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {job.location} • {job.experience_level} • {job.niche}
                    </p>
                    <p className="text-sm text-green-600 font-medium mt-2">
                      ${job.salary_range_min?.toLocaleString()} - ${job.salary_range_max?.toLocaleString()}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.required_skills?.slice(0, 3).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => generateMatches(job.id)}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
                  >
                    {loading ? '🔄' : '🎯 Generate Matches'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Matches with Video Preview */}
        {matches.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🤖 AI-Generated Matches
            </h2>
            <div className="space-y-4">
              {matches.slice(0, 5).map((match) => (
                <div key={match.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`w-4 h-4 rounded-full ${match.overall_score >= 80 ? 'bg-green-500' : match.overall_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Match Score: {match.overall_score.toFixed(1)}%
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {match.overall_score >= 80 ? '⭐ Excellent' : match.overall_score >= 60 ? '👍 Good' : '👌 Fair'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div>Skills: {match.skills_match.toFixed(1)}%</div>
                        <div>Culture: {match.culture_match.toFixed(1)}%</div>
                        <div>Salary: {match.salary_match.toFixed(1)}%</div>
                        <div>Success: {match.success_projection.toFixed(1)}%</div>
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                        {match.ai_analysis?.substring(0, 200)}...
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {match.match_reasons?.slice(0, 2).map((reason, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            ✓ {reason.substring(0, 50)}...
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200">
                        📹 Ver Video
                      </button>
                      <button className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all duration-200 block w-full">
                        📞 Interview
                      </button>
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
                onClick={() => setCurrentView('video-interview')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentView === 'video-interview'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-500'
                }`}
              >
                📱 Video Interview
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
          {currentView === 'video-interview' && <VideoInterviewModule />}
          {currentView === 'candidates' && <CandidateForm />}
          {currentView === 'jobs' && <JobForm />}
        </div>
      </div>
    </div>
  );
}

export default App;