import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

import { Chain } from '../../../../models/chain.model';
import { P2pAd } from '../../../../models/p2p-ad.model';
import { P2pAdPaymentType } from '../../../../models/p2p-ad-payment-type.model';

import { ChainsService } from '../../../../services/chains/chains.service';
import { P2pAdsService } from '../../../../services/p2p-ads/p2p-ads.service';
import { P2pAdPaymentTypesService } from '../../../../services/p2p-ad-payment-types/p2p-ad-payment-types';

@Component({
  selector: 'app-p2p-marketplace',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
  ],
  templateUrl: './p2p-marketplace.html',
  styleUrl: './p2p-marketplace.css',
})
export class P2pMarketplace {
  @Input() activeTab: 'buy' | 'sell' = 'buy';

  constructor(
    private chainsService: ChainsService,
    private p2pAdsService: P2pAdsService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService
  ) { }

  sourceChains: Chain[] = [];
  selectedSourceChain: Chain | undefined;

  paymentTypes: string[] = ['GCash', 'Bank Transfer'];
  selectedPaymentType: string | undefined;

  searchTerm: string = '';

  allAds: P2pAd[] = [];
  adPaymentTypesMap: Map<string, P2pAdPaymentType[]> = new Map();
  isLoading = signal(false);

  buyOffers: P2pAd[] = [];
  sellOffers: P2pAd[] = [];

  getSourceChains(): void {
    this.chainsService.getChainsByNetworkId(1).subscribe({
      next: (chains: Chain[]) => {
        this.sourceChains = chains;
        this.selectedSourceChain = this.sourceChains[0] || undefined;
      }
    });
  }

  loadAds(): void {
    this.isLoading.set(true);

    this.p2pAdsService.getAds().subscribe({
      next: (ads) => {
        this.allAds = ads;
        console.log('Loaded ads:', ads);

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

  transformAdToOffer(ad: P2pAd): any {
    const paymentTypes = this.adPaymentTypesMap.get(ad.id) || [];
    const paymentMethods = paymentTypes.map(pt =>
      pt.p2p_payment_type?.name || 'Unknown'
    );

    return {
      id: ad.id,
      merchant: ad.name || 'Unknown Merchant',
      orders: ad.total_orders,
      completion: ad.completed_orders,
      price: ad.price,
      available: ad.available_amount,
      asset: 'USDT',
      minLimit: ad.min_limit,
      maxLimit: ad.max_limit,
      paymentMethods: paymentMethods
    };
  }

  ngOnInit(): void {
    this.getSourceChains();
    this.loadAds();
  }
}
