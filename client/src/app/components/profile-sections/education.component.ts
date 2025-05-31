import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Education } from '../../models/profile.model';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="education && education.length > 0">
      <div class="section-header">
        <h3>Education</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let edu of education; let i = index">
          <h4>{{edu.degree}}</h4>
          <p class="institution">{{edu.institution}}, {{edu.location}}</p>
          <p class="duration">{{edu.duration}}</p>
          <p class="cgpa" *ngIf="edu.cgpa">CGPA: {{edu.cgpa}}</p>
        </div>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="education">
              <div *ngFor="let edu of educationFormArray.controls; let i = index" [formGroupName]="i" class="form-array-item">
                <div class="form-array-header">
                  <h4>Education {{i + 1}}</h4>
                  <button type="button" class="remove-button" (click)="removeEducation(i)">✕</button>
                </div>
                <div class="form-group">
                  <label>Institution</label>
                  <input type="text" formControlName="institution">
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" formControlName="location">
                </div>
                <div class="form-group">
                  <label>Degree</label>
                  <input type="text" formControlName="degree">
                </div>
                <div class="form-group">
                  <label>Duration</label>
                  <input type="text" formControlName="duration" placeholder="e.g., Jun 2016 - Sept 2020">
                </div>
                <div class="form-group">
                  <label>CGPA</label>
                  <input type="text" formControlName="cgpa">
                </div>
              </div>
            </div>
            <button type="button" class="btnclass" (click)="addEducation()">+ Add Education</button>

            <div class="button-group">
              <button type="button" class="cancel-button" (click)="closeModal()">Cancel</button>
              <button type="submit" class="button-with-spinner" [disabled]="editForm.invalid || isLoading">
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
export class EducationComponent {
  @Input() education: Education[] = [];
  @Output() educationUpdated = new EventEmitter<Education[]>();

  showModal = false;
  modalTitle = 'Edit Education';
  isLoading = false;
  editForm!: FormGroup;
  currentIndex = -1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      education: this.fb.array([])
    });
  }

  get educationFormArray() {
    return this.editForm.get('education') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Education';
    this.showModal = true;
    this.currentIndex = -1;

    this.educationFormArray.clear();
    if (this.education && this.education.length > 0) {
      this.education.forEach(edu => {
        this.educationFormArray.push(this.createEducationFormGroup(edu));
      });
    } else {
      this.addEducation();
    }
  }

  editEducation(index: number) {
    this.modalTitle = 'Edit Education';
    this.showModal = true;
    this.currentIndex = index;

    this.educationFormArray.clear();
    const edu = this.education[index];
    this.educationFormArray.push(this.createEducationFormGroup(edu));
  }

  createEducationFormGroup(edu?: Education) {
    return this.fb.group({
      institution: [edu?.institution || '', Validators.required],
      location: [edu?.location || '', Validators.required],
      degree: [edu?.degree || '', Validators.required],
      duration: [edu?.duration || '', Validators.required],
      cgpa: [edu?.cgpa || '']
    });
  }

  addEducation() {
    this.educationFormArray.push(this.createEducationFormGroup());
  }

  removeEducation(index: number) {
    this.educationFormArray.removeAt(index);
  }

  closeModal() {
    this.showModal = false;
    this.editForm.reset();
    this.currentIndex = -1;
  }

  saveChanges() {
    if (this.editForm.invalid) {
      return;
    }

    this.isLoading = true;

    let updatedEducation: Education[];

    if (this.currentIndex >= 0) {
      // Editing a single education entry
      updatedEducation = [...this.education];
      updatedEducation[this.currentIndex] = this.educationFormArray.at(0).value;
    } else {
      // Editing all education entries
      updatedEducation = this.educationFormArray.value;
    }

    this.educationUpdated.emit(updatedEducation);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}



