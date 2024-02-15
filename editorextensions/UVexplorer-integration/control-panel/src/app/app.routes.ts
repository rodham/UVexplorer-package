import { Routes } from '@angular/router';
import { NetworksComponent } from './networks/networks.component';
import { ConnectedDevicesComponent } from './ConnectedDevices/connectedDevices.component';

export const routes: Routes = [
  {
    path: 'networks',
    component: NetworksComponent
  },
  {
    path: 'connected-devices',
    component: ConnectedDevicesComponent
  }
];
