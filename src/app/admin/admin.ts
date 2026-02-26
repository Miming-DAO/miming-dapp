import { Component } from '@angular/core';

import { RouterModule } from "@angular/router";

import { SubHeader } from './sub-header/sub-header';
import { Footer as LayoutFooter } from './../layout/footer/footer';

@Component({
  selector: 'app-admin',
  imports: [
    RouterModule,
    SubHeader,
    LayoutFooter
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {

}
