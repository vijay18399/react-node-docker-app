import { User } from './../../models/profile.model';

export class Template3 {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  getLatexFromUserObj() {
    // Creative and fun LaTeX resume template
    return `\\documentclass{article}
\\usepackage{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{titlesec}
\\usepackage{fontawesome5}
\\usepackage{fancyhdr}
\\usepackage{amssymb}  % Added for symbols like \\rhd

\\definecolor{primary}{RGB}{142, 68, 173}
\\definecolor{secondary}{RGB}{243, 156, 18}
\\definecolor{accent}{RGB}{26, 188, 156}
\\definecolor{light}{RGB}{236, 240, 241}

\\geometry{a4paper, margin=0.75in}
\\hypersetup{colorlinks=true, linkcolor=primary, urlcolor=primary}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\fancyfoot[C]{\\thepage}

\\titleformat{\\section}{\\Large\\bfseries\\color{primary}}{}{0em}{\\faIcon{star} }
\\titlespacing*{\\section}{0pt}{12pt}{8pt}

\\begin{document}

\\begin{center}
  {\\LARGE\\textbf{\\textcolor{primary}{${this.user.name || ''}}}}\\\\[0.3cm]
  \\textcolor{secondary}{\\faEnvelope} ${this.user.email || ''}
  ${this.user.phone ? ' \\textcolor{secondary}{\\faPhone} ' + this.user.phone : ''}\\\\
  ${this.user.portfolio ? '\\textcolor{secondary}{\\faGlobe} \\href{' + this.user.portfolio + '}{Portfolio}' : ''}
  ${this.user.linkedin ? ' \\textcolor{secondary}{\\faLinkedin} \\href{' + this.user.linkedin + '}{LinkedIn}' : ''}
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

    return `\\section*{\\faUser\\ Professional Summary}
\\begin{quote}
\\textit{${this.user.professional_summary}}
\\end{quote}
\\vspace{0.5cm}
`;
  }

  private generateExperience() {
    if (!this.user.experience || this.user.experience.length === 0) return '';

    let latex = `\\section*{\\faBriefcase\\ Experience}
\\begin{itemize}[leftmargin=*]
`;

    this.user.experience.forEach(exp => {
      latex += `\\item \\textbf{\\textcolor{secondary}{${exp.title}}} at \\textbf{${exp.company}}
      \\\\\\textit{${exp.location} (${exp.start_date} - ${exp.end_date})}
      \\begin{itemize}[label={\\textcolor{accent}{$\\triangleright$}}]
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

    let latex = `\\section*{\\faGraduationCap\\ Education}
\\begin{itemize}[leftmargin=*]
`;

    this.user.education.forEach(edu => {
      latex += `\\item \\textbf{\\textcolor{secondary}{${edu.degree}}}
      \\\\\\textit{${edu.institution}, ${edu.location} (${edu.duration})}
      \\begin{itemize}[label={\\textcolor{accent}{$\\triangleright$}}]
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

    return `\\section*{\\faTools\\ Skills}
\\begin{center}
\\fcolorbox{accent}{light}{\\parbox{0.9\\textwidth}{
\\centering
${this.user.skills.join(' $\\bullet$ ')}
}}
\\end{center}
\\vspace{0.5cm}
`;
  }

  private generateProjects() {
    if (!this.user.projects || this.user.projects.length === 0) return '';

    let latex = `\\section*{\\faLaptopCode\\ Projects}
\\begin{itemize}[leftmargin=*]
`;

    this.user.projects.forEach(proj => {
      latex += `\\item \\textbf{\\textcolor{secondary}{${proj.name}}}: ${proj.description}
      \\begin{itemize}[label={\\textcolor{accent}{$\\triangleright$}}]
        \\item \\textbf{Tools:} ${proj.tools.join(', ')}
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

    let latex = `\\section*{\\faBook\\ Publications}
\\begin{itemize}[leftmargin=*]
`;

    this.user.publications.forEach(pub => {
      latex += `\\item \\textcolor{secondary}{"${pub.title}"}, ${pub.authors.join(', ')}, \\textit{${pub.journal}}, ${pub.date}, pp. ${pub.pages}, ISSN: ${pub.issn}
`;
    });

    latex += `\\end{itemize}
\\vspace{0.5cm}
`;

    return latex;
  }

  private generateCertifications() {
    if (!this.user.certifications || this.user.certifications.length === 0) return '';

    let latex = `\\section*{\\faMedal\\ Certifications}
\\begin{itemize}[leftmargin=*,label={\\textcolor{accent}{$\\triangleright$}}]
`;

    this.user.certifications.forEach(cert => {
      latex += `\\item ${cert}\n`;
    });

    latex += `\\end{itemize}
`;

    return latex;
  }
}
