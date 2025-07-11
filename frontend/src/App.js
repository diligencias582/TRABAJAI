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
  ),
  Chat: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18l9-2zm0 0v-8" />
    </svg>
  ),
  Paperclip: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  ),
  Emoji: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
  const [pricingPlans, setPricingPlans] = useState([]);
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSocket, setChatSocket] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [currentChatRoom, setCurrentChatRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatNotifications, setChatNotifications] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatView, setChatView] = useState('rooms'); // 'rooms' or 'chat'
  const [selectedChatType, setSelectedChatType] = useState('general');
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  // Chat functions
  const initializeChatSocket = () => {
    if (chatSocket) return;
    
    const io = require('socket.io-client');
    const socket = io(API_BASE_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
      timeout: 20000,
      forceNew: true
    });

    socket.on('connect', () => {
      console.log('Connected to chat server');
      setChatSocket(socket);
      loadChatRooms();
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    socket.on('new_message', (message) => {
      setChatMessages(prev => [...prev, message]);
      if (currentChatRoom && message.room_id === currentChatRoom.id) {
        setChatNotifications(prev => prev + 1);
      }
      scrollToBottom();
    });

    socket.on('user_joined', (data) => {
      console.log('User joined:', data);
      setOnlineUsers(prev => [...prev.filter(u => u.user_id !== data.user_id), data]);
    });

    socket.on('user_left', (data) => {
      console.log('User left:', data);
      setOnlineUsers(prev => prev.filter(u => u.user_id !== data.user_id));
    });

    socket.on('user_typing', (data) => {
      if (data.typing) {
        setTypingUsers(prev => [...prev.filter(u => u.user_id !== data.user_id), data]);
      } else {
        setTypingUsers(prev => prev.filter(u => u.user_id !== data.user_id));
      }
    });

    socket.on('reaction_added', (data) => {
      setChatMessages(prev => 
        prev.map(msg => 
          msg.id === data.message_id 
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      );
    });

    socket.on('error', (error) => {
      console.error('Chat error:', error);
    });

    return socket;
  };

  const loadChatRooms = async () => {
    try {
      const userId = user?.id || 'anonymous';
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms/${userId}`);
      const rooms = await response.json();
      setChatRooms(rooms);
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const joinChatRoom = (room) => {
    if (!chatSocket || !user) return;
    
    if (currentChatRoom) {
      chatSocket.emit('leave_room', {
        room_id: currentChatRoom.id,
        user_id: user.id
      });
    }

    setCurrentChatRoom(room);
    setChatView('chat');
    
    chatSocket.emit('join_room', {
      room_id: room.id,
      user_id: user.id
    });

    loadChatMessages(room.id);
  };

  const loadChatMessages = async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/messages/${roomId}`);
      const data = await response.json();
      setChatMessages(data.messages || []);
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !chatSocket || !currentChatRoom || !user) return;

    chatSocket.emit('send_message', {
      room_id: currentChatRoom.id,
      user_id: user.id,
      user_name: user.name,
      message: newMessage,
      message_type: 'text'
    });

    setNewMessage('');
    stopTyping();
  };

  const startTyping = () => {
    if (!chatSocket || !currentChatRoom || !user || isTyping) return;
    
    setIsTyping(true);
    chatSocket.emit('typing_start', {
      room_id: currentChatRoom.id,
      user_id: user.id,
      user_name: user.name
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!chatSocket || !currentChatRoom || !user || !isTyping) return;
    
    setIsTyping(false);
    chatSocket.emit('typing_stop', {
      room_id: currentChatRoom.id,
      user_id: user.id,
      user_name: user.name
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key !== 'Enter') {
      startTyping();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addReaction = (messageId, emoji) => {
    if (!chatSocket || !user) return;
    
    chatSocket.emit('add_reaction', {
      message_id: messageId,
      emoji: emoji,
      user_id: user.id
    });
  };

  const createChatRoom = async (name, type, participants = []) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          room_type: type,
          participants: [user?.id || 'anonymous', ...participants]
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        loadChatRooms();
        return data.room_id;
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      if (chatSocket && currentChatRoom && user) {
        chatSocket.emit('send_message', {
          room_id: currentChatRoom.id,
          user_id: user.id,
          user_name: user.name,
          message: file.name,
          message_type: file.type.startsWith('image/') ? 'image' : 'file',
          attachments: [base64]
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Initialize chat when user is available
  useEffect(() => {
    if (user && !chatSocket) {
      initializeChatSocket();
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chatSocket) {
        chatSocket.disconnect();
      }
    };
  }, [chatSocket]);
  const fileInputRef = useRef(null);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
    loadNiches();
    loadInterviews();
    loadPricingPlans();
  }, []);

  const loadPricingPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pricing/plans`);
      const data = await response.json();
      setPricingPlans(data.plans || []);
    } catch (error) {
      console.error('Error loading pricing plans:', error);
    }
  };

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

        {/* Premium Video Recording Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="card-premium p-8 ai-glow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                Estudio de Grabación Premium
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Calidad Profesional HD
              </div>
            </div>
            
            <div className="video-container mb-6 relative group">
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
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                  <div className="text-center text-white">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Estudio Listo</h4>
                    <p className="text-gray-300">Presiona grabar para comenzar tu video-pitch profesional</p>
                  </div>
                </div>
              )}
              
              {videoRecording && (
                <div className="absolute top-6 left-6 recording-indicator">
                  <div className="recording-dot"></div>
                  REC
                </div>
              )}
              
              {/* Recording Controls Overlay */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-3 bg-black bg-opacity-50 backdrop-blur-sm rounded-full px-6 py-3">
                  <div className="text-white text-sm font-medium">
                    {videoRecording ? 'Grabando...' : recordedVideo ? 'Video Completado' : 'Listo para Grabar'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={videoRecording ? stopVideoRecording : startVideoRecording}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  videoRecording 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                }`}
              >
                {videoRecording ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1"/>
                    </svg>
                    Finalizar
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 10l-2 2m2-2V7a2 2 0 114 0v3m-2 0l2 2" />
                    </svg>
                    Comenzar
                  </>
                )}
              </button>
              
              {recordedVideo && (
                <button className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Subir Video
                </button>
              )}
            </div>
            
            {/* Technical Info */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="text-sm font-bold text-gray-900 dark:text-white">1080p</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Resolución</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="text-sm font-bold text-gray-900 dark:text-white">60fps</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Frame Rate</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="text-sm font-bold text-gray-900 dark:text-white">AAC</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Audio</div>
              </div>
            </div>
          </div>

          {/* Premium Interview Tips */}
          <div className="card-premium p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                Consejos de Expertos
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Recomendado por IA
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="group p-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800 hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white mb-2">Iluminación Profesional</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Utiliza luz natural frente a una ventana o un ring light. Evita luces por detrás que creen sombras en tu rostro.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-5 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white mb-2">Fondo Limpio & Profesional</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Elige un fondo neutro sin distracciones. Una pared lisa o un espacio organizado proyecta profesionalismo.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-5 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white mb-2">Audio Cristalino</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Graba en un ambiente silencioso. Habla clara y pausadamente. Usa auriculares con micrófono si es posible.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="group p-5 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800 hover:scale-105 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                    4
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 dark:text-white mb-2">Duración Óptima</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      60-90 segundos es ideal. Sé conciso, directo y muestra tu personalidad auténtica.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI Score Prediction */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Icons.Sparkles className="text-white" />
                </div>
                <div>
                  <div className="font-black text-gray-900 dark:text-white">Predicción de Puntuación IA</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Siguiendo estos consejos</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full" style={{width: '92%'}}></div>
                </div>
                <span className="font-black text-2xl text-green-600 dark:text-green-400">92%</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Puntuación esperada con buenas prácticas aplicadas
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

  const LoginForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      name: '',
      role: 'candidate'
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const endpoint = isLogin ? 'login' : 'register';
        const payload = isLogin ? 
          { email: formData.email, password: formData.password } : 
          formData;

        const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (response.ok) {
          setUser(data.user);
          alert(isLogin ? '¡Login exitoso!' : '¡Registro exitoso!');
          setCurrentView('dashboard');
        } else {
          alert(data.detail || 'Error en la autenticación');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-lg mx-auto p-6 space-y-8 animate-fade-scale">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 border border-blue-200 dark:border-blue-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Acceso Premium</span>
          </div>
          <h1 className="text-4xl font-black text-gradient mb-4">
            {isLogin ? 'Iniciar Sesión' : 'Registro Premium'}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {isLogin ? 'Accede a tu cuenta premium' : 'Únete a la elite profesional'}
          </p>
        </div>

        <div className="card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="form-input focus-ring w-full dark:text-white"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="form-input focus-ring w-full dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Usuario
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                >
                  <option value="candidate">Candidato</option>
                  <option value="recruiter">Reclutador</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-premium py-4 text-lg font-bold flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
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
          alert('¡Candidato creado exitosamente!');
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
        alert('Error al crear candidato');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-5xl mx-auto p-6 space-y-8 animate-fade-scale">
        {/* Premium Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 border border-blue-200 dark:border-blue-800">
            <Icons.Star />
            <span className="ml-2">Registro Premium de Candidatos</span>
          </div>
          <h1 className="text-5xl font-black text-gradient mb-4">
            Únete a la Elite Profesional
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Completa tu perfil premium y deja que nuestra IA te conecte con las mejores oportunidades profesionales
          </p>
        </div>

        {/* Video Section Premium */}
        {recordedVideo && (
          <div className="card-premium p-8 mb-8 ai-glow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                Tu Video-Pitch Premium
              </h3>
              <div className="success-state">
                <Icons.CheckCircle />
                <span>Video Completado</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="video-container">
                <video
                  src={recordedVideo}
                  controls
                  className="w-full h-full object-cover"
                  poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2NjdlZWEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM3NjRiYTIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+"
                />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center mb-2">
                    <Icons.CheckCircle className="text-green-600 mr-2" />
                    <span className="font-bold text-green-800 dark:text-green-200">Video Analizado por IA</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Tu video ha sido procesado y analizado. Los candidatos con video tienen 5x más probabilidades de ser contactados.
                  </p>
                </div>
                
                <button
                  onClick={() => setCurrentView('video-interview')}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Icons.Video />
                  Grabar Nuevo Video
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="card-premium p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              Información Personal & Profesional
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Completa tu perfil premium para acceder a oportunidades exclusivas
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="Ej: María González García"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="maria@ejemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="+34 600 123 456"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="Madrid, España"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Expectativa Salarial (€) *
                </label>
                <input
                  type="number"
                  value={formData.salary_expectation}
                  onChange={(e) => setFormData({...formData, salary_expectation: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="45000"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Nivel de Experiencia *
                </label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                >
                  <option value="entry">Nivel de Entrada</option>
                  <option value="junior">Junior</option>
                  <option value="middle">Intermedio</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Ejecutivo</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Sector Profesional *
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({...formData, niche: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                >
                  {niches.map(niche => (
                    <option key={niche.value} value={niche.value}>
                      {niche.value === 'tech' ? '💻 Tecnología' : 
                       niche.value === 'creative' ? '🎨 Creativos' :
                       niche.value === 'health' ? '⚕️ Salud' :
                       niche.value === 'finance' ? '💰 Finanzas' :
                       niche.value === 'marketing' ? '📢 Marketing' :
                       niche.value === 'sales' ? '📈 Ventas' :
                       niche.value === 'operations' ? '⚙️ Operaciones' :
                       '📚 Educación'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Idiomas
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({...formData, languages: e.target.value})}
                  className="form-input focus-ring w-full dark:text-white"
                  placeholder="Español (Nativo), Inglés (C1), Francés (B2)"
                />
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="space-y-6">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  Habilidades y Competencias
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Habilidades Técnicas * (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({...formData, skills: e.target.value})}
                    placeholder="React, Node.js, Python, AWS, Docker, Kubernetes"
                    className="form-input focus-ring w-full dark:text-white"
                    required
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Incluye tecnologías, herramientas y frameworks relevantes para tu área
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Soft Skills (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.soft_skills}
                    onChange={(e) => setFormData({...formData, soft_skills: e.target.value})}
                    placeholder="Liderazgo, Comunicación, Resolución de Problemas, Trabajo en Equipo"
                    className="form-input focus-ring w-full dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    Preferencias de Cultura Empresarial (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.culture_preferences}
                    onChange={(e) => setFormData({...formData, culture_preferences: e.target.value})}
                    placeholder="Trabajo remoto, Innovación, Flexibilidad, Crecimiento profesional"
                    className="form-input focus-ring w-full dark:text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Bio Section */}
            <div className="space-y-4">
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Sobre Ti
                </h3>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                  Biografía Profesional *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={5}
                  placeholder="Cuéntanos sobre tu experiencia, logros y lo que te apasiona de tu profesión. ¿Qué te hace único como profesional?"
                  className="form-input focus-ring w-full dark:text-white resize-none"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Una biografía atractiva aumenta tus posibilidades de ser contactado
                </p>
              </div>
            </div>

            {/* Video Pitch CTA */}
            {!recordedVideo && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="card-premium p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 ai-glow">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                      ¿Listo para Destacar?
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md mx-auto">
                      Los candidatos con video-pitch tienen <strong>5x más probabilidades</strong> de ser contactados por empresas premium.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">5x</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Más Contactos</div>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-green-600 dark:text-green-400">AI</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Análisis</div>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                        <div className="text-2xl font-black text-purple-600 dark:text-purple-400">HD</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Calidad</div>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setCurrentView('video-interview')}
                      className="btn-premium px-8 py-4 text-lg font-bold flex items-center justify-center gap-3 mx-auto"
                    >
                      <Icons.Video />
                      <span>Grabar Video-Pitch Premium</span>
                      <Icons.ArrowRight />
                    </button>
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                      Puedes completar el registro sin video, pero recomendamos grabarlo para mejores resultados
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-premium py-5 text-xl font-black flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <Icons.Sparkles />
                    <span>Unirse a la Elite Profesional</span>
                    <Icons.ArrowRight />
                  </>
                )}
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Al registrarte, aceptas nuestros{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">términos y condiciones</a>
                  {' '}y{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">política de privacidad</a>
                </p>
              </div>
            </div>
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

  const PricingPlans = () => {
    const handleSubscribe = async (plan) => {
      if (!user) {
        alert('Debes iniciar sesión para suscribirte');
        setCurrentView('login');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/pricing/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            plan_type: plan.id,
            amount: plan.price,
            payment_method: 'credit_card'
          })
        });

        if (response.ok) {
          alert(`¡Suscripción exitosa al plan ${plan.name}!`);
          // Update user data
          const updatedUser = await fetch(`${API_BASE_URL}/api/users/${user.id}`);
          const userData = await updatedUser.json();
          setUser(userData);
        } else {
          alert('Error en la suscripción');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-7xl mx-auto p-6 space-y-12 animate-fade-scale">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full text-green-600 dark:text-green-400 text-sm font-bold mb-8 border border-green-200 dark:border-green-800">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Asesoría Personalizada Premium</span>
          </div>
          <h1 className="text-6xl lg:text-7xl font-black text-gradient mb-6">
            Planes de Asesoría
          </h1>
          <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
            Acelera tu carrera profesional con nuestros expertos en reclutamiento. 
            Coaching personalizado para conseguir el trabajo de tus sueños.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`card-premium p-8 relative group hover:scale-105 transition-all duration-500 ${
                plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 ai-glow' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    MÁS POPULAR
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-3xl font-black text-white ${
                  plan.id === 'basico' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                  plan.id === 'profesional' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                  'bg-gradient-to-br from-orange-500 to-red-600'
                }`}>
                  {plan.id === 'basico' ? '💼' : plan.id === 'profesional' ? '🚀' : '👑'}
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                
                <div className="mb-4">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2">USD</span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {plan.sessions} sesión{plan.sessions > 1 ? 'es' : ''} de {plan.duration}
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white' 
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700'
                }`}
              >
                {loading ? 'Procesando...' : 'Seleccionar Plan'}
              </button>

              {plan.id === 'premium' && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Garantía de satisfacción
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Todo lo que necesitas saber sobre nuestros servicios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-premium p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                ¿Qué incluye cada sesión?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Análisis de CV, simulacros de entrevista, feedback personalizado y estrategias específicas para tu industria.
              </p>
            </div>

            <div className="card-premium p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                ¿Puedo cambiar de plan?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Sí, puedes upgradear tu plan en cualquier momento y pagarás solo la diferencia prorrateada.
              </p>
            </div>

            <div className="card-premium p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                ¿Hay garantía de resultados?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                El plan Premium incluye garantía de satisfacción. Si no estás satisfecho, te devolvemos tu dinero.
              </p>
            </div>

            <div className="card-premium p-6">
              <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                ¿Cómo funcionan las sesiones?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Las sesiones son virtuales via Zoom, con horarios flexibles adaptados a tu zona horaria.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="card-premium p-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
              ¿Listo para acelerar tu carrera?
            </h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Únete a los miles de profesionales que han conseguido su trabajo soñado con nuestra ayuda
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => setCurrentView('login')}
                className="btn-premium px-8 py-4 text-lg font-bold flex items-center gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Comenzar Ahora</span>
              </button>
              
              <div className="text-sm text-gray-600 dark:text-gray-400">
                o contacta a nuestro equipo: <strong>hello@trabajai.com</strong>
              </div>
            </div>
          </div>
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

        {/* Additional Premium Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <div className="card-premium p-6 bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">47</div>
            <div className="text-sm font-medium opacity-90">Entrevistas Hoy</div>
          </div>
          
          <div className="card-premium p-6 bg-gradient-to-br from-emerald-500 to-green-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">312</div>
            <div className="text-sm font-medium opacity-90">Aplicaciones Nuevas</div>
          </div>
          
          <div className="card-premium p-6 bg-gradient-to-br from-violet-500 to-purple-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">89</div>
            <div className="text-sm font-medium opacity-90">Empresas Activas</div>
          </div>
          
          <div className="card-premium p-6 bg-gradient-to-br from-pink-500 to-rose-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">156</div>
            <div className="text-sm font-medium opacity-90">Matches Hoy</div>
          </div>
          
          <div className="card-premium p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">78%</div>
            <div className="text-sm font-medium opacity-90">Tasa Respuesta</div>
          </div>
          
          <div className="card-premium p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-center hover:scale-105 transition-all duration-300">
            <div className="text-3xl font-black mb-2">2.1k</div>
            <div className="text-sm font-medium opacity-90">Perfiles Visitados</div>
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
              <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">{analytics.candidates_with_video}</div>
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Videos Analizados Total</div>
              <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">+23% vs ayer</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-green-200 dark:border-green-800 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">{analytics.video_completion_rate}%</div>
              <div className="text-sm font-medium text-green-800 dark:text-green-200">Calidad Audio/Video</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-2">Excelente calidad</div>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">1.8m</div>
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
              <button
                onClick={() => setCurrentView('pricing')}
                className={`nav-item ${currentView === 'pricing' ? 'active' : ''}`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Precios
              </button>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Sistema Status Badge */}
            <div className="hidden md:flex items-center px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span>Sistema Activo</span>
            </div>
            
            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Hola, <span className="font-bold">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setUser(null);
                    setCurrentView('dashboard');
                  }}
                  className="btn-secondary px-4 py-2 text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('login')}
                className="btn-secondary px-6 py-3 text-sm font-bold flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Iniciar Sesión</span>
              </button>
            )}
            
            {/* Premium CTA */}
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
  // Chat Component
  const ChatSystem = () => {
    return (
      <>
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          {isChatOpen ? <Icons.Close /> : <Icons.Chat />}
          {chatNotifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {chatNotifications > 9 ? '9+' : chatNotifications}
            </span>
          )}
        </button>

        {/* Chat Window */}
        {isChatOpen && (
          <div className="fixed bottom-20 right-6 z-40 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icons.Chat />
                <div>
                  <h3 className="font-bold text-lg">
                    {chatView === 'chat' ? currentChatRoom?.name : 'Chat TRABAJAI'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {chatView === 'chat' ? `${onlineUsers.length} en línea` : 'Elige una sala'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {chatView === 'chat' && (
                  <button
                    onClick={() => setChatView('rooms')}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  >
                    <Icons.ArrowRight className="transform rotate-180" />
                  </button>
                )}
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <Icons.Close />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            <div className="h-full flex flex-col">
              {chatView === 'rooms' ? (
                <ChatRoomsList />
              ) : (
                <ChatWindow />
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  // Chat Rooms List Component
  const ChatRoomsList = () => {
    const roomTypes = [
      { type: 'general', name: 'General', icon: '🌐', color: 'bg-blue-500' },
      { type: 'support', name: 'Soporte', icon: '🎧', color: 'bg-green-500' },
      { type: 'candidate_employer', name: 'Empleos', icon: '💼', color: 'bg-purple-500' },
      { type: 'custom', name: 'Personalizado', icon: '⚙️', color: 'bg-orange-500' }
    ];

    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Quick Room Type Selector */}
        <div className="grid grid-cols-2 gap-2">
          {roomTypes.map((type) => (
            <button
              key={type.type}
              onClick={() => setSelectedChatType(type.type)}
              className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedChatType === type.type
                  ? `${type.color} text-white shadow-lg transform scale-105`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{type.icon}</span>
                <span>{type.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Available Rooms */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            Salas Disponibles
          </h4>
          {chatRooms
            .filter(room => selectedChatType === 'custom' || room.room_type === selectedChatType)
            .map((room) => (
              <button
                key={room.id}
                onClick={() => joinChatRoom(room)}
                className="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg ${
                      room.room_type === 'general' ? 'bg-blue-500' :
                      room.room_type === 'support' ? 'bg-green-500' :
                      room.room_type === 'candidate_employer' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}>
                      {room.room_type === 'general' && '🌐'}
                      {room.room_type === 'support' && '🎧'}
                      {room.room_type === 'candidate_employer' && '💼'}
                      {room.room_type === 'custom' && '⚙️'}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 dark:text-white truncate">
                      {room.name}
                    </h5>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {room.last_message || 'Sin mensajes'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {room.participants?.length || 0} 👥
                  </div>
                </div>
              </button>
            ))}
        </div>

        {/* Create Custom Room */}
        <button
          onClick={() => {
            const roomName = prompt('Nombre de la sala:');
            if (roomName) {
              createChatRoom(roomName, 'custom');
            }
          }}
          className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span className="text-2xl">+</span>
          <span className="font-medium">Crear Sala</span>
        </button>
      </div>
    );
  };

  // Chat Window Component
  const ChatWindow = () => {
    return (
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message, index) => (
            <div
              key={message.id || index}
              className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  message.user_id === user?.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {message.user_id !== user?.id && (
                  <div className="text-xs font-semibold mb-1 opacity-70">
                    {message.user_name}
                  </div>
                )}
                
                {message.message_type === 'image' && message.attachments?.[0] && (
                  <img
                    src={message.attachments[0]}
                    alt="Imagen enviada"
                    className="max-w-full h-auto rounded-lg mb-2"
                  />
                )}
                
                <div className="text-sm">
                  {message.message}
                </div>
                
                <div className="text-xs mt-1 opacity-70">
                  {formatTime(message.timestamp)}
                </div>
                
                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex space-x-1 mt-2">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(message.id, emoji)}
                        className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30 transition-colors"
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-2xl text-sm text-gray-600 dark:text-gray-400">
                {typingUsers.map(u => u.user_name).join(', ')} está{typingUsers.length > 1 ? 'n' : ''} escribiendo...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Icons.Paperclip />
            </button>
            
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Icons.Emoji />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribir mensaje..."
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
              
              {/* Simple Emoji Picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
                  <div className="grid grid-cols-6 gap-1">
                    {['😀', '😂', '😍', '🤔', '👍', '👎', '❤️', '🔥', '🎉', '💯', '👏', '🚀'].map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => {
                          setNewMessage(prev => prev + emoji);
                          setShowEmojiPicker(false);
                        }}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <Icons.Send />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-200">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'video-interview' && <VideoInterviewModule />}
          {currentView === 'candidates' && <CandidateForm />}
          {currentView === 'jobs' && <JobForm />}
          {currentView === 'pricing' && <PricingPlans />}
          {currentView === 'login' && <LoginForm />}
        </div>
      </div>
    </div>
  );
}

export default App;