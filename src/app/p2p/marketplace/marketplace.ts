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
import { Chain } from '../../../models/chain.model';

import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';
import { P2pPaymentTypesService } from '../../../services/p2p-payment-types/p2p-payment-types.service';
import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { ChainsService } from '../../../services/chains/chains.service';
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
    private chainsService: ChainsService,
    private pMessageService: PMessageService
  ) { }

  currentUser: User | null = null;

  activeTab: 'buy' | 'sell' = 'buy';

  p2pPaymentTypes: P2pPaymentType[] = [];
  selectedP2pPaymentType: P2pPaymentType | undefined;

  searchTerm: string = '';

  p2pAds: P2pAd[] = [];
  p2pAdsPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();

  selectedP2pAd: P2pAd | null = null;
  p2pAdPaymentTypes: P2pAdPaymentType[] = [];
  selectedP2pAdPaymentType: P2pAdPaymentType | undefined;

  chains: Chain[] = [];
  selectedChain: Chain | undefined;

  showCreateOrderDialog: boolean = false;
  showConfirmOrderDialog: boolean = false;
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
    wallet_chain: "",
    wallet_address: "",
    account_name: "",
    account_number: "",
    ordered_by_user_id: "",
    ordered_by_user: undefined,
    proof_attachment_url_1: "",
    proof_attachment_url_2: "",
    proof_attachment_url_3: "",
    p2p_conversation_id: "",
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

    if (this.selectedP2pPaymentType) {
      offers = offers.filter(ad => {
        const adPaymentTypes = this.getAdPaymentTypes(ad.id);
        return adPaymentTypes.some(pt =>
          pt.p2p_payment_type?.name === this.selectedP2pPaymentType!.name
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

  loadP2pPaymentTypes(): void {
    this.isLoading = true;

    this.p2pPaymentTypesService.getP2pPaymentTypes().subscribe({
      next: (p2pPaymentTypes) => {
        this.p2pPaymentTypes = p2pPaymentTypes;
        this.selectedP2pPaymentType = p2pPaymentTypes.length > 0 ? p2pPaymentTypes[0] : undefined;

        this.loadP2pAds();
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

  loadP2pAds(): void {
    this.p2pAdsService.getP2pAds().subscribe({
      next: (p2pAds) => {
        this.p2pAds = p2pAds;

        p2pAds.forEach(p2pAd => {
          this.p2pAdPaymentTypesService.getP2pAdPaymentTypesByP2pAd(p2pAd.id).subscribe({
            next: (p2pPaymentTypes) => {
              this.p2pAdsPaymentTypesMap.set(p2pAd.id, p2pPaymentTypes);
            },
            error: (error) => {
              console.error('Error loading payment types for ad', p2pAd.id, error);
            }
          });
        });

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

  loadP2pAdPaymentTypes(p2pAdId: string): void {
    this.p2pAdPaymentTypesService.getP2pAdPaymentTypesByP2pAd(p2pAdId).subscribe({
      next: (p2pAdPaymentTypes) => {
        this.p2pAdPaymentTypes = p2pAdPaymentTypes;
        this.selectedP2pAdPaymentType = p2pAdPaymentTypes.length > 0 ? p2pAdPaymentTypes[0] : undefined;

        if (this.selectedP2pAdPaymentType) {
          this.p2pOrderForm.p2p_payment_type_id = this.selectedP2pAdPaymentType?.p2p_payment_type_id;
        }
      },
      error: (error) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load payment types for the selected advertisement. Please try again.'
        });
      }
    });
  }

  getAdPaymentTypes(p2pAdId: string): P2pAdPaymentType[] {
    return this.p2pAdsPaymentTypesMap.get(p2pAdId) || [];
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
      wallet_chain: "",
      wallet_address: "",
      account_name: "",
      account_number: "",
      ordered_by_user_id: "",
      ordered_by_user: undefined,
      proof_attachment_url_1: "",
      proof_attachment_url_2: "",
      proof_attachment_url_3: "",
      p2p_conversation_id: "",
      status: "",
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.selectedP2pAd = null;

    this.p2pAdPaymentTypes = [];
    this.selectedP2pAdPaymentType = undefined;
  }

  loadChains(): void {
    this.chainsService.getChainsByNetworkId(1).subscribe({
      next: (chains: Chain[]) => {
        this.chains = chains;
        this.selectedChain = chains[0] || undefined;
        if (this.selectedChain) {
          this.p2pOrderForm.wallet_chain = this.selectedChain.name;
        }
      },
      error: (error) => {
        console.error('Error loading chains:', error);
      }
    });
  }

  onChainSelected(): void {
    if (this.selectedChain) {
      this.p2pOrderForm.wallet_chain = this.selectedChain.name;
    }
  }

  createOrder(p2pAd: P2pAd): void {
    // Store wallet address before reset
    const savedWalletAddress = this.p2pOrderForm.wallet_address;

    this.resetP2pOrderForm();

    this.selectedP2pAd = p2pAd;
    this.orderInputMode = 'amount';

    this.loadP2pAdPaymentTypes(p2pAd.id);

    this.p2pOrderForm.amount = p2pAd.min_limit;
    this.p2pOrderForm.quantity = 0;

    // Restore wallet address for buy orders
    if (this.activeTab === 'buy') {
      this.p2pOrderForm.wallet_address = savedWalletAddress;
    }

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

  openConfirmOrderDialog(): void {
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
        detail: `Minimum amount is ${this.selectedP2pAd.min_limit} PHP`
      });
      return;
    }

    if (this.p2pOrderForm.amount > this.selectedP2pAd.max_limit) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Invalid Quantity or Amount',
        detail: `Maximum amount is ${this.selectedP2pAd.max_limit} PHP`
      });
      return;
    }

    if (!this.selectedP2pAdPaymentType) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Payment Type Required',
        detail: 'Please select a payment type'
      });
      return;
    }

    // Validate wallet address for buy orders
    if (this.activeTab === 'buy' && !this.p2pOrderForm.wallet_address?.trim()) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Wallet Address Required',
        detail: 'Please enter your wallet address to receive the tokens'
      });
      return;
    }

    // Validate wallet chain for buy orders
    if (this.activeTab === 'buy' && !this.p2pOrderForm.wallet_chain?.trim()) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Chain Required',
        detail: 'Please select a chain for token delivery'
      });
      return;
    }

    // Validate account details for sell orders
    if (this.activeTab === 'sell') {
      if (!this.p2pOrderForm.account_name?.trim()) {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Account Name Required',
          detail: 'Please enter your account name for receiving payment'
        });
        return;
      }
      if (!this.p2pOrderForm.account_number?.trim()) {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Account Number Required',
          detail: 'Please enter your account number for receiving payment'
        });
        return;
      }
    }

    this.p2pOrderForm.p2p_ad_id = this.selectedP2pAd.id;
    this.p2pOrderForm.order_type = this.activeTab;
    this.p2pOrderForm.ordered_price = this.selectedP2pAd.price;
    this.p2pOrderForm.ordered_by_user_id = this.currentUser?.id || '';

    if (this.selectedP2pAdPaymentType) {
      this.p2pOrderForm.p2p_payment_type_id = this.selectedP2pAdPaymentType?.p2p_payment_type_id;
    }

    this.showConfirmOrderDialog = true;
  }

  closeConfirmOrderDialog(): void {
    this.showConfirmOrderDialog = false;
  }

  confirmCreateOrder(): void {
    if (!this.selectedP2pAd) return;

    this.isCreatingOrder = true;

    const createOrderDto: CreateP2pOrderDto = {
      p2p_ad_id: this.selectedP2pAd.id,
      order_type: this.selectedP2pAd.ordering_type,
      ordered_price: this.selectedP2pAd.price,
      quantity: this.p2pOrderForm.quantity,
      amount: this.p2pOrderForm.amount,
      p2p_payment_type_id: this.p2pOrderForm.p2p_payment_type_id,
      wallet_chain: this.p2pOrderForm.wallet_chain,
      wallet_address: this.p2pOrderForm.wallet_address,
      account_name: this.p2pOrderForm.account_name,
      account_number: this.p2pOrderForm.account_number,
      ordered_by_user_id: this.currentUser?.id || '',
      p2p_conversation_id: this.p2pOrderForm.p2p_conversation_id
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
          created_at: new Date(),
          updated_at: new Date(),
        };
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth_user');
      }
    }

    const authWallet = localStorage.getItem('auth_wallet');
    if (authWallet) {
      try {
        const walletData = JSON.parse(authWallet);
        if (walletData.address) {
          this.p2pOrderForm.wallet_address = walletData.address;
        }
      } catch (error) {
        console.error('Failed to parse wallet data:', error);
        localStorage.removeItem('auth_wallet');
      }
    }
  }

  ngOnInit(): void {
    this.checkAuthStatus();

    this.loadChains();
    this.loadP2pPaymentTypes();
  }
}
