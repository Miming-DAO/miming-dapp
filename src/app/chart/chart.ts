import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";

import { SubHeader } from './sub-header/sub-header';
import { Footer as LayoutFooter } from './../layout/footer/footer';

@Component({
  selector: 'app-chart',
  imports: [
    RouterModule,
    SubHeader,
    LayoutFooter
  ],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class Chart {

}
