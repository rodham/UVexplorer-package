import { Component, Input } from '@angular/core';
import { Device } from 'model/uvx/device';

@Component({
    selector: 'dl-select',
    templateUrl: './dl-select.component.html'
})
export class DynamicLayoutSelect {
    @Input() devices: Device[] = [];
    deviceCategories: Map<string, string[]> = new Map<string, string[]>();

    private getDeviceCategories() {
        for (const device of this.devices) {
            const entries = device.device_categories.entries;
            if (!entries) continue;
            for (const entry of entries) {
                const cat = entry.device_category;
                let catDevices = this.deviceCategories.get(cat);
                if (catDevices) {
                    catDevices.push(device.guid);
                } else {
                    catDevices = [device.guid];
                }
                this.deviceCategories.set(cat, catDevices);
            }
        }
    }
}
