import { Viewport } from 'lucid-extension-sdk';
import { DataClient } from '@data/data-client';

export class DocumentClient {
    constructor(
        private _viewport: Viewport,
        private _data: DataClient
    ) {}
}
