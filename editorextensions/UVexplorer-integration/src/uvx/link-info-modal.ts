import { UVXModal } from './uvx-modal';
import { EditorClient } from 'lucid-extension-sdk';
import { DocumentClient } from 'src/doc/document-client';
import { UVExplorerClient } from '@uvx/uvx-client';
import { DataClient } from '@data/data-client';
import { DisplayEdge } from 'model/uvx/display-edge';

export class LinkInfoModal extends UVXModal {
    displayEdge: DisplayEdge;

    constructor(
        client: EditorClient,
        docEditor: DocumentClient,
        uvxClient: UVExplorerClient,
        data: DataClient,
        displayEdge: DisplayEdge
    ) {
        super(client, docEditor, uvxClient, data, 'link-detail');
        this.displayEdge = displayEdge;
    }

    async sendLineDetails() {
        await this.sendMessage({
            action: 'viewLinkDetails',
            linkDetails: JSON.stringify(this.displayEdge)
        });
    }
}
