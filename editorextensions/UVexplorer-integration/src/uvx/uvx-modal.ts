import { EditorClient, Modal, Viewport } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvx-client';
import { drawMap, getDeviceFromBlock, isNetworkDeviceBlock } from '@blocks/block-utils';
import { createTopoMapRequest, TopoMap } from 'model/uvexplorer-topomap-model';
import { Device } from 'model/uvexplorer-devices-model';

export abstract class UVXModal extends Modal {
    protected viewport: Viewport;
    protected uvexplorerClient: UVExplorerClient;
    protected serverUrl = '';
    protected apiKey = '';
    protected sessionGuid = '';

    constructor(client: EditorClient, viewport: Viewport, path: string) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: `http://localhost:4200/${path}`
        });

        this.viewport = viewport;
        this.uvexplorerClient = new UVExplorerClient(client);
    }

    public async configureSetting(setting: string) {
        let settings = await this.client.getPackageSettings();
        if (!settings.get(setting)) {
            if (await this.client.canEditPackageSettings()) {
                await this.client.alert(
                    `You have not configured the ${setting}. You will now be prompted to complete that configuration.`
                );
                await this.client.showPackageSettingsModal();
                settings = await this.client.getPackageSettings();
                if (!settings.get(setting)) {
                    return;
                }
            } else {
                await this.client.alert(
                    `Your account has not configured the ${setting}. Talk with your Lucid account administrator to complete configuration.`
                );
            }
        }
    }

    public async loadSettings() {
        const settings = await this.client.getPackageSettings();
        const apiKey = settings.get('apiKey');
        const serverUrl = settings.get('serverUrl');

        if (typeof apiKey == 'string' && typeof serverUrl == 'string') {
            this.apiKey = apiKey;
            this.serverUrl = serverUrl;
        }
    }

    async openSession() {
        try {
            this.sessionGuid = await this.uvexplorerClient.openSession(this.serverUrl, this.apiKey);
            console.log(`Successfully opened a session: ${this.sessionGuid}`);
        } catch (e) {
            console.error(e);
        }
    }

    async closeSession() {
        try {
            await this.uvexplorerClient.closeSession(this.serverUrl, this.sessionGuid);
            console.log(`Successfully closed the session.`);
        } catch (e) {
            console.error(e);
        }
    }

    async loadTopoMap(deviceGuids: string[]): Promise<TopoMap | undefined> {
        try {
            const topoMapRequest = createTopoMapRequest(deviceGuids);
            return await this.uvexplorerClient.getTopoMap(this.serverUrl, this.sessionGuid, topoMapRequest);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async drawDevices(devices: Device[], removeDevices?: string[]): Promise<void> {
        const pageItems = this.viewport.getCurrentPage()?.allBlocks;
        // TODO: only delete device connection lines not all lines
        const lines = this.viewport.getCurrentPage()?.allLines;
        if (lines) {
            for (const [, line] of lines) {
                line.delete();
            }
        }
        const deviceGuids = devices.map((d) => d.guid);
        if (pageItems) {
            for (const [, item] of pageItems) {
                if (isNetworkDeviceBlock(item)) {
                    const deviceItem = getDeviceFromBlock(item);
                    if (!deviceItem) continue;
                    item.delete();
                    if (
                        !deviceGuids.includes(deviceItem.guid) &&
                        !(removeDevices && removeDevices.includes(deviceItem.guid))
                    ) {
                        devices.push(deviceItem);
                        deviceGuids.push(deviceItem.guid);
                    }
                }
            }
        }
        const topoMap = await this.loadTopoMap(deviceGuids);
        if (topoMap !== undefined) {
            console.log("Timer started");
            const startTime = new Date();
            await drawMap(this.client, this.viewport, topoMap.deviceNodes, topoMap.deviceLinks);
            const endTime = new Date();
            console.log("Timer ended");
            const elapsedTime = endTime.getTime() - startTime.getTime();
            console.log(`Elapsed time: ${elapsedTime} milliseconds`);
        } else {
            console.error('Could not load topo map data.');
        }
    }
}
