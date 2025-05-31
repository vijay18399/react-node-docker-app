import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="skills && skills.length > 0">
      <div class="section-header">
        <h3>Skills</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="skills-container">
        <span class="skill-tag" *ngFor="let skill of skills">{{skill}}</span>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="skills">
              <div *ngFor="let skill of skillsFormArray.controls; let i = index" class="form-group skill-item">
                <input type="text" [formControlName]="i" placeholder="Enter skill">
                <button type="button" class="remove-small-button" (click)="removeSkill(i)">✕</button>
              </div>
            </div>
            <button type="button" class="add-small-button" (click)="addSkill()">+ Add Skill</button>

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
export class SkillsComponent {
  @Input() skills: string[] = [];
  @Output() skillsUpdated = new EventEmitter<string[]>();

  showModal = false;
  modalTitle = 'Edit Skills';
  isLoading = false;
  editForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      skills: this.fb.array([])
    });
  }

  get skillsFormArray() {
    return this.editForm.get('skills') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Skills';
    this.showModal = true;

    this.skillsFormArray.clear();
    if (this.skills && this.skills.length > 0) {
      this.skills.forEach(skill => {
        this.skillsFormArray.push(this.fb.control(skill, Validators.required));
      });
    } else {
      this.addSkill();
    }
  }

  addSkill() {
    this.skillsFormArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skillsFormArray.removeAt(index);
  }

  closeModal() {
    this.showModal = false;
    this.editForm.reset();
  }

  saveChanges() {
    if (this.editForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Filter out empty skills
    const updatedSkills = this.skillsFormArray.value.filter((skill: string) => skill.trim() !== '');
    this.skillsUpdated.emit(updatedSkills);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}


