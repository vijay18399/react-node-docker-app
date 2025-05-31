import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../models/profile.model';
import { profile } from '../data/profile';
import { ProfileHeaderComponent } from './profile-sections/profile-header.component';
import { ProfileService } from '../services/profile.service';
import { EducationComponent } from './profile-sections/education.component';
import { ExperienceComponent } from './profile-sections/experience.component';
import { ProjectsComponent } from './profile-sections/projects.component';
import { SkillsComponent } from './profile-sections/skills.component';
import { PublicationsComponent } from './profile-sections/publications.component';
import { CertificationsComponent } from './profile-sections/certifications.component';
import { ModalComponent } from './modal.component';
import { Template1 } from '../templates/1/template';
import { Template2 } from '../templates/2/template';
import { Template3 } from '../templates/3/template';
import { HttpClient } from '@angular/common/http';
import { Template4 } from '../templates/4/template';

const templateMap: { [key: number]: any } = {
  1: Template1,
  2: Template2,
  3: Template3,
  4:Template4
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    EducationComponent,
    PublicationsComponent,
    CertificationsComponent,
    ModalComponent
  ],
  template: `
    <main>
      <button (click)="openModal()" class="btnclass">Generate Resume</button>
      <app-profile-header [user]="user" (userUpdated)="updateUser($event)"></app-profile-header>

      <!-- Loading indicator -->
      <div *ngIf="isGenerating" class="loading-overlay">
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Generating your resume...</p>
          <p class="loading-note">This may take more than 5 minutes. Please be patient.</p>
        </div>
      </div>

      <app-experience
        [experience]="user.experience ?? []"
        (experienceUpdated)="updateExperience($event)">
      </app-experience>

      <app-skills
        [skills]="user.skills ?? []"
        (skillsUpdated)="updateSkills($event)">
      </app-skills>

      <app-projects
        [projects]="user.projects ?? []"
        (projectsUpdated)="updateProjects($event)">
      </app-projects>

      <app-education
        [education]="user.education ?? []"
        (educationUpdated)="updateEducation($event)">
      </app-education>

      <app-publications
        [publications]="user.publications ?? []"
        (publicationsUpdated)="updatePublications($event)">
      </app-publications>

      <app-certifications
        [certifications]="user.certifications ?? []"
        (certificationsUpdated)="updateCertifications($event)">
      </app-certifications>
      <app-modal *ngIf="showModal">
         <div class="modal-header">
           <h3>Choose a Resume Template</h3>
         </div>
         <div class="templates">
          <div class="template-card">
            <img (click)="selectTemplate(1)" class="template" src="/templates/1.png">
            <p>Classic</p>
          </div>
          <div class="template-card">
            <img (click)="selectTemplate(2)" class="template" src="/templates/2.png">
            <p>Modern</p>
          </div>
          <div class="template-card">
            <img (click)="selectTemplate(3)" class="template" src="/templates/3.png">
            <p>Creative</p>
          </div>
          <div class="template-card">
            <img (click)="selectTemplate(4)" class="template" src="/templates/4.png">
            <p>Professional</p>
          </div>
         </div>
      </app-modal>
    </main>
  `,
  styles: `
    main {
      font-family: Arial, sans-serif;
      max-width: 1000px;
      margin: 10px auto;
      padding: 20px;
    }
    button{
      position: absolute;
      top: 10px;
      right: 100px;
      z-index: 99;
    }
    .templates {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    .template-card {
      text-align: center;
    }
    .template-card p {
      margin-top: 8px;
      font-weight: 500;
      color: #3F51B5;
    }
    .template{
      width: 260px;
      height: 320px;
      border: 1px solid #9E9E9E;
      padding: 2px;
      border-radius: 10px;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .template:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .loading-container {
      background-color: white;
      padding: 30px;
      border-radius: 8px;
      text-align: center;
      max-width: 400px;
    }
    .loading-note {
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      margin: 0 auto 20px;
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3F51B5;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
})
export class ProfileComponent implements OnInit {
  user: any = profile;
  showModal: boolean = false;
  isGenerating: boolean = false;
  constructor(private profileService: ProfileService, private http: HttpClient) {}

  ngOnInit() {
    // Could fetch profile data from a service
    this.profileService.getProfile().subscribe(profile => {
      if (profile) {
        this.user = profile;
      }
    });
  }

  updateUser(userData: Partial<User>) {
    this.user = { ...this.user, ...userData };
    this.saveProfile();
  }

  updateExperience(experience: any[]) {
    this.user = { ...this.user, experience };
    this.saveProfile();
  }

  updateSkills(skills: string[]) {
    this.user = { ...this.user, skills };
    this.saveProfile();
  }

  updateProjects(projects: any[]) {
    this.user = { ...this.user, projects };
    this.saveProfile();
  }

  updateEducation(education: any[]) {
    this.user = { ...this.user, education };
    this.saveProfile();
  }

  updatePublications(publications: any[]) {
    this.user = { ...this.user, publications };
    this.saveProfile();
  }

  updateCertifications(certifications: string[]) {
    this.user = { ...this.user, certifications };
    this.saveProfile();
  }

  private saveProfile() {
    // Save profile data to service/backend
    this.profileService.saveProfile(this.user).subscribe();
  }
  openModal(){
    this.showModal = true;
  }
  selectTemplate(id: number) {
    const templateClass = templateMap[id];
    const templateInc = new templateClass(this.user);
    const latexCode = templateInc.getLatexFromUserObj();
    this.handleGenerate(latexCode);
  }

  async handleGenerate(code: string) {
    try {
      this.isGenerating = true;
      this.showModal = false;
      this.http.post('https://react-node-docker-app.onrender.com/generate-pdf',
        { code },
        { responseType: 'blob' }
      ).subscribe(
        response => {
          this.isGenerating = false;
          const url = window.URL.createObjectURL(new Blob([response]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'resume.pdf');
          document.body.appendChild(link);
          link.click();
        },
        error => {
          this.isGenerating = false;
          console.error("PDF generation failed:", error);
        }
      );
    } catch (error) {
      this.isGenerating = false;
      console.error("PDF generation failed:", error);
    }
  }
}
