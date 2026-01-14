import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule as PSelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-p2p-admin',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    PSelectModule,
    TableModule,
  ],
  templateUrl: './p2p-admin.html',
  styleUrl: './p2p-admin.css',
})
export class P2pAdmin implements OnInit {
  constructor(private router: Router) { }

  ngOnInit(): void {
    // Load initial data
  }

  // Navigation
  goBackToP2P(): void {
    this.router.navigate(['/dapp/p2p']);
  }

  // Active tab/section
  activeSection: 'users' | 'orders' = 'users';

  // User Management
  showUserDialog: boolean = false;
  userDialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedUser: any = null;
  userForm = {
    id: 0,
    username: '',
    email: '',
    fullName: '',
    role: 'user',
    status: 'active',
    verified: false,
    totalOrders: 0,
    completionRate: 0,
    joinedDate: new Date().toISOString().split('T')[0],
  };

  // User Ads
  userAds: any[] = [];

  users = [
    {
      id: 1,
      username: 'cryptoking',
      email: 'cryptoking@example.com',
      fullName: 'John Crypto',
      role: 'merchant',
      status: 'active',
      verified: true,
      totalOrders: 1523,
      completionRate: 98.5,
      joinedDate: '2025-01-15',
    },
    {
      id: 2,
      username: 'trademaster',
      email: 'trademaster@example.com',
      fullName: 'Jane Trade',
      role: 'merchant',
      status: 'active',
      verified: true,
      totalOrders: 892,
      completionRate: 99.2,
      joinedDate: '2025-02-20',
    },
    {
      id: 3,
      username: 'johndoe',
      email: 'john.doe@example.com',
      fullName: 'John Doe',
      role: 'user',
      status: 'active',
      verified: false,
      totalOrders: 12,
      completionRate: 95.0,
      joinedDate: '2025-11-10',
    },
    {
      id: 4,
      username: 'bitexchange',
      email: 'bitexchange@example.com',
      fullName: 'Bit Exchange Ltd',
      role: 'merchant',
      status: 'suspended',
      verified: true,
      totalOrders: 2341,
      completionRate: 97.8,
      joinedDate: '2024-08-05',
    },
  ];

  // All user ads data
  allUserAds: any = {
    1: [
      {
        id: 101,
        type: 'buy',
        asset: 'USDT',
        price: 1.02,
        available: 50000,
        minLimit: 100,
        maxLimit: 10000,
        paymentMethods: ['Bank Transfer', 'PayPal', 'Wise'],
        status: 'active',
        totalOrders: 45,
        createdAt: '2026-01-10',
      },
      {
        id: 102,
        type: 'sell',
        asset: 'USDT',
        price: 0.99,
        available: 25000,
        minLimit: 50,
        maxLimit: 5000,
        paymentMethods: ['Bank Transfer', 'Revolut'],
        status: 'active',
        totalOrders: 32,
        createdAt: '2026-01-08',
      },
    ],
    2: [
      {
        id: 201,
        type: 'buy',
        asset: 'USDT',
        price: 1.01,
        available: 30000,
        minLimit: 100,
        maxLimit: 8000,
        paymentMethods: ['GCash', 'Bank Transfer'],
        status: 'active',
        totalOrders: 28,
        createdAt: '2026-01-05',
      },
    ],
    3: [],
    4: [
      {
        id: 401,
        type: 'buy',
        asset: 'USDT',
        price: 1.03,
        available: 100000,
        minLimit: 200,
        maxLimit: 20000,
        paymentMethods: ['Bank Transfer', 'PayPal', 'Zelle'],
        status: 'paused',
        totalOrders: 156,
        createdAt: '2025-12-01',
      },
    ],
  };

  userRoles = ['user', 'merchant', 'admin'];
  userStatuses = ['active', 'suspended', 'banned'];

