import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); 
  const router = inject(Router); 

  const isAuthenticated = authService.isAuthenticated(); 
  // console.log('AuthGuard', isAuthenticated); 
  if (isAuthenticated) {
    // console.log('AuthGuard: User is authenticated, granting access.'); 
    return of(true); 
  } else {
    router.navigate(['/login']);
    return of(false); 
  }
};
