import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, GraduationCap, ShieldCheck, ArrowLeft, ExternalLink, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCertificates } from '@/hooks/api/useCertificates';
import { formatDate } from '@/lib/date';
import { SEO } from '@/components/common/SEO';
import { QueryState } from '@/components/common/QueryState';
import type { ApiCertificate } from '@/types/api';

export default function CertificationsPage() {
  const { category = 'primary' } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { data: certificates = [], isLoading, isError, error, refetch } = useCertificates();
  const [previewCert, setPreviewCert] = useState<ApiCertificate | null>(null);

  const activeCategory = category === 'e-certifications' ? 'DIGITAL' : 'ACADEMIC';

  const { academicCerts, digitalCerts } = useMemo(() => {
    return {
      academicCerts: certificates.filter(c => c.category === 'ACADEMIC'),
      digitalCerts: certificates.filter(c => c.category === 'DIGITAL')
    };
  }, [certificates]);

  const currentList = activeCategory === 'ACADEMIC' ? academicCerts : digitalCerts;

  return (
    <div className="min-h-screen bg-background pt-28 pb-36 px-4 sm:px-6 md:px-12 lg:px-24 relative overflow-hidden">
      <SEO
        title={`${activeCategory === 'ACADEMIC' ? 'Primary' : 'E-'} Certifications | Sugikaran`}
        description="Verified technical certifications, diplomas, and academic credentials achieved by Sugikaran."
      />

      {/* Background Gradients */}
      <div className="fixed top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[140px] pointer-events-none mix-blend-screen" />
      <div className="fixed bottom-0 left-0 w-125 h-125 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <Button asChild variant="ghost" className="hover:bg-muted/50 rounded-xl -ml-2 text-muted-foreground hover:text-foreground w-fit">
            <Link to="/#certifications">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-center gap-6">
            <div className="w-16 h-0.5 bg-linear-to-r from-primary to-transparent shrink-0" />
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase">
              {activeCategory === 'ACADEMIC' ? 'Primary ' : 'E-'}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">
                Certifications
              </span>
            </h1>
          </div>

          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl ml-0 md:ml-22">
            {activeCategory === 'ACADEMIC' 
              ? 'Formal degrees, institutional diplomas, and recognized university qualifications.'
              : 'Professional digital certifications, online credentials, and specialized domain training.'
            }
          </p>

          {/* Category Switcher Tabs */}
          <div className="flex items-center gap-3 ml-0 md:ml-22 pt-2">
            <Button
              variant={activeCategory === 'ACADEMIC' ? 'default' : 'outline'}
              onClick={() => navigate('/certifications/primary')}
              className="rounded-full text-xs font-bold uppercase tracking-wider h-10 px-6 gap-2"
            >
              <GraduationCap className="w-4 h-4" />
              Primary Certifications ({academicCerts.length})
            </Button>
            <Button
              variant={activeCategory === 'DIGITAL' ? 'default' : 'outline'}
              onClick={() => navigate('/certifications/e-certifications')}
              className="rounded-full text-xs font-bold uppercase tracking-wider h-10 px-6 gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              E-Certifications ({digitalCerts.length})
            </Button>
          </div>
        </motion.div>

        {/* Certificates Grid with QueryState */}
        <QueryState
          isLoading={isLoading}
          isError={isError}
          error={error}
          data={currentList}
          onRetry={() => refetch()}
          emptyTitle="No credentials in this section"
          emptyMessage="No certificates found under this category at this time."
          loadingComponent={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-72 rounded-3xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentList.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="group relative flex flex-col bg-card border border-border rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
                onClick={() => setPreviewCert(cert)}
              >
                {/* Certificate Image Banner */}
                {cert.image?.url ? (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted/30 border-b border-border/50">
                    <img
                      src={cert.image.url}
                      alt={cert.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-card via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="p-8 border-b border-border/50 flex items-center justify-center bg-muted/20">
                    <Award className="w-16 h-16 text-primary opacity-60" />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {cert.issuer}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                    {cert.issuedAt ? (
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium font-mono">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDate(cert.issuedAt)}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">Verified Credential</span>
                    )}

                    <span className="text-xs font-bold text-primary group-hover:underline flex items-center gap-1">
                      Inspect
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </QueryState>
      </div>

      {/* High-Resolution Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewCert(null)}
              className="absolute inset-0 bg-background/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
                <div className="pr-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                    {previewCert.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2">{previewCert.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{previewCert.issuer}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setPreviewCert(null)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh] flex flex-col items-center">
                {previewCert.image?.url ? (
                  <div className="w-full rounded-2xl overflow-hidden border border-border/50 shadow-md">
                    <img
                      src={previewCert.image.url}
                      alt={previewCert.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="py-20 text-muted-foreground text-center">
                    <Award className="w-20 h-20 mx-auto mb-4 text-primary opacity-50" />
                    <p>No image certificate uploaded.</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-border/50 flex items-center justify-between bg-muted/20">
                {previewCert.issuedAt && (
                  <span className="text-xs text-muted-foreground font-mono">
                    Issued: {formatDate(previewCert.issuedAt, 'MMMM yyyy')}
                  </span>
                )}
                <div className="flex items-center gap-3 ml-auto">
                  {previewCert.credentialUrl && (
                    <Button asChild className="rounded-xl h-10 gap-2">
                      <a href={previewCert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify Credential
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setPreviewCert(null)} className="rounded-xl h-10">
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
