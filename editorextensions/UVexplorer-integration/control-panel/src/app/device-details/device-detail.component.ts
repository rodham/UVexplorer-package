import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Device, DeviceDetailsResponse } from 'model/uvexplorer-model';

@Component({
  selector: 'device-detail',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './device-detail.component.html'
})
export class DeviceDetailComponent {
  device?: Device;
  deviceDetails?: DeviceDetailsResponse;

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);
    });
  }
}
