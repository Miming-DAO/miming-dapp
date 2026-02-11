import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() mobileMenuOpen: boolean = false;
  @Output() activeMenuOnClick = new EventEmitter<'' | 'marketplace' | 'my-ads' | 'orders' | 'messages'>();

  constructor(
    private router: Router
  ) { }

  activeMenu: '' | 'marketplace' | 'my-ads' | 'orders' | 'messages' = 'marketplace';
  isAdmin: boolean = true;

  setActiveMenu(menu: 'marketplace' | 'my-ads' | 'orders' | 'messages'): void {
    this.activeMenu = menu;
    this.activeMenuOnClick.emit(this.activeMenu);

    this.router.navigate([`/p2p/${menu}`]);
  }

  navigateToAdminConsole(): void {
    this.router.navigate(['/p2p/admin']);

    this.activeMenu = '';
    this.activeMenuOnClick.emit('');
  }
}
