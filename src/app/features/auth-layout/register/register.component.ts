import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isSubmitting = false;

  constructor(private router: Router) {}

  onSubmit(form: any): void {
    if (form.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      // Simular el proceso de registro
      setTimeout(() => {
        // Aquí iría la lógica real de registro
        console.log('Registro exitoso');
        
        // Redirigir al componente de éxito
        this.router.navigate(['/register-success']);
      }, 1000);
    }
  }
}
