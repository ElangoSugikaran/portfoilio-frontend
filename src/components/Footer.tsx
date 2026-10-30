'use client';

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { HalftoneWordmarkFooter, type FooterColumn, type FooterSocialItem } from '@/components/ui/halftone-wordmark-footer';
import { useThemeStore } from '@/store/theme';
import { useAbout } from '@/hooks/api/useAbout';
import { useSettings } from '@/hooks/api/useSettings';
import { scrollToAnchor } from '@/lib/scroll';
import { SITE_AVATAR, SITE_BRAND, SITE_FULL_NAME, SITE_ROLE, FALLBACK_EMAIL } from '@/lib/brand';

gsap.registerPlugin(ScrollTrigger);

function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function Footer() {
  const navigate = useNavigate();
  const { data: about } = useAbout();
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);

  const footerContainerRef = useRef<HTMLDivElement>(null);
  const footerInnerRef = useRef<HTMLDivElement>(null);
  const copyResetRef = useRef<number | null>(null);

  const roleTitle = about?.title || SITE_ROLE;
  const avatarUrl = settings?.brandLogo?.url?.trim() || SITE_AVATAR;
  const email = about?.email || FALLBACK_EMAIL;
  const currentYear = new Date().getFullYear();
  const [emailCopied, setEmailCopied] = React.useState(false);

  React.useEffect(
    () => () => {
      if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
    },
    []
  );

  // Calculate responsive radius based on viewport width
  const [responsiveRadius, setResponsiveRadius] = React.useState(120);
  React.useEffect(() => {
    const updateRadius = () => {
      // Clamp between 90px (mobile min) and 200px, scale with width (12% of width)
      const vw = window.innerWidth;
      const calc = Math.max(90, Math.min(200, vw * 0.12));
      setResponsiveRadius(calc);
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  // Gentle reveal parallax effect between Contact section and Footer
  useGSAP(
    () => {
      if (!footerContainerRef.current || !footerInnerRef.current) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reducedMotion) return;

      gsap.fromTo(
        footerInnerRef.current,
        { y: -60, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footerContainerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
          },
        }
      );
    },
    { scope: footerContainerRef }
  );

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
      return;
    }

    e.preventDefault();
    if (window.location.pathname !== '/' && window.location.pathname !== '/home') {
      navigate(`/${href}`);
      return;
    }

    window.history.pushState(null, '', href);
    scrollToAnchor(href);
  };

  const copyEmail = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    let copied = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch {
        copied = false;
      }
      document.body.removeChild(textarea);
    }

    if (!copied) {
      window.location.href = `mailto:${email}`;
      return;
    }

    setEmailCopied(true);
    if (copyResetRef.current) window.clearTimeout(copyResetRef.current);
    copyResetRef.current = window.setTimeout(() => setEmailCopied(false), 2000);
  };

  // Social links (focused on professional developer profiles, no phone)
  const socials: FooterSocialItem[] = [
    {
      icon: <GithubIcon />,
      href: 'https://github.com/ElangoSugikaran',
      label: 'GitHub',
    },
    {
      icon: <LinkedinIcon />,
      href: 'https://linkedin.com/in/elango-sugikaran',
      label: 'LinkedIn',
    },
    {
      icon: emailCopied ? <CheckIcon /> : <MailIcon />,
      href: `mailto:${email}`,
      label: emailCopied ? 'Email copied' : 'Copy email',
      onClick: copyEmail,
    },
  ];

  // Curated, clutter-free navigation columns
  const columns: FooterColumn[] = [
    {
      title: 'Navigation',
      links: [
        { label: 'Home', href: '#hero', onClick: (e) => handleLinkClick(e, '#hero') },
        { label: 'About', href: '#about', onClick: (e) => handleLinkClick(e, '#about') },
        { label: 'Experience', href: '#experience', onClick: (e) => handleLinkClick(e, '#experience') },
        { label: 'Projects', href: '#projects', onClick: (e) => handleLinkClick(e, '#projects') },
        { label: 'Contact', href: '#contact', onClick: (e) => handleLinkClick(e, '#contact') },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Skills', href: '#skills', onClick: (e) => handleLinkClick(e, '#skills') },
        { label: 'Education', href: '#education', onClick: (e) => handleLinkClick(e, '#education') },
        { label: 'Certifications', href: '#certifications', onClick: (e) => handleLinkClick(e, '#certifications') },
        { label: 'Project Archive', href: '/projects', onClick: (e) => handleLinkClick(e, '/projects') },
      ],
    },
  ];

  // Palette adaptation with cyan/blue brand colors (no orange)
  const isDark = resolvedTheme === 'dark';
  const palette = isDark
    ? {
        background: '#131313',
        ink: '#94a3b8',
        warm: '#60a5fa',
      }
    : {
        background: '#ffffff',
        ink: '#475569',
        warm: '#2563eb',
      };

  return (
    <div
      ref={footerContainerRef}
      className="relative w-full overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3.5rem] md:rounded-t-[4rem] border-t border-border/50 shadow-[0_-16px_40px_-10px_rgba(0,0,0,0.06)] dark:shadow-[0_-16px_40px_-10px_rgba(0,0,0,0.4)] bg-white dark:bg-[#131313] mt-12 sm:mt-16 md:mt-20"
    >
      {/* Decorative top border gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500/25 to-transparent pointer-events-none z-20" />
      {/* Ambient top glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-500/3 dark:bg-blue-400/5 rounded-full blur-3xl pointer-events-none z-10" />

      <div ref={footerInnerRef} className="will-change-transform">
        <HalftoneWordmarkFooter
          wordmark="sugikaran"
          avatarUrl={avatarUrl}
          avatarFallbackUrl={SITE_AVATAR}
          avatarLoading={isSettingsLoading}
          label={SITE_BRAND}
          meta={`${roleTitle}`}
          description="Building responsive web applications and scalable backends with React, Node.js and TypeScript."
          socials={socials}
          columns={columns}
          copyright={`© ${currentYear} ${SITE_FULL_NAME}. All rights reserved.`}
          credit="Designed & built by me ✨"
          preset={isDark ? 'night' : 'paper'}
          palette={palette}
          dotGap={6}
          radius={responsiveRadius}
          sensitivity={1.6}
          crop={0.2}
          grain={0.25}
          height="auto"
        />
      </div>
    </div>
  );
}
