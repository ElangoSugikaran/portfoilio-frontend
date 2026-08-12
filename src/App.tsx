import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Footer will go here eventually */}
    </div>
  )
}

export default App
