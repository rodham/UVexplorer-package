import { DeviceLinkEdge } from 'model/uvx/device';
import { UVXModal } from './uvx-modal';
import { EditorClient } from 'lucid-extension-sdk';
import { DocumentEditor } from 'src/doc/documentEditor';

export class LinkInfoModal extends UVXModal {
    deviceLink: DeviceLinkEdge;

    constructor(client: EditorClient, docEditor: DocumentEditor, deviceLink: DeviceLinkEdge) {
        super(client, docEditor, 'link-detail');
        this.deviceLink = deviceLink;
    }

    async displayLineDetails() {
        await this.sendMessage({
            action: 'viewLinkDetails',
            linkDetails: JSON.stringify(this.deviceLink)
        });
    }
}
