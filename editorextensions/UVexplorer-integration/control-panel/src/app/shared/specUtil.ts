import {
    Device,
    DeviceCategories,
    DeviceCategoryEntry,
    DeviceClass,
    ProtocolProfile,
    ProtocolProfileEntry
} from 'model/uvx/device';

export function createDevice(increment: string): Device {
    const value = 'device' + increment;
    const protocol = 'protocol' + increment;

    const deviceClass: DeviceClass = {};

    const deviceCategoryEntry: DeviceCategoryEntry = {
        device_category: value,
        source_name: value
    };

    const deviceCategoryEntry2: DeviceCategoryEntry = {
        device_category: value + '1',
        source_name: value
    };

    const deviceCategories: DeviceCategories = {
        entries: [deviceCategoryEntry, deviceCategoryEntry2]
    };

    const protocolProfileEntry: ProtocolProfileEntry = {
        protocol_name: protocol,
        protocol_settings: protocol
    };

    const protocolProfilesArray: ProtocolProfileEntry[] = [protocolProfileEntry];

    const protocolProfile: ProtocolProfile = {
        entries: protocolProfilesArray
    };

    const device: Device = {
        ip_address: value,
        mac_address: value,
        guid: value,
        info_sets: value,
        device_class: deviceClass,
        device_categories: deviceCategories,
        protocol_profile: protocolProfile,
        timestamp: value
    };

    return device;
}
