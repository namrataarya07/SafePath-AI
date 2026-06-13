
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Home,
  Route,
  AlertTriangle,
  FileText,
  MapPin,
  User,
  Settings,
  Plus,
  Filter,
  Clock,
  ChevronRight,
  Share2,
  Sun,
  MessageSquare,
  Users,
  Eye,
  ChevronDown
} from 'lucide-react'
import BottomNav from '../components/BottomNav'

const categories = [
  { value: 'Poor Lighting', icon: Sun, color: '#FFC857' },
  { value: 'Harassment', icon: AlertTriangle, color: '#FF3B3B' },
  { value: 'Suspicious Activity', icon: Eye, color: '#FF3B3B' },
  { value: 'Road Conditions', icon: Route, color: '#FFB020' },
  { value: 'Infrastructure', icon: Settings, color: '#7C3AED' }
]

const recentReports = [
  {
    id: 1,
    title: 'Street Light Not Working',
    location: 'Park Street, Sector 15',
    time: '10 min ago',
    severity: 'High',
    category: 'Poor Lighting',
    icon: Sun
  },
  {
    id: 2,
    title: 'Suspicious Activity',
    location: 'Near City Mall, Gate 2',
    time: '25 min ago',
    severity: 'High',
    category: 'Suspicious Activity',
    icon: Eye
  },
  {
    id: 3,
    title: 'Poor Lighting',
    location: 'MG Road, Near Metro Station',
    time: '40 min ago',
    severity: 'Medium',
    category: 'Poor Lighting',
    icon: Sun
  },
  {
    id: 4,
    title: 'Harassment Report',
    location: 'Bus Stop, Sector 18',
    time: '1 hr ago',
    severity: 'High',
    category: 'Harassment',
    icon: AlertTriangle
  },
  {
    id: 5,
    title: 'Road Under Construction',
    location: 'Lake View Road',
    time: '2 hr ago',
    severity: 'Medium',
    category: 'Road Conditions',
    icon: Route
  }
]

const contributors = [
  { name: 'Emma Wilson', reports: 245, badge: 1 },
  { name: 'Rahul Sharma', reports: 198, badge: 2 },
  { name: 'Aisha Khan', reports: 156, badge: 3 },
  { name: 'James Lee', reports: 134, badge: 4 },
  { name: 'Priya Patel', reports: 121, badge: 5 }
]

const heatmapZones = [
  { lat: 28.6200, lng: 77.2100, intensity: 'high', count: 12 },
  { lat: 28.6150, lng: 77.2200, intensity: 'medium', count: 8 },
  { lat: 28.6100, lng: 77.2150, intensity: 'low', count: 5 },
  { lat: 28.6050, lng: 77.2300, intensity: 'high', count: 7 },
  { lat: 28.6250, lng: 77.2250, intensity: 'low', count: 3 }
]

