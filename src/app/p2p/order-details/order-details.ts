import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

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
    private p2pAdPaymentTypesService: P2pAdPaymentTypesService,
    private p2pAdWalletAddressesService: P2pAdWalletAddressesService,
    private pMessageService: PMessageService
  ) { }

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
    sender: 'me' | 'other';
    senderName: string;
    message: string;
    timestamp: Date;
    avatar?: string;
  }> = [];

  get isMerchant(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id !== this.p2pOrder.ordered_by_user_id;
  }

  get isUser(): boolean {
    if (!this.currentUser || !this.p2pOrder) return false;
    return this.currentUser.id === this.p2pOrder.ordered_by_user_id;
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
    return this.isUser && this.p2pOrder?.status === 'paid';
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
      case 'completed': return 'pi-check';
      case 'cancelled': return 'pi-times-circle';
      default: return 'pi-clock';
    }
  }

  get statusTitle(): string {
    if (!this.p2pOrder) return '';
    switch (this.p2pOrder.status) {
      case 'pending': return 'Waiting for Payment';
      case 'paid': return 'Payment Submitted';
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
          return `Your payment proof has been uploaded. Waiting for the merchant to verify your <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span> payment and send you <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span>.`;
        } else {
          return `Your payment proof has been uploaded. Waiting for the merchant to verify your <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> payment and send you <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span>.`;
        }
      } else {
        if (order_type === 'buy') {
          return `The user has uploaded their payment proof. Please verify you received <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span> and send <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> to complete the order.`;
        } else {
          return `The user has uploaded their payment proof. Please verify you received <span class="font-bold text-blue-400">${this.formatQuantity(quantity)} ${tokenSymbol}</span> and send <span class="font-bold text-blue-400">₱${this.formatAmount(amount)} PHP</span> to complete the order.`;
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
      case 'completed': return 'green';
      case 'cancelled': return 'red';
      default: return 'yellow';
    }
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
    // TODO: Load actual chat messages from backend
    // Mock data for now - adjust based on viewType
    if (this.paramsViewType === 'my-orders') {
      // User is the user
      this.chatMessages = [
        {
          sender: 'other',
          senderName: 'Merchant',
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
      // User is the merchant (viewing order on their ad)
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
          senderName: 'User',
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

    this.isLoading = true;

    this.p2pOrdersService.confirmP2pOrder(this.p2pOrder.id).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Payment Confirmed',
          detail: 'Payment has been confirmed. The order is now complete.'
        });

        this.closeConfirmReceivedDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Confirmation Failed',
          detail: error.error?.message || 'Failed to confirm payment. Please try again.'
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

  notifyTokenSent(): void {
    if (!this.p2pOrder) return;

    this.isLoading = true;

    this.p2pOrdersService.confirmP2pOrder(this.p2pOrder.id).subscribe({
      next: (updatedOrder: P2pOrder) => {
        this.pMessageService.add({
          severity: 'success',
          summary: 'Token Sent Confirmed',
          detail: 'Order has been marked as complete. User will be notified.'
        });

        this.closeNotifyTokenDialog();
        this.loadOrderDetails();

        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: 'Confirmation Failed',
          detail: error.error?.message || 'Failed to confirm token sent. Please try again.'
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
          id: userData.user._id,
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
        this.loadChatMessages();
      }
    });
  }
}
