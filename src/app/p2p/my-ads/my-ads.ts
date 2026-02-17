import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService as PMessageService } from 'primeng/api';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { SelectModule as PSelectModule } from 'primeng/select';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { TextareaModule as PTextareaModule } from 'primeng/textarea';
import { InputNumberModule as PInputNumberModule } from 'primeng/inputnumber';
import { ToastModule as PToastModule } from 'primeng/toast';

import { User } from '../../../models/user.model';
import { Token } from '../../../models/token.model';
import { P2pAd, CreateP2pAdDto, UpdateP2pAdDto } from '../../../models/p2p-ad.model';
import { P2pPaymentType } from '../../../models/p2p-payment-type.model'
import { P2pAdPaymentType, CreateP2pAdPaymentTypeDto } from '../../../models/p2p-ad-payment-type.model';

import { TokensService } from '../../../services/tokens/tokens.service';
import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pPaymentTypesService } from '../../../services/p2p-payment-types/p2p-payment-types.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';

@Component({
  selector: 'app-my-ads',
  imports: [
    CommonModule,
    FormsModule,
    PDialogModule,
    PSelectModule,
    PInputTextModule,
    PTextareaModule,
    PInputNumberModule,
    PToastModule,
  ],
  templateUrl: './my-ads.html',
  styleUrl: './my-ads.css',
  providers: [PMessageService],
})
export class MyAds {

  constructor(
    private tokensService: TokensService,
    private p2pAdsService: P2pAdsService,
    private p2pPaymentTypesService: P2pPaymentTypesService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private pMessageService: PMessageService
  ) { }

  currentUser: User | null = null;

  p2pAds: P2pAd[] = [];
  p2pAdPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();

  paymentTypes: P2pPaymentType[] = [];
  selectedPaymentType: P2pPaymentType | undefined;

  tokens: Token[] = [];
  selectedToken: Token | undefined;

  showP2pAdDetailsDialog: boolean = false;
  p2pAdDetailsDialogMode: 'create' | 'edit' = 'create';
  p2pAdForm: P2pAd = {
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

  showP2pAdPaymentTypeDetailsDialog: boolean = false;
  p2pAdPaymentTypeDetailsDialogMode: 'create' | 'edit' = 'create';
  p2pAdPaymentTypeForm: P2pAdPaymentType = {
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
  p2pAdPaymentTypes: P2pAdPaymentType[] = [];

  showDeleteP2pAdDialog: boolean = false;
  selectedP2pAdToDelete: P2pAd | null = null;

  isLoading: boolean = false;

  loadP2pAds(): void {
    this.isLoading = true;

    this.p2pAdsService.getP2pAdsByAuthUser().subscribe({
      next: (p2pAds) => {
        this.p2pAds = p2pAds;
        p2pAds.forEach(p2pAd => {
          this.p2pAdPaymentTypesService.getP2pAdPaymentTypesByP2pAd(p2pAd.id).subscribe({
            next: (paymentTypes) => {
              this.p2pAdPaymentTypesMap.set(p2pAd.id, paymentTypes);
            },
            error: (error) => {
              console.error('Error loading payment types for ad', p2pAd.id, error);
            }
          });
        });

        this.loadP2pPaymentTypes();
        this.loadTokens();

        this.isLoading = false;
      },
      error: (error) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load your advertisements. Please try again.'
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

  getAdPaymentTypes(p2pAdId: string): P2pAdPaymentType[] {
    return this.p2pAdPaymentTypesMap.get(p2pAdId) || [];
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
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load tokens. Please try again.'
        });
      }
    });
  }

