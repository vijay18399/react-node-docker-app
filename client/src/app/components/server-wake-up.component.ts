import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-wake-up',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="server-wake-container">
      <div class="wake-up-card">
        <h2>Waking up the server...</h2>
        <div class="spinner"></div>
        <p>{{ statusMessage }}</p>
        <p class="info-text">Our server is hosted on a free tier and may take up to 30 seconds to wake up from sleep mode.</p>
        <button *ngIf="showRetryButton" (click)="checkServerStatus()" class="retry-button">Retry Connection</button>
      </div>
    </div>
  `,
  styles: `
    .server-wake-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .wake-up-card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      padding: 2rem;
      text-align: center;
      max-width: 500px;
      width: 90%;
    }
    
    h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 50px;
      height: 50px;
      margin: 0 auto 1.5rem auto;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    p {
      color: #666;
      margin-bottom: 1rem;
    }
    
    .info-text {
      font-size: 0.9rem;
      color: #888;
      margin-bottom: 1.5rem;
    }
    
    .retry-button {
      background-color: #4a6cf7;
      color: white;
      border: none;
      padding: 0.7rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .retry-button:hover {
      background-color: #3a5ce5;
    }
  `
})
export class ServerWakeUp implements OnInit {
  statusMessage = 'Checking server status...';
  showRetryButton = false;
  maxRetries = 5;
  currentRetry = 0;
  serverUrl = 'https://react-node-docker-app.onrender.com/health';
  
  constructor(private http: HttpClient, private router: Router) {}
  
  ngOnInit() {
    this.checkServerStatus();
  }
  
  checkServerStatus() {
    this.statusMessage = 'Checking server status...';
    this.showRetryButton = false;
    
    this.http.get(this.serverUrl).subscribe(
      (response: any) => {
        if (response.status === 'ok') {
          this.statusMessage = 'Server is up and running!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        } else {
          this.handleServerDown();
        }
      },
      (error) => {
        this.handleServerDown();
      }
    );
  }
  
  handleServerDown() {
    this.currentRetry++;
    
    if (this.currentRetry < this.maxRetries) {
      this.statusMessage = `Server is still waking up... (Attempt ${this.currentRetry}/${this.maxRetries})`;
      setTimeout(() => {
        this.checkServerStatus();
      }, 5000); // Wait 5 seconds before retrying
    } else {
      this.statusMessage = 'Server is taking longer than expected to respond.';
      this.showRetryButton = true;
    }
  }
}