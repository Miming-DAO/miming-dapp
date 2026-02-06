import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-p2p-user-sidebar',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './p2p-user-sidebar.html',
  styleUrl: './p2p-user-sidebar.css',
})
export class P2pUserSidebar {
  @Input() mobileMenuOpen: boolean = false;
  @Input() walletAddress: string = '';
  @Output() mobileMenuClose = new EventEmitter<void>();

  closeMobileMenu(): void {
    this.mobileMenuClose.emit();
  }
}
