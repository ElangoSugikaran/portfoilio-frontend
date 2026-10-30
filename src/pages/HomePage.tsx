import { Hero } from "@/sections/Hero"
import { About } from "@/sections/About"
import { Experience } from "@/sections/Experience"
import { Education } from "@/sections/Education"
import { Skills } from "@/sections/Skills"
import { Projects } from "@/sections/Projects"
import { Certifications } from "@/sections/Certifications"
import { Contact } from "@/sections/Contact"

import { SEO } from "@/components/common/SEO"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Certifications />
      <Contact />
    </div>
  )
}
