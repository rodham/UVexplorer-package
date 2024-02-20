import { CustomBlockProxy } from 'lucid-extension-sdk';

export class NetworkDeviceBlock extends CustomBlockProxy {
    public static library = 'UVexplorer-shapes';
    public static shape = 'networkDevice';
}

CustomBlockProxy.registerCustomBlockClass(NetworkDeviceBlock);
