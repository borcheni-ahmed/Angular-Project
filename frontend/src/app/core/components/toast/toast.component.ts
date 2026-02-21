import { Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
    this.toastService.toasts.subscribe(t => this.toasts = t);
  }

  remove(id: number) { this.toastService.remove(id); }

  getStyle(type: string) {
    const styles: any = {
      success: 'border-left:4px solid #22c55e; background:rgba(22,163,74,0.15);',
      error:   'border-left:4px solid #ef4444; background:rgba(220,38,38,0.15);',
      warning: 'border-left:4px solid #f59e0b; background:rgba(217,119,6,0.15);',
      info:    'border-left:4px solid #3b82f6; background:rgba(37,99,235,0.15);'
    };
    return styles[type] || styles.info;
  }

  getIcon(type: string) {
    const icons: any = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    return icons[type] || 'ℹ️';
  }
}
