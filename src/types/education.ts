import { GraduationCap, Award, BookOpen } from 'lucide-react'

export interface EducationItem {
  id: number;
  type: 'professional' | 'degree' | 'diploma' | 'certificate' | 'academic';
  title: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  skills: string[];
  icon: any; // Lucide icon
  award?: string;
}

export const educationData: EducationItem[] = [
  {
    id: 1,
    type: 'professional',
    title: 'Full Stack Engineering (MERN)',
    institution: 'STEM Link – Personalized Education Consultancy',
    period: 'Apr 2025 - Jul 2025',
    location: 'Sri Lanka',
    description: '4-month professional training program in MERN stack development with hands-on experience building e-commerce platforms and note management applications.',
    skills: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    icon: GraduationCap
  },
  {
    id: 2,
    type: 'degree',
    title: 'BEng in Software Engineering',
    institution: 'London Metropolitan University (UK)',
    period: '2023 - 2024',
    location: 'Colombo, Sri Lanka',
    description: 'BEng (Hons) in Software Engineering with Lower Second Class Honours from London Metropolitan University.',
    skills: ['Software Engineering', 'Computer Science', 'Programming'],
    icon: Award,
    award: 'Lower Second Class Honours'
  },
  {
    id: 3,
    type: 'diploma',
    title: 'HND in Computing - General',
    institution: 'ESOFT Metro Campus, Wattala',
    period: '2021 - 2023',
    location: 'Wattala, Sri Lanka',
    description: 'BTEC Higher National Diploma in Computing specialized in Software Engineering, assured by Pearson UK Global.',
    skills: ['Computing', 'Software Engineering', 'Programming'],
    icon: BookOpen
  }
]
