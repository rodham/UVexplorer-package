import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { SessionInfo } from "../../../../model/uvexplorer-model";
import {isOpenSessionMessage} from "../../../../model/iframe-message";

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  title = 'login';
  serverUrl = ''; //https://server.uvexplorer.com:5189/
  apiKey = ''; //4aff2a87-e76a-4fbc-a699-7c6db610cd88
  receivedSettingsFromParent = false;

  constructor() {
    window.addEventListener('message', (e) => {
      if (isOpenSessionMessage(e.data)) {
        console.log(e.data.apiKey);
        this.apiKey = e.data.apiKey;
        this.serverUrl = e.data.serverUrl;
      }
    })
  }

  async login() {
    try {
      if (this.serverUrl === '' || this.apiKey === '') {
        return;
      }

      const response = await fetch(this.serverUrl + 'public/api/v1/session', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + this.apiKey
        }
      });

      if (!this.receivedSettingsFromParent) {
        const result = await response.text();
        console.log(result);
        parent.postMessage({
          'action': 'openSession',
          'apiKey': this.apiKey,
          'serverUrl': this.serverUrl
        }, '*');
        console.log("Successfully sent message to parent")
      }
    } catch (error) {
      console.log('Error: ',error);
      throw error;
    }
  }

  @Output() onLogin = new EventEmitter<SessionInfo>();
}
