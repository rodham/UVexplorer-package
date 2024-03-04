import { Component } from '@angular/core';
import { isLinkDetailsMessage, linkFromSerializableLinkMessage } from 'model/message';
import { DeviceLinkEdge } from 'model/uvx/device';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';

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
}
