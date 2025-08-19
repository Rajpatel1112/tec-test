import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  const isAuthenticated = authService.isAuthenticated(); 

  if (isAuthenticated) {
    console.log('LoginGuard: User is already authenticated');
    router.navigate(['/user-info-list']); 
    return of(false); 
  } else {
    return of(true); 
  }
};
