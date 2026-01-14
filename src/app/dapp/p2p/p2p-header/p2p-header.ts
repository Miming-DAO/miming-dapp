import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

@Component({
  selector: 'app-p2p-header',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
  ],
  templateUrl: './p2p-header.html',
  styleUrl: './p2p-header.css',
})
export class P2pHeader {
  @Input() mobileMenuOpen: boolean = false;

  @Output() mobileMenuOpenOnClick = new EventEmitter<boolean>();
  @Output() loginP2PUserOnClick = new EventEmitter<void>();
  @Output() logoutP2PUserOnClick = new EventEmitter<void>();

  showLoginDialog: boolean = false;

  loginEmail: string = '';
  loginPassword: string = '';

  isP2PUserLoggedIn: boolean = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuOpenOnClick.emit(this.mobileMenuOpen);
  }

  loginP2PUser(): void {
    this.showLoginDialog = true;
  }

  handleLogin(): void {
    if (this.loginEmail && this.loginPassword) {
      this.isP2PUserLoggedIn = true;
      this.loginP2PUserOnClick.emit();

      this.showLoginDialog = false;

      this.loginEmail = '';
      this.loginPassword = '';
    }
  }

  handleGoogleLogin(): void {
    this.isP2PUserLoggedIn = true;
    this.loginP2PUserOnClick.emit();

    this.showLoginDialog = false;
  }

  logoutP2PUser(): void {
    this.isP2PUserLoggedIn = false;
    this.logoutP2PUserOnClick.emit();
  }
}
