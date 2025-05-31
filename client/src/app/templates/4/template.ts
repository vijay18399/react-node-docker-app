import { User } from './../../models/profile.model';

export class Template4 {
  user: User;

  constructor(user: User) {
    this.user = user;
  }

  getLatexFromUserObj() {
    return `%-------------------------
% Resume in Latex
% Author : Vijay Reddy Medapati
%------------------------

\\documentclass[letterpaper,11pt]{article}
\\usepackage{multicol}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[pdftex]{hyperref}
\\usepackage{fancyhdr}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.375in}
\\addtolength{\\evensidemargin}{-0.375in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-4pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=*]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

% Define new environments for two-column and one-column entries
\\newenvironment{twocolentry}[1][]{
  \\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
    #1
  \\end{tabular*}
}{}

\\newenvironment{onecolentry}{
  \\begin{tabular*}{\\textwidth}{l}
  \\end{tabular*}
}{}

% Define highlights environment
\\newenvironment{highlights}{
  \\begin{itemize}[leftmargin=*]
}
{\\end{itemize}}

%-------------------------------------------
%%%%%%  CV STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING-----------------
\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\Large ${this.user.name || ''}}} & \\href{mailto:${this.user.email || ''}}{\\textbf{${this.user.email || ''}}} \\\\
  ${this.getJobTitle()} & \\textbf{Mobile:} ${this.user.phone || ''} \\\\
  \\href{${this.user.portfolio || ''}}{\\textbf{Portfolio: ${this.getPortfolioUrl()}}} &
  \\href{${this.user.linkedin || ''}}{\\textbf{LinkedIn: ${this.getLinkedinUrl()}}} \\\\
\\end{tabular*}


%-----------Professional Summary-----------------
\\section{Professional Summary}
 \\resumeItemListStart
${this.user.professional_summary || ''}
      \\resumeItemListEnd

%-----------EXPERIENCE-----------------
\\section{Experience}
  \\resumeSubHeadingListStart
${this.generateExperience()}
  \\resumeSubHeadingListEnd

%--------PROGRAMMING SKILLS------------
\\section{Programming Skills}
\\vspace{-10pt}
\\begin{multicols}{5}
\\setlist[itemize]{noitemsep} % Reduce space between items
\\begin{itemize}
${this.generateSkillsList()}
\\end{itemize}
\\end{multicols}

\\section{Projects}
${this.generateProjects()}

${this.generatePublications()}

\\section{Certifications}
\\resumeItemListStart
${this.generateCertifications()}
\\resumeItemListEnd

%-----------EDUCATION-----------------
\\section{Education}
  \\resumeSubHeadingListStart
${this.generateEducation()}
  \\resumeSubHeadingListEnd

%-------------------------------------------
\\end{document}`;
  }

  private getJobTitle(): string {
    // You can customize this based on user data
    return this.user.experience && this.user.experience.length > 0
      ? this.user.experience[0].title
      : 'Software Engineer';
  }

  private getPortfolioUrl(): string {
    if (!this.user.portfolio) return '';
    return this.user.portfolio.replace(/^https?:\/\//, '');
  }

  private getLinkedinUrl(): string {
    if (!this.user.linkedin) return '';
    return this.user.linkedin.replace(/^https?:\/\//, '');
  }

  private generateExperience(): string {
    if (!this.user.experience || this.user.experience.length === 0) return '';

    let latex = '';

    this.user.experience.forEach(exp => {
      latex += `    \\resumeSubheading
      {${exp.company}}{${exp.location}}
      {${exp.title}}{${exp.start_date} - ${exp.end_date}}

      \\vspace{5pt}

      \\resumeItemListStart
`;

      exp.responsibilities.forEach(resp => {
        latex += `      \\resumeItem{${resp.split(':')[0] || 'Responsibility'}}{${resp.split(':')[1] || resp}}\n`;
      });

      latex += `      \\resumeItemListEnd\n\n`;
    });

    return latex;
  }

  private generateSkillsList(): string {
    if (!this.user.skills || this.user.skills.length === 0) return '';

    let latex = '';
    this.user.skills.forEach(skill => {
      latex += `    \\item ${skill}\n`;
    });

    return latex;
  }

  private generateProjects(): string {
    if (!this.user.projects || this.user.projects.length === 0) return '';

    let latex = '';

    this.user.projects.forEach((proj, index) => {
      latex += `
\\begin{twocolentry}
    \\textbf{{${proj.name}}}
\\end{twocolentry}

\\vspace{0.10 cm}
\\begin{onecolentry}
    \\begin{highlights}
        \\item ${proj.description}
        \\item \\textbf{Tools Used}: ${proj.tools.join(', ')}.
    \\end{highlights}
\\end{onecolentry}

\\vspace{0.2 cm}
`;
    });

    return latex;
  }

  private generatePublications(): string {
    if (!this.user.publications || this.user.publications.length === 0) return '';

    let latex = `\\section{Publications}\n\n`;

    this.user.publications.forEach(pub => {
      latex += `
        \\begin{samepage}
            \\begin{twocolentry}{

            }
                \\textbf{${pub.title} (${pub.date})}
            \\end{twocolentry}

            \\vspace{0.10 cm}
            \\begin{onecolentry}
                \\mbox{\\textbf{\\textit{${this.user.name}}}},
                ${pub.authors.filter(author => author !== this.user.name).map(author => `\\mbox{${author}}`).join(',\n                ')}
                \\vspace{0.10 cm}

        \\{${pub.journal}, Pages ${pub.pages}, ISSN: ${pub.issn}.}
        \\end{onecolentry}
        \\end{samepage}
`;
    });

    return latex;
  }

  private generateCertifications(): string {
    if (!this.user.certifications || this.user.certifications.length === 0) return '';

    let latex = '';

    this.user.certifications.forEach(cert => {
      const parts = cert.split(':');
      const title = parts[0] || 'Certification';
      const description = parts.length > 1 ? parts[1] : cert;

      latex += `\\resumeItem{${title}}{${description}}\n`;
    });

    return latex;
  }

  private generateEducation(): string {
    if (!this.user.education || this.user.education.length === 0) return '';

    let latex = '';

    this.user.education.forEach(edu => {
      latex += `    \\resumeSubheading
      {${edu.institution}}{${edu.location}}
      {${edu.degree},  CGPA: ${edu.cgpa}}{${edu.duration}}
`;
    });

    return latex;
  }
}
