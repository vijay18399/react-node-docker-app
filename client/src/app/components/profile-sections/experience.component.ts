import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Experience } from '../../models/profile.model';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="experience && experience.length > 0">
      <div class="section-header">
        <h3>Experience</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let exp of experience; let i = index">
          <h4>{{exp.title}} at {{exp.company}}</h4>
          <p class="subtitle">{{exp.location}} | {{exp.start_date}} - {{exp.end_date}}</p>
          <ul>
            <li *ngFor="let resp of exp.responsibilities">{{resp}}</li>
          </ul>
        </div>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="experiences">
              <div *ngFor="let exp of experiencesFormArray.controls; let i = index" [formGroupName]="i" class="form-array-item">
                <div class="form-array-header">
                  <h4>Experience {{i + 1}}</h4>
                  <button type="button" class="remove-button" (click)="removeExperience(i)">✕</button>
                </div>
                <div class="form-group">
                  <label>Company</label>
                  <input type="text" formControlName="company">
                </div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" formControlName="title">
                </div>
                <div class="form-group">
                  <label>Location</label>
                  <input type="text" formControlName="location">
                </div>
                <div class="form-row">
                  <div class="form-group half">
                    <label>Start Date</label>
                    <input type="text" formControlName="start_date" placeholder="e.g., Jan 2020">
                  </div>
                  <div class="form-group half">
                    <label>End Date</label>
                    <input type="text" formControlName="end_date" placeholder="e.g., Present">
                  </div>
                </div>
                <label>Responsibilities</label>
                <div formArrayName="responsibilities">
                  <div *ngFor="let resp of getResponsibilitiesArray(i).controls; let j = index" class="form-group responsibility-item">
                    <input type="text" [formControlName]="j" placeholder="Enter responsibility">
                    <button type="button" class="remove-small-button" (click)="removeResponsibility(i, j)">✕</button>
                  </div>
                </div>
                <button type="button" class="add-small-button" (click)="addResponsibility(i)">+ Add Responsibility</button>
              </div>
            </div>
            <button type="button" class="btnclass" (click)="addExperience()">+ Add Experience</button>

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
export class ExperienceComponent {
  @Input() experience: Experience[] = [];
  @Output() experienceUpdated = new EventEmitter<Experience[]>();

  showModal = false;
  modalTitle = 'Edit Experience';
  isLoading = false;
  editForm!: FormGroup;
  currentIndex = -1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      experiences: this.fb.array([])
    });
  }

  get experiencesFormArray() {
    return this.editForm.get('experiences') as FormArray;
  }

  getResponsibilitiesArray(expIndex: number) {
    return this.experiencesFormArray.at(expIndex).get('responsibilities') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Experience';
    this.showModal = true;
    this.currentIndex = -1;

    this.experiencesFormArray.clear();
    if (this.experience && this.experience.length > 0) {
      this.experience.forEach(exp => {
        this.experiencesFormArray.push(this.createExperienceFormGroup(exp));
      });
    } else {
      this.addExperience();
    }
  }

  editExperience(index: number) {
    this.modalTitle = 'Edit Experience';
    this.showModal = true;
    this.currentIndex = index;

    this.experiencesFormArray.clear();
    const exp = this.experience[index];
    this.experiencesFormArray.push(this.createExperienceFormGroup(exp));
  }

  createExperienceFormGroup(exp?: Experience) {
    return this.fb.group({
      company: [exp?.company || '', Validators.required],
      location: [exp?.location || '', Validators.required],
      title: [exp?.title || '', Validators.required],
      start_date: [exp?.start_date || '', Validators.required],
      end_date: [exp?.end_date || '', Validators.required],
      responsibilities: this.fb.array(
        exp?.responsibilities?.map(resp => this.fb.control(resp, Validators.required)) ||
        [this.fb.control('', Validators.required)]
      )
    });
  }

  addExperience() {
    this.experiencesFormArray.push(this.createExperienceFormGroup());
  }

  removeExperience(index: number) {
    this.experiencesFormArray.removeAt(index);
  }

  addResponsibility(expIndex: number) {
    const responsibilitiesArray = this.getResponsibilitiesArray(expIndex);
    responsibilitiesArray.push(this.fb.control('', Validators.required));
  }

  removeResponsibility(expIndex: number, respIndex: number) {
    const responsibilitiesArray = this.getResponsibilitiesArray(expIndex);
    responsibilitiesArray.removeAt(respIndex);
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

    let updatedExperience: Experience[];

    if (this.currentIndex >= 0) {
      // Editing a single experience entry
      updatedExperience = [...this.experience];
      updatedExperience[this.currentIndex] = {
        ...this.experiencesFormArray.at(0).value,
        responsibilities: this.getResponsibilitiesArray(0).value.filter((resp: string) => resp.trim() !== '')
      };
    } else {
      // Editing all experience entries
      updatedExperience = this.experiencesFormArray.value.map((exp: Experience) => ({
        ...exp,
        responsibilities: exp.responsibilities.filter((resp: string) => resp.trim() !== '')
      }));
    }

    this.experienceUpdated.emit(updatedExperience);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}




