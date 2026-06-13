import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Polyline, TileLayer, useMap, Circle } from 'react-leaflet'
import L from 'leaflet'
import polyline from '@mapbox/polyline'
import 'leaflet/dist/leaflet.css'
import { ArrowLeft, Clock, MapPin, Navigation as NavigationIcon, ShieldAlert, Layers, Map as MapIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import BottomNav from '../components/BottomNav'

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:30px;height:30px;border-radius:50%;background:#00E5FF;border:4px solid white;box-shadow:0 2px 16px rgba(0,0,0,.4)"><div style="width:10px;height:10px;border-radius:50%;background:#020817;margin:6px"></div></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
})

const destinationIcon = L.divIcon({
  className: '',
  html: '<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#FF3B3B;border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 14px rgba(0,0,0,.4)"><div style="width:8px;height:8px;border-radius:50%;background:white;margin:6px"></div></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 26],
})

const getScoreColor = (score) => {
  if (score >= 90) return '#22C55E'
  if (score >= 75) return '#4ADE80'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#FB923C'
  return '#FF3B3B'
}

function FitRouteBounds({ positions }) {
  const map = useMap()

  useEffect(() => {
    if (!positions.length) return
    map.fitBounds(L.latLngBounds(positions), { padding: [56, 56] })
  }, [map, positions])

  return null
}

export default function Navigation() {
  const navigate = useNavigate()
  const { selectedRoute } = useApp()
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapZones, setHeatmapZones] = useState([])

  useEffect(() => {
    if (!selectedRoute) navigate('/')
  }, [navigate, selectedRoute])

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const res = await fetch('http://localhost:8000/heatmap')
        const data = await res.json()
        setHeatmapZones(data.zones)
      } catch (err) {
        console.error('Failed to fetch heatmap', err)
      }
    }
    fetchHeatmap()
  }, [])

  const getHeatmapColor = (score) => {
    if (score >= 80) return '#00FF88'
    if (score >= 50) return '#FFC857'
    return '#FF3B3B'
  }

  const routePositions = useMemo(() => {
    const points = selectedRoute?.overview_polyline?.points
    return points ? polyline.decode(points) : []
  }, [selectedRoute])

  useEffect(() => {
    if (!selectedRoute?.steps?.length) return

    const interval = setInterval(() => {
      setActiveStepIndex((index) => Math.min(index + 1, selectedRoute.steps.length - 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedRoute])

  if (!selectedRoute) return null

  const activeStep = selectedRoute.steps?.[activeStepIndex]
  const sourcePosition = selectedRoute.source_coords
    ? [selectedRoute.source_coords.lat, selectedRoute.source_coords.lng]
    : routePositions[0]
  const destinationPosition = selectedRoute.destination_coords
    ? [selectedRoute.destination_coords.lat, selectedRoute.destination_coords.lng]
    : routePositions[routePositions.length - 1]
  const safetyColor = getScoreColor(selectedRoute.safety_score)

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <div className="p-4 flex items-center gap-4 z-10 relative bg-[#050816]">
        <button
          onClick={() => navigate('/explain')}
          className="p-2 bg-[#0B1220] border border-[#14213D] rounded-xl"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Navigation Active</h1>
          <p className="text-sm text-[#B5B5B5]">{selectedRoute.summary || 'Route'}</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`p-3 rounded-xl border transition-all ${
              showHeatmap
                ? 'bg-[#00E5FF]/20 border-[#00E5FF] text-[#00E5FF]'
                : 'bg-[#0B1220] border-[#14213D]'
            }`}
          >
            <Layers className="w-6 h-6" />
          </button>
          <button
            onClick={() => navigate('/heatmap')}
            className="px-4 py-3 bg-gradient-to-r from-[#00E5FF] to-[#22C55E] text-[#020817] font-semibold rounded-xl flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <MapIcon className="w-5 h-5" />
            View Heatmap
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={sourcePosition || [28.6139, 77.209]}
          zoom={15}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {routePositions.length > 0 && (
            <Polyline
              positions={routePositions}
              pathOptions={{
                color: safetyColor,
                weight: 8,
                opacity: 0.92,
              }}
            />
          )}
          {showHeatmap && heatmapZones.map(zone => (
            <Circle
              key={zone.id}
              center={[zone.lat, zone.lng]}
              radius={500}
              pathOptions={{
                color: getHeatmapColor(zone.safety_score),
                fillColor: getHeatmapColor(zone.safety_score),
                fillOpacity: 0.35
              }}
            />
          ))}
          {sourcePosition && <Marker position={sourcePosition} icon={userIcon} />}
          {destinationPosition && <Marker position={destinationPosition} icon={destinationIcon} />}
          <FitRouteBounds positions={routePositions} />
        </MapContainer>

        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-[#0B1220]/95 border border-[#14213D] rounded-3xl p-5 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-[#B5B5B5] text-xs mb-1 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" /> ETA
                </div>
                <div className="text-2xl font-bold">{selectedRoute.eta}</div>
              </div>
              <div>
                <div className="text-[#B5B5B5] text-xs mb-1">Distance</div>
                <div className="text-2xl font-bold">{selectedRoute.distance}</div>
              </div>
              <div>
                <div className="text-[#B5B5B5] text-xs mb-1 flex items-center justify-center gap-1">
                  <ShieldAlert className="w-4 h-4" /> Safety
                </div>
                <div className="text-2xl font-bold" style={{ color: safetyColor }}>
                  {selectedRoute.safety_score}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-4 right-4 z-10">
          <div className="bg-[#0B1220]/95 border border-[#14213D] rounded-3xl p-5 backdrop-blur-sm shadow-lg">
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${safetyColor}20`,
                  boxShadow: `0 0 20px ${safetyColor}30`,
                }}
              >
                <NavigationIcon className="w-7 h-7" style={{ color: safetyColor }} />
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#B5B5B5] mb-1">
                  Step {activeStepIndex + 1} of {selectedRoute.steps?.length || 0}
                </div>
                <div className="text-xl font-bold mb-1">
                  {activeStep?.instruction || 'Follow the highlighted route'}
                </div>
                <div className="flex items-center gap-3 text-sm text-[#B5B5B5]">
                  <span>{activeStep?.distance?.text || selectedRoute.distance}</span>
                  <span>{activeStep?.duration?.text || selectedRoute.eta}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-[#14213D] bg-[#050816] p-3">
                <div className="flex items-center gap-2 text-[#B5B5B5] mb-1">
                  <MapPin className="w-4 h-4 text-[#00E5FF]" />
                  From
                </div>
                <p className="font-semibold">{selectedRoute.start_address}</p>
              </div>
              <div className="rounded-2xl border border-[#14213D] bg-[#050816] p-3">
                <div className="flex items-center gap-2 text-[#B5B5B5] mb-1">
                  <MapPin className="w-4 h-4 text-[#FF3B3B]" />
                  To
                </div>
                <p className="font-semibold">{selectedRoute.end_address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
