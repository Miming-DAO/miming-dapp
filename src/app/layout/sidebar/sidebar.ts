import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MenuItem as PMenuItem } from 'primeng/api';
import { MenuModule as PMenuModule } from 'primeng/menu';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ImageModule as PImageModule } from 'primeng/image';

import { User } from '../../../models/user.model';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule,
    PMenuModule,
    PButtonModule,
    PImageModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Output() onClickGenerate = new EventEmitter<void>();
  @Output() onClose = new EventEmitter<void>();

  currentUser: User | null = null;
  isAdmin: boolean = false;

  menuItems: PMenuItem[] = [
    {
      label: 'Teleport',
      icon: 'pi pi-arrow-right-arrow-left',
      routerLink: ['/cross-chain'],
    },
    {
      label: 'P2P',
      icon: 'pi pi-shopping-bag',
      routerLink: ['/p2p'],
    },
    {
      label: 'Chart',
      icon: 'pi pi-chart-line',
      routerLink: ['/chart'],
    },
  ];

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.isAdmin = this.currentUser?.type === 'admin';
    }
  }

  closeSidebar() {
    this.onClose.emit();
  }
}
