import { Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { HomeComponent } from './home/home.component';
import { AuthLayoutComponent } from './features/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth-layout/login/login.component';
import { RegisterComponent } from './features/auth-layout/register/register.component';
import { RegisterSuccessComponent } from './features/auth-layout/register-success/register-success.component';
import { MenuComponent } from './features/menu/menu.component';
import { CargaAcademicaComponent } from './features/carga-academica/carga-academica.component';
import { ProximamenteComponent } from './features/proximamente/proximamente.component';
import { NotificacionesComponent } from './features/notificaciones/notificaciones.component';
import { ConfiguracionComponent } from './features/configuracion/configuracion.component';

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

    // Ruta independiente para register-success (pantalla completa)
    { path: 'register-success', component: RegisterSuccessComponent },

    {
        path: 'main',
        component: MainComponent,
        children: [
        { path: '', redirectTo: 'menu', pathMatch: 'full' },
        { path: 'menu', component: MenuComponent },
        { path: 'home', component: HomeComponent },
        { path: 'carga-academica', component: CargaAcademicaComponent },
        { path: 'proximamente', component: ProximamenteComponent },
        { path: 'notificaciones', component: NotificacionesComponent },
        { path: 'configuracion', component: ConfiguracionComponent },
        ],
    },

    { path: '**', redirectTo: '' },
];
