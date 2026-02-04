import { Component, signal, inject } from '@angular/core';
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
import { P2pAdPaymentTypesService } from '../../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';

import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../../../models/p2p-ad.model';
import { P2pPaymentType } from '../../../../models/p2p-payment-type.model'
import { P2pAdPaymentType, CreateP2pAdPaymentTypeDto, UpdateP2pAdPaymentTypeDto } from '../../../../models/p2p-ad-payment-type.model';

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
  adPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();
  paymentTypes: P2pPaymentType[] = [];
  selectedPaymentType: P2pPaymentType | undefined;

  assetOptions = [
    { label: 'USDT', value: 'USDT' }
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
    token_symbol: 'USDT',
    price: 0,
    available_amount: 0,
    min_limit: 0,
    max_limit: 0,
    payment_instructions: '',
    total_orders: 0,
    completed_orders: 0,
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date()
  };
  newAdPaymentTypes: P2pAdPaymentType[] = [];
  newAdPaymentTypeForm: P2pAdPaymentType = {
    id: '',
    p2p_ad_id: '',
    p2p_ad: undefined,
    p2p_payment_type_id: '',
    p2p_payment_type: undefined,
    account_name: '',
    account_number: '',
    attachments: [],
    other_details: '',
    created_at: new Date(),
    updated_at: new Date()
  };

  showEditDialog = signal(false);
  editAd: P2pAd = {
    id: '',
    user_id: '',
    type: 'sell',
    p2p_number: '',
    logo_url: '',
    name: '',
    token_symbol: 'USDT',
    price: 0,
    available_amount: 0,
    min_limit: 0,
    max_limit: 0,
    payment_instructions: '',
    total_orders: 0,
    completed_orders: 0,
    status: 'draft',
    created_at: new Date(),
    updated_at: new Date()
  };
  editAdPaymentTypes: P2pAdPaymentType[] = [];
  originalAdPaymentTypes: P2pAdPaymentType[] = [];
  paymentTypesToDelete: string[] = [];
  editAdPaymentTypeForm: P2pAdPaymentType = {
    id: '',
    p2p_ad_id: '',
    p2p_ad: undefined,
    p2p_payment_type_id: '',
    p2p_payment_type: undefined,
    account_name: '',
    account_number: '',
    attachments: [],
    other_details: '',
    created_at: new Date(),
    updated_at: new Date()
  };
  isEditingPaymentType = false;
  editingPaymentTypeIndex: number = -1;

  showDeleteDialog = signal(false);
  selectedAdForDelete: P2pAd | null = null;

  isLoading = signal(false);

  loadMyAds(): void {
    this.isLoading.set(true);

    this.p2pAdsService.getAdsByAuthUser().subscribe({
      next: (ads) => {
        this.myAds = ads;
        this.loadPaymentTypes();

        // Load payment types for each ad
        ads.forEach(ad => {
          this.p2pAdPaymentTypesService.getAdPaymentTypesByP2pAd(ad.id).subscribe({
            next: (paymentTypes) => {
              this.adPaymentTypesMap.set(ad.id, paymentTypes);
            },
            error: (error) => {
              console.error('Error loading payment types for ad', ad.id, error);
            }
          });
        });

        this.isLoading.set(false);
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
        this.selectedPaymentType = paymentTypes.length > 0 ? paymentTypes[0] : undefined;
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
      token_symbol: 'USDT',
      price: 0,
      available_amount: 0,
      min_limit: 0,
      max_limit: 0,
      payment_instructions: '',
      total_orders: 0,
      completed_orders: 0,
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date()
    };
    this.newAdPaymentTypes = [];
    this.resetNewPaymentTypeForm();
  }

  resetNewPaymentTypeForm(): void {
    this.newAdPaymentTypeForm = {
      id: '',
      p2p_ad_id: '',
      p2p_ad: undefined,
      p2p_payment_type_id: '',
      p2p_payment_type: undefined,
      account_name: '',
      account_number: '',
      attachments: [],
      other_details: '',
      created_at: new Date(),
      updated_at: new Date()
    };
  }

  addPaymentTypeToNewAd(): void {
    if (!this.selectedPaymentType?.id || !this.newAdPaymentTypeForm.account_name || !this.newAdPaymentTypeForm.account_number) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in payment type, account name, and account number.'
      });
      return;
    }

    // Check if payment type already exists
    const isDuplicate = this.newAdPaymentTypes.some(
      pt => pt.p2p_payment_type_id === this.selectedPaymentType?.id
    );

    if (isDuplicate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Payment Type',
        detail: 'This payment type has already been added. Each payment type can only be added once.'
      });
      return;
    }

    this.newAdPaymentTypeForm.p2p_payment_type_id = this.selectedPaymentType.id;

    const newPaymentType: P2pAdPaymentType = {
      id: `temp_${Date.now()}`,
      p2p_ad_id: '',
      p2p_ad: undefined,
      p2p_payment_type_id: this.newAdPaymentTypeForm.p2p_payment_type_id,
      p2p_payment_type: undefined,
      account_name: this.newAdPaymentTypeForm.account_name,
      account_number: this.newAdPaymentTypeForm.account_number,
      attachments: [],
      other_details: this.newAdPaymentTypeForm.other_details,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.newAdPaymentTypes.push(newPaymentType);
    this.resetNewPaymentTypeForm();

    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Payment method added!'
    });
  }

  removePaymentTypeFromNewAd(index: number): void {
    this.newAdPaymentTypes.splice(index, 1);
    this.messageService.add({
      severity: 'info',
      summary: 'Removed',
      detail: 'Payment method removed.'
    });
  }

  getPaymentTypeName(id: string): string {
    return this.paymentTypes.find(pt => pt.id === id)?.name || 'Unknown';
  }

  getAdPaymentTypes(adId: string): P2pAdPaymentType[] {
    return this.adPaymentTypesMap.get(adId) || [];
  }

  submitAd(): void {
    if (this.newAdPaymentTypes.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please add at least one payment method.'
      });
      return;
    }

    this.isLoading.set(true);

    const payload: CreateP2pAdDto = {
      type: this.newAd.type,
      logo_url: this.newAd.logo_url,
      name: this.newAd.name,
      token_symbol: this.newAd.token_symbol,
      price: this.newAd.price,
      available_amount: this.newAd.available_amount,
      min_limit: this.newAd.min_limit,
      max_limit: this.newAd.max_limit,
      payment_instructions: this.newAd.payment_instructions,
    };

    this.p2pAdsService.createAd(payload).subscribe({
      next: (createdAd) => {
        // Create payment types for the new ad
        const paymentTypeObservables = this.newAdPaymentTypes.map(pt => {
          const paymentPayload: CreateP2pAdPaymentTypeDto = {
            p2p_ad_id: createdAd.id,
            p2p_payment_type_id: pt.p2p_payment_type_id,
            account_name: pt.account_name,
            account_number: pt.account_number,
            attachments: [],
            other_details: pt.other_details
          };
          return this.p2pAdPaymentTypesService.createAdPaymentType(paymentPayload);
        });

        // Wait for all payment types to be created
        if (paymentTypeObservables.length > 0) {
          let completed = 0;
          paymentTypeObservables.forEach(obs => {
            obs.subscribe({
              next: () => {
                completed++;
                if (completed === paymentTypeObservables.length) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Advertisement created successfully!'
                  });
                  this.loadMyAds();
                  this.closeCreateDialog();
                  this.isLoading.set(false);
                }
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create payment method: ' + (error.error?.message || 'Unknown error')
                });
                this.isLoading.set(false);
              }
            });
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Advertisement created successfully!'
          });
          this.loadMyAds();
          this.closeCreateDialog();
          this.isLoading.set(false);
        }
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
        this.editAdPaymentTypes = JSON.parse(JSON.stringify(payments));
        this.originalAdPaymentTypes = JSON.parse(JSON.stringify(payments));
        this.paymentTypesToDelete = [];
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

  resetEditPaymentTypeForm(): void {
    this.editAdPaymentTypeForm = {
      id: '',
      p2p_ad_id: '',
      p2p_ad: undefined,
      p2p_payment_type_id: '',
      p2p_payment_type: undefined,
      account_name: '',
      account_number: '',
      attachments: [],
      other_details: '',
      created_at: new Date(),
      updated_at: new Date()
    };
    this.isEditingPaymentType = false;
    this.editingPaymentTypeIndex = -1;
    this.selectedPaymentType = undefined;
  }

  closeEditDialog(): void {
    this.showEditDialog.set(false);
    this.editAdPaymentTypes = [];
    this.originalAdPaymentTypes = [];
    this.paymentTypesToDelete = [];
    this.resetEditPaymentTypeForm();
  }

  addPaymentTypeToEditAd(): void {
    if (!this.selectedPaymentType?.id || !this.editAdPaymentTypeForm.account_name || !this.editAdPaymentTypeForm.account_number) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in payment type, account name, and account number.'
      });
      return;
    }

    // Check if payment type already exists
    const isDuplicate = this.editAdPaymentTypes.some(
      pt => pt.p2p_payment_type_id === this.selectedPaymentType?.id
    );

    if (isDuplicate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Payment Type',
        detail: 'This payment type has already been added. Each payment type can only be added once.'
      });
      return;
    }

    this.editAdPaymentTypeForm.p2p_payment_type_id = this.selectedPaymentType.id;

    const newPaymentType: P2pAdPaymentType = {
      id: `temp_${Date.now()}`,
      p2p_ad_id: this.editAd.id,
      p2p_ad: undefined,
      p2p_payment_type_id: this.editAdPaymentTypeForm.p2p_payment_type_id,
      p2p_payment_type: this.selectedPaymentType,
      account_name: this.editAdPaymentTypeForm.account_name,
      account_number: this.editAdPaymentTypeForm.account_number,
      attachments: [],
      other_details: this.editAdPaymentTypeForm.other_details,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.editAdPaymentTypes.push(newPaymentType);
    this.resetEditPaymentTypeForm();

    this.messageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method added. Click Update to save changes.'
    });
  }

  editPaymentType(paymentType: P2pAdPaymentType, index: number): void {
    this.isEditingPaymentType = true;
    this.editingPaymentTypeIndex = index;
    this.editAdPaymentTypeForm = {
      id: paymentType.id,
      p2p_ad_id: paymentType.p2p_ad_id,
      p2p_ad: paymentType.p2p_ad,
      p2p_payment_type_id: paymentType.p2p_payment_type_id,
      p2p_payment_type: paymentType.p2p_payment_type,
      account_name: paymentType.account_name,
      account_number: paymentType.account_number,
      attachments: paymentType.attachments,
      other_details: paymentType.other_details,
      created_at: paymentType.created_at,
      updated_at: paymentType.updated_at
    };

    if (this.selectedPaymentType?.id !== paymentType.p2p_payment_type_id) {
      this.selectedPaymentType = this.paymentTypes.find(pt => pt.id === paymentType.p2p_payment_type_id);
    }
  }

  updatePaymentType(): void {
    if (!this.editAdPaymentTypeForm.id || this.editingPaymentTypeIndex === -1) return;

    if (!this.selectedPaymentType?.id || !this.editAdPaymentTypeForm.account_name || !this.editAdPaymentTypeForm.account_number) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in payment type, account name, and account number.'
      });
      return;
    }

    // Check if payment type already exists (excluding current one being edited)
    const isDuplicate = this.editAdPaymentTypes.some(
      (pt, index) => pt.p2p_payment_type_id === this.selectedPaymentType?.id && index !== this.editingPaymentTypeIndex
    );

    if (isDuplicate) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Payment Type',
        detail: 'This payment type has already been added. Each payment type can only be added once.'
      });
      return;
    }

    this.editAdPaymentTypeForm.p2p_payment_type_id = this.selectedPaymentType.id;
    this.editAdPaymentTypeForm.p2p_payment_type = this.selectedPaymentType;
    this.editAdPaymentTypeForm.updated_at = new Date();

    this.editAdPaymentTypes[this.editingPaymentTypeIndex] = { ...this.editAdPaymentTypeForm };

    this.resetEditPaymentTypeForm();
    this.messageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method updated. Click Update to save changes.'
    });
  }

  deletePaymentType(paymentTypeId: string): void {
    const paymentType = this.editAdPaymentTypes.find(pt => pt.id === paymentTypeId);

    // If it's an existing payment type (not temp), mark for deletion
    if (paymentType && !paymentTypeId.startsWith('temp_')) {
      this.paymentTypesToDelete.push(paymentTypeId);
    }

    // Remove from the list
    this.editAdPaymentTypes = this.editAdPaymentTypes.filter(pt => pt.id !== paymentTypeId);

    this.messageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method marked for deletion. Click Update to save changes.'
    });
  }

  updateAd(): void {
    if (this.editAdPaymentTypes.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please add at least one payment method.'
      });
      return;
    }

    this.isLoading.set(true);

    const { id, ...updateDto } = this.editAd;
    const payload: UpdateP2pAdDto = {
      type: updateDto.type,
      logo_url: updateDto.logo_url,
      name: updateDto.name,
      price: updateDto.price,
      available_amount: updateDto.available_amount,
      min_limit: updateDto.min_limit,
      max_limit: updateDto.max_limit,
      payment_instructions: updateDto.payment_instructions,
    };

    this.p2pAdsService.updateAd(id, payload).subscribe({
      next: (updatedAd) => {
        // Process payment type changes
        this.processPaymentTypeChanges();
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

  processPaymentTypeChanges(): void {
    let pendingOperations = 0;
    let completedOperations = 0;
    let hasErrors = false;

    // Delete payment types
    const deleteOps = this.paymentTypesToDelete.map(id => {
      pendingOperations++;
      return this.p2pAdPaymentTypesService.deleteAdPaymentType(id);
    });

    // Create new payment types (temp IDs)
    const createOps = this.editAdPaymentTypes
      .filter(pt => pt.id.startsWith('temp_'))
      .map(pt => {
        pendingOperations++;
        const payload: CreateP2pAdPaymentTypeDto = {
          p2p_ad_id: this.editAd.id,
          p2p_payment_type_id: pt.p2p_payment_type_id,
          account_name: pt.account_name,
          account_number: pt.account_number,
          attachments: [],
          other_details: pt.other_details
        };
        return this.p2pAdPaymentTypesService.createAdPaymentType(payload);
      });

    // Update existing payment types
    const updateOps = this.editAdPaymentTypes
      .filter(pt => !pt.id.startsWith('temp_'))
      .filter(pt => {
        const original = this.originalAdPaymentTypes.find(opt => opt.id === pt.id);
        return original && (
          original.p2p_payment_type_id !== pt.p2p_payment_type_id ||
          original.account_name !== pt.account_name ||
          original.account_number !== pt.account_number ||
          original.other_details !== pt.other_details
        );
      })
      .map(pt => {
        pendingOperations++;
        const payload: UpdateP2pAdPaymentTypeDto = {
          p2p_payment_type_id: pt.p2p_payment_type_id,
          account_name: pt.account_name,
          account_number: pt.account_number,
          other_details: pt.other_details
        };
        return this.p2pAdPaymentTypesService.updateAdPaymentType(pt.id, payload);
      });

    const checkCompletion = () => {
      completedOperations++;
      if (completedOperations === pendingOperations) {
        if (!hasErrors) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Advertisement and payment methods updated successfully!'
          });
        }
        this.loadMyAds();
        this.closeEditDialog();
        this.isLoading.set(false);
      }
    };

    if (pendingOperations === 0) {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Advertisement updated successfully!'
      });
      this.loadMyAds();
      this.closeEditDialog();
      this.isLoading.set(false);
      return;
    }

    // Execute all operations
    deleteOps.forEach(obs => {
      obs.subscribe({
        next: () => checkCompletion(),
        error: (error: any) => {
          hasErrors = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to delete payment method.'
          });
          checkCompletion();
        }
      });
    });

    createOps.forEach(obs => {
      obs.subscribe({
        next: () => checkCompletion(),
        error: (error: any) => {
          hasErrors = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create payment method.'
          });
          checkCompletion();
        }
      });
    });

    updateOps.forEach(obs => {
      obs.subscribe({
        next: () => checkCompletion(),
        error: (error: any) => {
          hasErrors = true;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update payment method.'
          });
          checkCompletion();
        }
      });
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
