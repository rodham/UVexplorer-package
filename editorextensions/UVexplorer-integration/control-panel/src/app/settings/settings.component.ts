import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { isMapSettingsMessage } from 'model/message';
import { FormsModule } from '@angular/forms';
import {
    DrawSettings,
    LayoutDirection,
    LayoutSettings,
    LayoutType,
    RootAlignment,
    defaultDrawSettings,
    defaultLayoutSettings,
    ImageSettings,
    defaultImageSettings,
    DashStyle,
    DeviceDisplaySetting
} from 'model/uvx/topo-map';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [NgIf, FormsModule, NgForOf],
    templateUrl: './settings.component.html'
})
export class SettingsComponent {
    @Input({ transform: booleanAttribute }) childSettings = false;
    @Output() settingsClosedEvent = new EventEmitter<boolean>();
    drawSettings: DrawSettings = defaultDrawSettings;
    layoutSettings: LayoutSettings = defaultLayoutSettings;
    imageSettings: ImageSettings = defaultImageSettings;
    layoutTypes = LayoutType;
    layoutDirection = LayoutDirection;
    rootAlignment = RootAlignment;
    deviceDisplaySetting = DeviceDisplaySetting;
    dashStyle = DashStyle;
    colors = {
        standardPen: '#000000',
        lagPen: '#ffd700',
        manualPen: '#0000ff',
        associatedPen: '#ffa500',
        multiPen: '#000000'
    };

    TABS = ['Layout Settings', 'Link Settings', 'Draw Settings', 'Image Settings', 'Label Settings'];
    selectedTab = 'Layout Settings';
    backButton = false;

    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent.');
            console.log(e.data);

            if (isMapSettingsMessage(e.data)) {
                this.drawSettings = JSON.parse(e.data.drawSettings) as DrawSettings;
                this.layoutSettings = JSON.parse(e.data.layoutSettings) as LayoutSettings;
                this.imageSettings = JSON.parse(e.data.imageSettings) as ImageSettings;
                this.backButton = e.data.backButton as boolean
                this.updateColors();

                console.log('Loaded Map Settings');
            }
        });
    }

    public saveSettings() {
        this.drawSettings.standardPen.color = this.parseColor(this.colors.standardPen);
        this.drawSettings.lagPen.color = this.parseColor(this.colors.lagPen);
        this.drawSettings.manualPen.color = this.parseColor(this.colors.manualPen);
        this.drawSettings.associatedPen.color = this.parseColor(this.colors.associatedPen);
        this.drawSettings.multiPen.color = this.parseColor(this.colors.multiPen);

        this.layoutSettings.hierarchicalSettings!.layoutDirection =
            +this.layoutSettings.hierarchicalSettings!.layoutDirection;
        this.layoutSettings.hierarchicalSettings!.rootAlignment =
            +this.layoutSettings.hierarchicalSettings!.rootAlignment;
        this.drawSettings.deviceDisplaySetting = +this.drawSettings.deviceDisplaySetting;

        parent.postMessage(
            {
                action: 'saveMapSettings',
                drawSettings: this.drawSettings,
                layoutSettings: this.layoutSettings,
                imageSettings: this.imageSettings
            },
            '*'
        );

        console.log('Updated settings');
        this.settingsClosedEvent.emit(true);
    }

    private parseColor(colorCode: string) {
        return {
            red: Number('0x' + colorCode.substring(1, 3)),
            green: Number('0x' + colorCode.substring(3, 5)),
            blue: Number('0x' + colorCode.substring(5, 7))
        };
    }

    private updateColors() {
        this.colors.standardPen = this.createColorCode(
            this.drawSettings.standardPen.color.red,
            this.drawSettings.standardPen.color.green,
            this.drawSettings.standardPen.color.blue
        );
        this.colors.lagPen = this.createColorCode(
            this.drawSettings.lagPen.color.red,
            this.drawSettings.lagPen.color.green,
            this.drawSettings.lagPen.color.blue
        );
        this.colors.manualPen = this.createColorCode(
            this.drawSettings.manualPen.color.red,
            this.drawSettings.manualPen.color.green,
            this.drawSettings.manualPen.color.blue
        );
        this.colors.associatedPen = this.createColorCode(
            this.drawSettings.associatedPen.color.red,
            this.drawSettings.associatedPen.color.green,
            this.drawSettings.associatedPen.color.blue
        );
        this.colors.multiPen = this.createColorCode(
            this.drawSettings.multiPen.color.red,
            this.drawSettings.multiPen.color.green,
            this.drawSettings.multiPen.color.blue
        );
    }

    private createColorCode(red: number, green: number, blue: number) {
        return '#' + this.toHex(red) + this.toHex(green) + this.toHex(blue);
    }

    private toHex(num: number): string {
        const map = '0123456789abcdef';
        let hex = '';
        hex += map.charAt(Math.floor(num / 16));
        hex += map.charAt(num % 16);
        return hex;
    }
}
