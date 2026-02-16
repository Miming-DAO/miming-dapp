import { Component } from '@angular/core';

import { SubHeader } from './sub-header/sub-header';
import { Footer as LayoutFooter } from './../layout/footer/footer';

@Component({
  selector: 'app-dex-screener',
  imports: [
    SubHeader,
    LayoutFooter
  ],
  templateUrl: './dex-screener.html',
  styleUrl: './dex-screener.css',
})
export class DexScreener {

}
