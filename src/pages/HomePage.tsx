import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      {/* Other sections like Projects, etc. will go here later */}
    </div>
  )
}
