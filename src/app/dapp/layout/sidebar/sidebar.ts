import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItem as PMenuItem } from 'primeng/api';
import { MenuModule as PMenuModule } from 'primeng/menu';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { ImageModule as PImageModule } from 'primeng/image';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterModule,
    PMenuModule,
    PButtonModule,
    PImageModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() onClickGenerate = new EventEmitter<void>();

  menuItems: PMenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/application/home'],
    },
  ];

  generate() {
    this.onClickGenerate.emit();
  }
}
