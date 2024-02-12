import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Device } from 'model/uvexplorer-model';
import { isListConnectedDevicesMessage } from 'model/message';

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
    const deviceGuids = this.connectedDevices.map((d) => {
      return d.guid;
    });
    // TODO: be able to select just some devices or filter in some way
    parent.postMessage(
      {
        action: 'addDevices',
        devices: deviceGuids
      },
      '*'
    );
  }
}
