import { Routes } from '@angular/router';
import { NetworksComponent } from './networks/networks.component';
import { DevicesComponent } from './devices/devices.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
  {
    path: 'networks',
    component: NetworksComponent
  },
  {
    path: 'devices',
    component: DevicesComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];
