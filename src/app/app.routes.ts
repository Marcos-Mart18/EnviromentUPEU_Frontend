import { Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { HomeComponent } from './home/home.component';
import { AuthLayoutComponent } from './features/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth-layout/login/login.component';
import { RegisterComponent } from './features/auth-layout/register/register.component';

export const routes: Routes = [
    {
        path: '',
        component: AuthLayoutComponent,
        children: [
        { path: '', redirectTo: 'login', pathMatch: 'full' },
        { path: 'login', component: LoginComponent },
        { path: 'register', component: RegisterComponent },
        ]
    },

    {
        path: 'main',
        component: MainComponent,
        children: [
        { path: 'home', component: HomeComponent },
        ],
    },

    { path: '**', redirectTo: '' },
];
