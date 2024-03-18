import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import { SelectedMapSettingsMessage } from 'model/message';
import { defaultDrawSettings, defaultImageSettings, defaultLayoutSettings } from 'model/uvx/topo-map';

describe('SettingsComponent', () => {
    let component: SettingsComponent;
    let fixture: ComponentFixture<SettingsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SettingsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SettingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call parent.postMessage on updateSettings', () => {
        const postMessageSpy: jasmine.Spy<(message: SelectedMapSettingsMessage, targetOrigin: string) => void> = spyOn(
            window.parent,
            'postMessage'
        );

        component.drawSettings = defaultDrawSettings;
        component.layoutSettings = defaultLayoutSettings;
        component.imageSettings = defaultImageSettings;
        component.updateSettings();

        expect(postMessageSpy).toHaveBeenCalledWith(
            {
                action: 'saveMapSettings',
                drawSettings: component.drawSettings,
                layoutSettings: component.layoutSettings,
                imageSettings: component.imageSettings
            },
            '*'
        );
    });
});
