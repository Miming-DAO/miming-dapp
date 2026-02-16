import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { P2pOrder } from '../../../models/p2p-order.model';

@Component({
  selector: 'app-order-details',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  providers: [MessageService],
})
export class OrderDetails implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) { }

  orderId: string = '';
  viewType: 'my-orders' | 'my-ad-orders' = 'my-orders';
  order: P2pOrder | null = null;
  isLoading: boolean = false;
  showMobileOrderDetails: boolean = false;

  // Payment proof upload
  showPaymentProofDialog: boolean = false;
  selectedFile: File | null = null;
  paymentReference: string = '';

  // Chat
  chatMessage: string = '';
  chatMessages: Array<{
    sender: 'me' | 'other';
    senderName: string;
    message: string;
    timestamp: Date;
    avatar?: string;
  }> = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      if (this.orderId) {
        this.loadOrderDetails();
        this.loadChatMessages();
      }
    });

    this.route.queryParams.subscribe(params => {
      this.viewType = params['view'] || 'my-orders';
    });
  }

  loadOrderDetails(): void {
    this.isLoading = true;
    // TODO: Implement actual API call
    // For now, using the existing service
    this.p2pOrdersService.getOrdersByAuthUser().subscribe({
      next: (orders: P2pOrder[]) => {
        this.order = orders.find(o => o.id === this.orderId) || null;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load order details.'
        });
        this.isLoading = false;
      }
    });
  }

  loadChatMessages(): void {
    // TODO: Load actual chat messages from backend
    // Mock data for now
    this.chatMessages = [
      {
        sender: 'other',
        senderName: 'John Seller',
        message: 'Hello! Thanks for your order. Please proceed with the payment.',
        timestamp: new Date(Date.now() - 3600000),
        avatar: ''
      },
      {
        sender: 'me',
        senderName: 'You',
        message: 'Payment sent! Reference: TXN123456',
        timestamp: new Date(Date.now() - 1800000)
      }
    ];
  }

  sendMessage(): void {
    if (!this.chatMessage || !this.chatMessage.trim()) return;

    const newMessage = {
      sender: 'me' as const,
      senderName: 'You',
      message: this.chatMessage.trim(),
      timestamp: new Date()
    };

    this.chatMessages.push(newMessage);
    this.chatMessage = '';

    // TODO: Send message to backend
    // Scroll to bottom
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
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
    if (!this.selectedFile || !this.order) return;

    this.messageService.add({
      severity: 'success',
      summary: 'Proof Uploaded',
      detail: 'Your payment proof has been submitted successfully.'
    });

    this.closePaymentProofDialog();
    this.loadOrderDetails();
  }

  confirmPaymentReceived(orderId: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Payment Confirmed',
      detail: 'Payment has been confirmed. The order is now complete.'
    });
    this.loadOrderDetails();
  }

  cancelOrder(orderId: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Order Cancelled',
      detail: 'The order has been cancelled successfully.'
    });
    this.loadOrderDetails();
  }

  goBack(): void {
    this.router.navigate(['/p2p/orders'], {
      queryParams: { view: this.viewType }
    });
  }

  formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}
