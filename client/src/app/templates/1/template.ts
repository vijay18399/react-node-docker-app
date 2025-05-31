import { User } from './../../models/profile.model';

export class Template1 {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  getLatexFromUserObj() {
    // Basic LaTeX resume template implementation
    return `\\documentclass{article}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\geometry{a4paper, margin=0.75in}

\\begin{document}

\\begin{center}
  {\\Large\\textbf{${this.user.name || ''}}}\\\\
  ${this.user.email || ''}${this.user.phone ? ' | ' + this.user.phone : ''}\\\\
  ${this.user.portfolio ? '\\href{' + this.user.portfolio + '}{Portfolio}' : ''}
  ${this.user.linkedin ? ' | \\href{' + this.user.linkedin + '}{LinkedIn}' : ''}
\\end{center}

${this.generateSummary()}
${this.generateExperience()}
${this.generateEducation()}
${this.generateSkills()}
${this.generateProjects()}
${this.generatePublications()}
${this.generateCertifications()}

\\end{document}`;
  }

  private generateSummary() {
    if (!this.user.professional_summary) return '';

    return `\\section*{Professional Summary}
${this.user.professional_summary}
\\vspace{0.5cm}
`;
  }

  private generateExperience() {
    if (!this.user.experience || this.user.experience.length === 0) return '';

    let latex = `\\section*{Experience}
\\begin{itemize}[leftmargin=*]
`;

    this.user.experience.forEach(exp => {
      latex += `\\item \\textbf{${exp.title}} at \\textbf{${exp.company}}, ${exp.location} (${exp.start_date} - ${exp.end_date})
      \\begin{itemize}
`;
      exp.responsibilities.forEach(resp => {
        latex += `        \\item ${resp}\n`;
      });
      latex += `      \\end{itemize}
`;
    });

    latex += `\\end{itemize}
\\vspace{0.5cm}
`;

    return latex;
  }

  private generateEducation() {
    if (!this.user.education || this.user.education.length === 0) return '';

    let latex = `\\section*{Education}
\\begin{itemize}[leftmargin=*]
`;

    this.user.education.forEach(edu => {
      latex += `\\item \\textbf{${edu.degree}}, ${edu.institution}, ${edu.location} (${edu.duration})
      \\begin{itemize}
        \\item CGPA: ${edu.cgpa}
      \\end{itemize}
`;
    });

    latex += `\\end{itemize}
\\vspace{0.5cm}
`;

    return latex;
  }

  private generateSkills() {
    if (!this.user.skills || this.user.skills.length === 0) return '';

    return `\\section*{Skills}
${this.user.skills.join(', ')}
\\vspace{0.5cm}
`;
  }

  private generateProjects() {
    if (!this.user.projects || this.user.projects.length === 0) return '';

    let latex = `\\section*{Projects}
\\begin{itemize}[leftmargin=*]
`;

    this.user.projects.forEach(proj => {
      latex += `\\item \\textbf{${proj.name}}: ${proj.description}
      \\begin{itemize}
        \\item Tools: ${proj.tools.join(', ')}
      \\end{itemize}
`;
    });

    latex += `\\end{itemize}
\\vspace{0.5cm}
`;

    return latex;
  }

  private generatePublications() {
    if (!this.user.publications || this.user.publications.length === 0) return '';

    let latex = `\\section*{Publications}
\\begin{itemize}[leftmargin=*]
`;

    this.user.publications.forEach(pub => {
      latex += `\\item "${pub.title}", ${pub.authors.join(', ')}, ${pub.journal}, ${pub.date}, pp. ${pub.pages}, ISSN: ${pub.issn}
`;
    });

    latex += `\\end{itemize}
\\vspace{0.5cm}
`;

    return latex;
  }

  private generateCertifications() {
    if (!this.user.certifications || this.user.certifications.length === 0) return '';

    let latex = `\\section*{Certifications}
\\begin{itemize}[leftmargin=*]
`;

    this.user.certifications.forEach(cert => {
      latex += `\\item ${cert}\n`;
    });

    latex += `\\end{itemize}
`;

    return latex;
  }
}
