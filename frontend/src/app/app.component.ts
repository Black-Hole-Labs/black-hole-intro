import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnalyticsService } from './services/analytics.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly seo: SeoService
  ) {}

  ngOnInit() {
    this.seo.init();
    this.analytics.init('G-Y0L2CB9L6E');
  }
}
