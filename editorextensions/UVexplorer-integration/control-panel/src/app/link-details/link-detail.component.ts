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
    COLUMNS = ['Device', 'IF Index', 'IF Name', 'Conn Device', 'Conn IF Index', 'Conn IF Name', 'Link Type'];
    displayEdge?: DisplayEdge;
    numMembers = 0;

    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent.');
            console.log(e.data);

            if (isLinkDetailsMessage(e.data)) {
                this.displayEdge = linkFromSerializableLinkMessage(e.data);
                this.displayEdge.deviceLinks.forEach((link) => {
                    this.numMembers += link.linkMembers.length;
                });
            }
        });
    }
}
