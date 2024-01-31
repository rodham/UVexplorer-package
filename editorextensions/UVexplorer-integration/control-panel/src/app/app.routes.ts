import { Routes } from '@angular/router';
import { SecondComponent } from './SecondComponent/second.component';
import { FirstComponent } from './FirstComponent/first.component';
import {LoginComponent} from "./login/login.component";

export const routes: Routes = [
  {
    path: 'first',
    component: FirstComponent
  },
  {
    path: 'second',
    component: SecondComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];
