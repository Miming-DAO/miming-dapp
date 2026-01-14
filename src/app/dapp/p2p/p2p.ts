import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  ],
  templateUrl: './p2p.html',
  styleUrl: './p2p.css',
})
export class P2p {
  constructor() { }

  mobileMenuOpen: boolean = false;
  isP2PUserLoggedIn: boolean = false;

  activeMenu: 'marketplace' | 'my-ads' | 'orders' = 'marketplace';
  activeTab: 'buy' | 'sell' = 'buy';

  mobileMenuOpenOnClick(mobileMenuOpen: boolean): void {
    this.mobileMenuOpen = mobileMenuOpen;
  }
}
