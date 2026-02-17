import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService as PMessageService } from 'primeng/api';
import { TabsModule as PTabsModule } from 'primeng/tabs';
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { StepperModule as PStepperModule } from 'primeng/stepper';
import { ToastModule as PToastModule } from 'primeng/toast';

import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';
import { P2pOrder } from '../../../models/p2p-order.model';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    PTabsModule,
    PDialogModule,
    PInputTextModule,
    PButtonModule,
    PSelectModule,
    PStepperModule,
    PToastModule,
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  providers: [PMessageService],
})
export class Orders {

  constructor(
    private router: Router,
    private p2pOrdersService: P2pOrdersService,
    private pMessageService: PMessageService
  ) { }

  activeViewTab: 'my-orders' | 'my-ad-orders' = 'my-orders';
  activeStatusTab: 'in-progress' | 'completed' | 'cancelled' = 'in-progress';

  searchTerm: string = '';

  p2pMyOrders: P2pOrder[] = [];
  p2pMyAdOrders: P2pOrder[] = [];

  statusOptions = [
    { label: 'In Progress', value: 'in-progress', icon: 'pi pi-clock text-yellow-400' },
    { label: 'Completed', value: 'completed', icon: 'pi pi-check text-green-400' },
    { label: 'Cancelled', value: 'cancelled', icon: 'pi pi-times-circle text-red-400' }
  ];

  isLoading: boolean = false;

  get orders(): P2pOrder[] {
    return this.activeViewTab === 'my-orders' ? this.p2pMyOrders : this.p2pMyAdOrders;
  }

  get filteredOrders(): P2pOrder[] {
    let filtered = this.orders;

    if (this.activeStatusTab === 'in-progress') {
      filtered = filtered.filter(order => order.status === 'pending' || order.status === 'paid');
    } else {
      filtered = filtered.filter(order => order.status === this.activeStatusTab);
    }

    if (this.searchTerm && this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.order_number?.toLowerCase().includes(search) ||
        order.ordered_by_user?.full_name?.toLowerCase().includes(search) ||
        order.amount?.toString().includes(search) ||
        order.p2p_ad?.name?.toLowerCase().includes(search)
      );
    }

    return filtered;
  }

  loadOrders(): void {
    this.isLoading = true;

    this.p2pOrdersService.getP2pMyOrdersByAuthUser().subscribe({
      next: (p2pMyOrders: P2pOrder[]) => {
        this.p2pMyOrders = p2pMyOrders;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load orders.'
        });
        this.isLoading = false;
      }
    });

    this.p2pOrdersService.getP2pMyAdOrdersByAuthUser().subscribe({
      next: (p2pAdOrders: P2pOrder[]) => {
        this.p2pMyAdOrders = p2pAdOrders;
      },
      error: (error: any) => {
        this.pMessageService.add({
          severity: 'error',
          summary: error.error.error || 'Error',
          detail: error.error.message || 'Failed to load ad orders.'
        });
      }
    });
  }

  openOrderDetails(p2pOrder: P2pOrder) {
    this.router.navigate(['/p2p/order-details', p2pOrder.id]);
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
