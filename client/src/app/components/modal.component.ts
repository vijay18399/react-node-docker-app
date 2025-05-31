import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  template: `
    <div class="modal">
      <ng-content></ng-content>
    </div>
  `,
 styles: `
 :host {
   position: fixed;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   background-color: rgba(0, 0, 0, 0.4);
   display: flex;
   align-items: center;
   justify-content: center;
   z-index: 1000;
 }

 .modal {
  width: 90%;
  max-width: 455px;
  overflow-y: scroll;
  height: 85vh;
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
 }

 /* Animation for smooth appearance */
 @keyframes fadeInScale {
   from {
     opacity: 0;
     transform: scale(0.95);
   }
   to {
     opacity: 1;
     transform: scale(1);
   }
 }
 `

})
export class ModalComponent {

}
