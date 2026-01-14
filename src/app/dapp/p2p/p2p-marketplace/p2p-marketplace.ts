import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

import { Chain } from '../../../../models/chain.model';
import { ChainsService } from '../../../../services/chains/chains.service';

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
    private chainsService: ChainsService
  ) { }

  sourceChains: Chain[] = [];
  selectedSourceChain: Chain | undefined;

  paymentTypes: string[] = ['GCash', 'Bank Transfer'];
  selectedPaymentType: string | undefined;

  searchTerm: string = '';

  buyOffers = [
    {
      id: 1,
      merchant: 'CryptoKing',
      orders: 1523,
      completion: 98.5,
      price: 1.02,
      available: 50000,
      asset: 'USDT',
      minLimit: 100,
      maxLimit: 10000,
      paymentMethods: ['Bank Transfer', 'PayPal', 'Wise']
    },
    {
      id: 2,
      merchant: 'TradeMaster',
      orders: 892,
      completion: 99.2,
      price: 1.01,
      available: 25000,
      asset: 'USDT',
      minLimit: 50,
      maxLimit: 5000,
      paymentMethods: ['Bank Transfer', 'Revolut']
    },
    {
      id: 3,
      merchant: 'BitExchange',
      orders: 2341,
      completion: 97.8,
      price: 1.03,
      available: 100000,
      asset: 'USDT',
      minLimit: 200,
      maxLimit: 20000,
      paymentMethods: ['Bank Transfer', 'PayPal', 'Zelle', 'Wise']
    },
    {
      id: 4,
      merchant: 'QuickTrade',
      orders: 645,
      completion: 96.5,
      price: 1.02,
      available: 15000,
      asset: 'USDT',
      minLimit: 100,
      maxLimit: 3000,
      paymentMethods: ['PayPal', 'Venmo']
    },
    {
      id: 5,
      merchant: 'SafeSwap',
      orders: 1876,
      completion: 99.8,
      price: 1.01,
      available: 75000,
      asset: 'USDT',
      minLimit: 500,
      maxLimit: 15000,
      paymentMethods: ['Bank Transfer', 'Wise', 'Revolut']
    }
  ];

  sellOffers = [
    {
      id: 6,
      merchant: 'ProTrader',
      orders: 1234,
      completion: 98.9,
      price: 0.99,
      available: 40000,
      asset: 'USDT',
      minLimit: 100,
      maxLimit: 8000,
      paymentMethods: ['Bank Transfer', 'PayPal']
    },
    {
      id: 7,
      merchant: 'FastCash',
      orders: 567,
      completion: 97.2,
      price: 0.98,
      available: 20000,
      asset: 'USDT',
      minLimit: 50,
      maxLimit: 4000,
      paymentMethods: ['Wise', 'Revolut']
    },
    {
      id: 8,
      merchant: 'TrustExchange',
      orders: 3421,
      completion: 99.5,
      price: 0.99,
      available: 150000,
      asset: 'USDT',
      minLimit: 300,
      maxLimit: 25000,
      paymentMethods: ['Bank Transfer', 'PayPal', 'Zelle']
    },
    {
      id: 9,
      merchant: 'SwiftPay',
      orders: 789,
      completion: 96.8,
      price: 0.98,
      available: 30000,
      asset: 'USDT',
      minLimit: 100,
      maxLimit: 5000,
      paymentMethods: ['PayPal', 'Venmo', 'Wise']
    },
    {
      id: 10,
      merchant: 'SecureMarket',
      orders: 2156,
      completion: 99.1,
      price: 0.99,
      available: 80000,
      asset: 'USDT',
      minLimit: 200,
      maxLimit: 12000,
      paymentMethods: ['Bank Transfer', 'Revolut']
    }
  ];

  getSourceChains(): void {
    this.chainsService.getChainsByNetworkId(1).subscribe({
      next: (chains: Chain[]) => {
        this.sourceChains = chains;
        this.selectedSourceChain = this.sourceChains[0] || undefined;
      }
    });
  }

  ngOnInit(): void {
    this.getSourceChains();
    // Show coming soon dialog when component loads
    // this.showComingSoonDialog = true;
  }

}
