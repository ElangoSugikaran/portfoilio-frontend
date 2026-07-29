import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {/* Footer will go here eventually */}
    </div>
  )
}

export default App
