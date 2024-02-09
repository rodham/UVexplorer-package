import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Device } from '@model/uvexplorer-model';
import { isListConnectedDevicesMessage } from '@model/message';

@Component({
  selector: 'connected-devices',
  imports: [NgForOf, NgIf],
  standalone: true,
  templateUrl: './connectedDevices.component.html'
})
export class ConnectedDevicesComponent {
  title = 'connectedDevices';
  connectedDevices: Device[] = [];
  isLoading = true;

  constructor() {
    window.addEventListener('message', (m) => {
      console.log('Received message from parent');
      if (!m.data || typeof m.data !== 'string') throw Error();
      const data = JSON.parse(m.data) as object;
      if (isListConnectedDevicesMessage(data)) {
        this.connectedDevices = data.devices;
        this.isLoading = false;
      }
    });
  }

  addDevices() {
    // TODO: add selected connected devices and maybe not pass full device objects in message (maybe guids?)
    parent.postMessage(
      {
        action: 'addDevices',
        devices: this.connectedDevices
      },
      '*'
    );
  }
}