  loadP2pPaymentTypes(): void {
    this.p2pPaymentTypesService.getP2pPaymentTypes().subscribe({
      next: (p2pPaymentTypes) => {
        this.paymentTypes = p2pPaymentTypes;
        this.selectedPaymentType = p2pPaymentTypes.length > 0 ? p2pPaymentTypes[0] : undefined;
      },
      error: (error) => {
        this.pMessageService.add({
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

  resetP2pAdForm(): void {
    this.p2pAdForm = {
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

  resetP2pAdPaymentTypes(): void {
    this.p2pAdPaymentTypes = [];
  }

  resetP2pAdFormPaymentTypeForm(): void {
    this.p2pAdPaymentTypeForm = {
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
    }
  }

  createP2pAd(): void {
    this.resetP2pAdForm();
    this.resetP2pAdPaymentTypes();

    this.showP2pAdDetailsDialog = true;
    this.p2pAdDetailsDialogMode = 'create';
  }

  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageUrl = e.target?.result as string;
        this.p2pAdForm.logo_url = imageUrl;
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.p2pAdForm.logo_url = '';
  }

  createP2pPaymentType(): void {
    this.resetP2pAdFormPaymentTypeForm();

    this.showP2pAdPaymentTypeDetailsDialog = true;
    this.p2pAdPaymentTypeDetailsDialogMode = 'create';
  }

  editP2pPaymentType(p2pAdPaymentType: P2pAdPaymentType): void {
    this.resetP2pAdFormPaymentTypeForm();
    this.p2pAdPaymentTypeForm = { ...p2pAdPaymentType };

    if (this.selectedPaymentType?.id !== p2pAdPaymentType.p2p_payment_type_id) {
      this.selectedPaymentType = this.paymentTypes.find(pt => pt.id === p2pAdPaymentType.p2p_payment_type_id);
    }

    this.showP2pAdPaymentTypeDetailsDialog = true;
    this.p2pAdPaymentTypeDetailsDialogMode = 'edit';
  }

  saveP2pPaymentType(): void {
    if (!this.selectedPaymentType?.id || !this.p2pAdPaymentTypeForm.account_name || !this.p2pAdPaymentTypeForm.account_number) {
      this.pMessageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in payment type, account name, and account number.'
      });
      return;
    }

    if (this.p2pAdPaymentTypeDetailsDialogMode === 'create') {
      const isDuplicate = this.p2pAdPaymentTypes.some(
        pt => pt.p2p_payment_type_id === this.selectedPaymentType?.id
      );

      if (isDuplicate) {
        this.pMessageService.add({
          severity: 'warn',
          summary: 'Duplicate Payment Type',
          detail: 'This payment type has already been added. Each payment type can only be added once.'
        });
        return;
      }

      const newPaymentType: P2pAdPaymentType = {
        id: `temp_${Date.now()}`,
        p2p_ad_id: this.p2pAdForm.id,
        p2p_ad: undefined,
        p2p_payment_type_id: this.selectedPaymentType.id,
        p2p_payment_type: this.selectedPaymentType,
        account_name: this.p2pAdPaymentTypeForm.account_name,
        account_number: this.p2pAdPaymentTypeForm.account_number,
        attachments: [],
        other_details: this.p2pAdPaymentTypeForm.other_details,
        created_at: new Date(),
        updated_at: new Date()
      };

      this.p2pAdPaymentTypes.push(newPaymentType);

      this.pMessageService.add({
        severity: 'info',
        summary: 'Draft',
        detail: 'Payment method added. Click Update to save changes.'
      });
    } else {
      const id = this.p2pAdPaymentTypeForm.id;

      const otherP2pAdPaymentTypes = this.p2pAdPaymentTypes.filter(
        pt => pt.id !== id
      );

      if (otherP2pAdPaymentTypes.length > 0) {
        const isDuplicate = otherP2pAdPaymentTypes.some(
          pt => pt.p2p_payment_type_id === this.selectedPaymentType?.id
        );

        if (isDuplicate) {
          this.pMessageService.add({
            severity: 'warn',
            summary: 'Duplicate Payment Type',
            detail: 'This payment type has already been added. Each payment type can only be added once.'
          });
          return;
        }
      }

      this.p2pAdPaymentTypeForm.p2p_payment_type_id = this.selectedPaymentType.id;
      this.p2pAdPaymentTypeForm.p2p_payment_type = this.selectedPaymentType;
      this.p2pAdPaymentTypeForm.updated_at = new Date();

      const index = this.p2pAdPaymentTypes.findIndex(pt => pt.id === id);
      if (index !== -1) {
        this.p2pAdPaymentTypes[index] = this.p2pAdPaymentTypeForm;
      }

      this.pMessageService.add({
        severity: 'info',
        summary: 'Draft',
        detail: 'Payment method updated. Click Update to save changes.'
      });
    }

    this.closeP2pPaymentTypeDialog();
  }

  closeP2pPaymentTypeDialog(): void {
    this.resetP2pAdFormPaymentTypeForm();
    this.showP2pAdPaymentTypeDetailsDialog = false;
  }

  getPaymentTypeName(id: string): string {
    return this.paymentTypes.find(pt => pt.id === id)?.name || 'Unknown';
  }

  deleteP2pPaymentType(id: string): void {
    this.p2pAdPaymentTypes = this.p2pAdPaymentTypes.filter(pt => pt.id !== id);
    this.pMessageService.add({
      severity: 'info',
      summary: 'Draft',
      detail: 'Payment method marked for deletion. Click Update to save changes.'
    });
  }

  editP2pAd(p2pAd: P2pAd): void {
    this.resetP2pAdForm();
    this.resetP2pAdPaymentTypes();

    this.p2pAdForm = { ...p2pAd };
    this.loadAdPaymentTypes(p2pAd.id);

    if (this.selectedToken?.symbol.toLocaleUpperCase() !== p2pAd.token_symbol.toLocaleUpperCase()) {
      this.selectedToken = this.tokens.find(t => t.symbol.toLocaleUpperCase() === p2pAd.token_symbol.toLocaleUpperCase());
    }

    this.showP2pAdDetailsDialog = true;
    this.p2pAdDetailsDialogMode = 'edit';
  }

  loadAdPaymentTypes(p2pAdId: string): void {
    this.p2pAdPaymentTypesService.getP2pAdPaymentTypesByP2pAd(p2pAdId).subscribe({
      next: (payments) => {
        this.p2pAdPaymentTypes = JSON.parse(JSON.stringify(payments));
      },
      error: (error) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load advertisement payment types. Please try again.'
        });
      }
    });
  }

  saveP2pAd(): void {
    if (this.p2pAdPaymentTypes.length === 0) {
      this.pMessageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please add at least one payment method.'
      });
      return;
    }

    this.isLoading = true;

    if (this.p2pAdDetailsDialogMode === 'create') {
      const payload: CreateP2pAdDto = {
        user_id: this.currentUser?.id || '',
        type: this.p2pAdForm.type,
        logo_url: this.p2pAdForm.logo_url,
        name: this.p2pAdForm.name,
        token_symbol: this.p2pAdForm.token_symbol,
        price: this.p2pAdForm.price,
        available_amount: this.p2pAdForm.available_amount,
        min_limit: this.p2pAdForm.min_limit,
        max_limit: this.p2pAdForm.max_limit,
        payment_instructions: this.p2pAdForm.payment_instructions,
      };

      this.p2pAdsService.createP2pAd(payload).subscribe({
        next: (createdP2pAd) => {
          const paymentTypes: CreateP2pAdPaymentTypeDto[] = this.p2pAdPaymentTypes.map(pt => ({
            p2p_ad_id: createdP2pAd.id,
            p2p_payment_type_id: pt.p2p_payment_type_id,
            account_name: pt.account_name,
            account_number: pt.account_number,
            attachments: pt.attachments,
            other_details: pt.other_details
          }));

          this.p2pAdPaymentTypesService.createManyP2pAdPaymentTypes(paymentTypes).subscribe({
            next: () => {
              this.loadP2pAds();
              this.closeP2pAdDetailsDialog();

              this.pMessageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Advertisement created successfully!'
              });
              this.isLoading = false;
            },
            error: (error) => {
              this.pMessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create payment methods: ' + (error.error?.message || 'Unknown error')
              });
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          this.pMessageService.add({
            severity: 'error',
            summary: error.error.error || 'Error',
            detail: error.error.message || 'Failed to create advertisement. Please try again.'
          });
          this.isLoading = false;
        }
      });
    } else {
      const payload: UpdateP2pAdDto = {
        type: this.p2pAdForm.type,
        logo_url: this.p2pAdForm.logo_url,
        name: this.p2pAdForm.name,
        token_symbol: this.p2pAdForm.token_symbol,
        price: this.p2pAdForm.price,
        available_amount: this.p2pAdForm.available_amount,
        min_limit: this.p2pAdForm.min_limit,
        max_limit: this.p2pAdForm.max_limit,
        payment_instructions: this.p2pAdForm.payment_instructions,
      };

      this.p2pAdsService.updateP2pAd(this.p2pAdForm.id, payload).subscribe({
        next: (updatedP2pAd) => {
          this.p2pAdPaymentTypesService.deleteP2pAdPaymentTypesByP2pAd(updatedP2pAd.id).subscribe({
            next: () => {
              const paymentTypes: CreateP2pAdPaymentTypeDto[] = this.p2pAdPaymentTypes.map(pt => ({
                p2p_ad_id: updatedP2pAd.id,
                p2p_payment_type_id: pt.p2p_payment_type_id,
                account_name: pt.account_name,
                account_number: pt.account_number,
                attachments: pt.attachments,
                other_details: pt.other_details
              }));

              this.p2pAdPaymentTypesService.createManyP2pAdPaymentTypes(paymentTypes).subscribe({
                next: () => {
                  this.loadP2pAds();
                  this.closeP2pAdDetailsDialog();

                  this.pMessageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Advertisement updated successfully!'
                  });
                  this.isLoading = false;
                },
                error: (error) => {
                  this.pMessageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to create payment methods: ' + (error.error?.message || 'Unknown error')
                  });
                  this.isLoading = false;
                }
              });
            },
            error: (error) => {
              this.pMessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete old payment methods: ' + (error.error?.message || 'Unknown error')
              });
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          this.pMessageService.add({
            severity: 'error',
            summary: error.error.error || 'Error',
            detail: error.error.message || 'Failed to update advertisement. Please try again.'
          });
          this.isLoading = false;
        }
      });
    }
  }

  closeP2pAdDetailsDialog(): void {
    this.showP2pAdDetailsDialog = false;

    this.resetP2pAdForm();
    this.resetP2pAdPaymentTypes();
    this.resetP2pAdFormPaymentTypeForm();
  }

  deleteP2pAd(p2pAd: P2pAd): void {
    this.selectedP2pAdToDelete = p2pAd;
    this.showDeleteP2pAdDialog = true;
  }

  confirmDeleteP2pAd(): void {
    if (!this.selectedP2pAdToDelete) return;
    this.isLoading = true;

    this.p2pAdsService.deleteP2pAd(this.selectedP2pAdToDelete.id).subscribe({
      next: () => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Advertisement deleted successfully!'
        });

        this.loadP2pAds();
        this.closeDeleteP2pAdDialog();

        this.isLoading = false;
      },
      error: (error) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete advertisement. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  closeDeleteP2pAdDialog(): void {
    this.showDeleteP2pAdDialog = false;
    this.selectedP2pAdToDelete = null;
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
    this.loadP2pAds();
  }
}
