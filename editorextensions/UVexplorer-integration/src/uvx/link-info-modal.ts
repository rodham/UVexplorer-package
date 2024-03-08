import { DeviceLinkEdge } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { UVExplorerClient } from '@uvx/uvx-client';

export class LinkInfoModal extends UVXModal {
    deviceLink: DeviceLinkEdge;

    constructor(client: EditorClient, viewport: Viewport, uvxClient: UVExplorerClient, deviceLink: DeviceLinkEdge) {
        super(client, viewport, uvxClient, 'link-detail');
        this.deviceLink = deviceLink;
    }

    async displayLineDetails() {
        await this.sendMessage({
            action: 'viewLinkDetails',
            linkDetails: JSON.stringify(this.deviceLink)
        });
    }
}
