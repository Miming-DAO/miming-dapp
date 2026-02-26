import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

import { SubHeader } from './sub-header/sub-header';
import { Footer as LayoutFooter } from './../layout/footer/footer';

@Component({
  selector: 'app-auth',
  imports: [
    RouterModule,
    SubHeader,
    LayoutFooter
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

}
