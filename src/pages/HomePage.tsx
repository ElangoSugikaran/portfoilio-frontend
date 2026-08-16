import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"
import { Experience } from "@/sections/Experience"
import { Education } from "@/sections/Education"
import { Skills } from "@/sections/Skills"
import { Projects } from "@/sections/Projects"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      {/* Other sections like Contact, etc. will go here later */}
    </div>
  )
}
