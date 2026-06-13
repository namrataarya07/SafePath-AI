import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Home as HomeIcon,
  RefreshCw,
  AlertTriangle,
  FileText,
  User,
  Bell,
  ChevronDown,
  MapPin,
  Sparkles,
  Users,
  Layers,
  Clock,
  Target
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import LocationSearch from '../components/LocationSearch'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

const GlowButton = ({ children, onClick, disabled, loading }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.02 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className="w-full py-4 bg-gradient-to-r from-[#00E5FF] to-[#2AF598] text-[#020817] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
    style={{
      boxShadow: '0 0 25px rgba(0,229,255,0.35), 0 8px 30px rgba(0,229,255,0.12)'
    }}
  >
    {loading ? (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 border-2.5 border-[#020817] border-t-transparent rounded-full"
      />
    ) : (
      <>
        <Sparkles className="w-5 h-5" />
        {children}
      </>
    )}
  </motion.button>
)

const FeatureCard = ({ icon: Icon, title, description, color, bgColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5 hover:border-[#00E5FF]/30 transition-all"
    style={{ borderColor: color + '25' }}
  >
    <motion.div
      whileHover={{ scale: 1.05, rotate: 2 }}
      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5"
      style={{ backgroundColor: bgColor }}
    >
      <Icon className="w-5.5 h-5.5" style={{ color }} />
    </motion.div>
    <h4 className="font-semibold mb-1.5 text-sm">{title}</h4>
    <p className="text-[#B6C2D2] text-xs leading-relaxed">{description}</p>
  </motion.div>
)

const StatItem = ({ icon: Icon, value, label, sublabel, color }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-center gap-4"
  >
    <div
      className="w-11 h-11 rounded-full flex items-center justify-center border"
      style={{
        backgroundColor: color + '12',
        borderColor: color + '30'
      }}
    >
      <Icon className="w-6 h-6" style={{ color }} />
    </div>
    <div>
      <div className="text-xl font-semibold text-white mb-1">{value}</div>
      <div className="text-xs text-[#B6C2D2]">{label}</div>
      {sublabel && (
        <div className="text-xs" style={{ color }}>{sublabel}</div>
      )}
    </div>
  </motion.div>
)

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-all ${
      active
        ? 'bg-[#00E5FF]/15 text-[#00E5FF] shadow-[0_0_35px rgba(0,229,255,0.22)]'
        : 'text-[#B6C2D2] hover:text-white hover:bg-[#071224]/60'
    }`}
  >
    <Icon className="w-6 h-6" />
    <span className="text-base font-semibold">{label}</span>
  </motion.button>
)

export default function HomePage() {
  const navigate = useNavigate()
  const { source, setSource, destination, setDestination, setRoutes, setSelectedRouteIndex, setUsingMockData } = useApp()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateMockRoutes = (src, dest) => {
    const baseScore = 70 + Math.floor(Math.random() * 20)
    const mockRoutes = [
      {
        id: 1,
        summary: 'Route 1 (Safest)',
        distance: '5.2 km',
        distance_meters: 5200,
        eta: '18 min',
        eta_seconds: 1080,
        start_address: src?.address || src?.name || 'Start',
        end_address: dest?.address || dest?.name || 'End',
        source: src?.address || src?.name,
        destination: dest?.address || dest?.name,
        source_coords: { lat: 28.6139, lng: 77.2090 },
        destination_coords: { lat: 28.5355, lng: 77.3910 },
        overview_polyline: { points: '{b`pFymryMJwGjEsAr@o@^y@d@w@t@u@|@m@v@o@t@_@r@]jAWlCk@~Bc@l@m@|@u@r@e@j@o@b@y@`Au@bAy@n@e@t@}@r@u@~Aa@r@u@lA}@p@e@x@y@`@a@|@c@r@e@^}@t@g@f@y@r@k@j@i@z@c@d@q@~@o@^' },
        safety_score: baseScore + 10,
        risk_level: 'Safe',
        lighting_score: 85,
        crowd_score: 70,
        report_score: 90,
        cctv_score: 80,
        emergency_score: 75,
        time_risk_score: 88,
        weather_penalty: 0,
        weather_desc: 'Clear',
        major_roads: ['MG Road', 'Connaught Place Outer Circle'],
        ai_explanation: { positives: ['Good lighting (85/100)', 'Nearby hospitals (+8)', 'High public activity (+7)'], negatives: [], final_score: baseScore + 10 }
      },
      {
        id: 2,
        summary: 'Route 2 (Moderate)',
        distance: '6.1 km',
        distance_meters: 6100,
        eta: '22 min',
        eta_seconds: 1320,
        start_address: src?.address || src?.name || 'Start',
        end_address: dest?.address || dest?.name || 'End',
        source: src?.address || src?.name,
        destination: dest?.address || dest?.name,
        source_coords: { lat: 28.6139, lng: 77.2090 },
        destination_coords: { lat: 28.5355, lng: 77.3910 },
        overview_polyline: { points: '{b`pFymryMJwGjEsAr@o@^y@d@w@t@u@|@m@v@o@t@_@r@]jAWlCk@~Bc@l@m@|@u@r@e@j@o@b@y@`Au@bAy@n@e@t@}@r@u@~Aa@r@u@lA}@p@e@x@y@`@a@|@c@r@e@^}@t@g@f@y@r@k@j@i@z@c@d@q@~@o@^' },
        safety_score: baseScore,
        risk_level: 'Moderate',
        lighting_score: 65,
        crowd_score: 60,
        report_score: 85,
        cctv_score: 55,
        emergency_score: 65,
        time_risk_score: 75,
        weather_penalty: 0,
        weather_desc: 'Clear',
        major_roads: ['Barakhamba Road', 'Lodhi Road'],
        ai_explanation: { positives: ['Nearby hospitals (+8)'], negatives: ['Poor lighting (-10)', 'Low public activity (-8)'], final_score: baseScore }
      },
      {
        id: 3,
        summary: 'Route 3 (Fastest but Riskier)',
        distance: '4.8 km',
        distance_meters: 4800,
        eta: '15 min',
        eta_seconds: 900,
        start_address: src?.address || src?.name || 'Start',
        end_address: dest?.address || dest?.name || 'End',
        source: src?.address || src?.name,
        destination: dest?.address || dest?.name,
        source_coords: { lat: 28.6139, lng: 77.2090 },
        destination_coords: { lat: 28.5355, lng: 77.3910 },
        overview_polyline: { points: '{b`pFymryMJwGjEsAr@o@^y@d@w@t@u@|@m@v@o@t@_@r@]jAWlCk@~Bc@l@m@|@u@r@e@j@o@b@y@`Au@bAy@n@e@t@}@r@u@~Aa@r@u@lA}@p@e@x@y@`@a@|@c@r@e@^}@t@g@f@y@r@k@j@i@z@c@d@q@~@o@^' },
        safety_score: baseScore - 15,
        risk_level: 'Moderate',
        lighting_score: 50,
        crowd_score: 45,
        report_score: 80,
        cctv_score: 40,
        emergency_score: 50,
        time_risk_score: 65,
        weather_penalty: 5,
        weather_desc: 'Light Rain',
        major_roads: ['Inner Ring Road'],
        ai_explanation: { positives: [], negatives: ['Poor lighting (-10)', 'Low public activity (-8)', 'Light Rain (-5)'], final_score: baseScore - 15 }
      }
    ]
    return mockRoutes
  }

  const handleFindRoute = () => {
    if (!source || !destination) {
      setError('Please enter both start and end locations')
      return
    }
    setLoading(true)
    setError('')
    
    // Use mock routes exclusively, no API calls at all
    const routes = generateMockRoutes(source, destination)
    setRoutes(routes)
    setSelectedRouteIndex(0)
    setUsingMockData(true)
    
    setLoading(false)
    navigate('/routes')
  }

  const features = [
    {
      icon: Shield,
      title: 'AI Safety Score',
      description: 'Smart analysis of multiple factors',
      color: '#2AF598',
      bgColor: '#2AF59818'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Real reports from real people',
      color: '#00E5FF',
      bgColor: '#00E5FF18'
    },
    {
      icon: Layers,
      title: 'Safety Heatmap',
      description: 'Visualize safe & risky zones',
      color: '#FFB020',
      bgColor: '#FFB02018'
    },
    {
      icon: Clock,
      title: 'Predictive Risk',
      description: 'Get future risk predictions',
      color: '#7C3AED',
      bgColor: '#7C3AED18'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex overflow-hidden">
      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-64 border-r border-[#00E5FF]/12 bg-[#030B18]/85 backdrop-blur-xl p-6 flex flex-col"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#2AF598] flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(0,229,255,0.35)' }}
          >
            <Shield className="w-6 h-6 text-[#020817]" />
          </motion.div>
          <span className="text-lg font-bold tracking-tight">
            SafePath <span className="text-[#00E5FF]">AI</span>
          </span>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 space-y-2">
          {[
            { icon: HomeIcon, label: 'Home', active: true },
            { icon: RefreshCw, label: 'Routes', active: false },
            { icon: AlertTriangle, label: 'SOS', active: false },
            { icon: FileText, label: 'Reports', active: false },
            { icon: User, label: 'Profile', active: false },
          ].map((item, i) => (
            <NavItem
              key={i}
              icon={item.icon}
              label={item.label}
              active={item.active}
              onClick={() => {
                if (item.label === 'Routes') navigate('/routes')
                if (item.label === 'Reports') navigate('/reports')
                if (item.label === 'SOS') navigate('/sos')
                if (item.label === 'Profile') navigate('/profile')
              }}
            />
          ))}
        </div>

        {/* Bottom Sidebar Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 p-5 bg-[#061121]/95 border border-[#00E5FF]/15 rounded-2xl"
        >
          <div className="relative w-full h-28 mb-4">
            {/* Shield Illustration SVG */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="shieldGradNew" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#2AF598" />
                </linearGradient>
                <radialGradient id="glowNew" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="65" r="60" fill="url(#glowNew)" />
              <path
                d="M100 15 C100 15 120 25 120 40 C120 58 100 95 100 95 C100 95 80 58 80 40 C80 25 100 15 100 15 Z"
                stroke="url(#shieldGradNew)"
                strokeWidth="3.5"
                fillOpacity="0.12"
                fill="url(#shieldGradNew)"
              />
              <text x="100" y="70" textAnchor="middle" fill="#00E5FF" fontSize="34" fontWeight="700">S</text>
              <path d="M60 36 L42 20" stroke="#00E5FF" strokeWidth="1" opacity="0.55" />
              <path d="M60 48 L38 44" stroke="#00E5FF" strokeWidth="1" opacity="0.35" />
              <path d="M60 60 L44 72" stroke="#00E5FF" strokeWidth="1" opacity="0.45" />
              <path d="M140 36 L158 20" stroke="#00E5FF" strokeWidth="1" opacity="0.55" />
              <path d="M140 48 L162 44" stroke="#00E5FF" strokeWidth="1" opacity="0.35" />
              <path d="M140 60 L156 72" stroke="#00E5FF" strokeWidth="1" opacity="0.45" />
              <circle cx="100" cy="30" r="4.5" fill="#2AF598" opacity="0.85" />
              <circle cx="72" cy="68" r="3" fill="#00E5FF" opacity="0.75" />
              <circle cx="128" cy="78" r="4" fill="#2AF598" opacity="0.65" />
            </svg>
          </div>
          <h3 className="text-base font-semibold mb-2">Your Safety, Our Priority</h3>
          <p className="text-[#B6C2D2] text-xs leading-relaxed">
            We analyze lighting, crowd density, community reports & more to recommend the safest routes for you.
          </p>
        </motion.div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-16 px-10 flex items-center justify-end border-b border-[#00E5FF]/8 bg-[#030B18]/70 backdrop-blur-xl"
        >
          <div className="flex items-center gap-8">
            {/* Notification Bell */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2.5 rounded-xl hover:bg-[#071224] transition-all"
            >
              <Bell className="w-5 h-5 text-[#B6C2D2]" />
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4D4D] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-[0_0_12px rgba(255,77,77,0.4)]"
              >
                3
              </motion.span>
            </motion.button>

            {/* Profile Section */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-2 pr-4 rounded-xl bg-[#061121] border border-[#00E5FF]/10 hover:bg-[#071224]/80 transition-all"
            >
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#00E5FF]/35">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">Sarah Johnson</p>
              </div>
              <ChevronDown className="w-4 h-4 text-[#B6C2D2]" />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <motion.div
            className="max-w-7xl mx-auto grid grid-cols-12 gap-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Column (Hero + Heatmap + Stats) */}
            <div className="col-span-8 flex flex-col gap-7">
              {/* Hero Section */}
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                  Hi, stay safe on every route <Shield className="w-7 h-7 inline text-[#2AF598] ml-2" />
                </h1>
                <p className="text-[#B6C2D2] text-base max-w-lg">
                  AI-powered safety navigation for smarter & safer journeys
                </p>
              </motion.div>

              {/* Heatmap Visualization */}
              <motion.div
                variants={itemVariants}
                className="relative h-80 rounded-2xl overflow-hidden bg-[#030B18] border border-[#00E5FF]/12"
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradNew" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="30%" stopColor="#2AF598" />
                      <stop offset="60%" stopColor="#FFB020" />
                      <stop offset="85%" stopColor="#FF7A1A" />
                      <stop offset="100%" stopColor="#FF4D4D" />
                    </linearGradient>
                    <radialGradient id="safeGradNew" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#2AF598" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#2AF598" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="modGradNew" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFB020" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#FFB020" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="riskGradNew" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="dangerGradNew" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FF4D4D" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#FF4D4D" stopOpacity="0" />
                    </radialGradient>
                    <filter id="glowNew">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <g opacity="0.22">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <path
                        key={`h${i}`}
                        d={`M 0 ${i * 20} L 800 ${i * 20}`}
                        stroke="#00E5FF"
                        strokeWidth="0.5"
                      />
                    ))}
                    {Array.from({ length: 40 }).map((_, i) => (
                      <path
                        key={`v${i}`}
                        d={`M ${i * 20} 0 L ${i * 20} 400`}
                        stroke="#00E5FF"
                        strokeWidth="0.5"
                      />
                    ))}
                  </g>

                  <g opacity="0.16" stroke="#00E5FF" strokeWidth="2">
                    <path d="M 0 200 Q 400 150 800 200" />
                    <path d="M 0 250 Q 400 200 800 250" />
                    <path d="M 0 300 Q 400 250 800 300" />
                    <path d="M 200 0 Q 250 200 200 400" />
                    <path d="M 400 0 Q 450 200 400 400" />
                    <path d="M 600 0 Q 650 200 600 400" />
                  </g>

                  <circle cx="200" cy="100" r="70" fill="url(#safeGradNew)" />
                  <circle cx="350" cy="300" r="80" fill="url(#modGradNew)" />
                  <circle cx="600" cy="150" r="60" fill="url(#riskGradNew)" />
                  <circle cx="150" cy="320" r="50" fill="url(#dangerGradNew)" />
                  <circle cx="650" cy="350" r="55" fill="url(#dangerGradNew)" />

                  <path
                    d="M 100 350 Q 250 300 400 250 T 700 100"
                    fill="none"
                    stroke="url(#routeGradNew)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    filter="url(#glowNew)"
                  />
                  <path
                    d="M 100 350 Q 250 300 400 250 T 700 100"
                    fill="none"
                    stroke="url(#routeGradNew)"
                    strokeWidth="15"
                    strokeLinecap="round"
                    opacity="0.3"
                    filter="url(#glowNew)"
                  />

                  <circle cx="100" cy="350" r="13" fill="#00E5FF" filter="url(#glowNew)" />
                  <circle cx="100" cy="350" r="6" fill="#FFFFFF" />
                  <circle cx="100" cy="350" r="28" fill="none" stroke="#00E5FF" strokeWidth="2" opacity="0.32" />

                  <g transform="translate(700, 100)">
                    <circle cx="0" cy="-10" r="24" fill="url(#dangerGradNew)" opacity="0.6" />
                    <path d="M0 0 L -14 -38 L14 -38 Z" fill="#FF4D4D" filter="url(#glowNew)" />
                    <circle cx="0" cy="-21" r="5.5" fill="white" />
                  </g>
                </svg>
              </motion.div>

              {/* Recent Safety Insights */}
              <motion.div
                variants={itemVariants}
                className="bg-[#061121]/95 border border-[#00E5FF]/12 rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold mb-5 tracking-tight">Recent Safety Insights</h3>
                <div className="grid grid-cols-3 gap-8">
                  <StatItem
                    icon={Shield}
                    value="92"
                    label="AI Safety Score"
                    sublabel="High Safety"
                    color="#2AF598"
                  />
                  <div className="flex items-center gap-4 border-x border-[#00E5FF]/10 px-8">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center border"
                      style={{
                        backgroundColor: '#00E5FF12',
                        borderColor: '#00E5FF30'
                      }}
                    >
                      <Users className="w-6 h-6" style={{ color: '#00E5FF' }} />
                    </div>
                    <div>
                      <div className="text-xl font-semibold text-white mb-1">128</div>
                      <div className="text-xs text-[#B6C2D2]">Community Reports</div>
                      <div className="text-xs text-[#B6C2D2]">In Your Area</div>
                    </div>
                  </div>
                  <StatItem
                    icon={AlertTriangle}
                    value="3"
                    label="Risk Alerts"
                    sublabel="Along Route"
                    color="#FF4D4D"
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column (Route Card + Features) */}
            <div className="col-span-4 flex flex-col gap-7">
              {/* Route Planning Card */}
              <motion.div
                variants={itemVariants}
                className="bg-[#061121]/95 border border-[#00E5FF]/12 rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 text-[#00E5FF]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-full h-full">
                      <path d="M3 12h4l2-8 2 16 2-8h4" />
                    </svg>
                  </div>
                  <h2 className="text-base font-semibold tracking-tight">Plan Your Safe Route</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <LocationSearch
                    label="From"
                    placeholder="Enter starting location"
                    value={source?.name || source?.address}
                    onChange={setSource}
                    icon={Target}
                  />
                  <LocationSearch
                    label="To"
                    placeholder="Enter destination"
                    value={destination?.name || destination?.address}
                    onChange={setDestination}
                    icon={MapPin}
                    iconStyle="text-[#FF4D4D]"
                  />
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-[#FF4D4D]/30 bg-[#FF4D4D]/10 px-4 py-3 text-sm text-[#FFB4B4]">
                    {error}
                  </div>
                )}

                <GlowButton onClick={handleFindRoute} disabled={loading} loading={loading}>
                  Find Safest Route
                </GlowButton>
              </motion.div>

              {/* Why SafePath AI */}
              <div>
                <h3 className="text-base font-semibold mb-5 tracking-tight">Why SafePath AI?</h3>
                <div className="grid grid-cols-2 gap-4">
                  {features.map((feat, i) => (
                    <FeatureCard
                      key={feat.title}
                      icon={feat.icon}
                      title={feat.title}
                      description={feat.description}
                      color={feat.color}
                      bgColor={feat.bgColor}
                      delay={i * 0.1}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
