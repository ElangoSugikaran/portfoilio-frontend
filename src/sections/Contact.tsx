import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send, MessageSquare } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const GridBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.04 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(var(--foreground) 1px, transparent 1px),
          linear-gradient(90deg, var(--foreground) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 90%)'
      }}
    />
  </div>
)

const ContactInfoCard = ({ 
  icon: Icon, 
  title, 
  details, 
  link, 
  delay 
}: { 
  icon: React.ElementType
  title: string
  details: string
  link?: string
  delay: number 
}) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
          {details}
        </p>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group"
    >
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-2xl hover:bg-card border border-transparent hover:border-border transition-all">
          {content}
        </a>
      ) : (
        <div className="p-4 rounded-2xl hover:bg-card border border-transparent hover:border-border transition-all">
          {content}
        </div>
      )}
    </motion.div>
  )
}

const SocialLink = ({ icon: Icon, href, label, delay }: { icon: React.ElementType, href: string, label: string, delay: number }) => (
  <motion.a
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.3 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all group"
  >
    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
  </motion.a>
)

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 lg:px-24 overflow-hidden scroll-margin-top border-t border-border/30">
      <GridBackground />
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          icon={MessageSquare}
          pillText="Get In Touch"
          highlight="Contact."
          subtitle="Feel free to reach out for collaborations, freelance opportunities, or just a friendly chat."
          title="Let's Connect & "
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left Column: Contact Information */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Contact Information</h3>
              <p className="text-muted-foreground leading-relaxed">
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
            </div>

            <div className="space-y-2 -mx-4">
              <ContactInfoCard
                icon={Mail}
                title="Email Address"
                details="hello@example.com"
                link="mailto:hello@example.com"
                delay={0.1}
              />
              <ContactInfoCard
                icon={Phone}
                title="Phone / WhatsApp"
                details="+94 77 123 4567"
                link="tel:+94771234567"
                delay={0.2}
              />
              <ContactInfoCard
                icon={MapPin}
                title="Location"
                details="Colombo, Sri Lanka"
                delay={0.3}
              />
            </div>

            <div className="pt-8 border-t border-border/50">
              <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Follow Me</h4>
              <div className="flex items-center gap-3">
                <SocialLink icon={GithubIcon} href="https://github.com/yourusername" label="GitHub" delay={0.4} />
                <SocialLink icon={LinkedinIcon} href="https://linkedin.com/in/yourusername" label="LinkedIn" delay={0.5} />
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-3xl p-6 sm:p-8 relative overflow-hidden"
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-6 relative z-10">Send a Message</h3>
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-muted-foreground font-medium">Your Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="bg-background/50 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john@example.com" 
                  className="bg-background/50 border-border focus-visible:ring-primary/20 focus-visible:border-primary h-12 rounded-xl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message" className="text-muted-foreground font-medium">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="How can I help you?" 
                  className="bg-background/50 border-border focus-visible:ring-primary/20 focus-visible:border-primary min-h-30 resize-y rounded-xl"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold gap-2 text-sm">
                Send Message
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
