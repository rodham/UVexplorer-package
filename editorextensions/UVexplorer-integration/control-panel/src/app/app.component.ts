import { Component } from '@angular/core';
import {SessionInfo} from "../../../model/uvexplorer-model";
import {NgIf} from "@angular/common";
import {LoginComponent} from "./login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgIf, LoginComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'control-panel';
  sessionInfo: SessionInfo = { serverUrl: '', sessionGuid: '', networkGuid: '' };

  public setSessionInfo(sessionInfo: SessionInfo):void {
    this.sessionInfo = sessionInfo
  }
}
