export interface User {
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  portfolio?: string;
  linkedin?: string;
  professional_summary?: string;
  experience?: Experience[];
  skills?: string[];
  projects?: Project[];
  publications?: Publication[];
  certifications?: string[];
  education?: Education[];
}

export interface Experience {
  company: string;
  location: string;
  title: string;
  start_date: string;
  end_date: string;
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string;
  tools: string[];
}

export interface Publication {
  title: string;
  authors: string[];
  journal: string;
  date: string;
  pages: string;
  issn: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  cgpa: string;
  duration: string;
}
