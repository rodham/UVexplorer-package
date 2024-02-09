import { EditorClient } from 'lucid-extension-sdk';
import { Device } from '../../model/uvexplorer-model';
import { NetworkDeviceBlockModel } from './network-device-block-model';

export class NetworkDeviceBlocks {
    private client: EditorClient;
    private nextId = 0;

    constructor(client: EditorClient) {
        this.client = client;
    }

    private incrementId() {
        this.nextId++;
    }

    private findCategory(deviceTypes: Set<string>) {
        const orderedPrimaryCategories = [
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

        return 'unknown-device';
    }

    private getCompany(device: Device) {
        const info_sets = device.info_sets;
        let company = 'unknown-make';
        if (typeof info_sets === 'object' && info_sets !== null) {
            if (
                'product_info' in info_sets &&
                typeof info_sets.product_info === 'object' &&
                info_sets.product_info !== null
            ) {
                if ('vendor' in info_sets.product_info && typeof info_sets.product_info.vendor === 'string') {
                    company = info_sets.product_info.vendor;
                }
            }
        }
        return company;
    }

    private getDeviceType(device: Device) {
        const deviceTypes = new Set<string>();
        device.device_categories.entries.forEach((type) => {
            deviceTypes.add(type.device_category);
        });

        const deviceType = this.findCategory(deviceTypes);
        return deviceType;
    }

    public convertDevicesToBlocks(devices: Device[]) {
        const deviceBlocks: NetworkDeviceBlockModel[] = [];

        for (const device of devices) {
            const company = this.getCompany(device);
            const deviceType = this.getDeviceType(device);

            const newBlock = new NetworkDeviceBlockModel(
                this.nextId as unknown as string,
                this.client,
                company,
                deviceType
            );
            this.incrementId();
            deviceBlocks.push(newBlock);
        }

        return deviceBlocks;
    }

    public async drawBlocks(deviceBlocks: NetworkDeviceBlockModel[]) {
        for (const block of deviceBlocks) {
            await block.drawBlock();
        }
    }
}
