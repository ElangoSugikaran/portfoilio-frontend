import { useEffect } from 'react';
import { useSettings } from '@/hooks/api/useSettings';
import { useAbout } from '@/hooks/api/useAbout';
import { SITE_FULL_NAME, SITE_ROLE } from '@/lib/brand';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEO = ({ title, description, image }: SEOProps) => {
  const { data: about } = useAbout();
  const { data: settings } = useSettings();

  useEffect(() => {
    const ownerName = about?.fullName || SITE_FULL_NAME;
    const roleTitle = about?.title || SITE_ROLE;

    const siteTitle =
      title ||
      settings?.seoTitle ||
      (ownerName ? `${ownerName} | ${roleTitle}` : `Sugikaran | ${SITE_ROLE}`);

    const siteDescription =
      description ||
      settings?.seoDescription ||
      about?.tagline ||
      about?.bio?.slice(0, 160) ||
      `${SITE_ROLE} specialized in scalable architectures and modern web apps.`;

    document.title = siteTitle;

    // Update meta tags safely
    const updateMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const selector = isProperty
        ? `meta[property="${nameOrProperty}"]`
        : `meta[name="${nameOrProperty}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', nameOrProperty);
        } else {
          meta.setAttribute('name', nameOrProperty);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    updateMeta('description', siteDescription);
    updateMeta('og:title', siteTitle, true);
    updateMeta('og:description', siteDescription, true);
    updateMeta('twitter:title', siteTitle);
    updateMeta('twitter:description', siteDescription);

    const img = image || about?.avatar?.url;
    if (img) {
      updateMeta('og:image', img, true);
      updateMeta('twitter:image', img);
    }
  }, [title, description, image, about, settings]);

  return null;
};
