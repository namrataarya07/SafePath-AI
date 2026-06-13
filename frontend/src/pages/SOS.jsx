import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Share2, MapPin, ShieldAlert, HeartPulse, ShieldCheck } from 'lucide-react'
import BottomNav from '../components/BottomNav'

export default function SOS() {
  const navigate = useNavigate()
  const [sosActive, setSosActive] = useState(false)

  const handleSOS = async () => {
    setSosActive(true)
    try {
      await fetch('http://localhost:8000/sos', { method: 'POST' })
    } catch (err) {
      console.error(err)
    }
    setTimeout(() => setSosActive(false), 5000)
  }

  const emergencyContacts = [
    { icon: ShieldCheck, title: 'Emergency Services', number: '911', color: '#FF3B3B' },
    { icon: HeartPulse, title: 'Medical Help', number: '911', color: '#00E5FF' }
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
        <h1 className="text-2xl font-bold">Emergency SOS</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0B1220] border border-[#14213D] rounded-3xl p-8 mb-8 text-center"
        >
          <button
            onClick={handleSOS}
            className={`w-40 h-40 rounded-full flex items-center justify-center mx-auto mb-6 transition-all ${sosActive ? 'bg-[#FF3B3B] animate-pulse' : 'bg-[#FF3B3B] hover:opacity-90'}`}
            style={{ boxShadow: sosActive ? '0 0 60px rgba(255, 59, 59, 0.6)' : '0 0 40px rgba(255, 59, 59, 0.4)' }}
          >
            <Phone className="w-16 h-16 text-white" />
          </button>
          <h2 className="text-3xl font-bold mb-2 text-[#FF3B3B]">
            {sosActive ? 'SOS ACTIVE!' : 'Tap to Trigger'}
          </h2>
          <p className="text-[#B5B5B5]">
            {sosActive ? 'Emergency services notified' : 'Alerts authorities and shares your location'}
          </p>
        </motion.div>

        <div className="space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full bg-[#0B1220] border border-[#14213D] rounded-2xl p-6 text-left hover:border-[#00E5FF] transition-all flex items-center gap-4"
          >
            <Share2 className="w-8 h-8 text-[#00E5FF]" />
            <div>
              <h3 className="font-bold text-lg">Share Live Location</h3>
              <p className="text-[#B5B5B5] text-sm">Send to emergency contacts</p>
            </div>
          </motion.button>

          {emergencyContacts.map((contact, i) => {
            const ContactIcon = contact.icon
            return (
              <motion.button
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="w-full bg-[#0B1220] border border-[#14213D] rounded-2xl p-6 text-left hover:border-[#00E5FF] transition-all flex items-center gap-4"
              >
                <ContactIcon className="w-8 h-8" style={{ color: contact.color }} />
                <div>
                  <h3 className="font-bold text-lg">{contact.title}</h3>
                  <p className="text-[#B5B5B5] text-sm">{contact.number}</p>
                </div>
              </motion.button>
            )
          })}

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-[#0B1220] border border-[#14213D] rounded-2xl p-6 text-left hover:border-[#00E5FF] transition-all flex items-center gap-4"
          >
            <MapPin className="w-8 h-8 text-[#00FF88]" />
            <div>
              <h3 className="font-bold text-lg">Nearest Safe Locations</h3>
              <p className="text-[#B5B5B5] text-sm">Find police stations, hospitals</p>
            </div>
          </motion.button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
