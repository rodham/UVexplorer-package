import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { isMapSettingsMessage } from 'model/message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  changingSettings = false;
  penSettings = defaultPenSettings;
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
        this.changingSettings = true;
        console.log('Loaded Map Settings');
      }
    });
  }

  public updateSettings() {
    this.penSettings.standardPen.color = this.parseColor(this.colors.standardPen);
    this.penSettings.lagPen.color = this.parseColor(this.colors.lagPen);
    this.penSettings.manualPen.color = this.parseColor(this.colors.manualPen);
    this.penSettings.associatedPen.color = this.parseColor(this.colors.associatedPen);
    this.penSettings.multiPen.color = this.parseColor(this.colors.multiPen);

    parent.postMessage(
      {
        action: 'saveMapSettings',
        penSettings: this.penSettings
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

const defaultPenSettings = {
  standardPen: {
    color: {
      red: 0,
      green: 0,
      blue: 0
    },
    width: 1,
    lineStyle: 'Solid'
  },
  lagPen: {
    color: {
      red: 0,
      green: 0,
      blue: 0
    },
    width: 1,
    lineStyle: 'Solid'
  },
  manualPen: {
    color: {
      red: 0,
      green: 0,
      blue: 0
    },
    width: 1,
    lineStyle: 'Solid'
  },
  associatedPen: {
    color: {
      red: 0,
      green: 0,
      blue: 0
    },
    width: 1,
    lineStyle: 'Solid'
  },
  multiPen: {
    color: {
      red: 0,
      green: 0,
      blue: 0
    },
    width: 1,
    lineStyle: 'Solid'
  }
};
