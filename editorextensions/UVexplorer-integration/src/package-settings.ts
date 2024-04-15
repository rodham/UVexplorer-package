import { EditorClient } from 'lucid-extension-sdk';

/**
 * Prompts the user to set values for any missing package settings
 * @param client
 */
export async function configureClientPackageSettings(client: EditorClient) {
    // TODO: Add back when deploying in production. Package settings do not 'save' locally.
    // await configureSetting('apiKey');
    // await configureSetting('serverUrl');

    // TODO: For development, the secrets are stored as ENV vars and package settings are manually set
    const additionalSettings: Map<string, string> = new Map<string, string>();
    additionalSettings.set('apiKey', process.env.UVX_API_KEY!);
    additionalSettings.set('serverUrl', process.env.UVX_BASE_URL!);
    await client.setPackageSettings(additionalSettings);
}

/**
 * Allows a user to set the value of a package setting
 * @param client
 * @param setting The name of the package setting being set
 */
export async function configureSetting(client: EditorClient, setting: string) {
    let settings = await client.getPackageSettings();
    if (!settings.get(setting)) {
        // The setting is empty
        if (await client.canEditPackageSettings()) {
            // The user has sufficient permissions to edit the setting
            await client.alert(
                `You have not configured the ${setting}. You will now be prompted to complete that configuration.`
            );
            await client.showPackageSettingsModal();
            settings = await client.getPackageSettings();
            if (!settings.get(setting)) {
                return;
            }
        } else {
            // The user does not have sufficient permissions to edit the setting
            await client.alert(
                `Your account has not configured the ${setting}. Talk with your Lucid account administrator to complete configuration.`
            );
        }
    }
}
