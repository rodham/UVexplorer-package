import { EditorClient, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';

export class ConnectedDevicesModal extends UVXModal {
    viewport: Viewport;
    deviceGuids: string[];

    constructor(client: EditorClient, viewport: Viewport, deviceGuids: string[]) {
        super(client);
        this.viewport = viewport;
        this.deviceGuids = deviceGuids;
    }

    async loadConnectedDevices() {
        // TODO: make api call to get connected devices
    }
}
