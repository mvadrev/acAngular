import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { EditEntryComponent } from './edit-entry/edit-entry.component';
import { ModalComponent } from './components/modal/modal.component';

export const routes: Routes = [
  {
    path: 'landing-component',
    component: LandingComponent,
  },
  {
    path: 'update-course/:id',
    component: EditEntryComponent,
  },

  {
    path: 'modal',
    component: ModalComponent,
  },
];
