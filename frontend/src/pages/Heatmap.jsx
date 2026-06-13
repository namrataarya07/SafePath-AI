
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Search, Map as MapIcon, Info, Shield, AlertCircle, Users,
  Camera, ChevronRight, Home, FileText, MapPin, User, Settings, Clock,
  Plus, Minus, Locate
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

// Fabricated zones
const ZONES = [
  { id: 1, name: 'City College Main Campus', lat: 28.6800, lng: 77.2100, score: 85, color: '#00FF88', type: 'safe' },
  { id: 2, name: 'MG Road', lat: 28.6100, lng: 77.2300, score: 75, color: '#00FF88', type: 'safe' },
  { id: 3, name: 'Park Street', lat: 28.6050, lng: 77.2250, score: 65, color: '#FFC857', type: 'moderate' },
  { id: 4, name: 'Industrial Area', lat: 28.5900, lng: 77.2400, score: 35, color: '#FF3B3B', type: 'risky' },
  { id: 5, name: 'City Mall Sector 18', lat: 28.5700, lng: 77.3200, score: 50, color: '#FFC857', type: 'moderate' },
];

// Recent alerts
const RECENT_ALERTS = [
  { type: 'Crowded area', location: 'MG Road', time: '10 min ago', color: '#FF3B3B' },
  { type: 'Poor lighting', location: 'Park Street', time: '25 min ago', color: '#FFC857' },
  { type: 'Traffic congestion', location: 'City Mall', time: '40 min ago', color: '#FFC857' },
  { type: 'Suspicious activity', location: 'Industrial Area', time: '1hr ago', color: '#FF3B3B' },
];

