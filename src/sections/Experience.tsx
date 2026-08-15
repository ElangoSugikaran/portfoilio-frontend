import { motion } from 'framer-motion'
import { Briefcase, Calendar, ChevronRight, ExternalLink } from 'lucide-react'

const experiences = [
  {
    id: 1,
    role: "Software Engineer Intern",
    company: "Code3x",
    logo: "", // e.g., "/images/companies/code3x.png"
    url: "https://code3x.tech/", // Replace with actual URL
    location: "Sri Lanka (Remote)",
    date: "Mar 2026 – Present",
    description: [
      "Collaborating with the engineering team to build and maintain scalable web applications.",
      "Improving system architecture and optimizing frontend performance.",
      "Implementing efficient backend APIs and seamless user experiences."
    ]
  },
  {
    id: 2,
    role: "Freelance Full-Stack Developer",
    company: "Independent / Freelance",
    logo: "", // e.g., "/images/companies/freelance.png"
    url: "",
    location: "Remote",
    date: "2025 – Present",
    description: [
      "Developing a custom e-commerce platform for a gem seller, covering product management, order flow, and backend APIs.",
      "Working directly with clients to gather requirements and implement features incrementally.",
      "Handling full development lifecycle from initial setup to deployment-ready implementation."
    ]
  },
]

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 bg-background overflow-hidden scroll-margin-top">
      {/* Subtle Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Main Container - Matches About Section Width */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">

        {/* Section Header - Improved Mobile Centering & Responsiveness */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start gap-4 md:gap-6"
        >
          <div className="flex items-center gap-4 md:gap-6 w-full">
            <div className="w-12 md:w-16 h-[2px] bg-gradient-to-r from-primary to-transparent shrink-0" />
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
              My <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Experience</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl ml-0 md:ml-[88px]">
            A timeline of my professional journey, building scalable software and delivering seamless digital experiences.
          </p>
        </motion.div>

        {/* Vertical Timeline with Logo Bubbles & Glass Cards */}
        <div className="relative w-full md:ml-[88px] max-w-4xl mt-4 md:mt-8">
          {/* Continuous Vertical Line */}
          <div className="absolute left-[24px] md:left-[28px] top-4 bottom-0 w-[2px] bg-border/50" />

          <div className="flex flex-col gap-10 md:gap-16">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                className="relative pl-16 md:pl-24 group"
              >
                {/* Company Logo / Icon Bubble on Timeline */}
                <div className="absolute left-[4px] md:left-[4px] top-0 w-11 h-11 md:w-13 md:h-13 rounded-full bg-background border-4 border-background ring-2 ring-border z-10 flex items-center justify-center overflow-hidden group-hover:ring-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {exp.logo ? (
                    <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                  ) : (
                    <Briefcase className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>

                {/* Experience Card (Subtle Glassmorphism to differentiate items without being plain) */}
                <div className="flex flex-col gap-4 md:gap-6 p-6 md:p-8 rounded-3xl bg-card/30 border border-border/50 hover:bg-card/60 transition-colors duration-500 relative overflow-hidden">

                  {/* Subtle hover glow inside card */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Header Row (Role, Company, Date) */}
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 md:mb-2">
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base md:text-lg font-medium text-foreground/80">
                        {exp.url ? (
                          <a href={exp.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-primary transition-colors group/link">
                            {exp.company}
                            <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                          </a>
                        ) : (
                          <span className="font-semibold">{exp.company}</span>
                        )}
                        <span className="text-muted-foreground/40 hidden sm:block">•</span>
                        <span className="text-muted-foreground">{exp.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm md:text-base font-semibold text-muted-foreground bg-muted/50 border border-border/50 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full w-fit shrink-0 mt-2 sm:mt-0">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      {exp.date}
                    </div>
                  </div>

                  {/* Bullet Points */}
                  <div className="relative z-10 space-y-3 mt-1 md:mt-2">
                    {exp.description.map((item, i) => (
                      <p key={i} className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed flex items-start gap-3">
                        <span className="text-primary mt-[5px] flex-shrink-0">
                          <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
