import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/profile.model';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="profile-header">
      <div class="profile-card card">
        <span class="edit-button" (click)="openEditModal('basic')">✎</span>
        <img class="profile-image" [src]="user.avatar || 'https://via.placeholder.com/150'" alt="Profile Image">
        <div class="profile-info">
          <h2>{{user.name}}</h2>
          <p>{{user.email}}</p>
          <p *ngIf="user.phone">{{user.phone}}</p>
          <div class="links">
            <a *ngIf="user.portfolio" [href]="user.portfolio" target="_blank">Portfolio</a>
            <a *ngIf="user.linkedin" [href]="user.linkedin" target="_blank">LinkedIn</a>
          </div>
        </div>
      </div>
      <div class="card" *ngIf="user.professional_summary">
        <span class="edit-button" (click)="openEditModal('summary')">✎</span>
        <h3>Professional Summary</h3>
        <p>{{user.professional_summary}}</p>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <!-- Basic Info Form -->
            @if(currentSection === 'basic') {
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" formControlName="name">
                <div *ngIf="editForm.get('name')?.invalid && editForm.get('name')?.touched" class="error">
                  Name is required
                </div>
              </div>
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email">
                <div *ngIf="editForm.get('email')?.invalid && editForm.get('email')?.touched" class="error">
                  Valid email is required
                </div>
              </div>
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" formControlName="phone">
              </div>
              <div class="form-group">
                <label for="portfolio">Portfolio URL</label>
                <input type="url" id="portfolio" formControlName="portfolio">
              </div>
              <div class="form-group">
                <label for="linkedin">LinkedIn URL</label>
                <input type="url" id="linkedin" formControlName="linkedin">
              </div>
              <div class="form-group">
                <label for="avatar">Avatar URL</label>
                <input type="url" id="avatar" formControlName="avatar">
              </div>
            }

            <!-- Summary Form -->
            @if(currentSection === 'summary') {
              <div class="form-group">
                <label for="summary">Professional Summary</label>
                <textarea id="summary" formControlName="professional_summary" rows="12"></textarea>
              </div>
            }

            <div class="button-group">
              <button type="button" class="cancel-button" (click)="closeModal()">Cancel</button>
              <button type="submit" class="button-with-spinner" [disabled]="isFormInvalid || isLoading">
                @if(isLoading) {
                  <span class="spinner"></span>
                } @else {
                  Save
                }
              </button>
            </div>
          </form>
        </app-modal>
      }
    </section>
  `
})
export class ProfileHeaderComponent {
  @Input() user!: User;
  @Output() userUpdated = new EventEmitter<Partial<User>>();

  showModal = false;
  currentSection = '';
  modalTitle = '';
  isLoading = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      portfolio: [''],
      linkedin: [''],
      avatar: [''],
      professional_summary: ['']
    });
  }

  openEditModal(section: string) {
    this.currentSection = section;
    this.modalTitle = `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    this.showModal = true;

    if (section === 'basic') {
      this.editForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        portfolio: this.user.portfolio,
        linkedin: this.user.linkedin,
        avatar: this.user.avatar
      });
    } else if (section === 'summary') {
      this.editForm.patchValue({
        professional_summary: this.user.professional_summary
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentSection = '';
    this.editForm.reset();
  }

  get isFormInvalid(){
    if (this.currentSection === 'basic') {
      return this.editForm.get('name')?.invalid || this.editForm.get('email')?.invalid;
    } else if (this.currentSection === 'summary') {
      return false;
    }
    return this.editForm.invalid;
  }

  saveChanges() {
    // For basic section, check validity
    if (this.currentSection === 'basic' && this.editForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Handle different sections
    if (this.currentSection === 'basic') {
      const basicInfo = {
        name: this.editForm.value.name,
        email: this.editForm.value.email,
        phone: this.editForm.value.phone,
        portfolio: this.editForm.value.portfolio,
        linkedin: this.editForm.value.linkedin,
        avatar: this.editForm.value.avatar
      };
      this.userUpdated.emit(basicInfo);
    } else if (this.currentSection === 'summary') {
      const summaryInfo = {
        professional_summary: this.editForm.value.professional_summary
      };
      this.userUpdated.emit(summaryInfo);
    }

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}

