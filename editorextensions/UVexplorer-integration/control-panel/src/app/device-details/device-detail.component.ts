import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Device, DeviceDetailsResponse } from 'model/uvx/device';
import { deviceDetailsFromMessage, deviceFromSerializableDeviceMessage, isDeviceDetailsMessage } from 'model/message';

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

            if (isDeviceDetailsMessage(e.data)) {
                this.device = deviceFromSerializableDeviceMessage(e.data);
                this.deviceDetails = deviceDetailsFromMessage(e.data);
            }
        });
    }
}
