import { LinkInfoModal } from '@uvx/link-info-modal';
import * as lucid from 'lucid-extension-sdk';
import { mockDisplayEdge1 } from 'mock_data/devices';
import { DocumentClient } from 'src/doc/document-client';
import { DataClient } from '@data/data-client';
import { UVExplorerClient } from '@uvx/uvx-client';

jest.mock('lucid-extension-sdk');
jest.mock('src/doc/document-client');
jest.mock('@data/data-client');

describe('Link Info Modal tests', () => {
    const mockEditorClient = new lucid.EditorClient();
    const mockViewport = {
        getCurrentPage: () => {
            return { id: '1' };
        }
    } as lucid.Viewport;
    const mockDataClient = new DataClient(mockEditorClient);
    const mockDocEditor = new DocumentClient(mockViewport, mockDataClient);
    const mockUvxClient = new UVExplorerClient(mockEditorClient);
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    describe('Display Line Details tests', () => {
        const modal = new LinkInfoModal(
            mockEditorClient,
            mockDocEditor,
            mockUvxClient,
            mockDataClient,
            mockDisplayEdge1
        );
        const sendMessageMock = jest.spyOn(modal, 'sendMessage');

        it('should send message to child', async () => {
            await modal.sendLineDetails();

            expect(sendMessageMock).toHaveBeenCalledWith({
                action: 'viewLinkDetails',
                linkDetails: JSON.stringify(mockDisplayEdge1)
            });
        });
    });
});
