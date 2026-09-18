import { ReactLenis } from 'lenis/react'
import { Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

function App() {
  return (
    <ReactLenis root>
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  )
}

export default App
