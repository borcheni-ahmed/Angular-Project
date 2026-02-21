import { Component, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginMode = true;
  error = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['User']
    });
  }

  ngAfterViewInit() {
    this.initParticles();
    this.initTyping();
    this.initRipple();
  }

  initTyping() {
    const text = 'Business Galaxy';
    const el = document.querySelector('.typing-title') as HTMLElement;
    if (!el) return;
    let i = 0;
    el.textContent = '';
    const type = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(type, 80);
      }
    };
    setTimeout(type, 300);
  }

  initParticles() {
    const canvas = document.getElementById('particlesCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(animate);
    };
    animate();
  }

  initRipple() {
    setTimeout(() => {
      document.querySelectorAll('.ripple-btn').forEach(btn => {
        btn.addEventListener('click', (e: any) => {
          const rect = (btn as HTMLElement).getBoundingClientRect();
          const ripple = document.createElement('span');
          const size = Math.max(rect.width, rect.height);
          ripple.style.cssText = `
            position:absolute; width:${size}px; height:${size}px;
            border-radius:50%; background:rgba(255,255,255,0.3);
            left:${e.clientX - rect.left - size/2}px;
            top:${e.clientY - rect.top - size/2}px;
            animation:ripple 0.6s ease forwards; pointer-events:none;
          `;
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });
    }, 500);
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
    setTimeout(() => this.initRipple(), 100);
  }

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid username or password';
        this.loading = false;
      }
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.registerForm.reset();
        this.isLoginMode = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }

}
