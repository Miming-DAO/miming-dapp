import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { P2pOrdersService } from '../../../../services/p2p-orders/p2p-orders.service';
import { P2pOrder } from '../../../../models/p2p-order.model';

@Component({
  selector: 'app-p2p-user-orders',
  imports: [
    CommonModule,
    ToastModule,
  ],
  templateUrl: './p2p-user-orders.html',
  styleUrl: './p2p-user-orders.css',
  providers: [MessageService],
})
export class P2pUserOrders implements OnInit {
  @Input() walletAddress: string = '';
  @Output() viewOrderDetails = new EventEmitter<string>();

  orders: P2pOrder[] = [];
  isLoading: boolean = false;

  constructor(
    private p2pOrdersService: P2pOrdersService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;

    this.p2pOrdersService.getOrders().subscribe({
      next: (orders: P2pOrder[]) => {
        this.orders = orders.filter(order =>
          order.wallet_address === this.walletAddress
        );
        this.isLoading = false;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: error.error?.error || 'Error',
          detail: error.error?.message || 'Failed to load orders.'
        });
        this.isLoading = false;
      }
    });
  }

  onViewOrderDetails(order: P2pOrder): void {
    this.viewOrderDetails.emit(order.id);
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

  formatNumber(num: number): string {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}
