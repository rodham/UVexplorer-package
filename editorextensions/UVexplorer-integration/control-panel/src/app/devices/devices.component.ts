import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    ListDevicesMessage,
    connDeviceGuidsFromListDevMsg,
    devicesFromSerializableDevicesMessage,
    isListDevicesMessage,
    isRelistDevicesMessage
} from 'model/message';
import { Device, DeviceCategoryEntry } from 'model/uvx/device';
import { AgGridAngular } from 'ag-grid-angular';
import { SettingsComponent } from '../settings/settings.component';
import { StaticSelect } from '../static-select/static-select.component';
import { DynamicLayoutSelect } from '../dynamic-layout-select/dl-select.component';

@Component({
    selector: 'app-devices',
    standalone: true,
    imports: [NgIf, NgClass, AgGridAngular, SettingsComponent, FormsModule, DynamicLayoutSelect, StaticSelect],
    templateUrl: './devices.component.html'
})
export class DevicesComponent implements OnChanges {
    @Input() devicesMessage?: ListDevicesMessage;
    devices: Device[] = [];
    preselectedDeviceGuids: string[] = [];
    networkName = '';
    tabSelection = 'man';
    settings = false;

    constructor() {
        // Messages are caught here when the 'Add/Remove Connected Devices' option is selected
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent in devices comp.');
            console.log(e.data);

            if (isListDevicesMessage(e.data)) {
                this.initFromMessage(e.data);
                // Related to hiding/showing components with forward/back functionality
                document.getElementById('devicesComponent')!.style.display = 'block';
                console.log('Received devices in component');
            } else if (isRelistDevicesMessage(e.data)) {
                document.getElementById('devicesComponent')!.style.display = 'block';
            } else {
                console.log('Message did not match correctly');
            }
        });

        if (this.devicesMessage) {
            console.log('Init from message from parent');
            this.initFromMessage(this.devicesMessage);
        }
    }

    ngOnChanges(_changes: SimpleChanges) {
        // When loading the main Network/Devices component, the message has already been received at this point
        if (this.devicesMessage) {
            console.log('Init from message from update');
            this.initFromMessage(this.devicesMessage);
        }
    }

    initFromMessage(message: ListDevicesMessage) {
        this.devices = devicesFromSerializableDevicesMessage(message);
        this.preselectedDeviceGuids = connDeviceGuidsFromListDevMsg(message);
        this.networkName = message.networkName;
    }

    public checkDevicesLength(): boolean {
        return this.devices.length > 0;
    }

    public appendDeviceCategories(categories: DeviceCategoryEntry[]): string {
        let returnString = categories[0].device_category;
        for (let i = 1; i < categories.length; i++) {
            if (categories[i].device_category == '') {
                continue;
            }
            returnString += ', ' + categories[i].device_category;
        }
        return returnString;
    }

    settingsClosed(closed: boolean) {
        if (closed) {
            this.settings = false;
        }
    }

    public changeSettings() {
        parent.postMessage(
            {
                action: 'loadMapSettings'
            },
            '*'
        );

        this.settings = true;
    }

    public relistNetworks() {
        parent.postMessage(
            {
                action: 'relistNetworks'
            },
            '*'
        );

        // TODO: do this in a better way
        document.getElementById('devicesComponent')!.style.display = 'none';
    }

    onTabChange(tab: string) {
        this.tabSelection = tab;
    }
}
