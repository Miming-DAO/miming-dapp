import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';

import { User } from '../../../models/user.model';
import { Token } from '../../../models/token.model';
import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../../models/p2p-ad.model';
import { P2pPaymentType } from '../../../models/p2p-payment-type.model'
import { P2pAdPaymentType, CreateP2pAdPaymentTypeDto, UpdateP2pAdPaymentTypeDto } from '../../../models/p2p-ad-payment-type.model';

import { TokensService } from '../../../services/tokens/tokens.service';
import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pPaymentTypesService } from '../../../services/p2p-payment-types/p2p-payment-types.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';

@Component({
  selector: 'app-my-ads',
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
  templateUrl: './my-ads.html',
  styleUrl: './my-ads.css',
  providers: [MessageService],
})
export class MyAds {

  constructor(
    private tokensService: TokensService,
    private p2pAdsService: P2pAdsService,
    private p2pPaymentTypesService: P2pPaymentTypesService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private messageService: MessageService
  ) { }

  currentUser: User | null = null;

  myAds: P2pAd[] = [];
  myAdPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();

  paymentTypes: P2pPaymentType[] = [];
  selectedPaymentType: P2pPaymentType | undefined;

  tokens: Token[] = [];
  selectedToken: Token | undefined;

  showCreateDialog: boolean = false;
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

  showEditDialog: boolean = false;
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
  editAdPaymentTypeIndex: number = -1;

  originalAdPaymentTypes: P2pAdPaymentType[] = [];
  paymentTypesToDelete: string[] = [];

  showPaymentMethodDialog: boolean = false;
  paymentMethodDialogMode: 'create' | 'edit' = 'create';

  showDeleteDialog: boolean = false;
  selectedAdForDelete: P2pAd | null = null;

  isLoading: boolean = false;

  loadMyAds(): void {
    this.isLoading = true;

    this.p2pAdsService.getAdsByAuthUser().subscribe({
      next: (ads) => {
        this.myAds = ads;

        this.loadTokens();
        this.loadPaymentTypes();

        ads.forEach(ad => {
          this.p2pAdPaymentTypesService.getAdPaymentTypesByP2pAd(ad.id).subscribe({
            next: (paymentTypes) => {
              this.myAdPaymentTypesMap.set(ad.id, paymentTypes);
            },
            error: (error) => {
              console.error('Error loading payment types for ad', ad.id, error);
            }
          });
        });

        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load your advertisements. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  loadTokens(): void {
    this.tokensService.getAllTokens().subscribe({
      next: (tokens) => {
        const usdtToken = tokens.find(t => t.symbol.toLocaleUpperCase() === 'USDT');
        if (usdtToken) {
          this.tokens = [usdtToken];
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load tokens. Please try again.'
        });
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
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load payment types. Please try again.'
        });
      }
    });
  }

  getAdPaymentTypes(adId: string): P2pAdPaymentType[] {
    return this.myAdPaymentTypesMap.get(adId) || [];
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
    this.showCreateDialog = true;
  }

  closeCreateDialog(): void {
    this.showCreateDialog = false;

    this.resetAdForm();

    this.newAdPaymentTypes = [];
    this.resetNewPaymentTypeForm();
  }

  onImageUpload(event: Event, mode: 'create' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;
        if (mode === 'create') {
          this.newAd.logo_url = imageUrl;
        } else {
          this.editAd.logo_url = imageUrl;
        }
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(mode: 'create' | 'edit'): void {
    if (mode === 'create') {
      this.newAd.logo_url = '';
    } else {
      this.editAd.logo_url = '';
    }
  }

  resetAdForm(): void {
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

    this.selectedPaymentType = undefined;
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

    this.editAdPaymentTypeIndex = -1;
    this.selectedPaymentType = undefined;
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

    this.closePaymentMethodDialog();
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

  submitAd(): void {
    if (this.newAdPaymentTypes.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please add at least one payment method.'
      });
      return;
    }

    this.isLoading = true;

    const payload: CreateP2pAdDto = {
      user_id: this.currentUser?.id || '',
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

        if (paymentTypeObservables.length > 0) {
          let completed = 0;

          paymentTypeObservables.forEach(obs => {
            obs.subscribe({
              next: () => {
                completed++;

                if (completed === paymentTypeObservables.length) {
                  this.loadMyAds();
                  this.closeCreateDialog();

                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Advertisement created successfully!'
                  });
                  this.isLoading = false;
                }
              },
              error: (error) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: 'Failed to create payment method: ' + (error.error?.message || 'Unknown error')
                });
                this.isLoading = false;
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
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to create advertisement. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  openEditDialog(ad: P2pAd): void {
    this.editAd = ad;

    this.loadAdPaymentTypes(ad.id);
    this.showEditDialog = true;
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

  editPaymentType(paymentType: P2pAdPaymentType, index: number): void {
    this.editAdPaymentTypeIndex = index;
    this.paymentMethodDialogMode = 'edit';

    this.editAdPaymentTypeForm = paymentType;

    if (this.selectedPaymentType?.id !== paymentType.p2p_payment_type_id) {
      this.selectedPaymentType = this.paymentTypes.find(pt => pt.id === paymentType.p2p_payment_type_id);
    }

    this.showPaymentMethodDialog = true;
  }

  updatePaymentType(): void {
    if (!this.editAdPaymentTypeForm.id || this.editAdPaymentTypeIndex === -1) return;

    if (!this.selectedPaymentType?.id || !this.editAdPaymentTypeForm.account_name || !this.editAdPaymentTypeForm.account_number) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in payment type, account name, and account number.'
      });
      return;
    }

    const isDuplicate = this.editAdPaymentTypes.some(
      (pt, index) => pt.p2p_payment_type_id === this.selectedPaymentType?.id && index !== this.editAdPaymentTypeIndex
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

    this.editAdPaymentTypes[this.editAdPaymentTypeIndex] = { ...this.editAdPaymentTypeForm };

    this.resetEditPaymentTypeForm();

    this.messageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method updated. Click Update to save changes.'
    });

    this.closePaymentMethodDialog();
  }

  deletePaymentType(paymentTypeId: string): void {
    const paymentType = this.editAdPaymentTypes.find(pt => pt.id === paymentTypeId);

    if (paymentType && !paymentTypeId.startsWith('temp_')) {
      this.paymentTypesToDelete.push(paymentTypeId);
    }

    this.editAdPaymentTypes = this.editAdPaymentTypes.filter(pt => pt.id !== paymentTypeId);

    this.messageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method marked for deletion. Click Update to save changes.'
    });
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

