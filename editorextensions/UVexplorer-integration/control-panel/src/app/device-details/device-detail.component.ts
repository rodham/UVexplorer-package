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

/*
 * This controls the page that displays data about the selected device
 */
export class DeviceDetailComponent {
    device?: Device;
    deviceDetails?: DeviceDetailsResponse;
    selectedTab = 'System';

    /*
     * Creates an event listener to extract the device details and display it to the user
     */
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
