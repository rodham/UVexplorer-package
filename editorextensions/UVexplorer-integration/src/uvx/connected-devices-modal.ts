import { EditorClient, JsonSerializable, Viewport } from 'lucid-extension-sdk';
import { UVXModal } from './uvx-modal';
import { ConnectedDevicesRequest, NetworkRequest } from 'model/uvexplorer-model';
import { isSelectedDevicesMessage } from 'model/message';
import { drawBlocks, drawLinks } from '@blocks/block-utils';
import {Data} from "src/data/data";

export class ConnectedDevicesModal extends UVXModal {
    viewport: Viewport;
    deviceGuids: string[];

    constructor(client: EditorClient, viewport: Viewport, deviceGuids: string[]) {
        super(client, 'devices');
        this.viewport = viewport;
        this.deviceGuids = deviceGuids;
    }

    async loadConnectedDevices() {
        // TODO: make api call to get connected devices assuming there will be some function to get network guid for me
        // const networkGuid = '82ec3a03-4653-43e2-8363-995b93af5227';
        const pageId = this.viewport.getCurrentPage()?.id;
        if (!pageId) throw Error('No page id found');
        const data = Data.getInstance(this.client);
        const networkGuid = data.getNetworkForPage(pageId);
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvexplorerClient.loadNetwork(this.serverUrl, this.sessionGuid, networkRequest);
        // now make api call to get connected devices
        const connectedDevicesRequest = new ConnectedDevicesRequest(this.deviceGuids);
        const devices = await this.uvexplorerClient.listConnectedDevices(
            this.serverUrl,
            this.sessionGuid,
            connectedDevicesRequest
        );
        console.log('Devices to send to modal', devices);
        await this.sendMessage({
            action: 'listDevices',
            devices: JSON.stringify(devices)
        });
        console.log('Done sending message');
    }

    protected async messageFromFrame(message: JsonSerializable) {
        console.log('Received message from child', message);
        if (isSelectedDevicesMessage(message)) {
            console.log('Message was of addDevices type');
            // TODO: get topo map with device guids from message
            // TODO: add the devices to the doc
            // const deviceGuids = message.devices;
            const devices = message.devices;
            const newDeviceGuids: string[] = devices.map((d) => d.guid);
            const topoMapGuids = newDeviceGuids.concat(this.deviceGuids);
            console.log('Device guids for topo map', topoMapGuids);
            const topoMap = await this.loadTopoMap(topoMapGuids);
            if (topoMap !== undefined) {
                console.log('Topomap res', topoMap);
                await drawBlocks(this.client, this.viewport, devices, topoMap.deviceNodes);
                drawLinks(this.client, this.viewport, topoMap.deviceLinks);
            } else {
                console.error('Could not load topo map data.');
            }
            await this.closeSession();
            this.hide();
        }
    }
}
