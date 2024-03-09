import { EditorClient, JsonSerializable, Viewport } from "lucid-extension-sdk";
import { UVXModal } from "./uvx-modal";
import { isSelectedMapSettingsMessage } from "model/message";

export class SettingsModal extends UVXModal {
    constructor(client: EditorClient, viewport: Viewport) {
        super(client, viewport, 'settings');

        this.viewport = viewport;
    }

    protected messageFromFrame(message: JsonSerializable) {
        console.log('Received a message from the child.');
        console.log(message);
        if (isSelectedMapSettingsMessage(message)) {
            this.saveSettings(message.drawSettings, message.layoutSettings);
            this.hide();
        }
    }
}
