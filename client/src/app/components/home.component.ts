import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="hero-section">
        <h1>Resume Builder</h1>
        <p>Create professional resumes with LaTeX templates in minutes</p>
        <button (click)="navigateToProfile()" class="cta-button">Get Started</button>
        <button (click)="loginWithLinkedIn()" class="linkedin-button">Login with LinkedIn</button>
      </div>

      <div class="features-section">
        <div class="feature-card">
          <h3>Professional Templates</h3>
          <p>Choose from multiple professionally designed LaTeX templates</p>
        </div>
        <div class="feature-card">
          <h3>Easy Editing</h3>
          <p>Simple interface to input your experience, skills, and education</p>
        </div>
        <div class="feature-card">
          <h3>PDF Export</h3>
          <p>Download your resume as a beautifully formatted PDF document</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .hero-section {
      text-align: center;
      padding: 4rem 1rem;
      background-color: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 3rem;
    }

    .hero-section h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #333;
    }

    .hero-section p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      color: #666;
    }

    .cta-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .cta-button:hover {
      background-color: #3a5ce5;
    }

    .linkedin-button {
      background-color: #0077b5;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      font-size: 1.1rem;
      border-radius: 4px;
      cursor: pointer;
      margin-left: 1rem;
      transition: background-color 0.3s;
    }
    .linkedin-button:hover {
      background-color: #005983;
    }

    .features-section {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      justify-content: center;
    }

    .feature-card {
      flex: 1;
      min-width: 250px;
      padding: 1.5rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }

    .feature-card h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .feature-card p {
      color: #666;
    }

    @media (max-width: 768px) {
      .feature-card {
        min-width: 100%;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  loginWithLinkedIn() {
      window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=true&client_id=${
      environment.LINKEDIN_API_KEY}&redirect_uri=${environment.LINKEDIN_REDIRECT_URL}&scope=r_liteprofile%20r_emailaddress`;

  }

  private generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
