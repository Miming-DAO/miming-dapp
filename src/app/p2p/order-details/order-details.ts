import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MessageService as PMessageService } from 'primeng/api';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ToastModule as PToastModule } from 'primeng/toast';

import { User } from '../../../models/user.model';
import { P2pOrder } from '../../../models/p2p-order.model';

import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';

@Component({
  selector: 'app-order-details',
  imports: [
    CommonModule,
    FormsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PToastModule,
  ],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css',
  providers: [PMessageService],
})
export class OrderDetails implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private p2pOrdersService: P2pOrdersService,
    private pMessageService: PMessageService
  ) { }

  currentUser: User | null = null;

  paramsOrderId: string = '';
  paramsViewType: 'my-orders' | 'ad-orders' = 'my-orders';

  p2pOrder: P2pOrder | null = null;

  showMobileOrderDetailsDialog: boolean = false;

  showPaymentProofDialog: boolean = false;
  selectedFile: File | null = null;
  paymentReference: string = '';

  isLoading: boolean = false;

  chatMessage: string = '';
  chatMessages: Array<{
    sender: 'me' | 'other';
    senderName: string;
    message: string;
    timestamp: Date;
    avatar?: string;
  }> = [];

  get isBuyer(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id === this.p2pOrder.ordered_by_user_id;
  }

  get isSeller(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id !== this.p2pOrder.ordered_by_user_id;
  }

  // PENDING status buttons
  get showUploadProofButton(): boolean {
    return this.isBuyer && this.p2pOrder?.status === 'pending';
  }

  get showCancelButtonForPending(): boolean {
    if (!this.p2pOrder || this.p2pOrder.status !== 'pending') return false;
    return true; // Both buyer and seller can cancel during pending
  }

  // PAID status buttons
  get showNotifyUSDTSentButton(): boolean {
    return this.isSeller && this.p2pOrder?.status === 'paid';
  }

  get showConfirmUSDTReceivedButton(): boolean {
    return this.isBuyer && this.p2pOrder?.status === 'paid';
  }

  get showCancelButtonForPaid(): boolean {
    if (!this.p2pOrder || this.p2pOrder.status !== 'paid') return false;
    return this.isBuyer; // Only buyer can cancel when paid
  }

  // COMPLETED/CANCELLED - no cancel button
  get showCancelButton(): boolean {
    if (!this.p2pOrder) return false;
    if (this.p2pOrder.status === 'completed' || this.p2pOrder.status === 'cancelled') return false;

    if (this.p2pOrder.status === 'pending') return true;
    if (this.p2pOrder.status === 'paid') return this.isBuyer;

    return false;
  }

  loadOrderDetails(): void {
    this.isLoading = true;

    this.p2pOrdersService.getP2pOrderById(this.paramsOrderId).subscribe({
      next: (p2pOrder: P2pOrder) => {
        this.p2pOrder = p2pOrder;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
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
    // Mock data for now - adjust based on viewType
    if (this.paramsViewType === 'my-orders') {
      // User is the buyer
      this.chatMessages = [
        {
          sender: 'other',
          senderName: 'Seller',
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
    } else {
      // User is the seller (viewing order on their ad)
      this.chatMessages = [
        {
          sender: 'me',
          senderName: 'You',
          message: 'Hello! Thanks for your order. Please proceed with the payment.',
          timestamp: new Date(Date.now() - 3600000),
          avatar: ''
        },
        {
          sender: 'other',
          senderName: 'Buyer',
          message: 'Payment sent! Reference: TXN123456',
          timestamp: new Date(Date.now() - 1800000)
        }
      ];
    }
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
        this.pMessageService.add({
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
    if (!this.selectedFile || !this.p2pOrder) return;

    this.pMessageService.add({
      severity: 'success',
      summary: 'Proof Uploaded',
      detail: 'Your payment proof has been submitted successfully.'
    });

    this.closePaymentProofDialog();
    this.loadOrderDetails();
  }

  confirmPaymentReceived(orderId: string): void {
    this.pMessageService.add({
      severity: 'success',
      summary: 'Payment Confirmed',
      detail: 'Payment has been confirmed. The order is now complete.'
    });
    this.loadOrderDetails();
  }

  notifyUSDTSent(orderId: string): void {
    this.pMessageService.add({
      severity: 'success',
      summary: 'Notification Sent',
      detail: 'Buyer has been notified that USDT was sent.'
    });
    // TODO: Implement backend call to update order status and notify buyer
    this.loadOrderDetails();
  }

  cancelOrder(orderId: string): void {
    this.pMessageService.add({
      severity: 'warn',
      summary: 'Order Cancelled',
      detail: 'The order has been cancelled successfully.'
    });
    this.loadOrderDetails();
  }

  goBack(): void {
    this.router.navigate(['/p2p/orders'], {
      queryParams: {
        viewType: this.paramsViewType
      }
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
        };
      } catch (error) {
        console.error('Failed to parse auth data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const viewType = params['viewType'];
      if (viewType === 'my-orders') {
        this.paramsViewType = 'my-orders';
      } else if (viewType === 'ad-orders') {
        this.paramsViewType = 'ad-orders';
      }
    });

    this.checkAuthStatus();

    this.route.params.subscribe(params => {
      this.paramsOrderId = params['id'];
      if (this.paramsOrderId) {
        this.loadOrderDetails();
        this.loadChatMessages();
      }
    });
  }
}
