import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { P2pUserHeader as P2pUserHeaderComponent } from './p2p-user-header/p2p-user-header';
import { P2pUserSidebar as P2pUserSidebarComponent } from './p2p-user-sidebar/p2p-user-sidebar';
import { P2pUserOrders as P2pUserOrdersComponent } from './p2p-user-orders/p2p-user-orders';
import { P2pUserOrderDetails as P2pUserOrderDetailsComponent } from './p2p-user-order-details/p2p-user-order-details';

@Component({
  selector: 'app-p2p-user',
  imports: [
    CommonModule,
    P2pUserHeaderComponent,
    P2pUserSidebarComponent,
    P2pUserOrdersComponent,
    P2pUserOrderDetailsComponent,
  ],
  templateUrl: './p2p-user.html',
  styleUrl: './p2p-user.css',
})
export class P2pUser implements OnInit {
  private route = inject(ActivatedRoute);

  walletAddress = signal<string>('');
  activeMenu = signal<'orders' | 'order-details'>('orders');
  mobileMenuOpen = signal<boolean>(false);
  selectedOrderId = signal<string>('');

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const wallet = params['walletAddress'];
      if (wallet) {
        this.walletAddress.set(wallet);
      }
    });
  }

  mobileMenuOpenOnClick(mobileMenuOpen: boolean): void {
    this.mobileMenuOpen.set(mobileMenuOpen);
  }

  viewOrderDetails(orderId: string): void {
    this.selectedOrderId.set(orderId);
    this.activeMenu.set('order-details');
  }

  backToOrders(): void {
    this.activeMenu.set('orders');
    this.selectedOrderId.set('');
  }
}
