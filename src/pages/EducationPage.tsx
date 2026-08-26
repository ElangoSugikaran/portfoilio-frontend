import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { GraduationCap, Calendar, MapPin, Award, BookOpen, ArrowLeft } from 'lucide-react'
import { educationData } from '@/types/education'

export default function EducationPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'professional': return 'bg-primary'
      case 'degree': return 'bg-blue-500' // Using blue-500 for variety, matching the gradients
      case 'diploma': return 'bg-purple-500'
      default: return 'bg-primary'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'professional': return 'Professional'
      case 'degree': return 'Degree'
      case 'diploma': return 'Diploma'
      case 'academic': return 'School'
      default: return 'Education'
    }
  }

  const getTextColor = (type: string) => {
    switch (type) {
      case 'professional': return 'text-primary-foreground'
      case 'degree': return 'text-white'
      case 'diploma': return 'text-white'
      default: return 'text-primary-foreground'
    }
  }

  return (
    <div className="min-h-screen relative bg-background pt-24 pb-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Subtle Background Gradients */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12 md:gap-16">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" className="mb-8 hover:bg-muted/50 rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-6 w-full">
            <div className="w-12 md:w-16 h-0.5 bg-linear-to-r from-primary to-transparent shrink-0 mt-2" />
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest w-fit">
                <GraduationCap className="w-3.5 h-3.5" />
                Full Journey
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
                Educational <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">History</span>
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl ml-0 md:ml-22 mt-6">
            A comprehensive timeline of my academic degrees, professional training programs, and specialized certifications.
          </p>
        </motion.div>

        {/* Education Timeline */}
        <div className="relative w-full md:ml-22 max-w-4xl mt-4 md:mt-8">
          {/* Center Timeline Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-primary to-blue-500 transform -translate-x-1/2 rounded-full hidden md:block opacity-20"></div>
          
          <div className="space-y-12 md:space-y-24">
            {educationData.map((edu, index) => {
              const Icon = edu.icon
              // Alternating left-right tree structure for desktop
              const isLeft = index % 2 === 0
              
              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                  className="relative"
                >
                  {/* Timeline Dot (Desktop only) */}
                  <div className="hidden md:flex absolute left-1/2 top-10 w-8 h-8 bg-background rounded-full border-4 border-background ring-2 ring-primary transform -translate-x-1/2 z-10 items-center justify-center shadow-sm">
                     <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  </div>

                  {/* Education Card */}
                  <div className={`flex items-center ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-center w-full`}>
                    <div className={`w-full md:w-[calc(50%-3rem)]`}>
                      <motion.div
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                      >
                        <Card className="bg-card/30 backdrop-blur-sm border-border/50 hover:bg-card/60 transition-colors duration-500 relative overflow-hidden h-full rounded-3xl group">
                          {/* Subtle hover glow inside card */}
                          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
                            {/* Enhanced Header */}
                            <motion.div 
                              className={`${getTypeColor(edu.type)} p-5 md:p-6 rounded-2xl ${getTextColor(edu.type)} mb-6 shadow-lg relative overflow-hidden`}
                            >
                              <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
                              <div className={`relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md shrink-0 shadow-inner">
                                  {Icon && <Icon className={`w-6 h-6 md:w-7 md:h-7 ${getTextColor(edu.type)}`} />}
                                </div>
                                <div className={`flex flex-col ${isLeft ? 'md:items-start' : 'md:items-end'} items-start w-full`}>
                                  <Badge variant="secondary" className={`mb-2 bg-white/20 ${getTextColor(edu.type)} hover:bg-white/30 border-none text-xs px-2.5 py-0.5 backdrop-blur-md`}>
                                    {getTypeLabel(edu.type)}
                                  </Badge>
                                  <h3 className={`font-bold text-lg md:text-xl leading-tight ${getTextColor(edu.type)} drop-shadow-sm ${!isLeft ? 'md:text-right' : ''}`}>
                                    {edu.title}
                                  </h3>
                                </div>
                              </div>
                            </motion.div>

                            {/* Enhanced Content */}
                            <div className="space-y-4 flex-grow flex flex-col">
                              <div className={`${isLeft ? 'md:text-left' : 'md:text-right'} text-left`}>
                                <p className="font-bold text-foreground text-lg mb-2">{edu.institution}</p>
                                <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-muted-foreground ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-start`}>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{edu.period}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{edu.location}</span>
                                  </div>
                                </div>
                              </div>

                              <p className={`text-muted-foreground text-sm sm:text-base leading-relaxed flex-grow mt-2 ${isLeft ? 'md:text-left' : 'md:text-right'} text-left`}>
                                {edu.description}
                              </p>

                              {/* Skills */}
                              {edu.skills && edu.skills.length > 0 && (
                                <div className={`flex flex-wrap gap-2 pt-4 ${isLeft ? 'md:justify-start' : 'md:justify-end'} justify-start`}>
                                  {edu.skills.map((skill, skillIndex) => (
                                    <Badge 
                                      key={skillIndex}
                                      variant="outline" 
                                      className="bg-primary/5 text-foreground border-primary/20 hover:border-primary/50 hover:bg-primary/10 transition-colors text-xs px-3 py-1 font-medium"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
