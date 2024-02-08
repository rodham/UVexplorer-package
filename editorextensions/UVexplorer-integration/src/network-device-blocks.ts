import { EditorClient } from 'lucid-extension-sdk';
import { Device } from '../model/uvexplorer-model';
import { NetworkDeviceBlockModel } from './network-device-block-model';

export class NetworkDeviceBlocks {
    private client: EditorClient;
    private lastId = 0;

    constructor(client: EditorClient) {
        this.client = client;
    }

    private incrementId() {
        this.lastId++;
    }

    private findCategory(deviceTypes: Set<string>) {
        let orderedPrimaryCategories = [
            'net-device',
            'firewall',
            'router',
            'switch',
            'printer',
            'wireless-controller',
            'wireless-ap',
            'virtual-server',
            'virtual-switch',
            'virtual-port-group',
            'ip-phone',
            'ip-phone-manager',
            'server',
            'workstation',
            'windows',
            'windows-server',
            'ip_camera_cctv',
            'virtual-port-group',
            'wireless-client'
        ];

        for (const category of orderedPrimaryCategories) {
            if (deviceTypes.has(category)) {
                return category;
            }
        }

        return "unknown-device";
    }

    public convertDevicesToBlocks(devices: Device[]) {
        let deviceBlocks: NetworkDeviceBlockModel[] = [];

        for(const device of devices) {
            const info_sets = JSON.parse(JSON.stringify(device.info_sets));
            let company = "unknown-make";
            if (info_sets.product_info != undefined) {
                company = info_sets.product_info.vendor;
            }

            const deviceTypes: Set<string> = new Set();
            device["device_categories"]["entries"].forEach(type => {
                deviceTypes.add(type["device_category"]);
            });

            const deviceType = this.findCategory(deviceTypes);

            this.incrementId();
            let newBlock = new NetworkDeviceBlockModel(this.lastId as any as string, this.client, company, deviceType);
            deviceBlocks.push(newBlock);
        }
        
        return deviceBlocks;
    }

    public async drawBlocks(deviceBlocks: NetworkDeviceBlockModel[]) {
        deviceBlocks.forEach(async block => {
            await block.drawBlock();
        });
    }
}