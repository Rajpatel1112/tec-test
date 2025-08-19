import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { UserInfoListComponent } from './user-info-list/user-info-list.component';

export const routes: Routes = [

      { path: 'login', component: LoginComponent ,canActivate: [loginGuard]},
    { path: 'register', component: RegisterComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'user-info-list', component: UserInfoListComponent ,canActivate: [authGuard] },
];
