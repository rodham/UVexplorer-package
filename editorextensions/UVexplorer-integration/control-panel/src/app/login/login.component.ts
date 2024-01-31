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
    if (this.serverUrl === '' || this.apiKey === '') {
      return;
    }

    parent.postMessage({
      'action': 'openSession',
      'apiKey': this.apiKey,
      'serverUrl': this.serverUrl
    }, '*');
    console.log("Successfully sent message to parent")
  }

  @Output() onLogin = new EventEmitter<SessionInfo>();
}
