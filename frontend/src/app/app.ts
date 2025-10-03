import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('frontend');
  private readonly auth = inject(AuthService);

  // Expose auth signals for template
  protected readonly isLoggedIn = this.auth.isLoggedIn;
  protected readonly userEmail = this.auth.email;

  protected logout() {
    this.auth.logout();
  }
}
