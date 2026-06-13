import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, MapPin, FileText, Settings, HelpCircle, Users, ShieldCheck } from 'lucide-react'
import BottomNav from '../components/BottomNav'

export default function Profile() {
  const navigate = useNavigate()

  const stats = [
    { value: '12', label: 'Trips Completed', icon: MapPin },
    { value: '5', label: 'Reports Submitted', icon: FileText }
  ]

  const menuItems = [
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Users, label: 'About Us' }
  ]

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 bg-[#0B1220] border border-[#14213D] rounded-xl"
        >
          <ArrowLeft className="w-7 h-7" />
        </button>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0B1220] border border-[#14213D] rounded-3xl p-8 mb-6 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00FF88] flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-[#050816]" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Sara Johnson</h2>
          <p className="text-[#B5B5B5]">Building safer journeys together</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          {stats.map((stat, i) => {
            const StatIcon = stat.icon
            return (
              <div key={stat.label} className="bg-[#0B1220] border border-[#14213D] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <StatIcon className="w-6 h-6 text-[#00E5FF]" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-[#B5B5B5] text-sm">{stat.label}</div>
              </div>
            )
          })}
        </motion.div>

        <div className="space-y-3">
          {menuItems.map((item, i) => {
            const MenuIcon = item.icon
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="w-full bg-[#0B1220] border border-[#14213D] rounded-2xl p-6 text-left hover:border-[#00E5FF] transition-all flex items-center gap-4"
              >
                <MenuIcon className="w-7 h-7 text-[#00E5FF]" />
                <span className="text-lg font-semibold">{item.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
