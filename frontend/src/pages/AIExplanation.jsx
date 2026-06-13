
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import polyline from '@mapbox/polyline'
import {
  Shield, Home, RefreshCw, Brain, AlertTriangle, FileText, Layers, Users, User, ChevronDown, MapPin, ArrowLeftRight, Download, Share2, Sun, CheckCircle2, AlertCircle, ArrowRight, ChevronRight, ArrowLeft, Lightbulb, FileCheck, Camera, Hospital, Clock3
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

function FitRouteBounds({ positions }) {
  const map = useMap()
  if (positions.length > 0) {
    map.fitBounds(positions, { padding: [50, 50] })
  }
  return null
}

const getScoreColor = (score) => {
  if (score >= 90) return '#22C55E'
  if (score >= 75) return '#4ADE80'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#FB923C'
  return '#FF3B3B'
}

const getRouteColor = (index) => {
  if (index === 0) return '#22C55E' // Route 1 (green)
  if (index === 1) return '#F59E0B' // Route 2 (yellow)
  return '#FF3B3B' // Route 3 (red)
}

export default function AIExplanation() {
  const navigate = useNavigate()
  const { source, destination, selectedRoute, routes } = useApp()

  if (!selectedRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Route Selected</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#00E5FF] text-[#020817] font-semibold rounded-xl">
            Go Back
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const positions = selectedRoute.overview_polyline?.points ? polyline.decode(selectedRoute.overview_polyline.points) : []
  const routeIndex = routes.findIndex(r => r.id === selectedRoute.id)
  const color = getScoreColor(selectedRoute.safety_score)

  const factors = [
    {
      name: 'Lighting',
      value: selectedRoute.lighting_score,
      icon: Lightbulb,
      description: 'Street lighting and visibility'
    },
    {
      name: 'Crowd Activity',
      value: selectedRoute.crowd_score,
      icon: Users,
      description: 'Pedestrian and public activity'
    },
    {
      name: 'Community Reports',
      value: selectedRoute.report_score,
      icon: FileCheck,
      description: 'Reported incidents and safety issues'
    },
    {
      name: 'CCTV Coverage',
      value: selectedRoute.cctv_score,
      icon: Camera,
      description: 'Surveillance and monitoring'
    },
    {
      name: 'Emergency Access',
      value: selectedRoute.emergency_score,
      icon: Hospital,
      description: 'Proximity to hospitals and police stations'
    },
    {
      name: 'Time Risk',
      value: selectedRoute.time_risk_score,
      icon: Clock3,
      description: 'Safety based on time of day'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-24 px-8 flex items-center gap-4 border-b border-[#00E5FF]/8 bg-[#030B18]/70 backdrop-blur-xl"
        >
          <button onClick={() => navigate('/routes')} className="p-2 bg-[#0B1220] border border-[#14213D] rounded-xl">
            <ArrowLeft className="w-7 h-7" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">AI Explanation</h1>
            <p className="text-[#B6C2D2] text-sm">{source?.name || source?.address || 'Start'} → {destination?.name || destination?.address || 'End'}</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Left Column - Map & Details */}
            <div className="col-span-8 flex flex-col gap-6">
              {/* Leaflet Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5 h-[400px]"
              >
                <MapContainer
                  center={positions[0] || [40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {positions.length > 0 && <FitRouteBounds positions={positions} />}
                  {positions.length > 0 && (
                    <Polyline
                      positions={positions}
                      pathOptions={{ color, weight: 8, opacity: 0.92 }}
                    />
                  )}
                </MapContainer>
              </motion.div>

              {/* Route Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-6"
              >
                <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6 text-center">
                  <p className="text-[#B6C2D2] text-xs mb-1">Safety Score</p>
                  <p className="text-4xl font-bold" style={{ color }}>{selectedRoute.safety_score}</p>
                  <p className="text-sm mt-1" style={{ color }}>{selectedRoute.risk_level} Risk</p>
                </div>
                <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6 text-center">
                  <p className="text-[#B6C2D2] text-xs mb-1">ETA</p>
                  <p className="text-4xl font-bold text-white">{selectedRoute.eta}</p>
                </div>
                <div className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6 text-center">
                  <p className="text-[#B6C2D2] text-xs mb-1">Distance</p>
                  <p className="text-4xl font-bold text-white">{selectedRoute.distance}</p>
                </div>
              </motion.div>

              {/* Factor Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold mb-5">Safety Factor Breakdown</h3>
                <div className="space-y-4">
                  {factors.map((factor, index) => {
                    const color = getScoreColor(factor.value)
                    return (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <factor.icon className="w-4 h-4 text-[#00E5FF]" />
                            <div>
                              <p className="text-white text-sm font-medium">{factor.name}</p>
                              <p className="text-[#B6C2D2] text-xs">{factor.description}</p>
                            </div>
                          </div>
                          <span className="text-lg font-bold" style={{ color }}>{factor.value}/100</span>
                        </div>
                        <div className="w-full h-2 bg-[#030B18] rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${factor.value}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-[#00E5FF]/10 to-[#22C55E]/10 border border-[#00E5FF]/20 rounded-2xl p-6"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#22C55E]/20 flex items-center justify-center border border-[#00E5FF]/15">
                    <Brain className="w-6 h-6 text-[#00E5FF]" />
                  </div>
                  <h3 className="text-base font-semibold">AI Summary</h3>
                </div>
                <p className="text-[#B6C2D2] text-sm leading-relaxed">
                  {selectedRoute?.ai_explanation?.positives?.length || selectedRoute?.ai_explanation?.negatives?.length
                    ? `${selectedRoute?.risk_level || 'Safe'} route with safety score ${selectedRoute?.safety_score || 80}/100`
                    : typeof selectedRoute?.ai_explanation === 'string'
                      ? selectedRoute.ai_explanation
                      : 'Safe route recommendation based on multiple safety factors'
                  }
                </p>
              </motion.div>

              {/* Route Alternatives */}
              {routes.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6"
                >
                  <h3 className="text-base font-semibold mb-4">Other Routes</h3>
                  <div className="space-y-3">
                    {routes.filter(r => r.id !== selectedRoute.id).map(route => {
                      const idx = routes.findIndex(r => r.id === route.id)
                      return (
                        <div
                          key={route.id}
                          onClick={() => navigate('/routes')}
                          className="flex items-center justify-between p-3 bg-[#030B18] rounded-xl border border-[#00E5FF]/10 cursor-pointer hover:bg-[#030B18]/80"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRouteColor(idx) }} />
                            <div>
                              <p className="text-white text-sm font-medium">{route.summary}</p>
                              <p className="text-[#B6C2D2] text-xs">{route.distance} • {route.eta}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p style={{ color: getScoreColor(route.safety_score) }} className="text-lg font-bold">{route.safety_score}</p>
                            <p className="text-[#B6C2D2] text-xs">{route.risk_level}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Navigation Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                onClick={() => navigate('/navigate')}
                className="w-full py-4 bg-gradient-to-r from-[#00E5FF] to-[#22C55E] text-[#020817] font-semibold text-base rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Start Navigation
              </motion.button>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
