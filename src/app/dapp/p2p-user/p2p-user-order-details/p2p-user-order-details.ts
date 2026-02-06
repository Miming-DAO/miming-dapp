import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

import { P2pOrdersService } from '../../../../services/p2p-orders/p2p-orders.service';
import { P2pOrder } from '../../../../models/p2p-order.model';

interface ChatMessage {
  sender: 'user' | 'merchant' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  type?: 'text' | 'image' | 'system';
  imageUrl?: string;
}

@Component({
  selector: 'app-p2p-user-order-details',
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './p2p-user-order-details.html',
  styleUrl: './p2p-user-order-details.css',
  providers: [MessageService],
})
export class P2pUserOrderDetails implements OnInit, OnChanges {
  @Input() orderId: string = '';
  @Output() backToOrders = new EventEmitter<void>();

  order: P2pOrder | null = null;
  isLoading: boolean = false;
  chatMessage: string = '';
  chatMessages: ChatMessage[] = [];
  showOrderInfo: boolean = false;
  showPaymentDialog: boolean = false;
  selectedPaymentProof: File | null = null;
  paymentProofPreview: string | null = null;
  isProcessing: boolean = false;

  constructor(
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.loadOrderDetails(this.orderId);
    }
  }

  ngOnChanges(): void {
    if (this.orderId) {
      this.loadOrderDetails(this.orderId);
    }
  }

  loadOrderDetails(orderId: string): void {
    this.isLoading = true;

    this.p2pOrdersService.getOrderById(orderId).subscribe({
      next: (order: P2pOrder) => {
        this.order = order;
        this.isLoading = false;
        this.initializeChatMessages(order);
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.error || 'Error',
          detail: error.error?.message || 'Failed to load order details.'
        });
        this.isLoading = false;
      }
    });
  }

  initializeChatMessages(order: P2pOrder): void {
    this.chatMessages = [
      {
        sender: 'system',
        senderName: 'System',
        message: `Order #${order.order_number || order.id} has been created.`,
        timestamp: typeof order.created_at === 'string' ? order.created_at : new Date().toISOString(),
        type: 'system'
      },
      {
        sender: 'merchant',
        senderName: 'Merchant',
        message: order.p2p_ad?.type === 'buy'
          ? `Hello! I'm ready to sell you ${this.formatNumber(order.quantity)} USDT for $${this.formatNumber(order.amount)}. Please proceed with the payment.`
          : `Hello! Please transfer ${this.formatNumber(order.quantity)} USDT to complete this order. I will release $${this.formatNumber(order.amount)} once confirmed.`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'text'
      }
    ];
  }

  sendChatMessage(): void {
    if (this.chatMessage && this.chatMessage.trim()) {
      this.chatMessages.push({
        sender: 'user',
        senderName: 'You',
        message: this.chatMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      });
      this.chatMessage = '';
      this.scrollToBottom();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedPaymentProof = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.paymentProofPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please select an image file.'
      });
    }
  }

  uploadPaymentProof(): void {
    if (!this.selectedPaymentProof) return;

    this.isProcessing = true;

    // Simulate upload - replace with actual API call
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'user',
        senderName: 'You',
        message: 'Payment proof uploaded',
        timestamp: new Date().toISOString(),
        type: 'image',
        imageUrl: this.paymentProofPreview || ''
      });

      this.chatMessages.push({
        sender: 'system',
        senderName: 'System',
        message: 'Payment proof has been uploaded. Waiting for merchant verification.',
        timestamp: new Date().toISOString(),
        type: 'system'
      });

      this.selectedPaymentProof = null;
      this.paymentProofPreview = null;
      this.isProcessing = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment proof uploaded successfully.'
      });

      this.scrollToBottom();
    }, 1500);
  }

  markAsPaid(): void {
    if (!this.order) return;

    this.isProcessing = true;

    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'system',
        senderName: 'System',
        message: 'Order marked as paid. Waiting for merchant to release USDT tokens.',
        timestamp: new Date().toISOString(),
        type: 'system'
      });

      if (this.order) {
        this.order.status = 'paid';
      }

      this.isProcessing = false;
      this.showPaymentDialog = false;
      this.selectedPaymentProof = null;
      this.paymentProofPreview = null;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Order marked as paid. Waiting for token release.'
      });

      this.scrollToBottom();
    }, 1500);
  }

  releaseTokens(): void {
    if (!this.order) return;

    this.isProcessing = true;

    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      this.chatMessages.push({
        sender: 'system',
        senderName: 'System',
        message: `${this.formatNumber(this.order?.quantity || 0)} USDT has been released to the buyer. Transaction completed.`,
        timestamp: new Date().toISOString(),
        type: 'system'
      });

      if (this.order) {
        this.order.status = 'completed';
      }

      this.isProcessing = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Tokens released successfully.'
      });

      this.scrollToBottom();
    }, 1500);
  }

  toggleOrderInfo(): void {
    this.showOrderInfo = !this.showOrderInfo;
  }

  openPaymentDialog(): void {
    this.showPaymentDialog = true;
    this.selectedPaymentProof = null;
    this.paymentProofPreview = null;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(2);
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'paid': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
      'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
      'disputed': 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };

    return classes[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }

  goBack(): void {
    this.backToOrders.emit();
  }
}
