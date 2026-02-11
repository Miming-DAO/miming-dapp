import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';

interface ChatUser {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatar?: string;
  orderNumber: string;
  orderType: 'buy' | 'sell';
  orderAmount: number;
  orderQuantity: number;
  orderStatus: 'pending' | 'paid' | 'completed' | 'cancelled';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'merchant' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'system' | 'order-details';
  imageUrl?: string;
}

@Component({
  selector: 'app-messages',
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    DialogModule,
  ],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
  providers: [MessageService],
})
export class Messages {
  chatUsers: ChatUser[] = [];
  selectedUser: ChatUser | null = null;
  chatMessages: ChatMessage[] = [];
  newMessage: string = '';
  showOrderDetailsDialog: boolean = false;
  showPaymentDialog: boolean = false;
  selectedPaymentProof: File | null = null;
  paymentProofPreview: string | null = null;
  isProcessing: boolean = false;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadChatUsers();
  }

  loadChatUsers(): void {
    // Mock data - replace with actual API call
    this.chatUsers = [
      {
        id: '1',
        name: 'John Trader',
        lastMessage: 'Payment has been sent',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        unreadCount: 2,
        orderNumber: 'ORD-2024-001',
        orderType: 'buy',
        orderAmount: 1000,
        orderQuantity: 1000,
        orderStatus: 'paid'
      },
      {
        id: '2',
        name: 'Sarah Crypto',
        lastMessage: 'Thank you for the trade!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        unreadCount: 0,
        orderNumber: 'ORD-2024-002',
        orderType: 'sell',
        orderAmount: 500,
        orderQuantity: 500,
        orderStatus: 'completed'
      },
      {
        id: '3',
        name: 'Mike Exchange',
        lastMessage: 'When will you release?',
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        unreadCount: 1,
        orderNumber: 'ORD-2024-003',
        orderType: 'sell',
        orderAmount: 2000,
        orderQuantity: 2000,
        orderStatus: 'pending'
      },
    ];
  }

  selectUser(user: ChatUser): void {
    this.selectedUser = user;
    user.unreadCount = 0;
    this.loadChatMessages(user.id);
  }

  loadChatMessages(userId: string): void {
    // Mock data - replace with actual API call
    this.chatMessages = [
      {
        id: '1',
        sender: 'system',
        senderName: 'System',
        message: `Order #${this.selectedUser?.orderNumber} has been created.`,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        type: 'system'
      },
      {
        id: '1.5',
        sender: 'system',
        senderName: 'System',
        message: 'Order Details',
        timestamp: new Date(Date.now() - 86350000).toISOString(),
        type: 'order-details'
      },
      {
        id: '2',
        sender: 'merchant',
        senderName: this.selectedUser?.name || 'Merchant',
        message: this.selectedUser?.orderType === 'buy'
          ? `Hello! I'm ready to sell you ${this.formatNumber(this.selectedUser?.orderQuantity || 0)} USDT for $${this.formatNumber(this.selectedUser?.orderAmount || 0)}. Please proceed with the payment.`
          : `Hello! Please transfer ${this.formatNumber(this.selectedUser?.orderQuantity || 0)} USDT to complete this order. I will release $${this.formatNumber(this.selectedUser?.orderAmount || 0)} once confirmed.`,
        timestamp: new Date(Date.now() - 82800000).toISOString(),
        type: 'text'
      },
      {
        id: '3',
        sender: 'user',
        senderName: 'You',
        message: 'Sure, processing payment now.',
        timestamp: new Date(Date.now() - 79200000).toISOString(),
        type: 'text'
      },
      {
        id: '4',
        sender: 'merchant',
        senderName: this.selectedUser?.name || 'Merchant',
        message: this.selectedUser?.lastMessage || 'Great! Waiting for confirmation.',
        timestamp: new Date(Date.now() - 75600000).toISOString(),
        type: 'text'
      },
    ];
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedUser) {
      return;
    }

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      senderName: 'You',
      message: this.newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    this.chatMessages.push(message);
    this.newMessage = '';

    // Update last message in user list
    if (this.selectedUser) {
      this.selectedUser.lastMessage = message.message;
      this.selectedUser.timestamp = message.timestamp;
    }
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      const minutes = Math.floor(diff / 60000);
      return minutes > 0 ? `${minutes}m ago` : 'Just now';
    }
  }

  getOrderStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'paid':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    }
  }

  openOrderDetailsDialog(): void {
    this.showOrderDetailsDialog = true;
  }

  openPaymentDialog(): void {
    this.showPaymentDialog = true;
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
    }
  }

  markAsPaid(): void {
    if (!this.selectedUser) return;

    this.isProcessing = true;

    // Simulate API call
    setTimeout(() => {
      this.isProcessing = false;
      this.showPaymentDialog = false;

      if (this.selectedUser) {
        this.selectedUser.orderStatus = 'paid';
      }

      // Add payment proof message if available
      if (this.paymentProofPreview) {
        const message: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          senderName: 'You',
          message: 'Payment proof uploaded',
          timestamp: new Date().toISOString(),
          type: 'image',
          imageUrl: this.paymentProofPreview
        };
        this.chatMessages.push(message);
      }

      // Add system message
      const systemMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'system',
        senderName: 'System',
        message: 'Payment marked as completed. Waiting for merchant to release tokens.',
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      this.chatMessages.push(systemMessage);

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment has been marked as completed'
      });

      // Reset
      this.selectedPaymentProof = null;
      this.paymentProofPreview = null;
    }, 1500);
  }
}
