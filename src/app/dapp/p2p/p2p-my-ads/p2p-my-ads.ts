import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-p2p-my-ads',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
  ],
  templateUrl: './p2p-my-ads.html',
  styleUrl: './p2p-my-ads.css',
})
export class P2pMyAds {
  showCreateDialog = signal(false);
  showEditDialog = signal(false);

  assetOptions = ['USDT', 'USDC', 'BTC', 'ETH'];
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' }
  ];

  newAd = {
    type: 'sell' as 'buy' | 'sell',
    asset: 'USDT',
    price: 0,
    available: 0,
    minLimit: 0,
    maxLimit: 0,
    paymentMethods: [] as string[],
    instructions: '',
    status: 'active' as 'active' | 'paused' | 'draft'
  };

  editAd: any = {
    id: 0,
    type: 'sell' as 'buy' | 'sell',
    asset: 'USDT',
    price: 0,
    available: 0,
    minLimit: 0,
    maxLimit: 0,
    paymentMethods: [] as string[],
    instructions: '',
    status: 'active' as 'active' | 'paused' | 'draft'
  };

  constructor() { }

  myAds = [
    {
      id: 101,
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      price: 1.02,
      available: 10000,
      minLimit: 100,
      maxLimit: 5000,
      paymentMethods: ['Bank Transfer', 'PayPal'],
      status: 'active' as 'active' | 'paused' | 'inactive',
      totalOrders: 45,
      createdAt: '2026-01-10'
    },
    {
      id: 102,
      type: 'sell' as 'buy' | 'sell',
      asset: 'USDT',
      price: 0.99,
      available: 8000,
      minLimit: 50,
      maxLimit: 3000,
      paymentMethods: ['Wise', 'Revolut'],
      status: 'active' as 'active' | 'paused' | 'inactive',
      totalOrders: 32,
      createdAt: '2026-01-08'
    },
    {
      id: 103,
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      price: 1.01,
      available: 15000,
      minLimit: 200,
      maxLimit: 10000,
      paymentMethods: ['Bank Transfer'],
      status: 'paused' as 'active' | 'paused' | 'inactive',
      totalOrders: 28,
      createdAt: '2026-01-05'
    }
  ];

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'active': 'bg-green-500/20 text-green-400 border-green-500/30',
      'paused': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'inactive': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'paid': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
      'disputed': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return classes[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }

  openCreateDialog(): void {
    this.showCreateDialog.set(true);
  }

  closeCreateDialog(): void {
    this.showCreateDialog.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.newAd = {
      type: 'sell',
      asset: 'USDT',
      price: 0,
      available: 0,
      minLimit: 0,
      maxLimit: 0,
      paymentMethods: [],
      instructions: '',
      status: 'active'
    };
  }

  togglePaymentMethod(method: string): void {
    const index = this.newAd.paymentMethods.indexOf(method);
    if (index > -1) {
      this.newAd.paymentMethods.splice(index, 1);
    } else {
      this.newAd.paymentMethods.push(method);
    }
  }

  isPaymentMethodSelected(method: string): boolean {
    return this.newAd.paymentMethods.includes(method);
  }

  submitAd(): void {
    // TODO: Implement actual API call
    console.log('Creating ad:', this.newAd);
    this.closeCreateDialog();
  }

  openEditDialog(ad: any): void {
    this.editAd = { ...ad, paymentMethods: [...ad.paymentMethods] };
    this.showEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
  }

  toggleEditPaymentMethod(method: string): void {
    const index = this.editAd.paymentMethods.indexOf(method);
    if (index > -1) {
      this.editAd.paymentMethods.splice(index, 1);
    } else {
      this.editAd.paymentMethods.push(method);
    }
  }

  isEditPaymentMethodSelected(method: string): boolean {
    return this.editAd.paymentMethods.includes(method);
  }

  updateAd(): void {
    // TODO: Implement actual API call
    console.log('Updating ad:', this.editAd);

    // Update the ad in the list
    const index = this.myAds.findIndex(ad => ad.id === this.editAd.id);
    if (index > -1) {
      this.myAds[index] = { ...this.editAd };
    }

    this.closeEditDialog();
  }
}
