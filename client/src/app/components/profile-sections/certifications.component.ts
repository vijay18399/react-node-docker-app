import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="certifications && certifications.length > 0">
      <div class="section-header">
        <h3>Certifications</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="certifications-container">
        <div class="card" *ngFor="let cert of certifications; let i = index">
          <p>{{cert}}</p>
        </div>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="certifications">
              <div *ngFor="let cert of certificationsFormArray.controls; let i = index" class="form-group cert-item">
                <input type="text" [formControlName]="i" placeholder="Enter certification">
                <button type="button" class="remove-small-button" (click)="removeCertification(i)">✕</button>
              </div>
            </div>
            <button type="button" class="add-small-button" (click)="addCertification()">+ Add Certification</button>

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
export class CertificationsComponent {
  @Input() certifications: string[] = [];
  @Output() certificationsUpdated = new EventEmitter<string[]>();

  showModal = false;
  modalTitle = 'Edit Certifications';
  isLoading = false;
  editForm!: FormGroup;
  currentIndex = -1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      certifications: this.fb.array([])
    });
  }

  get certificationsFormArray() {
    return this.editForm.get('certifications') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Certifications';
    this.showModal = true;
    this.currentIndex = -1;

    this.certificationsFormArray.clear();
    if (this.certifications && this.certifications.length > 0) {
      this.certifications.forEach(cert => {
        this.certificationsFormArray.push(this.fb.control(cert, Validators.required));
      });
    } else {
      this.addCertification();
    }
  }

  editCertification(index: number) {
    this.modalTitle = 'Edit Certification';
    this.showModal = true;
    this.currentIndex = index;

    this.certificationsFormArray.clear();
    const cert = this.certifications[index];
    this.certificationsFormArray.push(this.fb.control(cert, Validators.required));
  }

  addCertification() {
    this.certificationsFormArray.push(this.fb.control('', Validators.required));
  }

  removeCertification(index: number) {
    this.certificationsFormArray.removeAt(index);
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

    let updatedCertifications: string[];

    if (this.currentIndex >= 0) {
      // Editing a single certification
      updatedCertifications = [...this.certifications];
      updatedCertifications[this.currentIndex] = this.certificationsFormArray.at(0).value;
    } else {
      // Editing all certifications
      updatedCertifications = this.certificationsFormArray.value.filter((cert: string) => cert.trim() !== '');
    }

    this.certificationsUpdated.emit(updatedCertifications);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}



