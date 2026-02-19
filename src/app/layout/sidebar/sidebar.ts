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

  checkAuthStatus(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);

        this.currentUser = {
          id: userData.user._id,
          email: userData.user.email,
          full_name: userData.user.full_name,
          username: userData.user.username,
          type: userData.user.type,
          auth_type: userData.user.auth_type,
          is_disabled: false,
          photo_url: userData.user.photo_url,
          google_account_id: userData.user.google_account_id,
          created_at: new Date(),
          updated_at: new Date()
        };

        if (this.currentUser.type === 'admin') {
          this.isAdmin = true;
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  closeSidebar() {
    this.onClose.emit();
  }

  ngOnInit(): void {
    this.checkAuthStatus();
  }
}
