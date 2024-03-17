import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Device } from 'model/uvx/device';

@Component({
    selector: 'dl-select',
    standalone: true,
    imports: [NgIf, NgFor, FormsModule],
    templateUrl: './dl-select.component.html'
})
export class DynamicLayoutSelect implements OnChanges {
    @Input() devices: Device[] = [];
    deviceCategories?: Map<string, string[]>;
    drawerSelection = 'devCat';

    private getDeviceCategories(devices: Device[]) {
        const deviceCategories = new Map<string, string[]>();
        for (const device of devices) {
            const entries = device.device_categories.entries;
            if (!entries) continue;
            for (const entry of entries) {
                const cat = entry.device_category;
                let catDevices = deviceCategories.get(cat);
                if (catDevices) {
                    catDevices.push(device.guid);
                } else {
                    catDevices = [device.guid];
                }
                deviceCategories.set(cat, catDevices);
            }
        }
        return deviceCategories;
    }

    protected compVisible(compName: string) {
        return this.drawerSelection === compName;
    }

    ngOnChanges(_changes: SimpleChanges) {
        this.deviceCategories = this.getDeviceCategories(this.devices);
    }
}
