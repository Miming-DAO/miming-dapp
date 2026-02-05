import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-p2p-user-header',
  imports: [
    CommonModule,
  ],
  templateUrl: './p2p-user-header.html',
  styleUrl: './p2p-user-header.css',
})
export class P2pUserHeader {
  private router = inject(Router);

  @Input() mobileMenuOpen: boolean = false;
  @Input() walletAddress: string = '';

  @Output() mobileMenuOpenOnClick = new EventEmitter<boolean>();

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuOpenOnClick.emit(this.mobileMenuOpen);
  }

  navigateToMarketplace(): void {
    this.router.navigate(['/dapp/p2p'], { queryParams: { xterium: 'true' } });
  }

  formatWalletAddress(address: string): string {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}
