import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';

@Component({
  selector: 'app-p2p-orders',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    PSelectModule,
  ],
  templateUrl: './p2p-orders.html',
  styleUrl: './p2p-orders.css',
})
export class P2pOrders {
  constructor() { }

  showOrderChatDialog: boolean = false;
  selectedOrder: any = null;
  chatMessage: string = '';
  chatMessages: any[] = [];

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
