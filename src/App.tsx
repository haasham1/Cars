import { VehicleProvider } from './context/VehicleContext'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <VehicleProvider>
      <Dashboard />
    </VehicleProvider>
  )
}

export default App
