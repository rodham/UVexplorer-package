import { EditorClient } from 'lucid-extension-sdk';

export async function configureClientPackageSettings(client: EditorClient) {
    // TODO: Add back when deploying. Package settings config did not save locally.
    // await configureSetting('apiKey');
    // await configureSetting('serverUrl');
    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);

    await client.setPackageSettings(additionalSettings);
}

export async function configureSetting(client: EditorClient, setting: string) {
    let settings = await client.getPackageSettings();
    if (!settings.get(setting)) {
        if (await client.canEditPackageSettings()) {
            await client.alert(
                `You have not configured the ${setting}. You will now be prompted to complete that configuration.`
            );
            await client.showPackageSettingsModal();
            settings = await client.getPackageSettings();
            if (!settings.get(setting)) {
                return;
            }
        } else {
            await client.alert(
                `Your account has not configured the ${setting}. Talk with your Lucid account administrator to complete configuration.`
            );
        }
    }
}
