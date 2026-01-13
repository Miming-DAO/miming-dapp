import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('miming-dapp');

  ngOnInit() {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');
  }
}
