import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {

  constructor() { }

  @Output() onToggleSidebar = new EventEmitter<void>();

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }

  toggleTheme(isDarkMode: boolean) {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');
  }

  ngOnInit() {

  }
}
