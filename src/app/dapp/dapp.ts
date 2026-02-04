import { Component } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';

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

import { Sidebar as LayoutSidebar } from './layout/sidebar/sidebar'
import { Header as LayoutHeader } from './layout/header/header'
import { Footer as LayoutFooter } from './layout/footer/footer'

@Component({
  selector: 'app-dapp',
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
    LayoutSidebar,
    LayoutHeader,
    LayoutFooter
  ],
  templateUrl: './dapp.html',
  styleUrl: './dapp.css'
})
export class Dapp {
  isSidebarVisible = true;
  isMobileDrawerVisible = false;
  isMobile = false;

  isGenerateDialogOpen = false;
  isXteriumMode = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile.bind(this));

    // Check for xterium URL parameter
    this.route.queryParams.subscribe(params => {
      this.isXteriumMode = params['xterium'] === 'true';
    });
  }

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
}
