import { CustomBlockProxy } from 'lucid-extension-sdk';

/**
 * Class using custom shape library to use custom shapes in our code.
 */
export class NetworkDeviceBlock extends CustomBlockProxy {
    public static library = 'UVexplorer-shapes';
    public static shape = 'networkDevice';
}

CustomBlockProxy.registerCustomBlockClass(NetworkDeviceBlock);
