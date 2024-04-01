import { EditorClient, Modal } from 'lucid-extension-sdk';
import { UVExplorerClient } from './uvx-client';
import { NetworkRequest } from 'model/uvx/network';
import {
    createTopoMapRequest,
    defaultDrawSettings,
    defaultImageSettings,
    defaultLayoutSettings,
    DrawSettings,
    ImageSettings,
    LayoutSettings,
    LayoutType,
    TopoMap
} from 'model/uvx/topo-map';
import { DataClient } from '@data/data-client';
import { DocumentClient } from 'src/doc/document-client';
import { DeviceFilter, DeviceListRequest } from 'model/uvx/device';
import { populateMapDisplayEdges } from 'model/uvx/display-edge-set';
export abstract class UVXModal extends Modal {
    protected docClient: DocumentClient;
    protected uvxClient: UVExplorerClient;
    protected dataClient: DataClient;
    protected serverUrl = '';
    protected apiKey = '';
    protected sessionGuid = '';

    protected constructor(
        client: EditorClient,
        docClient: DocumentClient,
        uvxClient: UVExplorerClient,
        dataClient: DataClient,
        path: string
    ) {
        super(client, {
            title: 'UVexplorer',
            width: 800,
            height: 600,
            url: `http://localhost:4200/${path}`
        });

        this.uvxClient = uvxClient;
        this.docClient = docClient;
        this.dataClient = dataClient;
    }

    async closeSession() {
        try {
            await this.uvxClient.closeSession();
            console.log(`Successfully closed the session.`);
        } catch (e) {
            console.error(e);
        }
    }

    async loadPageNetwork() {
        const networkGuid = this.docClient.getPageNetworkGuid();
        if (!networkGuid) {
            console.error('Unable to get networkGuid');
            return;
        }
        const networkRequest = new NetworkRequest(networkGuid);
        await this.uvxClient.loadNetwork(networkRequest);
    }

