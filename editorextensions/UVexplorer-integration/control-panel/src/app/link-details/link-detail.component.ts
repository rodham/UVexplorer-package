import { Component } from '@angular/core';
import { isLinkDetailsMessage, linkFromSerializableLinkMessage } from 'model/message';
import { DeviceLinkEdge } from 'model/uvx/device';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';
import { Point } from 'lucid-extension-sdk';

@Component({
    selector: 'link-detail',
    standalone: true,
    imports: [NgIf, NgFor, KeyValuePipe],
    templateUrl: './link-detail.component.html'
})
export class LinkDetailComponent {
    deviceLink?: DeviceLinkEdge;

    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent.');
            console.log(e.data);

            if (isLinkDetailsMessage(e.data)) {
                this.deviceLink = linkFromSerializableLinkMessage(e.data);
            }
        });
    }

    displayValue(val: string | number | Point | string[]): string {
        if (typeof val === 'string') {
            return val;
        }
        if (Array.isArray(val)) {
            return val.toString();
        }
        if (typeof val === 'object') {
            return `x: ${val.x}, y: ${val.y}`;
        }
        return val.toString();
    }
}
