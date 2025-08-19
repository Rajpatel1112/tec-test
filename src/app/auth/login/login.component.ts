import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}
 

  onSubmit(): void {
    const success = this.authService.login(this.username, this.password);
    if (success) {
      this.router.navigate(['/user-info-list']); 
    } else {
      alert('Login failed! Please check your credentials.');
    }
  }
}