    // Creates and sends the TopoMapRequest with the desired layout and draw settings
    async loadTopoMap(deviceGuids: string[]): Promise<TopoMap | undefined> {
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        const page = this.docClient.getPageId();
        const data = DataClient.getInstance(this.client);

        let layoutSettings = defaultLayoutSettings;
        let drawSettings = defaultDrawSettings;
        if (page) {
            layoutSettings = data.getLayoutSettings(collection, page);
            drawSettings = data.getDrawSettings(collection, page);
        }

        try {
            const topoMapRequest = createTopoMapRequest(deviceGuids, layoutSettings, drawSettings);

            return await this.uvxClient.getTopoMap(topoMapRequest);
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async drawMap(addDevices: string[], removeDevices?: string[]): Promise<void> {
        let topoMap: TopoMap | undefined = undefined;
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        const page = this.docClient.getPageId();
        if (!page) return;

        const layoutSettings = this.dataClient.getLayoutSettings(collection, page);
        const layoutType = layoutSettings.layoutType;

        const imageSettings = this.dataClient.getImageSettings(collection, page);

        if (layoutType !== LayoutType.Manual) {
            // Auto layout
            // Remove all devices
            const remainDevices = this.docClient.clearMap(removeDevices);
            // Redraw new devices with auto layout
            if (remainDevices.length + addDevices.length > 0) {
                topoMap = await this.loadTopoMap([...addDevices, ...remainDevices]);
            }
        } else {
            // Manual layout
            // Remove only unwanted devices
            if (removeDevices) {
                this.docClient.removeFromMap(removeDevices);
            }

            const blocks = this.docClient.getNetworkDeviceBlockGuids();

            const blocksToAdd: string[] = [];
            for (const newDevice of addDevices) {
                console.log('newDevice - drawMap', newDevice);
                if (!blocks.includes(newDevice)) {
                    blocksToAdd.push(newDevice);
                }
            }

            console.log('new blocks to add', blocksToAdd);

            if (blocksToAdd.length > 0) {
                // Draw only the new devices with manual layout
                topoMap = await this.loadTopoMap(blocksToAdd);
            } else {
                return;
            }
        }

        if (topoMap) {
            populateMapDisplayEdges(topoMap);
            if (topoMap.displayEdges) {
                this.dataClient.saveDisplayEdges(this.dataClient.getNetworkForPage(page), topoMap.displayEdges);
            }
            await this.docClient.drawMap(topoMap, this.client, imageSettings);
        } else {
            console.error('Could not load topo map data.');
        }
    }

    async dynamicDrawMap(deviceFilter: DeviceFilter) {
        const page = this.docClient.getPageId();
        if (!page) return;

        console.log('creating device list request');
        const deviceListRequest: DeviceListRequest = new DeviceListRequest(deviceFilter);
        const devices = await this.uvxClient.listDevices(deviceListRequest);
        console.log('retrieved list of ' + devices.length + ' printers');
        const updatedDeviceGuidsList = devices.map((device) => device.guid);

        console.log('Updated Device Guids List', updatedDeviceGuidsList);

        let deviceGuids = updatedDeviceGuidsList;
        if (this.docClient.getLayoutSettings().layoutType === LayoutType.Manual) {
            console.log('Dynamic Manual layout');
            const previousDeviceGuids = this.docClient.getNetworkDeviceBlockGuids();

            const deviceGuidsNoLongerInNetwork = previousDeviceGuids.filter(
                (oldDevice) => !updatedDeviceGuidsList.includes(oldDevice)
            );
            this.docClient.removeFromMap(deviceGuidsNoLongerInNetwork);

            const newlyAddedDeviceGuids = updatedDeviceGuidsList.filter(
                (device) => !previousDeviceGuids.includes(device)
            );
            deviceGuids = newlyAddedDeviceGuids;
        } else {
            console.log('Dynamic Auto layout');
            this.docClient.clearMap();
        }

        console.log('Dynamic loading topo map');
        const topoMap = await this.loadTopoMap(deviceGuids);
        console.log('Retrieved topo map, retrieving image settings');

        const data = DataClient.getInstance(this.client);
        const collection = data.createOrRetrieveSettingsCollection();

        let imageSettings = defaultImageSettings;
        if (page) {
            imageSettings = data.getImageSettings(collection, page);
        }

        //const settingsCollection = this.dataClient.createOrRetrieveSettingsCollection();
        //const imageSettings = this.dataClient.getImageSettings(settingsCollection, page);
        console.log('retrieved image settings');

        if (topoMap) {
            console.log('Dynamically drawing map');
            await this.docClient.drawMap(topoMap, this.client, imageSettings);
        } else {
            console.log('Dynamic Layout - Unable to load topo map');
        }
    }

    async sendMapSettings(backButton: boolean) {
        const collection = this.dataClient.createOrRetrieveSettingsCollection();
        const page = this.docClient.getPageId();

        let layoutSettings: LayoutSettings = defaultLayoutSettings;
        let drawSettings: DrawSettings = defaultDrawSettings;
        let imageSettings: ImageSettings = defaultImageSettings;

        if (page !== undefined) {
            layoutSettings = this.dataClient.getLayoutSettings(collection, page);
            drawSettings = this.dataClient.getDrawSettings(collection, page);
            imageSettings = this.dataClient.getImageSettings(collection, page);
        }

        try {
            await this.sendMessage({
                action: 'mapSettings',
                drawSettings: JSON.stringify(drawSettings),
                layoutSettings: JSON.stringify(layoutSettings),
                imageSettings: JSON.stringify(imageSettings),
                backButton: backButton
            });
        } catch (e) {
            console.error(e);
        }
    }

    async reloadDevices() {
        try {
            await this.sendMessage({
                action: 'relistDevices'
            });
        } catch (e) {
            console.error(e);
        }
    }
}
