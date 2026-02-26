import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MessageService as PMessageService } from 'primeng/api';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ToastModule as PToastModule } from 'primeng/toast';

import { environment } from '../../../environments/environment';
import { User } from '../../../models/user.model';
import { P2pOrder } from '../../../models/p2p-order.model';
import { P2pAdPaymentType } from '../../../models/p2p-ad-payment-type.model';
import { P2pAdWalletAddress } from '../../../models/p2p-ad-wallet-address.model';

import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { P2pAdPaymentTypesService } from '../../../services/p2p-ad-payment-types/p2p-ad-payment-types.service';
import { P2pAdWalletAddressesService } from '../../../services/p2p-ad-wallet-addresses/p2p-ad-wallet-addresses.service';
import { P2pChatService, ConversationHistory } from '../../../services/p2p-chat/p2p-chat.service';

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
export class OrderDetails implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private p2pOrdersService: P2pOrdersService,
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private p2pAdWalletAddressesService: P2pAdWalletAddressesService,
    private p2pChatService: P2pChatService,
    private pMessageService: PMessageService
  ) { }

  private destroy$ = new Subject<void>();

  currentUser: User | null = null;

  paramsOrderId: string = '';
  paramsViewType: 'my-orders' | 'ad-orders' = 'my-orders';

  p2pOrder: P2pOrder | null = null;
  adPaymentTypes: P2pAdPaymentType[] = [];
  adWalletAddresses: P2pAdWalletAddress[] = [];

  showMobileOrderDetailsDialog: boolean = false;

  showPaymentProofDialog: boolean = false;
  selectedFiles: File[] = [];
  maxFiles: number = 3;

  showConfirmReceivedDialog: boolean = false;
  showCancelOrderDialog: boolean = false;
  showNotifyTokenDialog: boolean = false;
  showImagePreviewDialog: boolean = false;
  previewImageUrl: string = '';

  isLoading: boolean = false;

  chatMessage: string = '';
  chatMessages: Array<{
    id: string;
    sender: 'me' | 'other';
    senderName: string;
    message: string;
    timestamp: Date;
    avatar?: string;
    isRead: boolean;
  }> = [];

  isOtherUserTyping: boolean = false;
  typingTimeout: any = null;
  activeUsers: string[] = [];

  lastMessageTime: number = 0;
  messagesCooldown: number = 0;
  messageCooldownInterval: any = null;
  readonly MESSAGE_COOLDOWN = 5000; // 5 seconds in milliseconds

  get isMerchant(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id !== this.p2pOrder.ordered_by_user_id;
  }

  get isUser(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id === this.p2pOrder.ordered_by_user_id;
  }

  get isMerchantOnline(): boolean {
    if (!this.p2pOrder || !this.p2pOrder.p2p_ad?.user_id) return false;
    return this.activeUsers.includes(this.p2pOrder.p2p_ad.user_id);
  }

  get isOtherUserOnline(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;

    // Determine the other user's ID
    const otherUserId = this.isMerchant
      ? this.p2pOrder.ordered_by_user_id
      : this.p2pOrder.p2p_ad?.user_id;

    if (!otherUserId) return false;
    return this.activeUsers.includes(otherUserId);
  }

  get selectedAdPaymentType(): P2pAdPaymentType | null {
    if (!this.p2pOrder || !this.p2pOrder.p2p_payment_type_id || this.adPaymentTypes.length === 0) {
      return null;
    }
    return this.adPaymentTypes.find(pt => pt.p2p_payment_type_id === this.p2pOrder!.p2p_payment_type_id) || null;
  }

  get proofAttachments(): Array<{ url: string, type: 'image' | 'pdf', filename: string }> {
    if (!this.p2pOrder) return [];
    const attachments: Array<{ url: string, type: 'image' | 'pdf', filename: string }> = [];

    const addAttachment = (attachmentUrl: string) => {
      if (attachmentUrl) {
        const fullUrl = `${attachmentUrl}`;
        const isPdf = attachmentUrl.toLowerCase().endsWith('.pdf');
        const filename = attachmentUrl.split('/').pop() || 'attachment';
        attachments.push({
          url: fullUrl,
          type: isPdf ? 'pdf' : 'image',
          filename
        });
      }
    };

    addAttachment(this.p2pOrder.proof_attachment_url_1);
    addAttachment(this.p2pOrder.proof_attachment_url_2);
    addAttachment(this.p2pOrder.proof_attachment_url_3);

    return attachments;
  }

  get showUploadProofButton(): boolean {
    return this.isUser && this.p2pOrder?.status === 'pending';
  }

  get showNotifyTokenSentButton(): boolean {
    return this.isMerchant && this.p2pOrder?.status === 'paid';
  }

  get showConfirmTokenReceivedButton(): boolean {
    return this.isUser && this.p2pOrder?.status === 'notified';
  }

  get showCancelButton(): boolean {
    if (!this.p2pOrder) return false;
    if (this.p2pOrder.status === 'completed' || this.p2pOrder.status === 'cancelled') return false;

    if (this.p2pOrder.status === 'pending') return true;
    if (this.p2pOrder.status === 'paid') return this.isUser;

    return false;
  }

  get statusIcon(): string {
    if (!this.p2pOrder) return 'pi-clock';
    switch (this.p2pOrder.status) {
      case 'pending': return 'pi-clock';
      case 'paid': return 'pi-check-circle';
      case 'notified': return 'pi-bell';
      case 'completed': return 'pi-check';
      case 'cancelled': return 'pi-times-circle';
      default: return 'pi-clock';
    }
  }

  get statusTitle(): string {
    if (!this.p2pOrder) return '';
    const { status, order_type } = this.p2pOrder;
    switch (status) {
      case 'pending':
        return order_type === 'buy' ? 'Waiting for Payment' : 'Waiting for Token Transfer';
      case 'paid':
        return order_type === 'buy' ? 'Payment Submitted' : 'Token Transfer Submitted';
      case 'notified':
        return order_type === 'buy' ? 'Tokens Sent — Confirm Receipt' : 'Payment Sent — Confirm Receipt';
      case 'completed': return 'Order Completed!';
      case 'cancelled': return 'Order Cancelled';
      default: return '';
    }
  }

  get statusMessage(): string {
    if (!this.p2pOrder) return '';

    const { status, order_type } = this.p2pOrder;
    const tokenSymbol = this.p2pOrder.p2p_ad?.token_symbol || '';
    const amount = this.p2pOrder.amount || 0;
    const quantity = this.p2pOrder.quantity || 0;
    const price = this.p2pOrder.ordered_price || 0;

    if (status === 'pending') {
      if (this.paramsViewType === 'my-orders') {
        if (order_type === 'buy') {
          return `You are buying <span class="font-bold text-yellow-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span>. Please send <span class="font-bold text-yellow-400">₱${this.formatAmount(amount)} PHP</span> to the merchant and upload your proof of payment.`;
        } else {
          return `You are selling ${tokenSymbol} at a price of <span class="font-bold text-yellow-400">₱${this.formatAmount(price)} PHP</span> with a total amount of <span class="font-bold text-yellow-400">₱${this.formatAmount(amount)} PHP</span>. Please send <span class="font-bold text-yellow-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> to the merchant and upload your proof of payment.`;
        }
      } else {
        if (order_type === 'buy') {
          return `Waiting for the user to send <span class="font-bold text-yellow-400">₱${this.formatAmount(amount)} PHP</span> and upload their proof of payment.`;
        } else {
          return `Waiting for the user to send <span class="font-bold text-yellow-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> and upload their proof of payment.`;
        }
      }
    }

    if (status === 'paid') {
      if (this.paramsViewType === 'my-orders') {
        if (order_type === 'buy') {
          return `Your proof of payment has been submitted. Waiting for the merchant to verify your <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span> payment and send you <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span>.`;
        } else {
          return `Your proof of token transfer has been submitted. Waiting for the merchant to verify your <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> transfer and send you <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span>.`;
        }
      } else {
        if (order_type === 'buy') {
          return `The user has submitted their proof of payment. Please verify you received <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span>, then send <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> to the user's wallet and notify them.`;
        } else {
          return `The user has submitted their proof of token transfer. Please verify you received <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span>, then send <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span> to the user's account and notify them.`;
        }
      }
    }

    if (status === 'notified') {
      if (this.paramsViewType === 'my-orders') {
        if (order_type === 'buy') {
          return `The merchant has sent <span class="font-bold text-orange-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> to your wallet. Please check your wallet and confirm receipt once the tokens arrive.`;
        } else {
          return `The merchant has sent your payment of <span class="font-bold text-orange-400">₱${this.formatAmount(amount)} PHP</span> to your account. Please check your account and confirm receipt once the payment arrives.`;
        }
      } else {
        if (order_type === 'buy') {
          return `You have notified the user that <span class="font-bold text-orange-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> has been sent. Waiting for the user to confirm receipt to complete this order.`;
        } else {
          return `You have notified the user that the payment of <span class="font-bold text-orange-400">₱${this.formatAmount(amount)} PHP</span> has been sent. Waiting for the user to confirm receipt to complete this order.`;
        }
      }
    }

    if (status === 'completed') {
      return 'This order has been completed successfully. Thank you for using our P2P marketplace!';
    }

    if (status === 'cancelled') {
      return 'This order has been cancelled. If you have questions, please contact support.';
    }

    return '';
  }

  get statusColorClass(): string {
    if (!this.p2pOrder) return 'yellow';
    switch (this.p2pOrder.status) {
      case 'pending': return 'yellow';
      case 'paid': return 'blue';
      case 'notified': return 'orange';
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'yellow';
    }
  }

  get uploadProofButtonLabel(): string {
    if (!this.p2pOrder) return 'Upload Proof';
    return this.p2pOrder.order_type === 'buy' ? 'Pay & Upload Proof' : 'Transfer & Upload Proof';
  }

  get notifyButtonLabel(): string {
    if (!this.p2pOrder) return 'Notify Sent';
    const symbol = this.p2pOrder.p2p_ad?.token_symbol || 'Token';
    return this.p2pOrder.order_type === 'buy' ? `Notify ${symbol} Sent` : 'Notify Payment Sent';
  }

  get confirmButtonLabel(): string {
    if (!this.p2pOrder) return 'Confirm Received';
    const symbol = this.p2pOrder.p2p_ad?.token_symbol || 'Token';
    return this.p2pOrder.order_type === 'buy' ? `Confirm ${symbol} Received` : 'Confirm Payment Received';
  }

  private formatQuantity(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  }

  private formatAmount(value: number): string {
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  loadOrderDetails(): void {
    this.isLoading = true;

    this.p2pOrdersService.getP2pOrderById(this.paramsOrderId).subscribe({
      next: (p2pOrder: P2pOrder) => {
        this.p2pOrder = p2pOrder;
        this.isLoading = false;

        if (this.p2pOrder.p2p_ad_id) {
          this.loadAdPaymentTypes(this.p2pOrder.p2p_ad_id);
          this.loadAdWalletAddresses(this.p2pOrder.p2p_ad_id);
        }

        this.loadChatMessages();
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

  loadAdPaymentTypes(p2pAdId: string): void {
    this.p2pAdPaymentTypesService.getP2pAdPaymentTypesByP2pAd(p2pAdId).subscribe({
      next: (paymentTypes: P2pAdPaymentType[]) => {
        this.adPaymentTypes = paymentTypes;
      },
      error: (error: any) => {
        console.error('Failed to load ad payment types:', error);
      }
    });
  }

  loadAdWalletAddresses(p2pAdId: string): void {
    this.p2pAdWalletAddressesService.getP2pAdWalletAddressesByP2pAd(p2pAdId).subscribe({
      next: (walletAddresses: P2pAdWalletAddress[]) => {
        this.adWalletAddresses = walletAddresses;
      },
      error: (error: any) => {
        console.error('Failed to load ad wallet addresses:', error);
      }
    });
  }

  loadChatMessages(): void {
    if (!this.p2pOrder) return;
    this.p2pChatService.initializeSocket();

    if (this.currentUser) {
      const conversationId = this.p2pOrder.p2p_conversation_id;
      this.p2pChatService.joinConversation(conversationId, this.currentUser.id);

      this.p2pChatService.messages$
        .pipe(takeUntil(this.destroy$))
        .subscribe((conversationHistory: ConversationHistory | null) => {
          if (conversationHistory) {
            const unreadMessageIds: string[] = [];

            this.chatMessages = conversationHistory.messages.map(msg => {
              const isMine = this.isMerchant ? msg.role === 'merchant' : msg.role === 'user';
              const isRead = msg.read_by && this.currentUser ? msg.read_by.includes(this.currentUser.id) : false;

              // Track unread messages from others
              if (!isMine && !isRead && this.currentUser) {
                unreadMessageIds.push(msg._id);
              }

              // For my messages, check if OTHER user has read them
              let isReadByOther = false;
              if (isMine && msg.read_by && this.p2pOrder) {
                const otherUserId = this.isMerchant
                  ? this.p2pOrder.ordered_by_user_id
                  : this.p2pOrder.p2p_ad?.user_id;
                isReadByOther = otherUserId ? msg.read_by.includes(otherUserId) : false;
              }

              return {
                id: msg._id,
                sender: isMine ? 'me' : 'other',
                senderName: isMine ? 'You' : (this.isMerchant ? 'User' : 'Merchant'),
                message: msg.content,
                timestamp: new Date(msg.created_at),
                avatar: msg.role === 'merchant' ? this.p2pOrder?.p2p_ad?.logo_url : '',
                isRead: isReadByOther
              };
            });

            // Auto-mark unread messages as read
            if (unreadMessageIds.length > 0 && this.currentUser && this.p2pOrder) {
              setTimeout(() => {
                this.p2pChatService.markMessagesAsRead(
                  this.p2pOrder!.p2p_conversation_id,
                  this.currentUser!.id,
                  unreadMessageIds
                );
              }, 500);
            }

            setTimeout(() => {
              this.scrollChatToBottom();
            }, 100);
          }
        });

      this.p2pChatService.userTyping$
        .pipe(takeUntil(this.destroy$))
        .subscribe((typing) => {
          if (typing && typing.user_id !== this.currentUser?.id) {
            this.isOtherUserTyping = typing.isTyping;
            // Scroll to bottom when typing indicator appears/disappears
            setTimeout(() => {
              this.scrollChatToBottom();
            }, 50);
          }
        });

      this.p2pChatService.activeUsers$
        .pipe(takeUntil(this.destroy$))
        .subscribe((activeUsers) => {
          this.activeUsers = activeUsers;
        });

      this.p2pChatService.messagesRead$
        .pipe(takeUntil(this.destroy$))
        .subscribe((readData) => {
          if (readData && readData.user_id !== this.currentUser?.id) {
            // Update read status for messages
            this.chatMessages = this.chatMessages.map(msg => {
              if (readData.messageIds.includes(msg.id) && msg.sender === 'me') {
                return { ...msg, isRead: true };
              }
              return msg;
            });
            // Scroll to bottom when read status changes
            setTimeout(() => {
              this.scrollChatToBottom();
            }, 50);
          }
        });

      this.p2pChatService.connectionStatus$
        .pipe(takeUntil(this.destroy$))
        .subscribe((isConnected) => {
          if (!isConnected) {
            this.pMessageService.add({
              severity: 'warn',
              summary: 'Connection Lost',
              detail: 'Reconnecting to chat...'
            });
          } else {
            this.pMessageService.clear();
            this.pMessageService.add({
              severity: 'success',
              summary: 'Connected',
              detail: 'Reconnected to chat successfully.'
            });
          }
        });

      this.p2pChatService.error$
        .pipe(takeUntil(this.destroy$))
        .subscribe((error) => {
          if (error) {
            // Optionally handle chat errors, e.g. show a notification
          }
        });
    }
  }

  onChatInputChange(): void {
    if (!this.p2pOrder || !this.currentUser) return;

    const conversationId = this.p2pOrder.p2p_conversation_id;

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.p2pChatService.emitTyping(conversationId, this.currentUser.id, true);
    this.typingTimeout = setTimeout(() => {
      if (this.p2pOrder && this.currentUser) {
        this.p2pChatService.emitTyping(conversationId, this.currentUser.id, false);
      }
    }, 5000);
  }

  sendMessage(): void {
    if (!this.chatMessage || !this.chatMessage.trim() || !this.p2pOrder || !this.currentUser) return;

    // Check if cooldown is active
    const now = Date.now();
    const timeSinceLastMessage = now - this.lastMessageTime;

    if (timeSinceLastMessage < this.MESSAGE_COOLDOWN) {
      this.pMessageService.add({
        severity: 'warn',
        summary: 'Please wait',
        detail: `You can send the next message in ${Math.ceil((this.MESSAGE_COOLDOWN - timeSinceLastMessage) / 1000)} second(s).`
      });
      return;
    }

    const conversationId = this.p2pOrder.p2p_conversation_id;
    const content = this.chatMessage.trim();

    this.chatMessage = '';

    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    this.p2pChatService.emitTyping(conversationId, this.currentUser.id, false);

    this.p2pChatService.sendMessage(
      conversationId,
      this.currentUser.id,
      this.isMerchant ? 'merchant' : 'user',
      content
    );

    // Update last message time and start cooldown
    this.lastMessageTime = now;
    this.startMessageCooldown();

    setTimeout(() => {
      this.scrollChatToBottom();
    }, 100);
  }

  private startMessageCooldown(): void {
    this.messagesCooldown = this.MESSAGE_COOLDOWN / 1000; // Convert to seconds

    // Clear any existing interval
    if (this.messageCooldownInterval) {
      clearInterval(this.messageCooldownInterval);
    }

    // Update cooldown every 100ms for smooth countdown
    this.messageCooldownInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastMessageTime;
      const remaining = Math.max(0, this.MESSAGE_COOLDOWN - elapsed);
      this.messagesCooldown = remaining / 1000;

      if (remaining <= 0) {
        clearInterval(this.messageCooldownInterval);
        this.messageCooldownInterval = null;
        this.messagesCooldown = 0;
      }
    }, 100);
  }

  get canSendMessage(): boolean {
    if (!this.chatMessage || !this.chatMessage.trim()) return false;
    const now = Date.now();
    return (now - this.lastMessageTime) >= this.MESSAGE_COOLDOWN;
  }

  private scrollChatToBottom(): void {
    // Query all chat containers (mobile and desktop)
    const chatContainers = document.querySelectorAll('.chat-messages');
    chatContainers.forEach(container => {
      container.scrollTop = container.scrollHeight;
    });
  }

  openPaymentProofDialog(): void {
    this.showPaymentProofDialog = true;
  }

  closePaymentProofDialog(): void {
    this.showPaymentProofDialog = false;
    this.selectedFiles = [];
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];

    if (this.selectedFiles.length + files.length > this.maxFiles) {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Too Many Files',
        detail: `You can only upload up to ${this.maxFiles} files.`
      });
      return;
    }

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        this.pMessageService.add({
          severity: 'error',
          summary: 'File Too Large',
          detail: `${file.name} is larger than 10MB.`
        });
        continue;
      }
      this.selectedFiles.push(file);
    }
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  uploadPaymentProof(): void {
    if (this.selectedFiles.length === 0 || !this.p2pOrder) return;

    this.isLoading = true;

    this.p2pOrdersService.uploadProofAttachment(this.p2pOrder.id, this.selectedFiles).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Proof Uploaded',
          detail: `${this.selectedFiles.length} file(s) submitted successfully.`
        });

        this.closePaymentProofDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Upload Failed',
          detail: error.error?.message || 'Failed to upload proof of payment. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  openConfirmReceivedDialog(): void {
    this.showConfirmReceivedDialog = true;
  }

  closeConfirmReceivedDialog(): void {
    this.showConfirmReceivedDialog = false;
  }

  confirmPaymentReceived(): void {
    if (!this.p2pOrder) return;

    const isBuy = this.p2pOrder.order_type === 'buy';
    const symbol = this.p2pOrder.p2p_ad?.token_symbol || 'Token';

    this.isLoading = true;

    this.p2pOrdersService.confirmP2pOrder(this.p2pOrder.id).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Receipt Confirmed',
          detail: isBuy
            ? `${symbol} receipt confirmed. The order is now complete.`
            : 'Payment receipt confirmed. The order is now complete.'
        });

        this.closeConfirmReceivedDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Confirmation Failed',
          detail: error.error?.message || 'Failed to confirm receipt. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  openNotifyTokenDialog(): void {
    this.showNotifyTokenDialog = true;
  }

  closeNotifyTokenDialog(): void {
    this.showNotifyTokenDialog = false;
  }

  notifyUser(): void {
    if (!this.p2pOrder) return;

    const isBuy = this.p2pOrder.order_type === 'buy';
    const symbol = this.p2pOrder.p2p_ad?.token_symbol || 'Token';

    this.isLoading = true;

    this.p2pOrdersService.notifyP2pOrder(this.p2pOrder.id).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'User Notified',
          detail: isBuy
            ? `The user has been notified that ${symbol} has been sent. Waiting for them to confirm receipt.`
            : 'The user has been notified that payment has been sent. Waiting for them to confirm receipt.'
        });

        this.closeNotifyTokenDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Notification Failed',
          detail: error.error?.message || 'Failed to notify user. Please try again.'
        });
        this.isLoading = false;
      }
    });
  }

  openCancelOrderDialog(): void {
    this.showCancelOrderDialog = true;
  }

  closeCancelOrderDialog(): void {
    this.showCancelOrderDialog = false;
  }

  cancelOrder(): void {
    if (!this.p2pOrder) return;

    this.isLoading = true;

    this.p2pOrdersService.cancelP2pOrder(this.p2pOrder.id).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'warn',
          summary: 'Order Cancelled',
          detail: 'The order has been cancelled successfully.'
        });

        this.closeCancelOrderDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Cancellation Failed',
          detail: error.error?.message || 'Failed to cancel order. Please try again.'
        });
        this.isLoading = false;
      }
    });
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

  copyToClipboard(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.pMessageService.add({
        severity: 'success',
        summary: 'Copied',
        detail: `${label} copied to clipboard`
      });
    }).catch(err => {
      this.pMessageService.add({
        severity: 'error',
        summary: 'Copy Failed',
        detail: 'Failed to copy to clipboard'
      });
    });
  }

  openImagePreview(imageUrl: string): void {
    this.previewImageUrl = imageUrl;
    this.showImagePreviewDialog = true;
  }

  closeImagePreview(): void {
    this.showImagePreviewDialog = false;
    this.previewImageUrl = '';
  }

  checkAuthStatus(): void {
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const userData = JSON.parse(authUser);

        this.currentUser = {
          id: userData.user.id,
          email: userData.user.email,
          full_name: userData.user.full_name,
          username: userData.user.username,
          type: userData.user.type,
          auth_type: userData.user.auth_type,
          is_disabled: false,
          photo_url: userData.user.photo_url,
          google_account_id: userData.user.google_account_id,
          created_at: new Date(),
          updated_at: new Date(),
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
      }
    });
  }

  ngOnDestroy(): void {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    if (this.messageCooldownInterval) {
      clearInterval(this.messageCooldownInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.p2pChatService.leaveConversation();
    this.p2pChatService.disconnect();
  }
}
