import { Routes } from '@angular/router';
import { NetworksComponent } from './networks/networks.component';
import { DevicesComponent } from './devices/devices.component';

export const routes: Routes = [
  {
    path: 'networks',
    component: NetworksComponent
  },
  {
    path: 'devices',
    component: DevicesComponent
  }
];
