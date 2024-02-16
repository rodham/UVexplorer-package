import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Device } from 'model/uvexplorer-model';
import { devicesFromSerializableDevicesMessage, isSerializableDevicesMessage } from 'model/message';

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
      if (isSerializableDevicesMessage(m.data)) {
        try {
          this.connectedDevices = devicesFromSerializableDevicesMessage(m.data);
          console.log('Modal received devices');
          this.isLoading = false;
        } catch (e) {
          console.log('Error getting devices from serializable devices message', e);
        }
      }
    });
  }

  addDevices() {
    // TODO: be able to select just some devices or filter in some way
    parent.postMessage(
      {
        action: 'selectDevices',
        devices: this.connectedDevices
      },
      '*'
    );
  }
}
