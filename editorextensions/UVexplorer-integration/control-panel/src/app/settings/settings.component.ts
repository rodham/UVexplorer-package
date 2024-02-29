import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { devicesFromSerializableDevicesMessage, isMapSettingsMessage } from 'model/message';
import { Device } from 'model/uvexplorer-devices-model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  devicesLoaded = false;
  devices: string[] = [];

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);

      if (isMapSettingsMessage(e.data)) {
        this.devicesLoaded = true;
        this.devices = e.data.devices;
        console.log('Received devices in settings component');
      }
    });
  }

  public changeSettings() {
    console.log("Changed settings!");

    parent.postMessage(
      {
        action: 'saveMapSettings',
        devices: this.devices,
        data: {}
      },
      '*'
    );

    this.devicesLoaded = false;
  }
}
