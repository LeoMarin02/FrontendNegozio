import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() openLogin = new EventEmitter<void>();

  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confermaPassword: ['', Validators.required],
      indirizzo: ['', Validators.required],
      telefono: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confermaPassword) {
        this.errorMessage = 'Le password non coincidono.';
        return;
      }

      const userData = {
        name: this.registerForm.value.name,
        cognome: this.registerForm.value.cognome,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        indirizzo: this.registerForm.value.indirizzo,
        telefono: this.registerForm.value.telefono,
        ruolo: 'USER' // Imposta il ruolo predefinito
      };

      this.authService.register(userData).subscribe({
        next: (res: any) => {
          this.successMessage = 'Registrazione avvenuta! Ora puoi accedere.';
          this.errorMessage = '';
        },
        error: (err: any) => {
          this.errorMessage = err.error || 'Errore nella registrazione.';
        }
      });
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  goToLogin(): void {
    this.close.emit();
    this.openLogin.emit();
  }
}
