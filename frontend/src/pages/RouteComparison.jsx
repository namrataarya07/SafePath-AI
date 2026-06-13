
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet'
import polyline from '@mapbox/polyline'
import {
  Shield, Home, RefreshCw, AlertTriangle, FileText, User, ChevronDown, MapPin, ArrowLeftRight, Clock, PlusCircle, MinusCircle, LocateFixed, Layers as LayersIcon, Car, PersonStanding, Bike, Lightbulb, Users, FileCheck, Camera, Hospital, Clock3, Bug, ChevronUp
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

const getRouteColor = (index) => {
  if (index === 0) return '#22C55E' // Route 1 (green)
  if (index === 1) return '#F59E0B' // Route 2 (yellow)
  return '#FF3B3B' // Route 3 (red)
}

const getScoreColor = (score) => {
  if (score >= 90) return '#22C55E'
  if (score >= 75) return '#4ADE80'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#FB923C'
  return '#FF3B3B'
}

export default function RouteComparison() {
  const navigate = useNavigate()
  const { source, destination, routes, selectedRouteIndex, setSelectedRouteIndex, selectedRoute } = useApp()
  const [selectedMode, setSelectedMode] = useState('walk')
  const [debugPanelOpen, setDebugPanelOpen] = useState(false)

  if (!routes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Routes Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-[#00E5FF] text-[#020817] font-semibold rounded-xl">
            Go Back
          </button>
        </div>
        <BottomNav />
      </div>
    )
  }

  const selectedPositions = selectedRoute?.overview_polyline?.points 
    ? polyline.decode(selectedRoute.overview_polyline.points)
    : []

  const allPositions = routes.flatMap(route => 
    route.overview_polyline?.points ? polyline.decode(route.overview_polyline.points) : []
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="h-24 px-8 flex items-center justify-between border-b border-[#00E5FF]/8 bg-[#030B18]/70 backdrop-blur-xl"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Route Comparison</h1>
            <p className="text-[#B6C2D2] text-sm">{source?.name || source?.address || 'Start'} → {destination?.name || destination?.address || 'End'}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
              {[
                { id: 'walk', icon: PersonStanding, label: 'Walk' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={`px-5 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${selectedMode === mode.id ? 'bg-[#00E5FF]/15 border-[#00E5FF]/30 text-[#00E5FF]' : 'bg-[#061121]/50 border-[#00E5FF]/10 text-[#B6C2D2] hover:bg-[#071224]'}`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
            {/* Map Section */}
            <div className="col-span-8 flex flex-col gap-6">
              {/* Route Input Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-12 gap-4"
              >
                <div className="col-span-5 bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#22C55E] flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#B6C2D2] text-xs mb-1">From</p>
                    <p className="text-white font-medium text-sm">{source?.name || source?.address || 'Start'}</p>
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <button className="w-10 h-10 rounded-lg bg-[#061121]/95 border border-[#00E5FF]/10 flex items-center justify-center hover:bg-[#071224] transition-all">
                    <ArrowLeftRight className="w-4 h-4 text-[#B6C2D2]" />
                  </button>
                </div>
                <div className="col-span-5 bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-4 flex items-center gap-3">
                  <MapPin className="w-7 h-7 text-[#FF3B3B]" />
                  <div className="flex-1">
                    <p className="text-[#B6C2D2] text-xs mb-1">To</p>
                    <p className="text-white font-medium text-sm">{destination?.name || destination?.address || 'End'}</p>
                  </div>
                </div>
              </motion.div>

              {/* Leaflet Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-5 h-[500px]"
              >
                <MapContainer
                  center={selectedPositions[0] || [40.7128, -74.0060]}
                  zoom={13}
                  style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {allPositions.length > 0 && <FitRouteBounds positions={allPositions} />}
                  {routes.map((route, index) => {
                    const positions = route.overview_polyline?.points ? polyline.decode(route.overview_polyline.points) : []
                    const color = getRouteColor(index)
                    const weight = index === selectedRouteIndex ? 8 : 5
                    return (
                      <Polyline
                        key={route.id}
                        positions={positions}
                        pathOptions={{
                          color,
                          weight,
                          opacity: index === selectedRouteIndex ? 0.95 : 0.6
                        }}
                        eventHandlers={{ click: () => setSelectedRouteIndex(index) }}
                      />
                    )
                  })}
                </MapContainer>
              </motion.div>

              {/* Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {routes.map((route, index) => {
                  const isSelected = index === selectedRouteIndex
                  const color = getRouteColor(index)
                  const borderColor = isSelected ? color + '80' : '#14213D'
                  const boxShadow = isSelected ? '0 0 30px ' + color + '30' : 'none'
                  const explanation = route.ai_explanation
                  return (
                    <motion.div
                      key={route.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      onClick={() => setSelectedRouteIndex(index)}
                      className="bg-[#061121]/95 border-2 rounded-2xl p-5 cursor-pointer transition-all"
                      style={{
                        borderColor,
                        boxShadow,
                        transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-6 h-6" style={{ color }} />
                        <span className="text-2xl font-bold" style={{ color }}>{route.safety_score}</span>
                        <span className="text-[#B6C2D2]">/100</span>
                        <span className="ml-auto font-semibold text-sm" style={{ color }}>{route.risk_level}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-2 bg-[#030B18] rounded-lg border border-[#00E5FF]/10">
                          <p className="text-[#B6C2D2] text-xs mb-1">ETA</p>
                          <p className="text-white font-semibold text-sm">{route.eta}</p>
                        </div>
                        <div className="text-center p-2 bg-[#030B18] rounded-lg border border-[#00E5FF]/10">
                          <p className="text-[#B6C2D2] text-xs mb-1">Distance</p>
                          <p className="text-white font-semibold text-sm">{route.distance}</p>
                        </div>
                      </div>
                      {route.weather_desc && (
                        <div className="mb-3 p-2 bg-[#030B18] rounded-lg border border-[#00E5FF]/10 text-center">
                          <p className="text-[#B6C2D2] text-xs mb-1">Weather</p>
                          <p className={`text-sm font-semibold ${route.weather_penalty > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                            {route.weather_desc}
                            {route.weather_penalty > 0 && <span className="text-xs ml-1">(-{route.weather_penalty})</span>}
                          </p>
                        </div>
                      )}
                      {route.major_roads && route.major_roads.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[#B6C2D2] text-xs mb-2">Major Roads:</p>
                          <div className="flex flex-wrap gap-1">
                            {route.major_roads.slice(0, 3).map((road, i) => (
                              <span key={i} className="px-2 py-1 bg-[#030B18] border border-[#00E5FF]/10 rounded text-xs text-[#00E5FF]">
                                {road.length > 20 ? `${road.slice(0, 20)}...` : road}
                              </span>
                            ))}
                            {route.major_roads.length > 3 && (
                              <span className="px-2 py-1 bg-[#030B18] border border-[#00E5FF]/10 rounded text-xs text-[#B6C2D2]">
                                +{route.major_roads.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {explanation && explanation.positives && (
                        <div className="mb-4">
                          <p className="text-[#B6C2D2] text-xs mb-2">Safety Highlights:</p>
                          <div className="space-y-1">
                            {explanation.positives.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-xs text-green-400 flex items-center gap-1">
                                <span>+</span> {item}
                              </p>
                            ))}
                            {explanation.negatives.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-xs text-red-400 flex items-center gap-1">
                                <span>-</span> {item}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedRouteIndex(index)
                          navigate('/explain')
                        }}
                        className="w-full py-2 rounded-lg bg-[#030B18] border border-[#00E5FF]/10 text-[#00E5FF] text-xs font-semibold"
                      >
                        View Details
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Right Sidebar - Comparison Panel */}
            <div className="col-span-4 flex flex-col gap-6">
              {/* Comparison Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#00E5FF]" />
                  Detailed Comparison
                </h3>

                {/* Selected Route Details */}
                {selectedRoute && (
                  <div className="mb-6 p-4 bg-[#030B18] rounded-xl border border-[#00E5FF]/10">
                    <h4 className="text-white font-semibold mb-3">
                      {selectedRoute.summary || 'Route ' + (selectedRouteIndex + 1)}
                    </h4>
                    <div className="space-y-3">
                      <ScoreItem
                        icon={Lightbulb}
                        label="Lighting"
                        score={selectedRoute.lighting_score}
                      />
                      <ScoreItem
                        icon={Users}
                        label="Crowd Activity"
                        score={selectedRoute.crowd_score}
                      />
                      <ScoreItem
                        icon={FileCheck}
                        label="Community Reports"
                        score={selectedRoute.report_score}
                      />
                      <ScoreItem
                        icon={Camera}
                        label="CCTV Coverage"
                        score={selectedRoute.cctv_score}
                      />
                      <ScoreItem
                        icon={Hospital}
                        label="Emergency Access"
                        score={selectedRoute.emergency_score}
                      />
                      <ScoreItem
                        icon={Clock3}
                        label="Time Risk"
                        score={selectedRoute.time_risk_score}
                      />
                    </div>
                  </div>
                )}

                {/* All Routes Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#00E5FF]/10">
                        <th className="text-left text-[#B6C2D2] pb-3">Metric</th>
                        {routes.map((route, index) => (
                          <th key={route.id} className="text-center pb-3">
                            <span style={{ color: getRouteColor(index) }}>
                              R{index + 1}
                            </span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-[#B6C2D2]">
                      <ComparisonRow label="Safety" routes={routes} field="safety_score" />
                      <ComparisonRow label="Distance" routes={routes} field="distance" isText />
                      <ComparisonRow label="ETA" routes={routes} field="eta" isText />
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#061121]/95 border border-[#00E5FF]/10 rounded-2xl p-6"
              >
                <h3 className="text-base font-semibold mb-4">AI Summary</h3>
                <p className="text-[#B6C2D2] text-sm leading-relaxed">
                  {selectedRoute?.ai_explanation?.positives?.length || selectedRoute?.ai_explanation?.negatives?.length
                    ? `${selectedRoute?.risk_level || 'Safe'} route with safety score ${selectedRoute?.safety_score || 80}/100`
                    : typeof selectedRoute?.ai_explanation === 'string'
                      ? selectedRoute.ai_explanation
                      : 'Safe route recommendation based on multiple safety factors'
                  }
                </p>
              </motion.div>

              {/* Recommendation Banner */}
              {routes[0] && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-[#061121]/95 border border-[#22C55E]/30 rounded-2xl p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-[#22C55E]" />
                    <h3 className="text-base font-semibold text-white">Recommended Route</h3>
                  </div>
                  <p className="text-[#B6C2D2] text-sm">
                    Route 1 is the safest option with a score of {routes[0].safety_score}/100!
                  </p>
                </motion.div>
              )}

              {/* Developer Debug Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-[#061121]/95 border border-[#FF3B3B]/30 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setDebugPanelOpen(!debugPanelOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#071224] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Bug className="w-5 h-5 text-[#FF3B3B]" />
                    <h3 className="text-base font-semibold text-white">Developer Debug Panel</h3>
                  </div>
                  {debugPanelOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#B6C2D2]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#B6C2D2]" />
                  )}
                </button>
                {debugPanelOpen && selectedRoute && (
                  <div className="p-4 border-t border-[#FF3B3B]/20 space-y-3">
                    <DebugItem label="Start Coordinates" value={`${selectedRoute.source_coords?.lat.toFixed(6)}, ${selectedRoute.source_coords?.lng.toFixed(6)}`} />
                    <DebugItem label="End Coordinates" value={`${selectedRoute.destination_coords?.lat.toFixed(6)}, ${selectedRoute.destination_coords?.lng.toFixed(6)}`} />
                    <DebugItem label="Selected Route ID" value={selectedRoute.id} />
                    <DebugItem label="Routing Engine" value="OpenRouteService (driving-car)" />
                    <DebugItem label="Route Geometry Length" value={`${selectedRoute.overview_polyline?.points?.length || 0} characters`} />
                    <DebugItem label="Route Distance (API)" value={`${selectedRoute.distance_meters} meters`} />
                    <DebugItem label="Route Duration (API)" value={`${selectedRoute.eta_seconds} seconds`} />
                    <DebugItem label="Safety Score" value={selectedRoute.safety_score} isScore />
                    <DebugItem label="Lighting Score" value={selectedRoute.lighting_score} isScore />
                    <DebugItem label="Crowd Score" value={selectedRoute.crowd_score} isScore />
                    <DebugItem label="CCTV Score" value={selectedRoute.cctv_score} isScore />
                    <DebugItem label="Emergency Score" value={selectedRoute.emergency_score} isScore />
                    <DebugItem label="Time Risk Score" value={selectedRoute.time_risk_score} isScore />
                    <DebugItem label="Segment Count" value={selectedRoute.steps?.length || 0} />
                    <DebugItem label="Major Roads" value={selectedRoute.major_roads?.join(', ') || 'None'} />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

function DebugItem({ label, value, isScore }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-[#B6C2D2] text-xs">{label}</span>
      <span className={`text-xs font-mono ${isScore ? 'text-[#00E5FF]' : 'text-white'}`}>
        {typeof value === 'string' && value.length > 50 ? `${value.slice(0, 50)}...` : value}
      </span>
    </div>
  )
}

function ScoreItem({ icon: Icon, label, score }) {
  const color = getScoreColor(score)
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#B6C2D2]" />
        <span className="text-[#B6C2D2] text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-[#030B18] rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
        </div>
        <span style={{ color }} className="text-sm font-semibold w-8 text-right">{score}</span>
      </div>
    </div>
  )
}

function ComparisonRow({ label, routes, field, isText }) {
  return (
    <tr className="border-b border-[#00E5FF]/5">
      <td className="py-2 text-[#B6C2D2]">{label}</td>
      {routes.map((route, index) => (
        <td key={route.id} className="text-center py-2">
          {isText ? (
            <span className="text-white">{route[field]}</span>
          ) : (
            <span style={{ color: getScoreColor(route[field]) }} className="font-semibold">{route[field]}</span>
          )}
        </td>
      ))}
    </tr>
  )
}
