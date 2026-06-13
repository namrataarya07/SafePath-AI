import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/Home'
import RouteComparison from './pages/RouteComparison'
import AIExplanation from './pages/AIExplanation'
import Navigation from './pages/Navigation'
import Heatmap from './pages/Heatmap'
import Reports from './pages/Reports'
import SOS from './pages/SOS'
import Profile from './pages/Profile'

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/routes" element={<RouteComparison />} />
          <Route path="/explain" element={<AIExplanation />} />
          <Route path="/navigate" element={<Navigation />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </AppProvider>
  )
}

export default App