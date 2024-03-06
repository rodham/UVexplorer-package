import { EditorClient, Viewport } from 'lucid-extension-sdk';

export class ConnectedDevicesModal {
    constructor(
        _client: EditorClient,
        _viewport: Viewport,
        _deviceGuids: string[],
        _visibleConnectedDeviceGuids: string[]
    ) {
        return;
    }

    async loadSettings() {
        return new Promise<void>((resolve) => resolve());
    }

    async openSession() {
        return new Promise<void>((resolve) => resolve());
    }

    async show() {
        return new Promise<void>((resolve) => resolve());
    }

    async loadConnectedDevices() {
        return new Promise<void>((resolve) => resolve());
    }
}