export default function Reports() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    category: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setShowForm(false)
    setFormData({ location: '', category: '', description: '' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex">
      {/* Left Sidebar - Desktop */}
      <div className="hidden lg:flex w-64 flex-col border-r border-[#00E5FF]/10 bg-[#030B18]/70 backdrop-blur-xl p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#22C55E] flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-[#020817]" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            SafePath <span className="text-[#00E5FF]">AI</span>
          </span>
        </div>

        <div className="flex-1 space-y-2">
          {[
            { icon: Home, label: 'Home', active: false, onClick: () => navigate('/') },
            { icon: Route, label: 'Routes', active: false, onClick: () => navigate('/routes') },
            { icon: FileText, label: 'Community Reports', active: true, onClick: () => {} },
            { icon: MapPin, label: 'Heatmap', active: false, onClick: () => navigate('/heatmap') },
            { icon: AlertTriangle, label: 'SOS', active: false, onClick: () => navigate('/sos') },
            { icon: User, label: 'Profile', active: false, onClick: () => navigate('/profile') },
            { icon: Settings, label: 'Settings', active: false, onClick: () => {} }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active
                  ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 shadow-[0_0_35px_rgba(0,229,255,0.22)]'
                  : 'text-[#B6C2D2] hover:text-white hover:bg-[#071224]/60'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-base font-semibold">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Card */}
        <div className="mt-6 p-5 bg-[#061121]/95 border border-[#00E5FF]/15 rounded-2xl">
          <div className="relative w-full h-24 mb-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-[#22C55E]/30 flex items-center justify-center border-2 border-[#00E5FF]/50">
                <Shield className="w-8 h-8 text-[#00E5FF]" />
              </div>
            </div>
          </div>
          <h3 className="text-base font-bold mb-2">Your Safety, Our Priority</h3>
          <p className="text-[#B6C2D2] text-xs leading-relaxed mb-3">
            Together, we build safer communities. Report, Update, Protect.
          </p>
          <div className="p-3 bg-gradient-to-br from-[#FF3B3B]/10 to-[#FF3B3B]/5 rounded-xl border border-[#FF3B3B]/30">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-[#FF3B3B]" />
              <span className="text-xs font-semibold">Emergency SOS</span>
            </div>
            <p className="text-[#B6C2D2] text-xs">Tap for immediate help</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-6 flex items-center justify-between border-b border-[#00E5FF]/10 bg-[#030B18]/70 backdrop-blur-xl">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Community Reports</h1>
            <p className="text-[#B6C2D2] text-sm">Real-time reports from the community to keep everyone safe</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00E5FF]/20 to-[#00E5FF]/10 border border-[#00E5FF]/30 rounded-xl font-semibold text-[#00E5FF] hover:bg-[#00E5FF]/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Report an Incident
              </button>
            </div>

            <div className="flex items-center gap-3 p-2 bg-[#061121]/95 border border-[#00E5FF]/10 rounded-xl">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#00E5FF]/30 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
                  alt="Sarah Johnson"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm font-semibold">Sarah Johnson</span>
              <ChevronDown className="w-4 h-4 text-[#B6C2D2]" />
            </div>
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 p-6 pb-24 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Stats Cards Row */}
            <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="p-4 bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                    <Users className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <span className="text-xs text-[#B6C2D2]">Total Reports</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">1,248</div>
                <div className="text-xs text-[#22C55E]">↑ 12% vs last week</div>
              </div>

              <div className="p-4 bg-[#061121]/95 border border-[#FF3B3B]/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#FF3B3B]/10 border border-[#FF3B3B]/30">
                    <AlertTriangle className="w-5 h-5 text-[#FF3B3B]" />
                  </div>
                  <span className="text-xs text-[#B6C2D2]">Active Risks</span>
                </div>
                <div className="text-2xl font-bold text-[#FF3B3B] mb-1">203</div>
                <div className="text-xs text-[#FF3B3B]">↑ 8% vs last week</div>
              </div>

              <div className="p-4 bg-[#061121]/95 border border-[#22C55E]/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30">
                    <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
                  </div>
                  <span className="text-xs text-[#B6C2D2]">Resolved</span>
                </div>
                <div className="text-2xl font-bold text-[#22C55E] mb-1">1,045</div>
                <div className="text-xs text-[#22C55E]">↑ 15% vs last week</div>
              </div>

              <div className="p-4 bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30">
                    <Users className="w-5 h-5 text-[#00E5FF]" />
                  </div>
                  <span className="text-xs text-[#B6C2D2]">Contributors</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">856</div>
                <div className="text-xs text-[#22C55E]">↑ 5% vs last week</div>
              </div>

              <div className="p-4 bg-[#061121]/95 border border-[#7C3AED]/30 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/30">
                    <MapPin className="w-5 h-5 text-[#7C3AED]" />
                  </div>
                  <span className="text-xs text-[#B6C2D2]">Areas Covered</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">32</div>
                <div className="text-xs text-[#B6C2D2]">Neighborhoods</div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Live Incident Map Section */}
              <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-[#00E5FF]/10">
                  <div>
                    <h3 className="font-semibold text-base">Live Incident Map</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FF3B3B]"></div>
                        <span className="text-xs text-[#B6C2D2]">High Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FFB020]"></div>
                        <span className="text-xs text-[#B6C2D2]">Medium Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                        <span className="text-xs text-[#B6C2D2]">Low Risk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div>
                        <span className="text-xs text-[#B6C2D2]">Resolved</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#030B18] border border-[#00E5FF]/10 rounded-lg text-sm text-[#B6C2D2]">
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#030B18] border border-[#00E5FF]/10 rounded-lg text-sm text-[#B6C2D2]">
                      <Clock className="w-4 h-4" />
                      All Time
                    </button>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="h-80 relative bg-[#030B18]">
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `
                      linear-gradient(to right, #00E5FF 1px, transparent 1px),
                      linear-gradient(to bottom, #00E5FF 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }} />
                  
                  {/* Map Controls */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <button className="w-10 h-10 bg-[#061121]/90 border border-[#00E5FF]/20 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-[#00E5FF]" />
                    </button>
                    <button className="w-10 h-10 bg-[#061121]/90 border border-[#00E5FF]/20 rounded-lg flex items-center justify-center">
                      <MinusCircle className="w-5 h-5 text-[#00E5FF]" />
                    </button>
                    <button className="w-10 h-10 bg-[#061121]/90 border border-[#00E5FF]/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-[#00E5FF]" />
                    </button>
                  </div>

                  {/* Heatmap Zones */}
                  {heatmapZones.map((zone, idx) => {
                    const color = zone.intensity === 'high' ? '#FF3B3B' : zone.intensity === 'medium' ? '#FFB020' : '#22C55E'
                    return (
                      <div key={idx} className="absolute rounded-full blur-xl opacity-60" style={{
                        left: `${30 + idx * 15}%`,
                        top: `${20 + idx * 12}%`,
                        width: `${60 + zone.count * 3}px`,
                        height: `${60 + zone.count * 3}px`,
                        backgroundColor: color
                      }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-[#030B18]/80 flex items-center justify-center">
                            <span className="text-xs font-bold" style={{ color }}>{zone.count}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Location Labels */}
                  <div className="absolute top-1/4 left-1/4 text-[#B6C2D2] text-sm">
                    <span className="font-semibold">CITY CENTER</span>
                  </div>
                  <div className="absolute top-1/2 left-1/6 text-[#B6C2D2] text-sm">
                    <span className="font-semibold">GREEN PARK</span>
                  </div>
                  <div className="absolute top-2/3 left-1/2 text-[#B6C2D2] text-sm">
                    <span className="font-semibold">DOWNTOWN</span>
                  </div>
                  <div className="absolute top-1/3 left-2/3 text-[#B6C2D2] text-sm">
                    <span className="font-semibold">LAKE VIEW</span>
                  </div>
                </div>
              </div>

              {/* Charts & Contributors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reports Overview Chart */}
                <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-base">Reports Overview</h3>
                    <select className="bg-[#030B18] border border-[#00E5FF]/10 rounded-lg text-xs text-[#B6C2D2] px-3 py-1.5">
                      <option>This Week</option>
                      <option>This Month</option>
                    </select>
                  </div>
                  
                  <div className="h-40 relative">
                    {/* Chart Legend */}
                    <div className="absolute top-0 right-0 flex items-center gap-4 text-xs text-[#B6C2D2]">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FF3B3B]"></div>
                        High Risk
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#FFB020]"></div>
                        Medium Risk
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                        Low Risk
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-[#00E5FF]"></div>
                        Resolved
                      </div>
                    </div>
                    
                    {/* Chart */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-1 h-32">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                        <div key={day} className="flex flex-col items-center flex-1 gap-1">
                          {/* Stacked bars placeholder */}
                          <div className="flex flex-col gap-0.5 items-center justify-end">
                            <div className="w-8 bg-[#00E5FF]/50" style={{ height: `${30 + idx * 5}px`, borderRadius: '2px' }}></div>
                            <div className="w-8 bg-[#22C55E]/50" style={{ height: `${20 + idx * 3}px`, borderRadius: '2px' }}></div>
                            <div className="w-8 bg-[#FFB020]/50" style={{ height: `${15 + idx * 4}px`, borderRadius: '2px' }}></div>
                            <div className="w-8 bg-[#FF3B3B]/50" style={{ height: `${10 + idx * 2}px`, borderRadius: '2px' }}></div>
                          </div>
                          <span className="text-xs text-[#B6C2D2]">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button className="text-[#00E5FF] text-xs flex items-center gap-1">
                      View Detailed Analytics <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Top Issue Categories */}
                <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5">
                  <h3 className="font-semibold text-base mb-4">Top Issue Categories</h3>
                  
                  <div className="flex items-center gap-6">
                    {/* Pie Chart Placeholder */}
                    <div className="relative w-36 h-36">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#FF3B3B" strokeWidth="20" strokeDasharray="71 181" transform="rotate(-90 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#FFB020" strokeWidth="20" strokeDasharray="61 191" transform="rotate(40 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#7C3AED" strokeWidth="20" strokeDasharray="31 221" transform="rotate(110 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#00E5FF" strokeWidth="20" strokeDasharray="20 232" transform="rotate(150 50 50)" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22C55E" strokeWidth="20" strokeDasharray="16 236" transform="rotate(175 50 50)" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">1,248</div>
                          <div className="text-xs text-[#B6C2D2]">Total</div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex-1 space-y-1 text-xs text-[#B6C2D2]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF3B3B]"></div>
                        Poor Lighting <span className="ml-auto text-white">28% (348)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFB020]"></div>
                        Suspicious Activity <span className="ml-auto text-white">24% (298)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#7C3AED]"></div>
                        Harassment <span className="ml-auto text-white">16% (199)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FFB020]"></div>
                        Road Conditions <span className="ml-auto text-white">14% (174)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#00E5FF]"></div>
                        Infrastructure <span className="ml-auto text-white">10% (124)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                        Others <span className="ml-auto text-white">8% (100)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Contributors */}
              <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base">Top Contributors</h3>
                  <button className="text-[#00E5FF] text-xs flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {contributors.map((user, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#030B18] to-[#061121] border border-[#00E5FF]/20 flex items-center justify-center">
                          <img
                            src={`https://images.unsplash.com/photo-${1494790108377 + idx * 1000}?w=100&h=100&fit=crop&crop=face`}
                            alt={user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-[#FFB020] to-[#FF3B3B] flex items-center justify-center text-xs font-bold text-white border border-[#020817]">
                          {user.badge}
                        </div>
                      </div>
                      <span className="text-xs text-white mt-2 text-center line-clamp-1">{user.name}</span>
                      <span className="text-xs text-[#B6C2D2]">{user.reports} Reports</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Recent Reports */}
              <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center justify-between border-b border-[#00E5FF]/10">
                  <h3 className="font-semibold text-base">Recent Reports</h3>
                  <button className="text-[#00E5FF] text-xs flex items-center gap-1">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                  {recentReports.map((report) => {
                    const Icon = report.icon
                    return (
                      <div key={report.id} className="p-3 bg-[#030B18] border border-[#00E5FF]/10 rounded-xl cursor-pointer hover:bg-[#030B18]/80 transition-all">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-gradient-to-br from-[#FF3B3B]/20 to-[#FF3B3B]/10 border border-[#FF3B3B]/30 flex-shrink-0">
                            <Icon className="w-4 h-4" style={{ color: report.severity === 'High' ? '#FF3B3B' : '#FFB020' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-semibold truncate">{report.title}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                report.severity === 'High'
                                  ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]'
                                  : 'bg-[#FFB020]/20 text-[#FFB020]'
                              }`}>
                                {report.severity}
                              </span>
                            </div>
                            <div className="text-xs text-[#B6C2D2] flex items-center gap-1 mb-1">
                              <MapPin className="w-3 h-3" />
                              {report.location}
                            </div>
                            <div className="text-xs text-[#B6C2D2] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {report.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Report Form */}
              <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5">
                <h3 className="font-semibold text-base mb-4">Report an Incident</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#030B18] border border-[#00E5FF]/10 rounded-xl text-white focus:outline-none focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.value}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Describe what happened..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-[#030B18] border border-[#00E5FF]/10 rounded-xl text-white placeholder-[#B6C2D2] focus:outline-none focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/20 h-28 resize-none"
                  ></textarea>
                  <div className="flex items-center gap-2">
                    <button type="button" className="flex items-center gap-2 px-3 py-2 bg-[#030B18] border border-[#00E5FF]/10 rounded-lg text-sm text-[#B6C2D2]">
                      <MapPin className="w-4 h-4" />
                      Add Location
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" className="flex-1 py-2 bg-[#030B18] border border-[#00E5FF]/10 rounded-lg text-sm text-[#B6C2D2]">
                      Upload Photo/Video
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#22C55E] text-[#020817] font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
                  >
                    Submit Report
                  </button>
                </form>
              </div>

              {/* Safety Tip */}
              <div className="p-5 bg-gradient-to-br from-[#00E5FF]/10 to-[#22C55E]/10 border border-[#00E5FF]/30 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-[#00E5FF]" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Safety Tip of the Day</h4>
                      <p className="text-xs text-[#B6C2D2] leading-relaxed">
                        Avoid poorly lit areas at night and stay on well-travelled roads for a safer journey.
                      </p>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-[#030B18] border border-[#00E5FF]/20">
                    <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    </div>
  )
}

// Missing component for CheckCircle2
function CheckCircle2(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function MinusCircle(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8" />
    </svg>
  )
}
