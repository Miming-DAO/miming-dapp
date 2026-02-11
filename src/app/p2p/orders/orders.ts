import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';

import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { P2pOrder } from '../../../models/p2p-order.model';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    TabsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    PSelectModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  providers: [MessageService],
})
export class Orders {

  constructor(
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) { }

  showOrderChatDialog: boolean = false;
  isLoading: boolean = false;

  selectedOrder: P2pOrder | null = null;
  chatMessage: string = '';
  chatMessages: Array<{ sender: string; senderName: string; message: string; timestamp: string }> = [];

  orders: P2pOrder[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.p2pOrdersService.getOrdersByAuthUser().subscribe({
      next: (orders: P2pOrder[]) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load orders.'
        });
        this.isLoading = false;
      }
    });
  }

  openOrderChat(order: P2pOrder) {
    this.selectedOrder = order;
    this.showOrderChatDialog = true;
    // load placeholder chat messages (use available order fields)
    this.chatMessages = [
      { sender: 'merchant', senderName: order.wallet_address || 'User', message: `Hello! Please proceed with payment for ${order.order_number}.`, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { sender: 'user', senderName: 'You', message: 'Payment sent! TXN123456', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ];
  }

  closeOrderChat() {
    this.showOrderChatDialog = false;
    this.selectedOrder = null;
    this.chatMessages = [];
    this.chatMessage = '';
  }

  sendChatMessage() {
    const msg = this.chatMessage;
    if (msg && msg.trim()) {
      this.chatMessages.push({ sender: 'user', senderName: 'You', message: msg, timestamp: new Date().toISOString() });
      this.chatMessage = '';
    }
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
