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
      <div className="max-w-7xl mx-auto p-6 space-y-12 animate-fade-scale">
        {/* Premium Hero Section */}
        <div className="gradient-hero rounded-3xl overflow-hidden shadow-premium relative">
          <div className="absolute inset-0 pattern-grid opacity-20"></div>
          <div className="relative z-20 px-8 py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-20 rounded-full text-white text-sm font-bold mb-8 glass-card">
                  <Icons.Sparkles />
                  <span className="ml-2">Tecnología de Video IA Avanzada</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  Video Entrevistas
                  <span className="block text-blue-200 text-4xl lg:text-5xl font-light">
                    de Nueva Generación
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 mb-10 leading-relaxed">
                  Graba tu video-pitch profesional desde cualquier dispositivo. Nuestra IA analiza 
                  comunicación, lenguaje corporal y soft skills para conectarte con el trabajo perfecto.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={videoRecording ? stopVideoRecording : startVideoRecording}
                    className={`btn-premium group px-8 py-4 text-lg font-bold flex items-center justify-center gap-3 ${
                      videoRecording 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                        : ''
                    }`}
                  >
                    {videoRecording ? (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" rx="1"/>
                        </svg>
                        <span>Detener Grabación</span>
                      </>
                    ) : (
                      <>
                        <Icons.Video />
                        <span>Iniciar Video-Pitch</span>
                        <Icons.ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
                
                {/* Trust Badges */}
                <div className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-white opacity-90">
                  <div className="text-center">
                    <div className="text-xl font-black">HD</div>
                    <div className="text-xs">Calidad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black">IA</div>
                    <div className="text-xs">Análisis</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black">24/7</div>
                    <div className="text-xs">Acceso</div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-float">
                <div className="relative z-10">
                  <img 
                    src="https://images.pexels.com/photos/8102677/pexels-photo-8102677.jpeg" 
                    alt="Professional Video Setup" 
                    className="w-full max-w-lg mx-auto rounded-3xl shadow-glass glass-card p-4"
                  />
                </div>
                
                {/* Floating Tech Elements */}
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20 animate-pulse-premium"></div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 animate-pulse-premium" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-12 -right-2 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-20 animate-pulse-premium" style={{animationDelay: '2s'}}></div>
              </div>
            </div>
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

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card-premium stats-card-blue p-8 text-white group hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">Total</div>
                <div className="text-3xl font-black">{analytics.total_candidates}</div>
              </div>
            </div>
            <div className="text-blue-100 font-medium">Candidatos Registrados</div>
            <div className="mt-3 flex items-center text-green-200 text-sm">
              <Icons.CheckCircle />
              <span className="ml-1">+12% este mes</span>
            </div>
          </div>

          <div className="card-premium stats-card-green p-8 text-white group hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">Activos</div>
                <div className="text-3xl font-black">{analytics.total_jobs}</div>
              </div>
            </div>
            <div className="text-green-100 font-medium">Empleos Disponibles</div>
            <div className="mt-3 flex items-center text-emerald-200 text-sm">
              <Icons.CheckCircle />
              <span className="ml-1">+8% esta semana</span>
            </div>
          </div>

          <div className="card-premium stats-card-purple p-8 text-white group hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">IA Generados</div>
                <div className="text-3xl font-black">{analytics.total_matches}</div>
              </div>
            </div>
            <div className="text-purple-100 font-medium">Matches Inteligentes</div>
            <div className="mt-3 flex items-center text-violet-200 text-sm">
              <Icons.Sparkles />
              <span className="ml-1">Precisión 94%</span>
            </div>
          </div>

          <div className="card-premium stats-card-orange p-8 text-white group hover:scale-105 transition-all duration-500">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-80">Tasa</div>
                <div className="text-3xl font-black">{analytics.success_rate}%</div>
              </div>
            </div>
            <div className="text-orange-100 font-medium">Éxito en Colocaciones</div>
            <div className="mt-3 flex items-center text-amber-200 text-sm">
              <Icons.Star />
              <span className="ml-1">Líder del mercado</span>
            </div>
          </div>
        </div>

        {/* Premium Video Analytics */}
        <div className="card-premium p-10 ai-glow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Analíticas de Video Premium
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Análisis en tiempo real impulsado por IA avanzada
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">127</div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Videos Analizados Hoy</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">+23% vs ayer</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">96%</div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Calidad Audio/Video</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-2">Excelente calidad</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">1.4m</div>
              <div className="text-sm font-medium text-purple-800 dark:text-purple-200">Duración Promedio</div>
              <div className="text-xs text-purple-600 dark:text-purple-400 mt-2">Óptimo para IA</div>
            </div>
          </div>
          
          {/* AI Insights */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <Icons.Sparkles className="text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white">Insights de IA</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Análisis predictivo en tiempo real</div>
              </div>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              La IA ha detectado un incremento del 34% en la calidad de comunicación de los candidatos que utilizan nuestros consejos de video-pitch.
            </div>
          </div>
        </div>

        {/* Premium Talent Distribution */}
        <div className="card-premium p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                Distribución de Talento por Sector
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Análisis detallado de nuestra base de talentos
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(analytics.niche_distribution).map(([niche, data]) => {
              const nicheInfo = {
                tech: { icon: '💻', color: 'from-blue-500 to-indigo-600', bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200' },
                creative: { icon: '🎨', color: 'from-purple-500 to-pink-600', bg: 'from-purple-50 to-pink-50', border: 'border-purple-200' },
                health: { icon: '⚕️', color: 'from-green-500 to-emerald-600', bg: 'from-green-50 to-emerald-50', border: 'border-green-200' },
                finance: { icon: '💰', color: 'from-yellow-500 to-orange-600', bg: 'from-yellow-50 to-orange-50', border: 'border-yellow-200' },
                marketing: { icon: '📢', color: 'from-red-500 to-pink-600', bg: 'from-red-50 to-pink-50', border: 'border-red-200' },
                sales: { icon: '📈', color: 'from-teal-500 to-cyan-600', bg: 'from-teal-50 to-cyan-50', border: 'border-teal-200' },
                operations: { icon: '⚙️', color: 'from-gray-500 to-slate-600', bg: 'from-gray-50 to-slate-50', border: 'border-gray-200' },
                education: { icon: '📚', color: 'from-orange-500 to-red-600', bg: 'from-orange-50 to-red-50', border: 'border-orange-200' }
              };
              
              const info = nicheInfo[niche] || nicheInfo.tech;
              
              return (
                <div key={niche} className={`p-6 bg-gradient-to-br ${info.bg} dark:from-gray-800 dark:to-gray-700 rounded-2xl border ${info.border} dark:border-gray-600 hover:scale-105 transition-all duration-300 group cursor-pointer`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform`}>
                      {info.icon}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900 dark:text-white">{data.candidates}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">candidatos</div>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white capitalize mb-1">
                    {niche === 'tech' ? 'Tecnología' : 
                     niche === 'creative' ? 'Creativos' :
                     niche === 'health' ? 'Salud' :
                     niche === 'finance' ? 'Finanzas' :
                     niche === 'marketing' ? 'Marketing' :
                     niche === 'sales' ? 'Ventas' :
                     niche === 'operations' ? 'Operaciones' :
                     'Educación'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {data.jobs} empleos activos
                  </div>
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 bg-gradient-to-r ${info.color} rounded-full transition-all duration-1000`}
                      style={{width: `${Math.min(100, (data.candidates / Math.max(...Object.values(analytics.niche_distribution).map(d => d.candidates))) * 100)}%`}}
                    ></div>
                  </div>
                </div>
              );
            })}
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
    <nav className="glass-nav sticky top-0 z-50 shadow-premium">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-10">
            {/* Premium Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-gradient">TRABAJAI</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Premium Edition</div>
              </div>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden lg:flex space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6a2 2 0 01-2 2H10a2 2 0 01-2-2V5z" />
                </svg>
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('video-interview')}
                className={`nav-item ${currentView === 'video-interview' ? 'active' : ''}`}
              >
                <Icons.Video className="mr-2" />
                Video Interview
              </button>
              <button
                onClick={() => setCurrentView('candidates')}
                className={`nav-item ${currentView === 'candidates' ? 'active' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Candidatos
              </button>
              <button
                onClick={() => setCurrentView('jobs')}
                className={`nav-item ${currentView === 'jobs' ? 'active' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Empleos
              </button>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Status Indicator */}
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Sistema Activo</span>
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
              data-tooltip={darkMode ? "Modo Claro" : "Modo Oscuro"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Quick Action Button */}
            <button
              onClick={() => setCurrentView('video-interview')}
              className="btn-premium px-6 py-3 text-sm font-bold flex items-center gap-2"
            >
              <Icons.Video />
              <span className="hidden sm:inline">Grabar Video</span>
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