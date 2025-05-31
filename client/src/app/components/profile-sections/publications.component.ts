import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Publication } from '../../models/profile.model';
import { ModalComponent } from '../modal.component';

@Component({
  selector: 'app-publications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  template: `
    <section class="card-section" *ngIf="publications && publications.length > 0">
      <div class="section-header">
        <h3>Publications</h3>
        <button class="btnclass" (click)="openEditModal()">Edit</button>
      </div>
      <div class="card-container">
        <div class="card" *ngFor="let pub of publications; let i = index">
          <h4>{{pub.title}}</h4>
          <p class="authors">{{pub.authors.join(', ')}}</p>
          <p class="journal">{{pub.journal}}, {{pub.date}}</p>
          <p class="details">Pages: {{pub.pages}} | ISSN: {{pub.issn}}</p>
        </div>
      </div>

      <!-- Edit Modal -->
      @if(showModal) {
        <app-modal>
          <div class="modal-header">
            <h3>{{modalTitle}}</h3>
          </div>
          <form [formGroup]="editForm" (ngSubmit)="saveChanges()">
            <div formArrayName="publications">
              <div *ngFor="let pub of publicationsFormArray.controls; let i = index" [formGroupName]="i" class="form-array-item">
                <div class="form-array-header">
                  <h4>Publication {{i + 1}}</h4>
                  <button type="button" class="remove-button" (click)="removePublication(i)">✕</button>
                </div>
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" formControlName="title">
                </div>
                <div formArrayName="authors">
                  <label>Authors</label>
                  <div *ngFor="let author of getAuthorsArray(i).controls; let j = index" class="form-group author-item">
                    <input type="text" [formControlName]="j" placeholder="Author name">
                    <button type="button" class="remove-small-button" (click)="removeAuthor(i, j)">✕</button>
                  </div>
                </div>
                <button type="button" class="add-small-button" (click)="addAuthor(i)">+ Add Author</button>

                <div class="form-group">
                  <label>Journal</label>
                  <input type="text" formControlName="journal">
                </div>
                <div class="form-group">
                  <label>Date</label>
                  <input type="text" formControlName="date" placeholder="e.g., June 2022">
                </div>
                <div class="form-row">
                  <div class="form-group half">
                    <label>Pages</label>
                    <input type="text" formControlName="pages" placeholder="e.g., 123-145">
                  </div>
                  <div class="form-group half">
                    <label>ISSN</label>
                    <input type="text" formControlName="issn">
                  </div>
                </div>
              </div>
            </div>
            <button type="button" class="btnclass" (click)="addPublication()">+ Add Publication</button>

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
export class PublicationsComponent {
  @Input() publications: Publication[] = [];
  @Output() publicationsUpdated = new EventEmitter<Publication[]>();

  showModal = false;
  modalTitle = 'Edit Publications';
  isLoading = false;
  editForm!: FormGroup;
  currentIndex = -1;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  initializeForm() {
    this.editForm = this.fb.group({
      publications: this.fb.array([])
    });
  }

  get publicationsFormArray() {
    return this.editForm.get('publications') as FormArray;
  }

  getAuthorsArray(pubIndex: number) {
    return this.publicationsFormArray.at(pubIndex).get('authors') as FormArray;
  }

  openEditModal() {
    this.modalTitle = 'Edit Publications';
    this.showModal = true;
    this.currentIndex = -1;

    this.publicationsFormArray.clear();
    if (this.publications && this.publications.length > 0) {
      this.publications.forEach(pub => {
        this.publicationsFormArray.push(this.createPublicationFormGroup(pub));
      });
    } else {
      this.addPublication();
    }
  }

  editPublication(index: number) {
    this.modalTitle = 'Edit Publication';
    this.showModal = true;
    this.currentIndex = index;

    this.publicationsFormArray.clear();
    const pub = this.publications[index];
    this.publicationsFormArray.push(this.createPublicationFormGroup(pub));
  }

  createPublicationFormGroup(pub?: Publication) {
    return this.fb.group({
      title: [pub?.title || '', Validators.required],
      journal: [pub?.journal || '', Validators.required],
      date: [pub?.date || '', Validators.required],
      pages: [pub?.pages || '', Validators.required],
      issn: [pub?.issn || '', Validators.required],
      authors: this.fb.array(
        pub?.authors?.map(author => this.fb.control(author, Validators.required)) ||
        [this.fb.control('', Validators.required)]
      )
    });
  }

  addPublication() {
    this.publicationsFormArray.push(this.createPublicationFormGroup());
  }

  removePublication(index: number) {
    this.publicationsFormArray.removeAt(index);
  }

  addAuthor(pubIndex: number) {
    const authorsArray = this.getAuthorsArray(pubIndex);
    authorsArray.push(this.fb.control('', Validators.required));
  }

  removeAuthor(pubIndex: number, authorIndex: number) {
    const authorsArray = this.getAuthorsArray(pubIndex);
    authorsArray.removeAt(authorIndex);
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

    let updatedPublications: Publication[];

    if (this.currentIndex >= 0) {
      // Editing a single publication entry
      updatedPublications = [...this.publications];
      updatedPublications[this.currentIndex] = {
        ...this.publicationsFormArray.at(0).value,
        authors: this.getAuthorsArray(0).value.filter((author: string) => author.trim() !== '')
      };
    } else {
      // Editing all publication entries
      updatedPublications = this.publicationsFormArray.value.map((pub: Publication) => ({
        ...pub,
        authors: pub.authors.filter((author: string) => author.trim() !== '')
      }));
    }

    this.publicationsUpdated.emit(updatedPublications);

    // Simulate API call
    setTimeout(() => {
      this.closeModal();
      this.isLoading = false;
    }, 1000);
  }
}



