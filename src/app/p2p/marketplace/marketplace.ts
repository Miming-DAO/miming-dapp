import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService as PMessageService } from 'primeng/api';
import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { InputNumberModule as PInputNumberModule } from 'primeng/inputnumber';
import { ToastModule as PToastModule } from 'primeng/toast';

import { P2pAd } from '../../../models/p2p-ad.model';
import { P2pAdPaymentType } from '../../../models/p2p-ad-payment-type.model';
import { P2pPaymentType } from '../../../models/p2p-payment-type.model';
import { P2pOrder, CreateP2pOrderDto } from '../../../models/p2p-order.model';

import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';
import { P2pPaymentTypesService } from '../../../services/p2p-payment-types/p2p-payment-types.service';
import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-marketplace',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
    PInputNumberModule,
    PToastModule,
  ],
  templateUrl: './marketplace.html',
  styleUrl: './marketplace.css',
  providers: [PMessageService],
})
export class Marketplace {

  constructor(
    private router: Router,
    private p2pAdsService: P2pAdsService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private p2pPaymentTypesService: P2pPaymentTypesService,
    private p2pOrdersService: P2pOrdersService,
    private pMessageService: PMessageService
  ) { }

  currentUser: User | null = null;

  activeTab: 'buy' | 'sell' = 'buy';

  p2pAds: P2pAd[] = [];
  p2pAdPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();

  selectedP2pAd: P2pAd | null = null;

  paymentTypes: P2pPaymentType[] = [];
  selectedPaymentType: P2pPaymentType | undefined;

  searchTerm: string = '';

  showCreateOrderDialog: boolean = false;
  p2pOrderForm: P2pOrder = {
    id: "",
    p2p_ad_id: "",
    p2p_ad: undefined,
    order_number: "",
    order_type: "buy",
    ordered_price: 0,
    quantity: 0,
    amount: 0,
    p2p_payment_type_id: "",
    p2p_payment_type: undefined,
    ordered_by_user_id: "",
    ordered_by_user: undefined,
    status: "",
    created_at: new Date(),
    updated_at: new Date(),
  };
  orderInputMode: 'amount' | 'quantity' = 'amount';
  isCreatingOrder: boolean = false;

  tradingTerms: string = 'By proceeding with this trade, you agree to complete the transaction within the specified time frame. Ensure all payment details are accurate before confirmation. Disputes should be resolved through the platform\'s resolution center. Cancel or modify orders only if permitted by the advertiser. Both parties must comply with local regulations and platform policies.';

  isLoading: boolean = false;

  get filteredOffers(): P2pAd[] {
    let offers = this.p2pAds.filter(ad =>
      ad.ordering_type === this.activeTab && ad.status === 'active'
    );

    if (this.selectedPaymentType) {
      offers = offers.filter(ad => {
        const adPaymentTypes = this.getAdPaymentTypes(ad.id);
        return adPaymentTypes.some(pt =>
          pt.p2p_payment_type?.name === this.selectedPaymentType!.name
        );
      });
    }

    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      offers = offers.filter(ad => {
        const merchantMatch = ad.name?.toLowerCase().includes(searchLower);
        const adPaymentTypes = this.getAdPaymentTypes(ad.id);
        const paymentMatch = adPaymentTypes.some(pt =>
          pt.p2p_payment_type?.name?.toLowerCase().includes(searchLower)
        );
        return merchantMatch || paymentMatch;
      });
    }

    return offers;
  }

  loadP2pAds(): void {
    this.isLoading = true;

    this.p2pAdsService.getP2pAds().subscribe({
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

  getAdPaymentTypes(p2pAdId: string): P2pAdPaymentType[] {
    return this.p2pAdPaymentTypesMap.get(p2pAdId) || [];
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

  resetP2pOrderForm(): void {
    this.p2pOrderForm = {
      id: "",
      p2p_ad_id: "",
      p2p_ad: undefined,
      order_number: "",
      order_type: "buy",
      ordered_price: 0,
      quantity: 0,
      amount: 0,
      p2p_payment_type_id: "",
      p2p_payment_type: undefined,
      ordered_by_user_id: "",
      ordered_by_user: undefined,
      status: "",
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.selectedP2pAd = null;
    this.selectedPaymentType = this.paymentTypes.length > 0 ? this.paymentTypes[0] : undefined;
  }

  createOrder(ad: P2pAd): void {
    this.resetP2pOrderForm();

    this.selectedP2pAd = ad;
    this.orderInputMode = 'amount';

    if (this.selectedPaymentType) {
      this.p2pOrderForm.p2p_payment_type_id = this.selectedPaymentType?.id;
    }

    this.p2pOrderForm.amount = ad.min_limit;
    this.p2pOrderForm.quantity = 0;

    this.calculateQuantity();

    this.showCreateOrderDialog = true;
  }

  calculateQuantity(): void {
    if (this.selectedP2pAd && this.selectedP2pAd.price > 0) {
      this.p2pOrderForm.quantity = this.p2pOrderForm.amount / this.selectedP2pAd.price;
    } else {
      this.p2pOrderForm.quantity = 0;
    }
  }

  calculateAmount(): void {
    if (this.selectedP2pAd) {
      this.p2pOrderForm.amount = this.p2pOrderForm.quantity * this.selectedP2pAd.price;
    }
  }

  confirmCreateOrder(): void {
    if (!this.selectedP2pAd) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'No Advertisement Selected',
        detail: 'Please select an advertisement to create an order'
      });
      return;
    };

    if (this.p2pOrderForm.amount <= 0) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Invalid Quantity or Amount',
        detail: 'Please enter a valid amount'
      });
      return;
    }

    if (this.p2pOrderForm.amount < this.selectedP2pAd.min_limit) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Invalid Quantity or Amount',
        detail: `Minimum amount is ${this.selectedP2pAd.min_limit} USD`
      });
      return;
    }

    if (this.p2pOrderForm.amount > this.selectedP2pAd.max_limit) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Invalid Quantity or Amount',
        detail: `Maximum amount is ${this.selectedP2pAd.max_limit} USD`
      });
      return;
    }

    if (!this.selectedPaymentType) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Payment Type Required',
        detail: 'Please select a payment type'
      });
      return;
    }

    this.isCreatingOrder = true;

    const createOrderDto: CreateP2pOrderDto = {
      p2p_ad_id: this.selectedP2pAd.id,
      order_type: this.selectedP2pAd.ordering_type,
      ordered_price: this.selectedP2pAd.price,
      quantity: this.p2pOrderForm.quantity,
      amount: this.p2pOrderForm.amount,
      p2p_payment_type_id: this.p2pOrderForm.p2p_payment_type_id,
      ordered_by_user_id: this.currentUser?.id || ''
    };

    this.p2pOrdersService.createP2pOrder(createOrderDto).subscribe({
      next: (order) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Order Created',
          detail: `Order ${order.order_number} created successfully`
        });

        setTimeout(() => {
          this.router.navigate(['/p2p/order-details', order.id]);
        }, 1000);
      },
      error: (error) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error?.error || 'Error',
          detail: error.error?.message || 'Failed to create order'
        });
        this.isCreatingOrder = false;
      }
    });
  }

  closeCreateOrderDialog(): void {
    this.resetP2pOrderForm();
    this.showCreateOrderDialog = false;
    this.orderInputMode = 'amount';
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
