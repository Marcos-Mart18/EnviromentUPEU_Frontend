# Sistema de Autenticación - Documentación

## 📋 Descripción

Sistema de autenticación completo implementado con Angular 19 que incluye login, logout, protección de rutas y manejo de tokens JWT.

## 🚀 Características Implementadas

### 1. **Modelos de Datos**
- `LoginRequest`: Credenciales de usuario (username, password)
- `LoginResponse`: Respuesta del servidor con tokens y datos del usuario
- `User`: Información del usuario autenticado
- `Role`: Roles del usuario
- `LogoutRequest`: Solicitud de cierre de sesión

**Ubicación:** `src/app/core/models/auth.model.ts`

### 2. **Servicio de Autenticación**
El servicio `AuthService` proporciona:

- ✅ `login()`: Autenticación de usuario
- ✅ `logout()`: Cierre de sesión
- ✅ `isAuthenticated()`: Verificar si el usuario está autenticado
- ✅ `getCurrentUser()`: Obtener usuario actual
- ✅ `hasRole()`: Verificar roles del usuario
- ✅ Almacenamiento seguro de tokens en localStorage
- ✅ Observable del usuario actual (`currentUser$`)

**Ubicación:** `src/app/core/services/auth.service.ts`

### 3. **Interceptor HTTP**
Agrega automáticamente el token JWT a todas las peticiones HTTP (excepto login/logout).

**Ubicación:** `src/app/core/interceptors/auth.interceptor.ts`

### 4. **Guard de Autenticación**
Protege las rutas que requieren autenticación, redirigiendo al login si es necesario.

**Ubicación:** `src/app/core/guards/auth.guard.ts`

### 5. **Componente de Login**
Formulario reactivo con:
- Validación de campos
- Manejo de errores
- Estados de carga
- Mensajes de error contextuales

**Ubicación:** `src/app/features/auth-layout/login/`

### 6. **Sidebar con Logout**
El sidebar muestra:
- Nombre del usuario autenticado
- Rol del usuario
- Botón de cerrar sesión

**Ubicación:** `src/app/shared/components/sidebar/`

## 🔧 Configuración del Backend

### URL del API
La URL del backend se configura en:
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

### Endpoints Utilizados

#### Login
```
POST http://localhost:8080/api/auth/login

Request:
{
  "username": "tebi",
  "password": "noegod"
}

Response:
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "expiresIn": 900,
  "user": {
    "id": 2,
    "username": "tebi",
    "isActive": true,
    "userProfileId": 1,
    "roles": [
      {
        "id": 2,
        "name": "USER"
      }
    ]
  }
}
```

#### Logout
```
POST http://localhost:8080/api/auth/logout

Request:
{
  "refreshToken": "{{refresh_token}}"
}
```

## 📁 Estructura de Archivos

```
src/app/
├── core/
│   ├── guards/
│   │   └── auth.guard.ts
│   ├── interceptors/
│   │   └── auth.interceptor.ts
│   ├── models/
│   │   └── auth.model.ts
│   └── services/
│       └── auth.service.ts
├── features/
│   └── auth-layout/
│       └── login/
│           ├── login.component.ts
│           ├── login.component.html
│           └── login.component.css
└── shared/
    └── components/
        └── sidebar/
            ├── sidebar.component.ts
            └── sidebar.component.html
```

## 🛡️ Rutas Protegidas

Las siguientes rutas están protegidas con `authGuard`:
- `/main/*` - Todas las rutas principales
- `/env-creation/*` - Creación de ambientes
- `/res-creation/*` - Creación de recursos

## 💾 Almacenamiento de Datos

Los siguientes datos se guardan en `localStorage`:
- `accessToken`: Token de acceso JWT
- `refreshToken`: Token de refresco
- `user`: Información del usuario (JSON)

## 🔄 Flujo de Autenticación

1. **Login**
   - Usuario ingresa credenciales
   - Se envía POST a `/api/auth/login`
   - Se guardan tokens y datos del usuario
   - Se actualiza el observable `currentUser$`
   - Redirección a `/main`

2. **Peticiones HTTP**
   - El interceptor agrega `Authorization: Bearer {token}` automáticamente
   - Solo a endpoints que no sean login/logout

3. **Logout**
   - Se envía POST a `/api/auth/logout` con refreshToken
   - Se limpian tokens y datos del localStorage
   - Se actualiza `currentUser$` a null
   - Redirección a `/login`

4. **Protección de Rutas**
   - El guard verifica si existe accessToken
   - Si no existe, redirige a `/login`
   - Si existe, permite el acceso

## 🎯 Uso del Servicio

### Inyectar el servicio
```typescript
import { AuthService } from './core/services/auth.service';

export class MiComponente {
  private authService = inject(AuthService);
}
```

### Verificar autenticación
```typescript
if (this.authService.isAuthenticated()) {
  // Usuario autenticado
}
```

### Obtener usuario actual
```typescript
const user = this.authService.getCurrentUser();
console.log(user?.username);
```

### Suscribirse a cambios del usuario
```typescript
this.authService.currentUser$.subscribe(user => {
  if (user) {
    console.log('Usuario:', user.username);
  }
});
```

### Verificar roles
```typescript
if (this.authService.hasRole('ADMIN')) {
  // Usuario es administrador
}
```

## 🐛 Manejo de Errores

El componente de login maneja los siguientes errores:

- **401**: Usuario o contraseña incorrectos
- **0**: No se pudo conectar con el servidor
- **Otros**: Mensaje de error del servidor o genérico

## ✅ Testing

Para probar el login:

1. Asegúrate de que el backend esté corriendo en `http://localhost:8080`
2. Usa las credenciales de prueba:
   - Usuario: `tebi`
   - Contraseña: `noegod`
3. Verifica que la redirección a `/main` funcione
4. Verifica que el nombre de usuario aparezca en el sidebar
5. Prueba el botón de logout

## 📝 Notas Adicionales

- Los tokens se almacenan en localStorage (considerar httpOnly cookies para producción)
- El token expira en 900 segundos (15 minutos) según la respuesta del servidor
- El sistema soporta múltiples roles por usuario
- La validación del formulario requiere mínimo 4 caracteres para la contraseña
