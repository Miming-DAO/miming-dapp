import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuickStats } from '../../../models/quick-stats.model';
import { User } from '../../../models/user.model';
import { P2pAd } from '../../../models/p2p-ad.model';
import { P2pOrder } from '../../../models/p2p-order.model';

import { QuickStatsService } from '../../../services/quick-stats/quick-stats.service';
import { UsersService } from '../../../services/users/users.service';
import { P2pAdsService } from '../../../services/p2p-ads/p2p-ads.service';
import { P2pOrdersService } from '../../../services/p2p-orders/p2p-orders.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  constructor(
    private quickStatsService: QuickStatsService,
    private usersService: UsersService,
    private p2pAdsService: P2pAdsService,
    private p2pOrdersService: P2pOrdersService
  ) { }

  isLoading: boolean = false;
  quickStats: QuickStats | null = null;

  recentUsers: User[] = [];
  recentAds: P2pAd[] = [];
  recentOrders: P2pOrder[] = [];

  // User stats
  totalUsers: number = 0;
  adminCount: number = 0;
  merchantCount: number = 0;
  userCount: number = 0;

  // Order stats
  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Load quick stats
    this.quickStatsService.getQuickStats().subscribe({
      next: (stats) => {
        this.quickStats = stats;
      },
      error: (error) => console.error('Error loading quick stats:', error)
    });

    // Load users
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.totalUsers = users.length;
        this.adminCount = users.filter(u => u.type === 'admin').length;
        this.merchantCount = users.filter(u => u.type === 'merchant').length;
        this.userCount = users.filter(u => u.type === 'user').length;

        // Get 5 most recent users
        this.recentUsers = users
          .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
          .slice(0, 5);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });

    // Load P2P Ads
    this.p2pAdsService.getP2pAds().subscribe({
      next: (ads) => {
        this.recentAds = ads
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading ads:', error)
    });

    // Load P2P Orders
    this.p2pOrdersService.getP2pOrders().subscribe({
      next: (orders) => {
        this.totalOrders = orders.length;
        this.pendingOrders = orders.filter(o => o.status === 'pending').length;
        this.completedOrders = orders.filter(o => o.status === 'completed').length;

        this.recentOrders = orders
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'draft':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  }
}
