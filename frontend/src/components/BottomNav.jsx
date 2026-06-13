import { useNavigate, useLocation } from 'react-router-dom'
import { Home, FileText, User } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0B1220] border-t border-[#14213D] px-4 py-3 z-50">
      <div className="flex items-center justify-around">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center transition-colors ${isActive('/') ? 'text-[#00E5FF]' : 'text-[#B5B5B5] hover:text-[#00E5FF]'}`}
        >
          <Home className="w-7 h-7 mb-1" />
          <span className="text-xs font-semibold">Home</span>
        </button>
        <button 
          onClick={() => navigate('/routes')}
          className={`flex flex-col items-center transition-colors ${isActive('/routes') ? 'text-[#00E5FF]' : 'text-[#B5B5B5] hover:text-[#00E5FF]'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7 mb-1">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <span className="text-xs font-semibold">Routes</span>
        </button>
        <button 
          onClick={() => navigate('/sos')}
          className="flex flex-col items-center"
        >
          <div 
            className="w-16 h-16 -mt-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00FF88] flex items-center justify-center"
            style={{ boxShadow: '0 0 40px rgba(0, 229, 255, 0.5)' }}
          >
            <div className="w-12 h-12 rounded-full bg-[#050816] flex items-center justify-center">
              <span className="text-[#00FF88] font-bold text-lg">SOS</span>
            </div>
          </div>
        </button>
        <button 
          onClick={() => navigate('/reports')}
          className={`flex flex-col items-center transition-colors ${isActive('/reports') ? 'text-[#00E5FF]' : 'text-[#B5B5B5] hover:text-[#00E5FF]'}`}
        >
          <FileText className="w-7 h-7 mb-1" />
          <span className="text-xs font-semibold">Reports</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center transition-colors ${isActive('/profile') ? 'text-[#00E5FF]' : 'text-[#B5B5B5] hover:text-[#00E5FF]'}`}
        >
          <User className="w-7 h-7 mb-1" />
          <span className="text-xs font-semibold">Profile</span>
        </button>
      </div>
    </div>
  )
}
