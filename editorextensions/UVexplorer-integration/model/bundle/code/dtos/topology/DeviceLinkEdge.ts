import { DeviceConnection } from './DeviceConnection';


export interface DeviceLinkEdge {
	localConnection: DeviceConnection;
	remoteConnection: DeviceConnection;
}
