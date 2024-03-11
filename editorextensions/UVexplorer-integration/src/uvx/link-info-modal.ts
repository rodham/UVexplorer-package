import { DeviceLinkEdge } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient } from 'lucid-extension-sdk';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';

export class LinkInfoModal extends UVXModal {
    deviceLink: DeviceLinkEdge;

    constructor(
        client: EditorClient,
        docEditor: DocumentClient,
        uvxClient: UVExplorerClient,
        data: DataClient,
        deviceLink: DeviceLinkEdge
    ) {
        super(client, docEditor, uvxClient, data, 'link-detail');
        this.deviceLink = deviceLink;
    }

    async sendLineDetails() {
        await this.sendMessage({
            action: 'viewLinkDetails',
            linkDetails: JSON.stringify(this.deviceLink)
        });
    }
}
