import { EditorClient, JsonSerializable } from 'lucid-extension-sdk';
import { configureSetting } from 'src/package-settings';

jest.mock('lucid-extension-sdk', (): unknown => ({
    ...jest.requireActual('lucid-extension-sdk'),
    EditorClient: jest.fn().mockImplementation(() => ({
        sendCommand: jest.fn(),
        getPackageSettings: jest.fn(),
        alert: jest.fn(),
        showPackageSettingsModal: jest.fn(),
        canEditPackageSettings: jest.fn()
    }))
}));

describe('Package Settings Tests', () => {
    let mockClient: EditorClient;

    beforeEach(() => {
        mockClient = new EditorClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('configureSetting', () => {
        it('should do nothing if setting is already configured', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings');
            const mockPackageSettings = new Map<string, JsonSerializable>();
            mockPackageSettings.set('apiKey', 'key');
            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');

            await configureSetting(mockClient, 'apiKey');

            expect(getPackageSettingsSpy).toHaveBeenCalled();
            expect(alertSpy).not.toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).not.toHaveBeenCalled();
        });

        it('should prompt user to configure setting and handle user input', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings');
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const canEditPackageSettingsSpy = jest.spyOn(mockClient, 'canEditPackageSettings');
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');
            const mockPackageSettings = new Map<string, JsonSerializable>();

            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            canEditPackageSettingsSpy.mockResolvedValue(true);
            await configureSetting(mockClient, 'apiKey');

            expect(alertSpy).toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).toHaveBeenCalled();
        });

        it('should handle case when user cannot edit package settings', async () => {
            const getPackageSettingsSpy = jest.spyOn(mockClient, 'getPackageSettings');
            const mockPackageSettings = new Map<string, JsonSerializable>();
            getPackageSettingsSpy.mockResolvedValue(mockPackageSettings);
            const canEditPackageSettingsSpy = jest.spyOn(mockClient, 'canEditPackageSettings');
            canEditPackageSettingsSpy.mockResolvedValue(false);
            const alertSpy = jest.spyOn(mockClient, 'alert');
            const showPackageSettingsModalSpy = jest.spyOn(mockClient, 'showPackageSettingsModal');

            await configureSetting(mockClient, 'apiKey');

            expect(alertSpy).toHaveBeenCalled();
            expect(showPackageSettingsModalSpy).not.toHaveBeenCalled();
        });
    });
});
