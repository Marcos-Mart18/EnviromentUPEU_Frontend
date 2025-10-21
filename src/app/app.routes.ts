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
import { EnvScreenComponent } from './features/env-screen/env-screen.component';
import { TypeEnvComponent } from './features/env-screen/type-env/type-env.component';
import { AmbienteComponent } from './features/env-screen/ambiente/ambiente.component';
import { ResourceScreenComponent } from './features/resource-screen/resource-screen.component';
import { ResourceComponent } from './features/resource-screen/resource/resource.component';
import { ResourceStateComponent } from './features/resource-screen/resource-state/resource-state.component';
import { ResourceTypeComponent } from './features/resource-screen/resource-type/resource-type.component';
import { authGuard } from './core/guards/auth.guard';

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
        canActivate: [authGuard],
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

    { path: 'env-creation', component: EnvScreenComponent, canActivate: [authGuard] },

    { path: 'env-creation/environment', component: AmbienteComponent, canActivate: [authGuard] },
    { path: 'env-creation/type-environment', component: TypeEnvComponent, canActivate: [authGuard] },

        // Pantalla de selección (cards)
    { path: 'res-creation', component: ResourceScreenComponent, canActivate: [authGuard] },

    // Vistas
    { path: 'res-creation/resources', component: ResourceComponent, canActivate: [authGuard] },
    { path: 'res-creation/states', component: ResourceStateComponent, canActivate: [authGuard] },
    { path: 'res-creation/types', component: ResourceTypeComponent, canActivate: [authGuard] },


    { path: '**', redirectTo: '' },
];
