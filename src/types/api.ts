export interface MediaItem {
  id: string;
  type: string;
  url: string;
  provider?: string;
  publicId?: string;
  width?: number;
  height?: number;
  alt?: string | null;
}

export interface ProjectPhase {
  id: string;
  projectId?: string;
  name: string;
  tasks: string[];
  startDate?: string | null;
  endDate?: string | null;
  sortOrder: number;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder?: number;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  icon?: string | null;
  showInSkills?: boolean;
  sortOrder?: number;
}

export interface ProjectMediaLink {
  id: string;
  projectId?: string;
  mediaId?: string;
  role: 'SCREENSHOT' | 'DIAGRAM' | 'DEMO';
  group?: string | null;
  caption?: string | null;
  sortOrder: number;
  media: MediaItem;
}

export interface ApiProject {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  githubUrl?: string | null;
  liveUrl?: string | null;
  aim?: string | null;
  objectives: string[];
  features: string[];
  category?: ProjectCategory | null;
  thumbnail?: MediaItem | null;
  technologies: Technology[];
  media: ProjectMediaLink[];
  phases: ProjectPhase[];
}

export interface ProjectListParams {
  feature?: boolean;
  featured?: boolean;
  category?: string;
  page?: number;
  pageSize?: number;
  status?: 'PUBLISHED' | 'DRAFT';
}

export interface ProjectListPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProjectCategoryFilter {
  id: string;
  name: string;
  count: number;
}

export interface ApiProjectList {
  projects: ApiProject[];
  pagination?: ProjectListPagination;
  filters?: {
    total: number;
    categories: ProjectCategoryFilter[];
  };
}

export type SkillCategory =
  | 'FRONTEND'
  | 'BACKEND'
  | 'FRAMEWORK'
  | 'DATABASE'
  | 'CSS_FRAMEWORK'
  | 'DESIGN_TOOL'
  | 'SERVICE'
  | 'TOOL'
  | (string & {});

export interface ApiSkill {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string | null;
  showInSkills?: boolean;
  sortOrder?: number;
}

export interface ApiExperience {
  id: string;
  role: string;
  company: string;
  companyUrl?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  description?: string | null;
  icon?: string | null;
}

export type EducationType =
  | 'DEGREE'
  | 'DIPLOMA'
  | 'CERTIFICATE'
  | 'TRAINING'
  | 'SCHOOL'
  | (string & {});

export interface ApiEducation {
  id: string;
  title: string;
  institution: string;
  type: EducationType;
  startDate: string;
  endDate?: string | null;
  grade?: string | null;
  description?: string | null;
  icon?: string | null;
}

export type CertificateCategory =
  | 'ACADEMIC'
  | 'DIGITAL'
  | (string & {});

export interface ApiCertificate {
  id: string;
  title: string;
  issuer: string;
  category: CertificateCategory;
  issuedAt?: string | null;
  credentialUrl?: string | null;
  image?: MediaItem | null;
}

export interface ApiSettings {
  brandLogo?: ApiAboutMedia | null;
  experienceFallbackText?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface ApiAboutMedia {
  id?: string;
  url: string;
  fileName?: string | null;
  type?: 'image' | 'video' | 'document' | string;
}

export interface ApiAboutSocialLink {
  id?: string;
  platform: string;
  url: string;
  icon?: string;
  active?: boolean;
}

export interface ApiAboutResume {
  downloadUrl: string;
  isPrimary?: boolean;
}

export interface ApiAbout {
  fullName: string;
  title: string;
  titles?: string[];
  tagline?: string | null;
  bio: string;
  location?: string | null;
  email: string;
  phone?: string | null;
  availableForWork: boolean;
  avatar?: ApiAboutMedia | null;
  introMedia?: ApiAboutMedia | null;
  socialLinks: ApiAboutSocialLink[];
  resumes: ApiAboutResume[];
}
