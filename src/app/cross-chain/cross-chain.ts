import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

import { SubHeader } from './sub-header/sub-header';
import { Footer as LayoutFooter } from './../layout/footer/footer';

@Component({
  selector: 'app-cross-chain',
  imports: [
    RouterModule,
    SubHeader,
    LayoutFooter
  ],
  templateUrl: './cross-chain.html',
  styleUrl: './cross-chain.css',
})
export class CrossChain {

}
