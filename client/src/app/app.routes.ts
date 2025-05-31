import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile.component';
import { HomeComponent } from './components/home.component';
import { ServerWakeUp } from './components/server-wake-up.component';
import { LinkedinCallbackComponent } from './components/linkedin-callback';

export const routes: Routes = [
  {
    path:'profile',
    component : ProfileComponent
  },
  { path: 'linkedin-callback', component: LinkedinCallbackComponent },
  {
    path:'',
    component : HomeComponent,
  },
  {
    path:'health',
    component: ServerWakeUp,
  }
];
