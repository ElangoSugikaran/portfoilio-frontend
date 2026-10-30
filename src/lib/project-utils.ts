export interface ProjectLike {
  id?: string;
  slug?: string | null;
  title?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
}

/**
 * Identifies company-authorized commercial production projects.
 * Specifically handles Rentzee and Digital Tourism, or any project flagged as commercial/company.
 */
export function isCompanyProject(project?: ProjectLike | null): boolean {
  if (!project) return false;
  const slug = (project.slug || '').toLowerCase();
  const title = (project.title || '').toLowerCase();

  return (
    slug === 'rentzee' ||
    slug === 'digital-tourism' ||
    title.includes('rentzee') ||
    title.includes('digital tourism')
  );
}

export const COMPANY_PROJECT_NOTICE = {
  badge: 'Company Project · Showcased with Permission',
  shortBadge: 'Company Project',
  privateRepoLabel: 'Private Company Repository',
  fullNotice:
    "Company Project. This is a company-owned commercial product that I worked on as a Full Stack Developer. It is showcased here with the company’s authorization. The source code is private and proprietary, so there is no public repository, but I’m happy to walk through the architecture and my contributions on request.",
  shortNotice: 'Company-authorized project. Source code is private. Live site available.',
};

export interface ProjectDisplayInfo {
  title: string;
  tagline: string;
  summary: string;
}

export function formatProjectDisplay(project: {
  title?: string | null;
  slug?: string | null;
  shortDescription?: string | null;
  description?: string | null;
}): ProjectDisplayInfo {
  const rawTitle = (project.title || '').trim();
  const slug = (project.slug || '').toLowerCase();
  let title = rawTitle;
  let tagline = 'Full Stack Web Application';

  if (slug === 'rentzee' || rawTitle.toLowerCase().includes('rentzee')) {
    title = 'Rentzee';
    tagline = 'Multi-Tenant Vehicle Rental Platform';
  } else if (slug === 'digital-tourism' || rawTitle.toLowerCase().includes('digital tourism')) {
    title = 'Digital Tourism';
    tagline = 'Tourism Platform & Backend Architecture Migration';
  } else if (slug.includes('dentassist') || rawTitle.toLowerCase().includes('dentassist')) {
    title = 'DentAssist-LK';
    tagline = 'AI-Powered Dental Appointment Platform';
  } else if (slug.includes('mebius') || rawTitle.toLowerCase().includes('mebius')) {
    title = 'Mebius Store';
    tagline = 'Full-Stack Clothing E-Commerce Platform';
  } else if (slug.includes('crystal') || rawTitle.toLowerCase().includes('crystal vision')) {
    title = 'Crystal Vision';
    tagline = 'Optical Store E-Commerce & Recommendation Engine';
  } else if (rawTitle.includes('—')) {
    const parts = rawTitle.split('—').map((s) => s.trim());
    title = parts[0];
    tagline = parts[1] || tagline;
  } else if (rawTitle.includes(' - ')) {
    const parts = rawTitle.split(' - ').map((s) => s.trim());
    title = parts[0];
    tagline = parts[1] || tagline;
  }

  let summary = '';
  if (project.shortDescription && project.shortDescription.trim()) {
    summary = project.shortDescription.trim();
  } else if (project.description) {
    summary = project.description
      .replace(/<\/(p|div|h\d|li)>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  return { title, tagline, summary };
}

