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
import { P2pPaymentTypesService } from '../../../../services/p2p-payment-types/p2p-payment-types.service';
import { P2pAdPaymentTypesService } from '../../../../services/p2p-ad-payment-types/p2p-ad-payment-types';

import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../../../models/p2p-ad.model';
import { P2pPaymentType } from '../../../../models/p2p-payment-type.model'
import { P2pAdPaymentType, CreateP2pAdPaymentTypeDto } from '../../../../models/p2p-ad-payment-type.model';

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

  constructor(
    private p2pAdsService: P2pAdsService,
    private p2pPaymentTypesService: P2pPaymentTypesService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private messageService: MessageService
  ) { }

  myAds: P2pAd[] = [];
  paymentTypes: P2pPaymentType[] = [];
  assetOptions = [
    { label: 'USDT', value: 1 }
  ];
  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Paused', value: 'paused' },
    { label: 'Draft', value: 'draft' }
  ];

  showCreateDialog = signal(false);
  newAd: P2pAd = {
    id: '',
    user_id: '',
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
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date()
  };
  newAdPaymentTypes: P2pAdPaymentType[] = [];

  showEditDialog = signal(false);
  editAd: P2pAd = {
    id: '',
    user_id: '',
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
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date()
  };
  editAdPaymentTypes: P2pAdPaymentType[] = [];

  showDeleteDialog = signal(false);
  selectedAdForDelete: P2pAd | null = null;

  isLoading = signal(false);

  loadMyAds(): void {
    this.isLoading.set(true);

    this.p2pAdsService.getAdsByAuthUser().subscribe({
      next: (ads) => {
        this.myAds = ads;
        this.isLoading.set(false);

        this.loadPaymentTypes();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load your advertisements. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  loadPaymentTypes(): void {
    this.p2pPaymentTypesService.getPaymentTypes().subscribe({
      next: (paymentTypes) => {
        this.paymentTypes = paymentTypes;
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load payment types. Please try again.'
        });
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
      id: '',
      user_id: '',
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
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date()
    };
    this.newAdPaymentTypes = [];
  }

  submitAd(): void {
    this.isLoading.set(true);

    const payload: CreateP2pAdDto = {
      user_id: this.newAd.user_id,
      type: this.newAd.type,
      p2p_number: `P2P${Date.now()}`,
      logo_url: this.newAd.logo_url,
      name: this.newAd.name,
      token_id: this.newAd.token_id,
      price: this.newAd.price,
      available_amount: this.newAd.available_amount,
      limit_from: this.newAd.limit_from,
      limit_to: this.newAd.limit_to,
      payment_instructions: this.newAd.payment_instructions,
      status: this.newAd.status,
    };

    this.p2pAdsService.createAd(payload).subscribe({
      next: (createdAd) => {
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
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to create advertisement. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  openEditDialog(ad: P2pAd): void {
    this.editAd = ad;

    this.loadAdPaymentTypes(ad.id);
    this.showEditDialog.set(true);
  }

  loadAdPaymentTypes(p2p_ad_id: string): void {
    this.p2pAdPaymentTypesService.getAdPaymentTypesByP2pAd(p2p_ad_id).subscribe({
      next: (payments) => {
        this.editAdPaymentTypes = payments;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load advertisement payment types. Please try again.'
        });
      }
    });
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editAdPaymentTypes = [];
  }

  updateAd(): void {
    this.isLoading.set(true);

    const { id, ...updateDto } = this.editAd;
    const payload: UpdateP2pAdDto = {
      type: updateDto.type,
      logo_url: updateDto.logo_url,
      name: updateDto.name,
      price: updateDto.price,
      available_amount: updateDto.available_amount,
      limit_from: updateDto.limit_from,
      limit_to: updateDto.limit_to,
      payment_instructions: updateDto.payment_instructions,
    };

    this.p2pAdsService.updateAd(id, payload).subscribe({
      next: (updatedAd) => {
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete advertisement. Please try again.'
        });
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadMyAds();
  }
}
