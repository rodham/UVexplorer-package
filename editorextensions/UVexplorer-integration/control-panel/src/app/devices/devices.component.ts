import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { isListDevicesMessage } from '../../../../model/message';
import { Device } from '../../../../model/uvexplorer-model';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {
  devices: Device[] = [];
  selectedDevices: Device[] = [];

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);
      if (isListDevicesMessage(e.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.devices = JSON.parse(e.data.devices)
        console.log("Received devices in component");
      }
    });
  }

  protected toggleDeviceSelect(device: Device) {
    if (this.selectedDevices.includes(device)) {
      const index = this.selectedDevices.findIndex(obj => obj === device);
      this.selectedDevices.splice(index, 1);
      return;
    }

    this.selectedDevices.push(device);
  }

  protected selectDevices() {
    parent.postMessage({
      action: 'selectDevices',
      devices: JSON.stringify(this.selectedDevices)
    }, '*');
  }
}
