import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-p2p-sidebar',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './p2p-sidebar.html',
  styleUrl: './p2p-sidebar.css',
})
export class P2pSidebar {
  @Input() mobileMenuOpen: boolean = false;
  @Output() activeMenuOnClick = new EventEmitter<'marketplace' | 'my-ads' | 'orders' | 'messages'>();

  constructor(
    private router: Router
  ) { }

  activeMenu: 'marketplace' | 'my-ads' | 'orders' | 'messages' = 'marketplace';
  isAdmin: boolean = true;

  setActiveMenu(menu: 'marketplace' | 'my-ads' | 'orders' | 'messages'): void {
    this.activeMenu = menu;
    this.activeMenuOnClick.emit(this.activeMenu);
  }

  navigateToAdminConsole(): void {
    this.router.navigate(['/dapp/p2p-admin']);
  }
}
