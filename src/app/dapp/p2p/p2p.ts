import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

import { P2pHeader as P2pHeaderComponent } from './p2p-header/p2p-header';
import { P2pSidebar as P2pSidebarComponent } from './p2p-sidebar/p2p-sidebar';
import { P2pMarketplace as P2pMarketplaceComponent } from './p2p-marketplace/p2p-marketplace';
import { P2pMyAds as P2pMyAdsComponent } from './p2p-my-ads/p2p-my-ads';
import { P2pOrders as P2pOrdersComponent } from './p2p-orders/p2p-orders';
import { P2pMessages as P2pMessagesComponent } from './p2p-messages/p2p-messages';

@Component({
  selector: 'app-p2p',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
    P2pHeaderComponent,
    P2pSidebarComponent,
    P2pMarketplaceComponent,
    P2pMyAdsComponent,
    P2pOrdersComponent,
    P2pMessagesComponent,
  ],
  templateUrl: './p2p.html',
  styleUrl: './p2p.css',
})
export class P2p {
  private router = inject(Router);

  mobileMenuOpen: boolean = false;
  isP2PUserLoggedIn: boolean = false;
  showComingSoonModal: boolean = false;

  activeMenu: 'marketplace' | 'my-ads' | 'orders' | 'messages' = 'marketplace';
  activeTab: 'buy' | 'sell' = 'buy';

  ngOnInit() {
    // Check if user is logged in by checking google_user in localStorage
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    const googleUser = localStorage.getItem('google_user');
    if (googleUser) {
      this.isP2PUserLoggedIn = true;
    }
  }

  mobileMenuOpenOnClick(mobileMenuOpen: boolean): void {
    this.mobileMenuOpen = mobileMenuOpen;
  }

  navigateToCrossChain(): void {
    this.router.navigate(['/dapp/cross-chain']);
  }
}
