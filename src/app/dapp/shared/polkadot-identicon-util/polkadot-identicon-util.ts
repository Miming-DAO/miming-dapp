import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { PolkadotJsService } from '../../../../services/polkadot-js/polkadot-js.service';

@Component({
  selector: 'app-polkadot-identicon-util',
  imports: [],
  templateUrl: './polkadot-identicon-util.html',
  styleUrl: './polkadot-identicon-util.scss'
})
export class PolkadotIdenticonUtil {
  @Input() address: string = '';
  @Input() size: number = 64;

  constructor(
    private domSanitizer: DomSanitizer,
    private polkadotJsService: PolkadotJsService,
  ) { }

  iconSvg!: SafeHtml;

  ngOnInit() {
    if (this.address) {
      const rawSvg = this.polkadotJsService.generateIdenticon(this.address, this.size);
      this.iconSvg = this.domSanitizer.bypassSecurityTrustHtml(rawSvg);
    }
  }
}