const Heatmap = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false
    }).setView([28.6139, 77.209], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom zoom controls
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add zones as circles
    ZONES.forEach(zone => {
      const circle = L.circle([zone.lat, zone.lng], {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.35,
        radius: 800,
        weight: 2
      }).addTo(map);

      circle.bindTooltip(`
        <div style="font-weight: bold; font-size: 14px;">${zone.name}</div>
        <div style="font-size: 12px;">Safety: ${zone.score}/100</div>
        <div style="font-size: 12px; color: ${zone.color};">${zone.type.toUpperCase()}</div>
      `);
    });

    // Add example route (like the reference image)
    const routeCoords = [
      [28.6800, 77.2100],
      [28.6600, 77.2150],
      [28.6400, 77.2200],
      [28.6200, 77.2250],
      [28.6050, 77.2250],
      [28.5900, 77.2400],
      [28.5700, 77.3200],
    ];
    const route = L.polyline(routeCoords, {
      color: '#00FF88',
      weight: 5,
      opacity: 0.8
    }).addTo(map);

    // Add markers for start and end
    const startMarker = L.marker([28.6800, 77.2100], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:24px;height:24px;border-radius:50%;background:#00E5FF;border:3px solid white;box-shadow:0 0 15px #00E5FF;"></div>',
        iconSize: [24, 24]
      })
    }).addTo(map);

    const endMarker = L.marker([28.5700, 77.3200], {
      icon: L.divIcon({
        className: '',
        html: '<div style="width:30px;height:40px;background:white;border-radius:8px 8px 8px 0;box-shadow:0 2px 10px rgba(0,0,0,.3);"><div style="width:14px;height:14px;background:#FF3B3B;border-radius:50%;margin:8px auto;"></div></div>',
        iconSize: [30, 40],
        iconAnchor: [15, 40]
      })
    }).addTo(map).bindTooltip('<div style="font-weight:bold;">City Mall Sector 18</div>');

    // Fit map to show everything
    map.fitBounds(L.latLngBounds(routeCoords).pad(0.1));

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020817] via-[#030B18] to-[#071224] text-white flex flex-col">
      {/* Top header */}
      <div className="p-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-[#0B1220] border border-[#00E5FF]/20 rounded-2xl hover:bg-[#0B1220]/80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#22C55E] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#020817]" />
          </div>
          <span className="text-xl font-bold tracking-tight">SafePath AI</span>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 bg-[#0B1220] rounded-full">
            <AlertCircle className="w-5 h-5 text-[#FF3B3B]" />
          </button>
          <div className="flex items-center gap-2 p-2 bg-[#0B1220] border border-[#00E5FF]/10 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF3B3B] to-[#FFC857] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold">Sarah Johnson</div>
              <div className="text-xs text-[#B6C2D2]">Safe Explorer</div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#B6C2D2]" />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-6 pb-24 grid grid-cols-1 lg:grid-cols-4 gap-6 z-10">
        {/* Sidebar left */}
        <div className="hidden lg:flex flex-col gap-4">
          {[
            { icon: Home, label: 'Home', id: 'home' },
            { icon: FileText, label: 'Reports', id: 'reports' },
            { icon: MapPin, label: 'Heatmap', id: 'heatmap', active: true },
            { icon: AlertCircle, label: 'SOS', id: 'sos' },
            { icon: User, label: 'Profile', id: 'profile' },
            { icon: Settings, label: 'Settings', id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                item.active ? 'bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]' : 'text-[#B6C2D2]'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}

          {/* SOS panel */}
          <div className="mt-auto bg-[#061121] border border-[#FF3B3B]/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#FF3B3B]/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#FF3B3B]" />
              </div>
              <div>
                <div className="text-sm font-semibold">Need Immediate Help?</div>
                <div className="text-xs text-[#B6C2D2]">Press SOS button for instant assistance</div>
              </div>
            </div>
            <button className="w-full py-3 bg-[#FF3B3B] text-white font-semibold rounded-xl hover:bg-[#FF3B3B]/90">
              SOS NOW
            </button>
          </div>
        </div>

        {/* Main map area */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Safety Heatmap</h2>
              <p className="text-sm text-[#B6C2D2]">Real-time safety intelligence of your area</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00FF88]" />
                <span className="text-sm text-[#B6C2D2]">Safe Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FFC857]" />
                <span className="text-sm text-[#B6C2D2]">Moderate Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF3B3B]" />
                <span className="text-sm text-[#B6C2D2]">High Risk Zone</span>
              </div>
            </div>
            <button className="p-2 bg-[#0B1220] border border-[#00E5FF]/10 rounded-lg">
              <Info className="w-5 h-5 text-[#B6C2D2]" />
            </button>
          </div>

          {/* Map container */}
          <div className="relative rounded-3xl overflow-hidden border border-[#00E5FF]/10">
            {/* Overlay controls */}
            <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#0B1220]/90 backdrop-blur-sm border border-[#00E5FF]/20 rounded-xl">
                  <Search className="w-5 h-5 text-[#B6C2D2]" />
                </div>
                <div className="px-4 py-3 bg-[#0B1220]/90 backdrop-blur-sm border border-[#00E5FF]/20 rounded-xl">
                  <div className="text-sm font-medium">Search location</div>
                </div>
              </div>

              <button className="flex items-center gap-2 px-4 py-3 bg-[#0B1220]/90 backdrop-blur-sm border border-[#00E5FF]/20 rounded-xl">
                <MapIcon className="w-5 h-5" />
                <span className="text-sm font-medium">My Route</span>
              </button>
            </div>

            {/* Start/end labels */}
            <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-30">
              <div className="px-4 py-2 bg-[#0B1220]/90 backdrop-blur-sm border border-[#00E5FF]/30 rounded-xl">
                <div className="text-[#00E5FF] text-sm font-medium">You are here</div>
              </div>
            </div>

            {/* The actual map */}
            <div 
              ref={mapContainerRef} 
              className="w-full" 
              style={{ height: '500px' }} 
            />
          </div>

          {/* Recent alerts */}
          <div className="bg-[#061121] border border-[#00E5FF]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Alerts in This Area</h3>
              <button className="text-[#00E5FF] text-sm flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {RECENT_ALERTS.map((alert, i) => (
                <div key={i} className="p-3 bg-[#030B18] rounded-xl border border-[#00E5FF]/10">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5" style={{ color: alert.color }} />
                    <div className="text-sm font-medium">{alert.type}</div>
                  </div>
                  <div className="text-xs text-[#B6C2D2]">{alert.location}</div>
                  <div className="text-xs text-[#B6C2D2] mt-1">{alert.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col gap-4">
          {/* AI Hotspot Insights */}
          <div className="bg-[#061121] border border-[#00E5FF]/10 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#22C55E]/20 flex items-center justify-center border border-[#00E5FF]/20">
                <span className="text-lg font-bold">AI</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Hotspot Insights</h3>
                <p className="text-xs text-[#B6C2D2]">Based on live security & traffic analysis</p>
              </div>
            </div>
            <p className="text-sm text-[#B6C2D2] mb-4">
              This map shows real-time risk levels, accident history and incident reports.
            </p>
            <button className="text-[#00E5FF] text-sm flex items-center gap-1">
              View why? <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Area Safety Breakdown */}
          <div className="bg-[#061121] border border-[#00E5FF]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Area Safety Breakdown</h3>
              <button className="text-[#00E5FF] text-sm flex items-center gap-1">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00FF88]/20 to-[#22C55E]/20 border border-[#00FF88]/30">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-6 h-6 text-[#00FF88]" />
                  <div className="text-xs text-[#B6C2D2]">Safe Zone</div>
                </div>
                <div className="text-2xl font-bold text-[#00FF88]">62%</div>
                <div className="text-xs text-[#B6C2D2]">High Safety</div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFC857]/20 to-[#F59E0B]/20 border border-[#FFC857]/30">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-6 h-6 text-[#FFC857]" />
                  <div className="text-xs text-[#B6C2D2]">Moderate Zone</div>
                </div>
                <div className="text-2xl font-bold text-[#FFC857]">28%</div>
                <div className="text-xs text-[#B6C2D2]">Use Caution</div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FF3B3B]/20 to-[#FF5757]/20 border border-[#FF3B3B]/30">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-6 h-6 text-[#FF3B3B]" />
                  <div className="text-xs text-[#B6C2D2]">High Risk Zone</div>
                </div>
                <div className="text-2xl font-bold text-[#FF3B3B]">10%</div>
                <div className="text-xs text-[#B6C2D2]">Avoid if possible</div>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#4338ca]/20 border border-[#00E5FF]/30">
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-6 h-6 text-[#00E5FF]" />
                  <div className="text-xs text-[#B6C2D2]">CCTV Coverage</div>
                </div>
                <div className="text-2xl font-bold text-[#00E5FF]">78%</div>
                <div className="text-xs text-[#B6C2D2]">Good</div>
              </div>
            </div>
          </div>

          {/* Community Reports */}
          <div className="bg-[#061121] border border-[#00E5FF]/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Community Reports in This Area</h3>
              <button className="text-[#00E5FF] text-sm flex items-center gap-1">
                View Reports <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <Users className="w-8 h-8 text-[#00E5FF]" />
              <div className="text-sm text-[#B6C2D2]">Based on last 24 hours</div>
            </div>

            <div className="text-sm text-[#B6C2D2]">
              Multiple incidents reported in 3 zones.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom nav for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNav />
      </div>
    </div>
  );
};

export default Heatmap;

