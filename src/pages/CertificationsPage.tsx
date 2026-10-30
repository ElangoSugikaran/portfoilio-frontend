import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, GraduationCap, ShieldCheck, ExternalLink, Calendar, X, Landmark, Maximize2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCertificates } from '@/hooks/api/useCertificates';
import { formatDate } from '@/lib/date';
import { SEO } from '@/components/common/SEO';
import { QueryState } from '@/components/common/QueryState';
import type { ApiCertificate } from '@/types/api';

export default function CertificationsPage() {
  const { category = 'primary' } = useParams<{ category: string }>();
  const { data: certificates = [], isLoading, isError, error, refetch } = useCertificates();
  const [previewCert, setPreviewCert] = useState<ApiCertificate | null>(null);

  // Determine active category from route param
  const isDigital = category.toLowerCase() === 'e-certifications' || category.toLowerCase() === 'digital';
  const activeCategory = isDigital ? 'DIGITAL' : 'ACADEMIC';

  const { academicCerts, digitalCerts } = useMemo(() => {
    return {
      academicCerts: certificates.filter(c => c.category === 'ACADEMIC'),
      digitalCerts: certificates.filter(c => c.category === 'DIGITAL')
    };
  }, [certificates]);

  const currentList = activeCategory === 'ACADEMIC' ? academicCerts : digitalCerts;

  // Handle ESC key to close preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewCert(null);
      }
    };
    if (previewCert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [previewCert]);

  const pageMeta = activeCategory === 'ACADEMIC'
    ? {
        title: 'Primary Certifications',
        badge: 'Academic & Degree Credentials',
        icon: GraduationCap,
        description: 'Formal academic degrees, higher national diplomas, and university-recognized achievements representing foundational education excellence.',
        emptyMessage: 'No primary academic certificates have been published yet.'
      }
    : {
        title: 'E-Certifications',
        badge: 'Professional & Digital Credentials',
        icon: ShieldCheck,
        description: 'Professional online certifications, cloud credentials, and specialized domain training programs from industry-leading platforms.',
        emptyMessage: 'No digital e-certifications have been published yet.'
      };

  const PageIcon = pageMeta.icon;

  return (
    <div data-ambient="certifications" className="min-h-screen pt-24 pb-36 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <SEO
        title={`${pageMeta.title} | Sugikaran`}
        description={pageMeta.description}
      />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
        
        {/* Clean, Majestic Header Section (No Back Button, No Accent Line, No Switcher Pills) */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          {/* Category Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest w-fit font-mono">
            <PageIcon className="w-3.5 h-3.5" />
            {pageMeta.badge}
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
            {activeCategory === 'ACADEMIC' ? (
              <>
                Primary <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">Certifications</span>
              </>
            ) : (
              <>
                E-<span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">Certifications</span>
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mt-1">
            {pageMeta.description}
          </p>
        </motion.div>

        {/* Certificates Showcase Grid with QueryState */}
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={currentList}
          onRetry={() => refetch()}
          emptyTitle="No credentials in this category"
          emptyMessage={pageMeta.emptyMessage}
          loadingComponent={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-card/40 border border-border/40 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentList.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="group relative flex flex-col bg-card/80 dark:bg-zinc-900/80 backdrop-blur-md border border-border/60 hover:border-primary/40 rounded-3xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Full Document Canvas Viewport */}
                <div
                  className="relative w-full h-64 sm:h-72 bg-muted/30 dark:bg-zinc-950/60 p-4 flex items-center justify-center overflow-hidden border-b border-border/40 cursor-pointer select-none"
                  onClick={() => setPreviewCert(cert)}
                  title="Click to view full certificate"
                >
                  {/* Subtle document canvas backdrop grid */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
                    style={{
                      backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {cert.image?.url ? (
                    <div className="relative h-full w-full flex items-center justify-center">
                      <img
                        src={cert.image.url}
                        alt={cert.title}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain rounded-md shadow-md border border-border/30 group-hover:scale-[1.03] transition-transform duration-500"
                      />

                      {/* Interactive Hover Pill */}
                      <div className="absolute inset-0 bg-background/50 dark:bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-xs transition-opacity duration-300 flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-xs shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <Maximize2 className="w-3.5 h-3.5" />
                          View Full Certificate
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Award className="w-14 h-14 text-primary/40 mb-2" />
                      <span className="text-xs font-mono">Verified Credential</span>
                    </div>
                  )}
                </div>

                {/* Card Information Details */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {cert.category === 'ACADEMIC' ? 'Academic' : 'Digital'}
                      </span>
                      {cert.issuedAt && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
                          <Calendar className="w-3 h-3 text-primary/80 shrink-0" />
                          <span>{formatDate(cert.issuedAt)}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {cert.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Landmark className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
                      <span className="line-clamp-1">{cert.issuer}</span>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewCert(cert)}
                      className="text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 -ml-2 h-8 px-2.5 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Inspect View
                    </Button>

                    {cert.credentialUrl ? (
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold h-8 px-3 rounded-lg border-border/60 hover:border-primary/40 hover:text-primary gap-1.5"
                      >
                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                          Verify
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-muted-foreground/75 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </QueryState>
      </div>

      {/* High-Resolution Certificate Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCert(null)}
              className="absolute inset-0 bg-background/85 dark:bg-black/90 backdrop-blur-md"
            />

            {/* Modal Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92dvh]"
            >
              {/* Modal Top Bar */}
              <div className="flex items-start justify-between p-5 sm:p-6 border-b border-border/50 bg-muted/20 gap-4 shrink-0">
                <div className="space-y-1 pr-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 font-mono">
                    {previewCert.category === 'ACADEMIC' ? 'Academic Degree / Diploma' : 'Digital Professional Credential'}
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground leading-snug">
                    {previewCert.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                    <Landmark className="w-3.5 h-3.5 shrink-0 text-muted-foreground/80" />
                    <span>{previewCert.issuer}</span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewCert(null)}
                  className="rounded-full shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Body: Crisp Document Presentation */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex items-center justify-center bg-zinc-950/40 min-h-[300px]">
                {previewCert.image?.url ? (
                  <div className="relative max-h-[62vh] w-full flex items-center justify-center rounded-xl overflow-hidden">
                    <img
                      src={previewCert.image.url}
                      alt={previewCert.title}
                      className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-2xl border border-border/30 bg-background"
                    />
                  </div>
                ) : (
                  <div className="py-20 text-muted-foreground text-center">
                    <Award className="w-20 h-20 mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-sm">No certificate document image is available.</p>
                  </div>
                )}
              </div>

              {/* Modal Footer Controls */}
              <div className="p-4 sm:p-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 bg-muted/20 shrink-0">
                <div>
                  {previewCert.issuedAt && (
                    <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      Issued: {formatDate(previewCert.issuedAt, 'MMMM yyyy')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 ml-auto">
                  {previewCert.image?.url && (
                    <Button asChild variant="outline" size="sm" className="rounded-xl h-9 text-xs gap-1.5">
                      <a href={previewCert.image.url} target="_blank" rel="noopener noreferrer">
                        Open Full Image
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}

                  {previewCert.credentialUrl && (
                    <Button asChild size="sm" className="rounded-xl h-9 text-xs gap-1.5">
                      <a href={previewCert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify Credential
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewCert(null)}
                    className="rounded-xl h-9 text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
