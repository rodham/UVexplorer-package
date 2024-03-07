import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { isMapSettingsMessage } from 'model/message';
import { FormsModule } from '@angular/forms';
import { defaultDrawSettings, defaultLayoutSettings } from 'model/uvexplorer-topomap-model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  changingSettings = false;
  drawSettings = defaultDrawSettings;
  layoutSettings = defaultLayoutSettings;
  colors = {
    standardPen: '#000000',
    lagPen: '#000000',
    manualPen: '#000000',
    associatedPen: '#000000',
    multiPen: '#000000',
  }

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);

      if (isMapSettingsMessage(e.data)) {
        this.drawSettings = JSON.parse(e.data.drawSettings?.toString() ?? '');
        this.changingSettings = true;
        console.log('Loaded Map Settings');
      }
    });
  }

  public updateSettings() {
    this.drawSettings.standardPen.color = this.parseColor(this.colors.standardPen);
    this.drawSettings.lagPen.color = this.parseColor(this.colors.lagPen);
    this.drawSettings.manualPen.color = this.parseColor(this.colors.manualPen);
    this.drawSettings.associatedPen.color = this.parseColor(this.colors.associatedPen);
    this.drawSettings.multiPen.color = this.parseColor(this.colors.multiPen);

    parent.postMessage(
      {
        action: 'saveMapSettings',
        drawSettings: this.drawSettings,
        layoutSettings: this.layoutSettings
      },
      '*'
    );

    this.changingSettings = false;
    
    console.log("Updated settings");
  }

  private parseColor(colorCode: string) {
    return {
      red: Number("0x" + colorCode.substring(1, 3)),
      green: Number("0x" + colorCode.substring(3, 5)),
      blue: Number("0x" + colorCode.substring(5, 7))
    }
  }
}
