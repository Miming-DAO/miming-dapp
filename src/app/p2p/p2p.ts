import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

import { Header } from './layout/header/header';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  selector: 'app-p2p',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
    Header,
    Sidebar
  ],
  templateUrl: './p2p.html',
  styleUrl: './p2p.css',
})
export class P2p {
  private router = inject(Router);

  mobileMenuOpen: boolean = false;
  isP2PUserLoggedIn: boolean = false;
  showComingSoonModal: boolean = false;

  activeMenu: '' | 'marketplace' | 'my-ads' | 'orders' | 'messages' = 'marketplace';
  activeTab: 'buy' | 'sell' = 'buy';

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const googleUser = localStorage.getItem('auth_user');
    if (googleUser) {
      this.isP2PUserLoggedIn = true;
    }
  }

  mobileMenuOpenOnClick(mobileMenuOpen: boolean): void {
    this.mobileMenuOpen = mobileMenuOpen;
  }

  navigateToCrossChain(): void {
    this.router.navigate(['/cross-chain']);
  }
}
