import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Project } from '../../models/profile.model';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="projects && projects.length > 0">
      <div class="section-header">
        <h3>Projects</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let project of projects; let i = index">
          <h4>{{project.name}}</h4>
          <p>{{project.description}}</p>
          <div class="tools-container">
            <span class="tool-tag" *ngFor="let tool of project.tools">{{tool}}</span>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="projects">
              <div *ngFor="let project of projectsFormArray.controls; let i = index" [formGroupName]="i" class="form-array-item">
                <div class="form-array-header">
                  <h4>Project {{i + 1}}</h4>
                  <button type="button" class="remove-button" (click)="removeProject(i)">✕</button>
                </div>
                <div class="form-group">
                  <label>Name</label>
                  <input type="text" formControlName="name">
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea formControlName="description" rows="3"></textarea>
                </div>
                <label>Tools</label>
                <div formArrayName="tools">
                  <div *ngFor="let tool of getToolsArray(i).controls; let j = index" class="form-group tool-item">
                    <input type="text" [formControlName]="j" placeholder="Enter tool or technology">
                    <button type="button" class="remove-small-button" (click)="removeTool(i, j)">✕</button>
                  </div>
                </div>
                <button type="button" class="add-small-button" (click)="addTool(i)">+ Add Tool</button>
              </div>
            </div>
            <button type="button" class="btnclass" (click)="addProject()">+ Add Project</button>

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
export class ProjectsComponent {
  @Input() projects: Project[] = [];
  @Output() projectsUpdated = new EventEmitter<Project[]>();

  showModal = false;
  modalTitle = 'Edit Projects';
  isLoading = false;
  editForm!: FormGroup;
  currentIndex = -1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      projects: this.fb.array([])
    });
  }

  get projectsFormArray() {
    return this.editForm.get('projects') as FormArray;
  }

  getToolsArray(index: number) {
    return this.projectsFormArray.at(index).get('tools') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Projects';
    this.showModal = true;
    this.currentIndex = -1;

    this.projectsFormArray.clear();
    if (this.projects && this.projects.length > 0) {
      this.projects.forEach(project => {
        this.projectsFormArray.push(this.createProjectFormGroup(project));
      });
    } else {
      this.addProject();
    }
  }

  editProject(index: number) {
    this.modalTitle = 'Edit Project';
    this.showModal = true;
    this.currentIndex = index;

    this.projectsFormArray.clear();
    const project = this.projects[index];
    this.projectsFormArray.push(this.createProjectFormGroup(project));
  }

  createProjectFormGroup(project?: Project) {
    return this.fb.group({
      name: [project?.name || '', Validators.required],
      description: [project?.description || '', Validators.required],
      tools: this.fb.array(
        project?.tools?.map(tool => this.fb.control(tool, Validators.required)) || []
      )
    });
  }

  addProject() {
    this.projectsFormArray.push(this.createProjectFormGroup());
    this.addTool(this.projectsFormArray.length - 1);
  }

  removeProject(index: number) {
    this.projectsFormArray.removeAt(index);
  }

  addTool(projectIndex: number) {
    const toolsArray = this.getToolsArray(projectIndex);
    toolsArray.push(this.fb.control('', Validators.required));
  }

  removeTool(projectIndex: number, toolIndex: number) {
    const toolsArray = this.getToolsArray(projectIndex);
    toolsArray.removeAt(toolIndex);
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

    let updatedProjects: Project[];

    if (this.currentIndex >= 0) {
      // Editing a single project
      updatedProjects = [...this.projects];
      updatedProjects[this.currentIndex] = {
        ...this.projectsFormArray.at(0).value,
        tools: this.getToolsArray(0).value.filter((tool: string) => tool.trim() !== '')
      };
    } else {
      // Editing all projects
      updatedProjects = this.projectsFormArray.value.map((project: Project) => ({
        ...project,
        tools: project.tools.filter((tool: string) => tool.trim() !== '')
      }));
    }

    this.projectsUpdated.emit(updatedProjects);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}



