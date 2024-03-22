import { Component } from '@angular/core';
import { isLinkDetailsMessage, linkFromSerializableLinkMessage } from 'model/message';
import { NgFor, NgIf } from '@angular/common';
import { DisplayEdge } from 'model/uvx/display-edge';

@Component({
    selector: 'link-detail',
    standalone: true,
    imports: [NgIf, NgFor],
    templateUrl: './link-detail.component.html'
})
export class LinkDetailComponent {
    displayEdge?: DisplayEdge;

    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent.');
            console.log(e.data);

            if (isLinkDetailsMessage(e.data)) {
                this.displayEdge = linkFromSerializableLinkMessage(e.data);
            }
        });
    }
}
