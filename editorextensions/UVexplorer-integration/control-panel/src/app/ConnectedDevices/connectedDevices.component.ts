import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Device, isDevice } from 'model/uvexplorer-model';
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
      console.log('Received message from parent', m);
      if (!m.data) throw Error();
      if (typeof m.data !== 'object') {
        console.log("Message data wasn't object");
        throw Error();
      }
      if (isListConnectedDevicesMessage(m.data)) {
        const devices: unknown = JSON.parse(m.data.devices);
        if (Array.isArray(devices) && devices.every((d) => isDevice(d))) {
          this.connectedDevices = devices as Device[];
          console.log('Modal received devices');
          this.isLoading = false;
        } else {
          console.log("Devices wasn't array of devices");
        }
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
