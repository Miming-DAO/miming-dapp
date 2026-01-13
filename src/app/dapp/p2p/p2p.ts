import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-p2p',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './p2p.html',
  styleUrl: './p2p.css',
})
export class P2p {
  // User login state (simulated)
  isP2PUserLoggedIn: boolean = true; // Set to true to show menu

  // Mobile menu toggle
  mobileMenuOpen: boolean = false;

  // Active menu item
  activeMenu: 'marketplace' | 'my-ads' | 'orders' = 'marketplace';

  // Active tab
  activeTab: 'buy' | 'sell' = 'buy';

  // Order chat
  showOrderChatDialog: boolean = false;
  selectedOrder: any = null;
  chatMessage: string = '';
  chatMessages: any[] = [];

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

  // My Ads - User's own advertisements
  myAds = [
    {
      id: 101,
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      price: 1.02,
      available: 10000,
      minLimit: 100,
      maxLimit: 5000,
      paymentMethods: ['Bank Transfer', 'PayPal'],
      status: 'active' as 'active' | 'paused' | 'inactive',
      totalOrders: 45,
      createdAt: '2026-01-10'
    },
    {
      id: 102,
      type: 'sell' as 'buy' | 'sell',
      asset: 'USDT',
      price: 0.99,
      available: 8000,
      minLimit: 50,
      maxLimit: 3000,
      paymentMethods: ['Wise', 'Revolut'],
      status: 'active' as 'active' | 'paused' | 'inactive',
      totalOrders: 32,
      createdAt: '2026-01-08'
    },
    {
      id: 103,
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      price: 1.01,
      available: 15000,
      minLimit: 200,
      maxLimit: 10000,
      paymentMethods: ['Bank Transfer'],
      status: 'paused' as 'active' | 'paused' | 'inactive',
      totalOrders: 28,
      createdAt: '2026-01-05'
    }
  ];

  // Orders - Transaction history
  orders = [
    {
      id: 'ORD-2026-001',
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      amount: 500,
      price: 1.02,
      total: 510,
      merchant: 'CryptoKing',
      paymentMethod: 'Bank Transfer',
      status: 'completed' as 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed',
      createdAt: '2026-01-12 14:30',
      completedAt: '2026-01-12 15:45'
    },
    {
      id: 'ORD-2026-002',
      type: 'sell' as 'buy' | 'sell',
      asset: 'USDT',
      amount: 1000,
      price: 0.99,
      total: 990,
      merchant: 'ProTrader',
      paymentMethod: 'PayPal',
      status: 'pending' as 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed',
      createdAt: '2026-01-13 10:15',
      completedAt: null
    },
    {
      id: 'ORD-2026-003',
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      amount: 2500,
      price: 1.01,
      total: 2525,
      merchant: 'TradeMaster',
      paymentMethod: 'Wise',
      status: 'paid' as 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed',
      createdAt: '2026-01-13 09:20',
      completedAt: null
    },
    {
      id: 'ORD-2026-004',
      type: 'sell' as 'buy' | 'sell',
      asset: 'USDT',
      amount: 750,
      price: 0.98,
      total: 735,
      merchant: 'FastCash',
      paymentMethod: 'Revolut',
      status: 'completed' as 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed',
      createdAt: '2026-01-11 16:00',
      completedAt: '2026-01-11 17:30'
    },
    {
      id: 'ORD-2026-005',
      type: 'buy' as 'buy' | 'sell',
      asset: 'USDT',
      amount: 3000,
      price: 1.02,
      total: 3060,
      merchant: 'BitExchange',
      paymentMethod: 'Bank Transfer',
      status: 'cancelled' as 'pending' | 'paid' | 'completed' | 'cancelled' | 'disputed',
      createdAt: '2026-01-10 12:00',
      completedAt: null
    }
  ];

  openOrderChat(order: any) {
    console.log('Opening chat for order:', order);
    this.selectedOrder = order;
    this.showOrderChatDialog = true;
    console.log('Dialog should be visible:', this.showOrderChatDialog);
    // Load existing chat messages for this order
    this.chatMessages = [
      {
        sender: 'merchant',
        senderName: order.merchant,
        message: 'Hello! I\'ve received your order. Please proceed with the payment.',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        sender: 'user',
        senderName: 'You',
        message: 'Payment sent! Transaction ID: TXN123456789',
        timestamp: new Date(Date.now() - 1800000).toISOString()
      },
      {
        sender: 'merchant',
        senderName: order.merchant,
        message: 'Thank you! Verifying payment now...',
        timestamp: new Date(Date.now() - 900000).toISOString()
      }
    ];
  }

  sendChatMessage() {
    if (this.chatMessage.trim()) {
      this.chatMessages.push({
        sender: 'user',
        senderName: 'You',
        message: this.chatMessage,
        timestamp: new Date().toISOString()
      });
      this.chatMessage = '';
    }
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'active': 'text-green-400',
      'paused': 'text-yellow-400',
      'inactive': 'text-slate-400',
      'pending': 'text-yellow-400',
      'paid': 'text-blue-400',
      'completed': 'text-green-400',
      'cancelled': 'text-red-400',
      'disputed': 'text-orange-400'
    };
    return colors[status] || 'text-slate-400';
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
}
