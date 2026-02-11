import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { InputNumberModule as PInputNumberModule } from 'primeng/inputnumber';
import { ToastModule as PToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Chain } from '../../../models/chain.model';
import { P2pAd } from '../../../models/p2p-ad.model';
import { P2pAdPaymentType } from '../../../models/p2p-ad-payment-type.model';
import { CreateP2pOrderDto } from '../../../models/p2p-order.model';

import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';
import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';

interface Offer {
  id: string;
  type: string;
  merchant: string;
  orders: number;
  completion: number;
  price: number;
  available: number;
  asset: string;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
}

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
  providers: [MessageService],
})
export class Marketplace {
  @Input() activeTab: 'buy' | 'sell' = 'buy';

  constructor(
    private p2pAdsService: P2pAdsService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) { }

  paymentTypes: string[] = ['GCash', 'Bank Transfer'];
  selectedPaymentType: string | undefined;

  searchTerm: string = '';

  allAds: P2pAd[] = [];
  adPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();
  isLoading = signal(false);

  buyOffers: Offer[] = [];
  sellOffers: Offer[] = [];

  // Order creation dialog
  showCreateOrderDialog = signal(false);
  selectedOffer: Offer | null = null;
  orderAmount: number = 0;
  orderQuantity: number = 0;
  selectedPaymentTypeId: string = '';
  selectedAdPaymentTypes: P2pAdPaymentType[] = [];
  isCreatingOrder = signal(false);

  loadAds(): void {
    this.isLoading.set(true);

    this.p2pAdsService.getAds().subscribe({
      next: (ads) => {
        this.allAds = ads;

        // Load payment types for each ad
        let completedRequests = 0;
        const totalAds = ads.length;

        if (totalAds === 0) {
          this.transformAds();
          this.isLoading.set(false);
          return;
        }

        ads.forEach(ad => {
          this.p2pAdPaymentTypesService.getAdPaymentTypesByP2pAd(ad.id).subscribe({
            next: (paymentTypes) => {
              this.adPaymentTypesMap.set(ad.id, paymentTypes);
              completedRequests++;

              if (completedRequests === totalAds) {
                this.transformAds();
                this.isLoading.set(false);
              }
            },
            error: (error) => {
              console.error('Error loading payment types for ad', ad.id, error);
              completedRequests++;

              if (completedRequests === totalAds) {
                this.transformAds();
                this.isLoading.set(false);
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading ads:', error);
        this.isLoading.set(false);
      }
    });
  }

  transformAds(): void {
    this.buyOffers = this.allAds
      .filter(ad => ad.type === 'buy' && ad.status === 'active')
      .map(ad => this.transformAdToOffer(ad));

    this.sellOffers = this.allAds
      .filter(ad => ad.type === 'sell' && ad.status === 'active')
      .map(ad => this.transformAdToOffer(ad));
  }

  transformAdToOffer(ad: P2pAd): Offer {
    const paymentTypes = this.adPaymentTypesMap.get(ad.id) || [];
    const paymentMethods = paymentTypes.map(pt =>
      pt.p2p_payment_type?.name || 'Unknown'
    );

    const completionRate = ad.total_orders > 0
      ? Math.round((ad.completed_orders / ad.total_orders) * 100)
      : 0;

    return {
      id: ad.id,
      type: ad.type,
      merchant: ad.name || 'Unknown Merchant',
      orders: ad.total_orders,
      completion: completionRate,
      price: ad.price,
      available: ad.available_amount,
      asset: ad.token_symbol || 'USDT',
      minLimit: ad.min_limit,
      maxLimit: ad.max_limit,
      paymentMethods: paymentMethods
    };
  }

  openCreateOrderDialog(offer: Offer): void {
    this.selectedOffer = offer;
    this.orderAmount = offer.minLimit;
    this.orderQuantity = 0;
    this.selectedPaymentTypeId = '';

    // Load payment types for this ad
    const adPaymentTypes = this.adPaymentTypesMap.get(offer.id) || [];
    this.selectedAdPaymentTypes = adPaymentTypes;

    if (adPaymentTypes.length > 0) {
      this.selectedPaymentTypeId = adPaymentTypes[0].p2p_payment_type_id;
    }

    this.showCreateOrderDialog.set(true);
  }

  closeCreateOrderDialog(): void {
    this.showCreateOrderDialog.set(false);
    this.selectedOffer = null;
    this.orderAmount = 0;
    this.orderQuantity = 0;
    this.selectedPaymentTypeId = '';
    this.selectedAdPaymentTypes = [];
  }

  calculateQuantity(): void {
    if (this.selectedOffer && this.orderAmount > 0) {
      if (this.activeTab === 'buy') {
        // Buy: User enters USD, calculate USDT quantity
        this.orderQuantity = this.orderAmount / this.selectedOffer.price;
      } else {
        // Sell: User enters USDT, calculate USD quantity
        this.orderQuantity = this.orderAmount * this.selectedOffer.price;
      }
    } else {
      this.orderQuantity = 0;
    }
  }

  calculateAmount(): void {
    if (this.selectedOffer && this.orderQuantity > 0) {
      this.orderAmount = this.orderQuantity * this.selectedOffer.price;
    }
  }

  createOrder(): void {
    if (!this.selectedOffer) return;

    // Validation
    if (this.activeTab === 'buy') {
      // Buy: Validate USD amount
      if (this.orderAmount < this.selectedOffer.minLimit) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Amount',
          detail: `Minimum amount is ${this.selectedOffer.minLimit} USD`
        });
        return;
      }

      if (this.orderAmount > this.selectedOffer.maxLimit) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Amount',
          detail: `Maximum amount is ${this.selectedOffer.maxLimit} USD`
        });
        return;
      }
    } else {
      // Sell: Validate USDT amount
      if (this.orderAmount <= 0) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Amount',
          detail: 'Please enter a valid USDT amount'
        });
        return;
      }

      if (this.orderAmount > this.selectedOffer.available) {
        this.messageService.add({
          severity: 'error',
          summary: 'Insufficient Available Amount',
          detail: `Maximum available is ${this.selectedOffer.available} USDT`
        });
        return;
      }

      // Check if calculated USD amount meets limits
      if (this.orderQuantity < this.selectedOffer.minLimit) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Amount',
          detail: `Calculated USD amount (${this.orderQuantity.toFixed(2)}) is below minimum limit of ${this.selectedOffer.minLimit} USD`
        });
        return;
      }

      if (this.orderQuantity > this.selectedOffer.maxLimit) {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid Amount',
          detail: `Calculated USD amount (${this.orderQuantity.toFixed(2)}) exceeds maximum limit of ${this.selectedOffer.maxLimit} USD`
        });
        return;
      }
    }

    if (!this.selectedPaymentTypeId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Payment Type Required',
        detail: 'Please select a payment type'
      });
      return;
    }

    this.isCreatingOrder.set(true);

    const createOrderDto: CreateP2pOrderDto = {
      p2p_ad_id: this.selectedOffer.id,
      order_type: this.selectedOffer.type,
      ordered_price: this.selectedOffer.price,
      quantity: this.orderQuantity,
      amount: this.orderAmount,
      p2p_payment_type_id: this.selectedPaymentTypeId,
      wallet_address: '',
    };

    this.p2pOrdersService.createOrder(createOrderDto).subscribe({
      next: (order) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Order Created',
          detail: `Order ${order.order_number} created successfully`
        });
        this.closeCreateOrderDialog();
        this.isCreatingOrder.set(false);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.error || 'Error',
          detail: error.error?.message || 'Failed to create order'
        });
        this.isCreatingOrder.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadAds();
  }
}
