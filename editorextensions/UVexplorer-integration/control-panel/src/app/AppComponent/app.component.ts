import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})

/*
 * This is the central component that controls all others
 */
export class AppComponent {
    title = 'control-panel';
}
