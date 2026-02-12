import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { StepperModule } from 'primeng/stepper';

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
    ToastModule,
    StepperModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  providers: [MessageService],
})
export class Orders {

  constructor(
    private router: Router,
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) { }

  activeStatusTab: 'pending' | 'paid' | 'completed' | 'cancelled' = 'pending';
  showOrderDetailsDialog: boolean = false;
  showOrderChatDialog: boolean = false;
  isLoading: boolean = false;

  selectedOrder: P2pOrder | null = null;
  chatMessage: string = '';
  chatMessages: Array<{ sender: string; senderName: string; message: string; timestamp: string }> = [];

  orders: P2pOrder[] = [];

  get filteredOrders(): P2pOrder[] {
    return this.orders.filter(order => order.status === this.activeStatusTab);
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
      { sender: 'merchant', senderName: order.ordered_by_user?.full_name || 'User', message: `Hello! Please proceed with payment for ${order.order_number}.`, timestamp: new Date(Date.now() - 3600000).toISOString() },
      { sender: 'user', senderName: 'You', message: 'Payment sent! TXN123456', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ];
  }

  openOrderDetails(order: P2pOrder) {
    this.selectedOrder = order;
    this.showOrderDetailsDialog = true;
  }

  closeOrderDetails() {
    this.showOrderDetailsDialog = false;
    this.selectedOrder = null;
  }

  goToMessages(orderId: string) {
    this.router.navigate(['/p2p/messages'], { queryParams: { orderId } });
  }

  getCurrentStepIndex(): number {
    if (!this.selectedOrder) return 0;
    const statusMap: any = {
      'pending': 0,
      'paid': 1,
      'completed': 2,
      'cancelled': 0,
      'disputed': 1
    };
    return statusMap[this.selectedOrder.status] || 0;
  }

  getPaymentAccountName(): string {
    if (!this.selectedOrder?.p2p_ad?.id) return '';
    // In a real scenario, you'd need to fetch the ad payment types from the API
    // For now, we return a placeholder
    return 'Account Name from Ad Payment Types';
  }

  getPaymentAccountNumber(): string {
    if (!this.selectedOrder?.p2p_ad?.id) return '';
    // In a real scenario, you'd need to fetch the ad payment types from the API
    // For now, we return a placeholder
    return 'Account Number from Ad Payment Types';
  }

  getPaymentOtherDetails(): string {
    if (!this.selectedOrder?.p2p_ad?.id) return '';
    // In a real scenario, you'd need to fetch the ad payment types from the API
    // For now, we return a placeholder
    return '';
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

  ngOnInit(): void {
    this.loadOrders();
  }
}
