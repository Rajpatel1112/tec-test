import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {


  username: string = '';
  password: string = '';

  constructor(private authService: AuthService , private router: Router) {}
 
  
  onSubmit(): void {
    if (!this.username || !this.password) {
      alert('Please fill in both username and password.');
      return; 
    }
    this.authService.register(this.username, this.password);
    alert('Registration successful! You can now log in.');
    this.router.navigate(['/login']); 
  }
}
