import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() register = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();


  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.toastr.success('Login riuscito!');
          this.close.emit();
          this.loginSuccess.emit();
        },
        error: (err) => {
          if (err.error instanceof ProgressEvent) {
            this.toastr.error('Errore di connessione al server. Controlla che il backend sia attivo!');
          } else {
            this.toastr.error(err.error || 'Email o password errati.');
          }
        }
      });
    } else {
      this.toastr.warning('Compila tutti i campi correttamente');
    }
  }

  onCancel(): void {
    this.close.emit();
  }

  goToRegister(): void {
    this.register.emit();
    this.onCancel();
  }
}
