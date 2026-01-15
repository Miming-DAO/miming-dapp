import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { P2pAdminHeader as P2pAdminHeaderComponent } from './p2p-admin-header/p2p-admin-header';
import { P2pAdminUserManagement as P2pAdminUserManagementComponent } from './p2p-admin-user-management/p2p-admin-user-management';

@Component({
  selector: 'app-p2p-admin',
  imports: [
    CommonModule,
    FormsModule,
    P2pAdminHeaderComponent,
    P2pAdminUserManagementComponent,
  ],
  templateUrl: './p2p-admin.html',
  styleUrl: './p2p-admin.css',
})
export class P2pAdmin {

}
