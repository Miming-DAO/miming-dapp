import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem as PMenuItem } from 'primeng/api';
import { MenuModule as PMenuModule } from 'primeng/menu';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ImageModule as PImageModule } from 'primeng/image';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    PMenuModule,
    PButtonModule,
    PImageModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Output() onClickGenerate = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  menuItems: PMenuItem[] = [
    {
      label: 'Teleport',
      icon: 'pi pi-arrow-right-arrow-left',
      routerLink: ['/dapp/cross-chain'],
    },
    {
      label: 'P2P',
      icon: 'pi pi-shopping-bag',
      routerLink: ['/dapp/p2p'],
    },
  ];

  closeSidebar() {
    this.onClose.emit();
  }
}
