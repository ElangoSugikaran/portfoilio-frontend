import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, CheckCircle2, Layers, Target, Compass, Sparkles, Building2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isCompanyProject } from '@/lib/project-utils';
import { RenderTechIcon } from '@/lib/tech-icons';
import { RichText } from '@/components/common/RichText';
import { formatDateRange } from '@/lib/date';
import { lockPageScroll, unlockPageScroll } from '@/lib/scroll';
import type { ApiProject } from '@/types/api';

interface ProjectDetailsModalProps {
  project: ApiProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailsModal({ project, isOpen, onClose }: ProjectDetailsModalProps) {
  useEffect(() => {
    if (isOpen) {
      lockPageScroll();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        unlockPageScroll();
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!project || !isOpen || typeof document === 'undefined') return null;

  const isCompany = isCompanyProject(project);

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          data-lenis-prevent
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-border/50 bg-muted/20">
            <div className="flex flex-col gap-1 pr-6">
              <div className="flex items-center gap-3 flex-wrap">
                {isCompany ? (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 flex items-center gap-1.5 font-mono shadow-2xs">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    Company Project · Showcased with Permission
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">
                    {project.category?.name || 'Project'}
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-2">
                {project.title}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full w-10 h-10 shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Modal Content Scrollable Body */}
          <div data-lenis-prevent className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
            {/* Visual Header / Cover Image */}
            {project.thumbnail?.url && (
              <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-inner bg-muted/20">
                <img
                  src={project.thumbnail.url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Tagline / Short Description */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/15">
              <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                {project.shortDescription}
              </p>
            </div>

            {/* Company Project Notice */}
            {isCompany && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/25 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-foreground">
                      Company Project · Authorized Showcase
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Commercial Production
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Company Project. This is a company-owned commercial product that I worked on as a Full Stack Developer. It is showcased here with the company’s authorization. The source code is private and proprietary, so there is no public repository, but I’m happy to walk through the architecture and my contributions on request.
                  </p>
                </div>
              </div>
            )}

            {/* Description / Overview with sanitized RichText */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Project Overview
              </h3>
              <RichText html={project.description} />
            </div>

            {/* Aim */}
            {project.aim && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Aim & Purpose
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.aim}
                </p>
              </div>
            )}

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Compass className="w-4 h-4 text-primary" />
                  Key Objectives
                </h3>
                <ul className="space-y-2">
                  {project.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  Key Features & Modules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-muted/30 border border-border/40 text-xs text-muted-foreground flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifecycle Phases */}
            {project.phases && project.phases.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Execution Phases & Milestones
                </h3>
                <div className="space-y-3">
                  {project.phases.map((phase) => (
                    <div
                      key={phase.id}
                      className="p-4 rounded-2xl bg-muted/20 border border-border/40"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-foreground">{phase.name}</span>
                        {(phase.startDate || phase.endDate) && (
                          <span className="text-[11px] font-mono text-muted-foreground bg-background px-2.5 py-0.5 rounded-md border border-border/50">
                            {formatDateRange(phase.startDate, phase.endDate)}
                          </span>
                        )}
                      </div>
                      {phase.tasks && phase.tasks.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {phase.tasks.map((task, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-[11px] bg-card border border-border text-muted-foreground"
                            >
                              {task}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/50 text-xs font-semibold text-foreground"
                    >
                      <RenderTechIcon name={tech.name} iconKey={tech.icon} className="w-4 h-4 text-primary" />
                      <span>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-border/50 bg-muted/20 flex flex-wrap items-center justify-end gap-3">
            {project.githubUrl ? (
              <Button asChild variant="outline" className="rounded-xl h-11 border-border/60 cursor-pointer">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  View Code
                </a>
              </Button>
            ) : isCompany ? (
              <div 
                className="h-11 px-4 rounded-xl border border-amber-500/25 bg-amber-500/10 text-muted-foreground text-xs font-semibold flex items-center gap-2 select-none"
                title="Source code is private and proprietary to the company"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Private Company Repository</span>
              </div>
            ) : null}
            {project.liveUrl && (
              <Button asChild className="rounded-xl h-11 bg-primary text-primary-foreground font-semibold cursor-pointer">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  Live Preview
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              </Button>
            )}
            <Button variant="ghost" onClick={onClose} className="rounded-xl h-11 cursor-pointer">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
