import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    ListDevicesMessage,
    connDeviceGuidsFromListDevMsg,
    devFilterFromListDevMsg,
    devicesFromSerializableDevicesMessage,
    isListDevicesMessage,
    isRelistDevicesMessage
} from 'model/message';
import { Device, DeviceCategoryEntry, DeviceFilter } from 'model/uvx/device';
import { AgGridAngular } from 'ag-grid-angular';
import { SettingsComponent } from '../settings/settings.component';
import { DynamicLayoutSelect } from '../dynamic-layout-select/dl-select.component';
import { StaticSelect } from '../static-select/static-select.component';

@Component({
    selector: 'app-devices',
    standalone: true,
    imports: [NgIf, NgClass, AgGridAngular, SettingsComponent, FormsModule, DynamicLayoutSelect, StaticSelect],
    templateUrl: './devices.component.html'
})

/*
 * This component controls the static membership selection
 */
export class DevicesComponent implements OnChanges {
    @Input() devicesMessage?: ListDevicesMessage;
    devices: Device[] = [];
    prevFilter?: DeviceFilter;
    preselectedDeviceGuids: string[] = [];
    networkName = '';
    tabSelection = 'man';
    settings = false;
    backButton = false;

    /*
     * Defines an event listener when messages are sent from the modals
     */
    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent in devices comp.');
            console.log(e.data);

            // 'ListDevices' message is caught here when the 'Add/Remove Connected Devices' option is selected
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
        // 'ListDevices' message was caught in the Network Component
        if (this.devicesMessage) {
            console.log('Init from message from update');
            this.initFromMessage(this.devicesMessage);
        }
    }

    /*
     * devices is the list of all devices and the preselectedDeviceGuids is devices that were already on the map
     */
    initFromMessage(message: ListDevicesMessage) {
        this.devices = devicesFromSerializableDevicesMessage(message);
        this.preselectedDeviceGuids = connDeviceGuidsFromListDevMsg(message);
        this.networkName = message.networkName;
        this.backButton = message.backButton;
        if (message.dynSelectFilter) {
            this.prevFilter = devFilterFromListDevMsg(message) ?? undefined;
        }
    }

    public checkDevicesLength(): boolean {
        return this.devices.length > 0;
    }

    /*
     * categories is a list of all DeviceCategoryEntrys a device is associated with. This function then concats
     * those into a nice string to display in the device selection list
     */
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

    /*
     * This is called when the settings component is closed, bringing up the list of devices again
     */
    settingsClosed(closed: boolean) {
        if (closed) {
            this.settings = false;
        }
    }

    /*
     * This notifies the modals to display the map settings then hides the list of devices
     */
    public changeSettings() {
        parent.postMessage(
            {
                action: 'loadMapSettings'
            },
            '*'
        );

        this.settings = true;
    }

    /*
     * This is called when a user confirms the map being affected by selecting another network. It forces a networks list
     * to be displayed again
     */
    public onWarningConfirm() {
        this.relistNetworks();
    }

    /*
     * Sends the message for the networks to be relisted
     */
    public relistNetworks() {
        parent.postMessage(
            {
                action: 'relistNetworks'
            },
            '*'
        );
    }

    /*
     * Called when switching between static membership selection and dynamic membership selection
     */
    onTabChange(tab: string) {
        this.tabSelection = tab;
    }
}