  openAddUserDialog(): void {
    this.userDialogMode = 'add';
    this.userForm = {
      id: 0,
      username: '',
      email: '',
      fullName: '',
      role: 'user',
      status: 'active',
      verified: false,
      totalOrders: 0,
      completionRate: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    this.showUserDialog = true;
  }

  openEditUserDialog(user: any): void {
    this.userDialogMode = 'edit';
    this.selectedUser = user;
    this.loadUserAds(user.id);
    this.showUserDialog = true;
  }

  openViewUserDialog(user: any): void {
    this.userDialogMode = 'view';
    this.selectedUser = user;
    this.userForm = { ...user };
    this.loadUserAds(user.id);
    this.showUserDialog = true;
  }

  loadUserAds(userId: number): void {
    this.userAds = this.allUserAds[userId] || [];
  }

  saveUser(): void {
    if (this.userDialogMode === 'add') {
      this.userForm.id = this.users.length + 1;
      this.users.push({ ...this.userForm });
    } else if (this.userDialogMode === 'edit') {
      const index = this.users.findIndex((u) => u.id === this.userForm.id);
      if (index !== -1) {
        this.users[index] = { ...this.userForm };
      }
    }
    this.showUserDialog = false;
  }

  deleteUser(user: any): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.users = this.users.filter((u) => u.id !== user.id);
    }
  }

  // Ad Orders Dialog
  showAdOrdersDialog: boolean = false;
  selectedAd: any = null;
  adOrders: any[] = [];

  openAdOrdersDialog(ad: any): void {
    this.selectedAd = ad;
    this.loadAdOrders(ad.id);
    this.showAdOrdersDialog = true;
  }

  loadAdOrders(adId: number): void {
    // Simulated orders for this ad
    const allAdOrders: any = {
      101: [
        {
          id: 'ORD-2026-001',
          buyer: 'UserA',
          amount: 500,
          total: 510,
          paymentMethod: 'Bank Transfer',
          status: 'completed',
          createdAt: '2026-01-12 14:30',
        },
        {
          id: 'ORD-2026-005',
          buyer: 'UserB',
          amount: 1000,
          total: 1020,
          paymentMethod: 'PayPal',
          status: 'pending',
          createdAt: '2026-01-13 09:15',
        },
      ],
      102: [
        {
          id: 'ORD-2026-003',
          buyer: 'UserC',
          amount: 750,
          total: 742.5,
          paymentMethod: 'Revolut',
          status: 'completed',
          createdAt: '2026-01-11 16:00',
        },
      ],
      201: [
        {
          id: 'ORD-2026-002',
          buyer: 'UserD',
          amount: 2000,
          total: 2020,
          paymentMethod: 'GCash',
          status: 'paid',
          createdAt: '2026-01-10 11:30',
        },
      ],
      401: [],
    };
    this.adOrders = allAdOrders[adId] || [];
  }

  // Orders Management
  showOrderDetailsDialog: boolean = false;
  selectedOrder: any = null;

  orders = [
    {
      id: 'ORD-2026-001',
      userId: 1,
      username: 'cryptoking',
      type: 'buy',
      asset: 'USDT',
      amount: 500,
      price: 1.02,
      total: 510,
      merchant: 'TradeMaster',
      paymentMethod: 'Bank Transfer',
      status: 'completed',
      createdAt: '2026-01-12 14:30',
      completedAt: '2026-01-12 15:45',
    },
    {
      id: 'ORD-2026-002',
      userId: 2,
      username: 'trademaster',
      type: 'sell',
      asset: 'USDT',
      amount: 1000,
      price: 0.99,
      total: 990,
      merchant: 'ProTrader',
      paymentMethod: 'PayPal',
      status: 'pending',
      createdAt: '2026-01-13 10:15',
      completedAt: null,
    },
    {
      id: 'ORD-2026-003',
      userId: 3,
      username: 'johndoe',
      type: 'buy',
      asset: 'USDT',
      amount: 2500,
      price: 1.01,
      total: 2525,
      merchant: 'BitExchange',
      paymentMethod: 'GCash',
      status: 'paid',
      createdAt: '2026-01-13 09:20',
      completedAt: null,
    },
  ];

  openOrderDetailsDialog(order: any): void {
    this.selectedOrder = order;
    this.loadChatMessages(order.id);
    this.showOrderDetailsDialog = true;
  }

  // Chat Messages
  chatMessages: any[] = [];

  loadChatMessages(orderId: string): void {
    // Simulated chat messages
    this.chatMessages = [
      {
        sender: 'merchant',
        senderName: 'TradeMaster',
        message: 'Hello! I\'ve received your order. Please proceed with the payment.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        sender: 'user',
        senderName: 'CryptoKing',
        message: 'Payment sent! Transaction ID: TXN123456789',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        sender: 'merchant',
        senderName: 'TradeMaster',
        message: 'Thank you! Verifying payment now...',
        timestamp: new Date(Date.now() - 900000).toISOString(),
      },
      {
        sender: 'merchant',
        senderName: 'TradeMaster',
        message: 'Payment confirmed! Releasing USDT to your wallet.',
        timestamp: new Date(Date.now() - 600000).toISOString(),
      },
    ];
  }

  formatMessageTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      active: 'text-green-400',
      suspended: 'text-yellow-400',
      banned: 'text-red-400',
      pending: 'text-yellow-400',
      paid: 'text-blue-400',
      completed: 'text-green-400',
      cancelled: 'text-red-400',
      disputed: 'text-orange-400',
      paused: 'text-yellow-400',
    };
    return colors[status] || 'text-slate-400';
  }

  getStatusBadgeClass(status: string): string {
    const classes: any = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      suspended: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      banned: 'bg-red-500/20 text-red-400 border-red-500/30',
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      paid: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
      disputed: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };
    return classes[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
}
