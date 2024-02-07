import { TopoImageKey } from './TopoImageKey';
import { TopoImageEntry } from './TopoImageEntry';
import { TopoImageMap } from './TopoImageMap';
import { ImageType } from './TopoImageKey';

export class TopoImageLibrary {
    public static findImage(key: TopoImageKey): HTMLImageElement {
        return TopoImageLibrary.instance._findImage(key) ?? new HTMLImageElement();
    }

    public static get isLoaded(): boolean {
        return TopoImageLibrary.instance._isLoaded;
    }

    public static set isLoaded(value: boolean) {
        TopoImageLibrary.instance._isLoaded = value;
    }

    private static _instance: TopoImageLibrary;
    public static get instance(): TopoImageLibrary {
        if (TopoImageLibrary._instance == null) {
            TopoImageLibrary._instance = new TopoImageLibrary();
        }
        return TopoImageLibrary._instance;
    }

    private _isLoaded: boolean = false;
    public systemImages: TopoImageMap;
    public userImages: TopoImageMap;

    constructor() {
        this.systemImages = new TopoImageMap();
        this.userImages = new TopoImageMap();
    }

    public addSystemImage(imageEntry: TopoImageEntry): void {
        this.systemImages.addEntry(imageEntry);
    }

    public addUserImage(imageEntry: TopoImageEntry): void {
        this.userImages.addEntry(imageEntry);
    }

    private _findImage(key: TopoImageKey): HTMLImageElement | null {
        if (key != null) {
            let entry: TopoImageEntry | null = null;

            entry = this.userImages.findEntry(key);
            if (entry != null) return entry.image ?? null;

            entry = this.systemImages.findEntry(key);
            if (entry != null) return entry.image ?? null;
        }

        return null;
    }

    public static userImages: TopoImageEntry[] = [];

    public static images: TopoImageEntry[] = [
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'router'
            },
            fileName: 'router.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'switch'
            },
            fileName: 'switch.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'server'
            },
            fileName: 'server.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'firewall'
            },
            fileName: 'firewall.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'ip-phone'
            },
            fileName: 'phone.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'ip-phone-manager'
            },
            fileName: 'phone-manager.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'ip_camera_cctv'
            },
            fileName: 'ip_camera_cctv.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'windows'
            },
            fileName: 'workstation.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'windows-server'
            },
            fileName: 'server.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'printer'
            },
            fileName: 'printer.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'hub'
            },
            fileName: 'hub.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'wireless-ap'
            },
            fileName: 'wireless-ap.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'wireless-controller'
            },
            fileName: 'wireless-controller.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'workstation'
            },
            fileName: 'workstation.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'net-device'
            },
            fileName: 'network-device.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'wireless-client'
            },
            fileName: 'wireless-client.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'virtual-server'
            },
            fileName: 'server.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'virtual-switch'
            },
            fileName: 'switch.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: 'virtual-port-group'
            },
            fileName: 'virtual-port-group.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Arista Networks'
            },
            fileName: 'arista.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Cisco'
            },
            fileName: 'cisco.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Meraki'
            },
            fileName: 'meraki.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Microsoft'
            },
            fileName: 'microsoft.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Dell'
            },
            fileName: 'dell.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Hewlett Packard'
            },
            fileName: 'hewlett-packard.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'HPN Supply Chain'
            },
            fileName: 'hewlett-packard.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Hirschmann Automation'
            },
            fileName: 'hirschmann.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Hirschmann Automation and Control GmbH'
            },
            fileName: 'hirschmann.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Huawei'
            },
            fileName: 'huawei.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Juniper'
            },
            fileName: 'juniper.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'VMware'
            },
            fileName: 'vmware.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'VMware, Inc'
            },
            fileName: 'vmware.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'VMware, Inc.'
            },
            fileName: 'vmware.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Aruba'
            },
            fileName: 'aruba.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Motorola'
            },
            fileName: 'motorola.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Apple'
            },
            fileName: 'apple.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Avaya'
            },
            fileName: 'avaya.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Brocade Communications Systems LLC'
            },
            fileName: 'brocade.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Extreme'
            },
            fileName: 'extreme.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Enterasys'
            },
            fileName: 'enterasys.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Westermo'
            },
            fileName: 'westermo.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'NETGEAR'
            },
            fileName: 'netgear.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Ruckus Wireless'
            },
            fileName: 'ruckus.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Rockwell Automation'
            },
            fileName: 'rockwella.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Checkpoint Systems, Inc.'
            },
            fileName: 'checkpoint.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Check Point Software Technologies'
            },
            fileName: 'checkpoint.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'D-Link'
            },
            fileName: 'dlink.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Ubiquiti Networks Inc.'
            },
            fileName: 'ubiquiti.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Ubiquiti'
            },
            fileName: 'ubiquiti.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Mellanox Technologies, Inc.'
            },
            fileName: 'mellanox.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Fortinet, Inc.'
            },
            fileName: 'fortinet.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'Foundry'
            },
            fileName: 'brocade.png'
        },
        {
            key: {
                type: ImageType.Vendor,
                value: 'TP-LINK TECHNOLOGIES CO.,LTD.'
            },
            fileName: 'tp-link.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'DownBackground'
            },
            fileName: 'red_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'DownIcon'
            },
            fileName: 'status_down.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'WarnBackground'
            },
            fileName: 'yellow_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'WarnIcon'
            },
            fileName: 'status_warn.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'UpBackground'
            },
            fileName: 'green_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'UpIcon'
            },
            fileName: 'status_up.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'UnknownBackground'
            },
            fileName: 'blue_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'UnknownIcon'
            },
            fileName: 'status_unknown.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'NoDataBackground'
            },
            fileName: 'gray_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'NoDataIcon'
            },
            fileName: 'status_no_data.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'PausedBackground'
            },
            fileName: 'purple_gradient.png'
        },
        {
            key: {
                type: ImageType.Status,
                value: 'PausedIcon'
            },
            fileName: 'status_paused.png'
        },
        {
            key: {
                type: ImageType.DeviceCategory,
                value: ''
            },
            fileName: 'unknown.png'
        }
    ];
}
