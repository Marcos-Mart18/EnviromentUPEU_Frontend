import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register-success.component.html',
  styleUrl: './register-success.component.css'
})
export class RegisterSuccessComponent implements OnInit {
  isRedirecting = false;
  countdown = 3;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCountdown();
  }

  private startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.redirectToMain();
      }
    }, 1000);
  }

  private redirectToMain(): void {
    this.isRedirecting = true;
    
    // Pequeña pausa para mostrar el estado de redirección
    setTimeout(() => {
      this.router.navigate(['/main']);
    }, 500);
  }
}