  closeEditDialog(): void {
    this.showEditDialog = false;
    this.editAdPaymentTypes = [];
    this.originalAdPaymentTypes = [];
    this.paymentTypesToDelete = [];
    this.resetEditPaymentTypeForm();
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

    this.isLoading = true;

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
        this.processPaymentTypeChanges();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update advertisement. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  processPaymentTypeChanges(): void {
    let pendingOperations = 0;
    let completedOperations = 0;
    let hasErrors = false;

    const deleteOps = this.paymentTypesToDelete.map(id => {
      pendingOperations++;
      return this.p2pAdPaymentTypesService.deleteAdPaymentType(id);
    });

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

        this.isLoading = false;
      }
    };

    if (pendingOperations === 0) {
      this.loadMyAds();
      this.closeEditDialog();

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Advertisement updated successfully!'
      });
      this.isLoading = false;

      return;
    }

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

  openPaymentMethodDialog(mode: 'create' | 'edit'): void {
    this.paymentMethodDialogMode = mode;
    this.showPaymentMethodDialog = true;
  }

  closePaymentMethodDialog(): void {
    this.showPaymentMethodDialog = false;
    this.resetPaymentMethodForm();
  }

  resetPaymentMethodForm(): void {
    if (this.paymentMethodDialogMode === 'create') {
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
    } else {
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
    }

    this.selectedPaymentType = undefined;
    this.editAdPaymentTypeIndex = -1;
  }

  savePaymentMethod(): void {
    if (this.paymentMethodDialogMode === 'edit') {
      this.updatePaymentType();
    } else {
      if (this.paymentMethodDialogMode === 'create') {
        this.addPaymentTypeToNewAd();
      } else {
        this.addPaymentTypeToEditAd();
      }
    }
  }

  openDeleteDialog(ad: P2pAd): void {
    this.selectedAdForDelete = ad;
    this.showDeleteDialog = true;
  }

  closeDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.selectedAdForDelete = null;
  }

  confirmDelete(): void {
    if (!this.selectedAdForDelete) return;

    this.isLoading = true;

    this.p2pAdsService.deleteAd(this.selectedAdForDelete.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Advertisement deleted successfully!'
        });

        this.loadMyAds();
        this.closeDeleteDialog();

        this.isLoading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete advertisement. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'AD';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  }

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
        };
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  ngOnInit(): void {
    this.checkAuthStatus();
    this.loadMyAds();
  }
}
