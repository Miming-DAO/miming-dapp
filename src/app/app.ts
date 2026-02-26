import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Drawer as PDrawer } from 'primeng/drawer'
import { DialogModule as PDialogModule } from 'primeng/dialog';
import { ButtonModule as PButtonModule } from 'primeng/button';
import { CardModule as PCardModule } from 'primeng/card';
import { TabsModule as PTabsModule } from 'primeng/tabs';
import { PanelModule as PPanelModule } from 'primeng/panel';
import { FileUploadModule as PFileUploadModule } from 'primeng/fileupload';
import { DividerModule as PDividerModule } from 'primeng/divider';
import { TextareaModule as PTextareaModule } from 'primeng/textarea';
import { InputTextModule as PInputTextModule } from 'primeng/inputtext';

import { Header as LayoutHeader } from './layout/header/header'
import { Sidebar as LayoutSidebar } from './layout/sidebar/sidebar'

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    PDrawer,
    PDialogModule,
    PButtonModule,
    PCardModule,
    PTabsModule,
    PPanelModule,
    PFileUploadModule,
    PDividerModule,
    PTextareaModule,
    PInputTextModule,
    LayoutHeader,
    LayoutSidebar,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'miming-dapp';

  isSidebarVisible = true;
  isMobileDrawerVisible = false;
  isMobile = false;

  isGenerateDialogOpen = false;

  constructor() { }

  checkIfMobile() {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isSidebarVisible = false;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.isMobileDrawerVisible = !this.isMobileDrawerVisible;
    } else {
      this.isSidebarVisible = !this.isSidebarVisible;
    }
  }

  closeMobileDrawer() {
    this.isMobileDrawerVisible = false;
  }

  generate() {
    this.isGenerateDialogOpen = true;
  }

  ngOnInit() {
    const element = document.querySelector('html') as HTMLElement;
    element.classList.toggle('my-app-dark');

    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));
  }
}
