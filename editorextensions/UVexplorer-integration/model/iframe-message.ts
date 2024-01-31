export interface OpenSessionMessage {
    action: 'openSession',
    apiKey: string,
    serverUrl: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOpenSessionMessage(message: any): message is OpenSessionMessage {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return message.action === 'openSession';
}
