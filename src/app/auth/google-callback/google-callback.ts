import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-callback',
  imports: [CommonModule],
  templateUrl: './google-callback.html',
  styleUrl: './google-callback.css',
})
export class GoogleCallback implements OnInit {
  loginStatus: string = 'Processing your login...';
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const data = params['data'];
      if (data) {
        this.handleGoogleCallback(data);
      } else {
        this.errorMessage = 'No authentication data received';
        setTimeout(() => {
          this.router.navigate(['/p2p']);
        }, 2000);
      }
    });
  }

  handleGoogleCallback(authData: string): void {
    try {
      // Parse the authentication data JSON
      const data = JSON.parse(authData);

      this.loginStatus = 'Saving your credentials...';

      // Store everything in one google_user object
      localStorage.setItem('google_user', JSON.stringify(data));

      this.loginStatus = 'Login successful! Redirecting...';

      // Redirect to P2P page after a short delay
      setTimeout(() => {
        this.router.navigate(['/p2p']);
      }, 1500);
    } catch (error) {
      this.errorMessage = 'Failed to process authentication data';
      console.error('Failed to parse authentication data:', error);

      setTimeout(() => {
        this.router.navigate(['/p2p']);
      }, 2000);
    }
  }
}
