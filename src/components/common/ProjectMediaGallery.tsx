import { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, Maximize2, X, ChevronLeft, ChevronRight, FileImage, Layers, ExternalLink } from 'lucide-react';
import { lockPageScroll, unlockPageScroll } from '@/lib/scroll';
import type { ProjectMediaLink } from '@/types/api';

interface ProjectMediaGalleryProps {
  media: ProjectMediaLink[];
  projectTitle: string;
}

export function ProjectMediaGallery({ media, projectTitle }: ProjectMediaGalleryProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Sort media by sortOrder
  const sortedMedia = useMemo(() => {
    return [...media].sort((a, b) => a.sortOrder - b.sortOrder);
  }, [media]);

  // Extract unique groups/roles for filter tabs
  const groupsWithCounts = useMemo(() => {
    const groupMap = new Map<string, number>();

    for (const item of sortedMedia) {
      const g = item.group?.trim() || (item.role === 'DIAGRAM' ? 'Architecture & Diagrams' : 'Screenshots');
      groupMap.set(g, (groupMap.get(g) || 0) + 1);
    }

    const list: { id: string; label: string; count: number }[] = [
      { id: 'all', label: 'All Media', count: sortedMedia.length }
    ];

    for (const [name, count] of groupMap.entries()) {
      list.push({ id: name, label: name, count });
    }

    return list;
  }, [sortedMedia]);

  // Filter media based on tab selection
  const filteredMedia = useMemo(() => {
    if (selectedGroup === 'all') return sortedMedia;
    return sortedMedia.filter((item) => {
      const g = item.group?.trim() || (item.role === 'DIAGRAM' ? 'Architecture & Diagrams' : 'Screenshots');
      return g === selectedGroup;
    });
  }, [sortedMedia, selectedGroup]);

  // Lightbox navigation handlers
  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const handleCloseLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const handlePrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredMedia.length - 1));
  }, [lightboxIndex, filteredMedia.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! < filteredMedia.length - 1 ? prev! + 1 : 0));
  }, [lightboxIndex, filteredMedia.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    lockPageScroll();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      unlockPageScroll();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, handleCloseLightbox, handlePrev, handleNext]);

  if (!sortedMedia || sortedMedia.length === 0) {
    return null;
  }

  const activeLightboxItem = lightboxIndex !== null ? filteredMedia[lightboxIndex] : null;

  return (
    <div className="p-8 sm:p-10 rounded-3xl bg-card border border-border/50 space-y-7 shadow-sm">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Images className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-bold text-foreground">Visual Showcase & Architecture</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                {sortedMedia.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              High-resolution interface screenshots, system designs, and structural diagrams.
            </p>
          </div>
        </div>

        {/* Group Filter Pills if multiple groups exist */}
        {groupsWithCounts.length > 2 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {groupsWithCounts.map((g) => {
              const isActive = selectedGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(g.id);
                    setLightboxIndex(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/40'
                  }`}
                >
                  {g.label} ({g.count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((item, index) => {
          const imageUrl = item.media?.url;
          if (!imageUrl) return null;

          const isDiagram = item.role === 'DIAGRAM' || item.group?.toLowerCase().includes('diagram');

          return (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              onClick={() => handleOpenLightbox(index)}
              className="group relative rounded-2xl border border-border/60 bg-muted/15 hover:border-primary/50 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col"
            >
              {/* Media Image Container */}
              <div className="aspect-16/10 relative overflow-hidden bg-black/20 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={item.caption || `${projectTitle} visual ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Role Pill Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-black/70 text-white/95 backdrop-blur-md border border-white/15 flex items-center gap-1 shadow-sm">
                    {isDiagram ? (
                      <>
                        <Layers className="w-3 h-3 text-sky-400" />
                        <span>Diagram</span>
                      </>
                    ) : (
                      <>
                        <FileImage className="w-3 h-3 text-emerald-400" />
                        <span>Screenshot</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Hover Maximize Overlay Icon */}
                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-2xl bg-background/90 text-foreground flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Caption Footer */}
              {item.caption && (
                <div className="p-3.5 bg-card/90 border-t border-border/40 flex flex-col justify-center">
                  <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.caption}
                  </p>
                  {item.group && (
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-0.5">
                      {item.group}
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Fullscreen Lightbox Modal (Portaled to document.body at z-[100] to cleanly cover Navbar) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {lightboxIndex !== null && activeLightboxItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[100] flex flex-col justify-between p-3 sm:p-6 bg-black/95 backdrop-blur-2xl select-none"
            >
              {/* Lightbox Top Control Bar */}
              <div className="flex items-center justify-between gap-4 z-20 pb-2">
                {/* Left: Counter & Group / Role Badge */}
                <div className="flex items-center gap-2.5">
                  <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase bg-white/10 text-white/95 border border-white/20 backdrop-blur-md shadow-xs">
                    {lightboxIndex + 1} / {filteredMedia.length}
                  </span>
                  <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono text-white/80 uppercase tracking-wider bg-white/5 border border-white/10 backdrop-blur-md hidden sm:inline-block">
                    {activeLightboxItem.group || (activeLightboxItem.role === 'DIAGRAM' ? 'Architecture Diagram' : 'Screenshot')}
                  </span>
                </div>

                {/* Right: Actions (Open Full Size & Close with ESC Key) */}
                <div className="flex items-center gap-2.5">
                  {activeLightboxItem.media?.url && (
                    <a
                      href={activeLightboxItem.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 text-xs font-medium transition-colors border border-white/15"
                      title="Open full resolution image in new tab"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="hidden md:inline">Open Full Size</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleCloseLightbox}
                    className="h-10 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center gap-2 text-xs font-medium transition-all cursor-pointer border border-white/20 hover:scale-105 active:scale-95 shadow-md"
                    aria-label="Close fullscreen preview"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline font-mono text-[11px] opacity-80 bg-white/15 px-1.5 py-0.5 rounded">ESC</span>
                  </button>
                </div>
              </div>

              {/* Lightbox Center Content with Prev / Next */}
              <div className="relative flex-1 flex items-center justify-center p-2 sm:p-4 overflow-hidden min-h-0">
                {/* Previous Image Button */}
                {filteredMedia.length > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-6 z-20 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                {/* Main Image with Zoom Transition */}
                <motion.div
                  key={activeLightboxItem.id || lightboxIndex}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={activeLightboxItem.media?.url}
                    alt={activeLightboxItem.caption || projectTitle}
                    className="max-w-full max-h-[66vh] sm:max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                  />
                </motion.div>

                {/* Next Image Button */}
                {filteredMedia.length > 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-6 z-20 w-12 h-12 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-2xl"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Lightbox Bottom Section: Dedicated Full Title/Caption Card & Thumbnails */}
              <div className="z-20 flex flex-col items-center gap-3 pt-2">
                {/* Full Caption Bar (Never truncated, full text proudly displayed!) */}
                <div className="max-w-3xl w-full text-center px-5 py-3 rounded-2xl bg-black/70 border border-white/15 backdrop-blur-md shadow-lg">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-wide">
                    {activeLightboxItem.caption || projectTitle}
                  </h3>
                  {activeLightboxItem.group && (
                    <p className="text-[11px] font-mono text-white/60 uppercase tracking-widest mt-0.5">
                      {activeLightboxItem.group}
                    </p>
                  )}
                </div>

                {/* Lightbox Bottom Strip: Thumbnail Previews */}
                {filteredMedia.length > 1 && (
                  <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-1 px-4">
                    {filteredMedia.map((thumbItem, idx) => {
                      const isThumbActive = idx === lightboxIndex;
                      return (
                        <button
                          key={thumbItem.id || idx}
                          type="button"
                          onClick={() => setLightboxIndex(idx)}
                          className={`relative w-14 h-10 sm:w-18 sm:h-12 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                            isThumbActive
                              ? 'border-primary ring-2 ring-primary/60 scale-105 shadow-lg'
                              : 'border-white/20 opacity-40 hover:opacity-100 hover:border-white/40'
                          }`}
                        >
                          <img
                            src={thumbItem.media?.url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
