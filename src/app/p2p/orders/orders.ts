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

  activeStatusTab: 'in-progress' | 'completed' | 'cancelled' = 'in-progress';
  showOrderDetailsDialog: boolean = false;
  showOrderChatDialog: boolean = false;
  showPaymentProofDialog: boolean = false;
  isLoading: boolean = false;

  selectedOrder: P2pOrder | null = null;
  selectedFile: File | null = null;
  paymentReference: string = '';
  chatMessage: string = '';
  chatMessages: Array<{ sender: string; senderName: string; message: string; timestamp: string }> = [];

  orders: P2pOrder[] = [];

  get filteredOrders(): P2pOrder[] {
    if (this.activeStatusTab === 'in-progress') {
      // In Progress includes 'pending' and 'paid' statuses
      return this.orders.filter(order => order.status === 'pending' || order.status === 'paid');
    }
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

  openPaymentProofDialog(): void {
    this.showPaymentProofDialog = true;
  }

  closePaymentProofDialog(): void {
    this.showPaymentProofDialog = false;
    this.selectedFile = null;
    this.paymentReference = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: 'Please upload a file smaller than 10MB.'
        });
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadPaymentProof(): void {
    if (!this.selectedFile || !this.selectedOrder) return;

    // TODO: Implement actual file upload to backend
    // For now, simulate the upload and status change
    this.messageService.add({
      severity: 'success',
      summary: 'Proof Uploaded',
      detail: 'Your payment proof has been submitted. The seller will verify your payment.'
    });

    // Close dialogs and reload orders
    this.closePaymentProofDialog();
    this.closeOrderDetails();
    this.loadOrders();
  }

  confirmPaymentReceived(orderId: string): void {
    // TODO: Implement API call to confirm payment and complete order
    this.messageService.add({
      severity: 'success',
      summary: 'Payment Confirmed',
      detail: 'You have confirmed payment received. The crypto will be released to the buyer.'
    });

    // Reload orders to reflect status change
    this.loadOrders();
    this.closeOrderDetails();
  }

  cancelOrder(orderId: string): void {
    // TODO: Implement API call to cancel order
    this.messageService.add({
      severity: 'warn',
      summary: 'Order Cancelled',
      detail: 'The order has been cancelled successfully.'
    });

    // Reload orders to reflect status change
    this.loadOrders();
    this.closeOrderDetails();
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
