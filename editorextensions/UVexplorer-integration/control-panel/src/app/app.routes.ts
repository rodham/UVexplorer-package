import { Routes } from '@angular/router';
import { SecondComponent } from './SecondComponent/second.component';
import { FirstComponent } from './FirstComponent/first.component';
import { NetworksComponent } from './networks/networks.component';
import { ConnectedDevicesComponent } from './ConnectedDevices/connectedDevices.component';

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
    path: 'networks',
    component: NetworksComponent
  },
  {
    path: 'connected-devices',
    component: ConnectedDevicesComponent
  }
];
