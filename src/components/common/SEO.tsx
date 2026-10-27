import { useEffect } from 'react';
import { useSettings } from '@/hooks/api/useSettings';
import { useAbout } from '@/hooks/api/useAbout';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEO = ({ title, description, image }: SEOProps) => {
  const { data: about } = useAbout();
  const { data: settings } = useSettings();

  useEffect(() => {
    const ownerName = about?.fullName || settings?.ownerName || 'Elango Sugikaran';
    const roleTitle = about?.title || settings?.roles?.[0] || 'Full Stack Developer';

    const siteTitle =
      title ||
      settings?.seoTitle ||
      (ownerName ? `${ownerName} | ${roleTitle}` : 'Sugikaran | Full Stack Developer');

    const siteDescription =
      description ||
      settings?.seoDescription ||
      about?.tagline ||
      settings?.heroIntro ||
      about?.bio?.slice(0, 160) ||
      'Full Stack Developer specialized in scalable architectures and modern web apps.';

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

    const img = image || about?.avatar?.url || settings?.profileImage?.url;
    if (img) {
      updateMeta('og:image', img, true);
      updateMeta('twitter:image', img);
    }
  }, [title, description, image, about, settings]);

  return null;
};
