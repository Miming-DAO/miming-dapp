import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService as PMessageService } from 'primeng/api';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { SelectModule as PSelectModule } from 'primeng/select';
import { ToastModule as PToastModule } from 'primeng/toast';

import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/users/users.service';
import { PolkadotIdenticonUtil } from '../../shared/polkadot-identicon-util/polkadot-identicon-util';

interface RoleOption {
  label: string;
  value: string;
  description?: string;
}

@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    FormsModule,
    PDialogModule,
    PSelectModule,
    PToastModule,
    PolkadotIdenticonUtil,
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  providers: [PMessageService],
})
export class Users implements OnInit {

  constructor(
    private usersService: UsersService,
    private pMessageService: PMessageService
  ) { }

  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = false;

  // Filters
  searchQuery: string = '';
  selectedRole: string = '';
  roleOptions: RoleOption[] = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'Merchant', value: 'merchant' },
    { label: 'User', value: 'user' },
  ];

  // Change Role Dialog
  showChangeRoleDialog: boolean = false;
  selectedUser: User | null = null;
  selectedNewRole: string = '';
  isProcessing: boolean = false;

  roleChangeOptions: RoleOption[] = [
    {
      label: 'Admin',
      value: 'admin',
      description: 'Full system access and management capabilities'
    },
    {
      label: 'Merchant',
      value: 'merchant',
      description: 'Can create and manage P2P advertisements'
    },
    {
      label: 'User',
      value: 'user',
      description: 'Standard user with basic trading permissions'
    },
  ];

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.pMessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users. Please try again.',
        });
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.type === this.selectedRole);
    }

    this.filteredUsers = filtered;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'merchant':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'user':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  }

  getRoleIcon(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'pi pi-shield';
      case 'merchant':
        return 'pi pi-briefcase';
      case 'user':
        return 'pi pi-user';
      default:
        return 'pi pi-user';
    }
  }

  getRoleLabel(value: string): string {
    const option = this.roleOptions.find(opt => opt.value === value);
    return option ? option.label : 'All Roles';
  }

  openChangeRoleDialog(user: User): void {
    this.selectedUser = user;
    this.selectedNewRole = '';
    this.showChangeRoleDialog = true;
  }

  changeUserRole(): void {
    if (!this.selectedUser || !this.selectedNewRole || this.selectedNewRole === this.selectedUser.type) {
      return;
    }

    this.isProcessing = true;

    let serviceCall;
    switch (this.selectedNewRole) {
      case 'admin':
        serviceCall = this.usersService.makeAdmin(this.selectedUser.id);
        break;
      case 'merchant':
        serviceCall = this.usersService.makeMerchant(this.selectedUser.id);
        break;
      case 'user':
        serviceCall = this.usersService.makeUser(this.selectedUser.id);
        break;
      default:
        this.isProcessing = false;
        return;
    }

    serviceCall.subscribe({
      next: (updatedUser) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `User role updated to ${this.selectedNewRole} successfully.`,
        });

        this.loadUsers();

        this.showChangeRoleDialog = false;
        this.selectedUser = null;
        this.selectedNewRole = '';
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error changing user role:', error);
        this.pMessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to change user role. Please try again.',
        });
        this.isProcessing = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }
}
