import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

import { P2pAdsService } from '../../../../services/p2p-ads/p2p-ads.service';
import { P2pAdsPaymentsService } from '../../../../services/p2p-ads-payments/p2p-ads-payments.service';
import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../../../models/p2p-ad.model';
import { CreateP2pAdsPaymentDto } from '../../../../models/p2p-ads-payment.model';

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
    ToastModule,
  ],
  templateUrl: './p2p-my-ads.html',
  styleUrl: './p2p-my-ads.css',
  providers: [MessageService],
})
export class P2pMyAds {
  showCreateDialog = signal(false);
  showEditDialog = signal(false);
  showDeleteDialog = signal(false);
  isLoading = signal(false);

  myAds: P2pAd[] = [];
  selectedAdForDelete: P2pAd | null = null;

  // Payment methods tracking (separate from ad data)
  newAdPaymentMethods: string[] = [];
  editAdPaymentMethods: string[] = [];

  assetOptions = [
    { label: 'USDT', value: 1 },
    { label: 'USDC', value: 2 },
    { label: 'BTC', value: 3 },
    { label: 'ETH', value: 4 }
  ];
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' }
  ];

  newAd: CreateP2pAdDto = {
    user_id: 1,
    type: 'sell',
    p2p_number: '',
    logo_url: '',
    name: '',
    token_id: 1,
    price: 0,
    available_amount: 0,
    limit_from: 0,
    limit_to: 0,
    payment_instructions: '',
    status: 'active'
  };

  editAd: UpdateP2pAdDto & { id: number } = {
    id: 0,
    type: 'sell',
    name: '',
    token_id: 1,
    price: 0,
    available_amount: 0,
    limit_from: 0,
    limit_to: 0,
    payment_instructions: ''
  };

  constructor(
    private p2pAdsService: P2pAdsService,
    private p2pAdsPaymentsService: P2pAdsPaymentsService,
    private messageService: MessageService
  ) {
    this.loadMyAds();
  }

  loadMyAds(): void {
    this.isLoading.set(true);

    this.p2pAdsService.getAds().subscribe({
      next: (ads) => {
        this.myAds = ads;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading ads:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load advertisements. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

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
      user_id: 1,
      type: 'sell',
      p2p_number: '',
      logo_url: '',
      name: '',
      token_id: 1,
      price: 0,
      available_amount: 0,
      limit_from: 0,
      limit_to: 0,
      payment_instructions: '',
      status: 'active'
    };
    this.newAdPaymentMethods = [];
  }

  togglePaymentMethod(method: string): void {
    const index = this.newAdPaymentMethods.indexOf(method);
    if (index > -1) {
      this.newAdPaymentMethods.splice(index, 1);
    } else {
      this.newAdPaymentMethods.push(method);
    }
  }

  isPaymentMethodSelected(method: string): boolean {
    return this.newAdPaymentMethods.includes(method);
  }

  submitAd(): void {
    this.isLoading.set(true);

    // Generate P2P number before submission
    this.newAd.p2p_number = `P2P${Date.now()}`;

    this.p2pAdsService.createAd(this.newAd).subscribe({
      next: (createdAd) => {
        console.log('Ad created successfully:', createdAd);

        // Save payment methods if any selected
        if (this.newAdPaymentMethods.length > 0 && createdAd.id) {
          this.saveAdPaymentMethods(createdAd.id, this.newAdPaymentMethods);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Advertisement created successfully!'
        });
        this.loadMyAds();
        this.closeCreateDialog();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error creating ad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create advertisement. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  openEditDialog(ad: P2pAd): void {
    this.editAd = {
      id: ad.id as number,
      type: ad.type,
      name: ad.name,
      token_id: ad.token_id,
      price: ad.price,
      available_amount: ad.available_amount,
      limit_from: ad.limit_from,
      limit_to: ad.limit_to,
      payment_instructions: ad.payment_instructions
    };

    // Load existing payment methods for this ad
    this.loadAdPaymentMethods(ad.id);

    this.showEditDialog.set(true);
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editAdPaymentMethods = [];
  }

  toggleEditPaymentMethod(method: string): void {
    const index = this.editAdPaymentMethods.indexOf(method);
    if (index > -1) {
      this.editAdPaymentMethods.splice(index, 1);
    } else {
      this.editAdPaymentMethods.push(method);
    }
  }

  isEditPaymentMethodSelected(method: string): boolean {
    return this.editAdPaymentMethods.includes(method);
  }

  updateAd(): void {
    this.isLoading.set(true);

    const { id, ...updateDto } = this.editAd;

    this.p2pAdsService.updateAd(id, updateDto).subscribe({
      next: (updatedAd) => {
        console.log('Ad updated successfully:', updatedAd);

        // Update payment methods if changed
        if (this.editAdPaymentMethods.length > 0) {
          this.saveAdPaymentMethods(id, this.editAdPaymentMethods);
        }

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Advertisement updated successfully!'
        });
        this.loadMyAds();
        this.closeEditDialog();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error updating ad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update advertisement. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  openDeleteDialog(ad: P2pAd): void {
    this.selectedAdForDelete = ad;
    this.showDeleteDialog.set(true);
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog.set(false);
    this.selectedAdForDelete = null;
  }

  confirmDelete(): void {
    if (!this.selectedAdForDelete) return;

    this.isLoading.set(true);

    this.p2pAdsService.deleteAd(this.selectedAdForDelete.id).subscribe({
      next: () => {
        console.log('Ad deleted successfully');
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Advertisement deleted successfully!'
        });
        this.loadMyAds();
        this.closeDeleteDialog();
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error deleting ad:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete advertisement. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  // Helper method to save ad payment methods
  saveAdPaymentMethods(adId: string | number, paymentMethods: string[]): void {
    paymentMethods.forEach((method) => {
      const paymentData: CreateP2pAdsPaymentDto = {
        p2p_ad_id: adId,
        payment_type_id: this.getPaymentTypeId(method),
        name: method,
        description: '',
        account_name: '',
        account_number: '',
        attachments: [],
        other_details: ''
      };

      this.p2pAdsPaymentsService.createAdsPayment(paymentData).subscribe({
        next: (result) => {
          console.log('Payment method saved:', result);
        },
        error: (error) => {
          console.error('Error saving payment method:', error);
        }
      });
    });
  }

  // Helper method to load ad payment methods
  loadAdPaymentMethods(adId: string | number): void {
    this.p2pAdsPaymentsService.getAdsPayments().subscribe({
      next: (payments) => {
        // Filter payments for this specific ad
        const adPayments = payments.filter(p => p.p2p_ad_id === adId);
        this.editAdPaymentMethods = adPayments.map(p => p.name || '');
      },
      error: (error) => {
        console.error('Error loading payment methods:', error);
      }
    });
  }

  // Helper method to map payment method names to IDs
  getPaymentTypeId(method: string): number {
    const paymentTypeMap: { [key: string]: number } = {
      'gcash': 1,
      'paymaya': 2,
      'bank': 3,
      'cash': 4
    };
    return paymentTypeMap[method.toLowerCase()] || 0;
  }

  ngOnInit(): void {
    this.loadMyAds();
  }
}
