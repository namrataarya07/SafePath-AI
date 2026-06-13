
import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [source, setSource] = useState(null)
  const [destination, setDestination] = useState(null)
  const [routes, setRoutes] = useState([])
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0)
  const [usingMockData, setUsingMockData] = useState(false)

  return (
    <AppContext.Provider value={{
      source,
      setSource,
      destination,
      setDestination,
      routes,
      setRoutes,
      selectedRouteIndex,
      setSelectedRouteIndex,
      selectedRoute: routes[selectedRouteIndex],
      usingMockData,
      setUsingMockData
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
