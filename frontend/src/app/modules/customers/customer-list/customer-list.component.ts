import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../core/services/customer.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  filtered: any[] = [];
  loading = true;
  isAdmin = false;
  searchTerm = '';
  confirmDelete: number | null = null; // stores ID to delete

  constructor(
    private customerService: CustomerService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        this.filtered = data;
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load customers');
        this.loading = false;
      }
    });
  }

  search() {
    const term = this.searchTerm.toLowerCase();
    this.filtered = this.customers.filter(c =>
      c.customerName?.toLowerCase().includes(term) ||
      c.phoneNumber?.toLowerCase().includes(term) ||
      c.deliveryAddressLine1?.toLowerCase().includes(term)
    );
  }

  askDelete(id: number) {
    this.confirmDelete = id; // show custom dialog
  }

  cancelDelete() {
    this.confirmDelete = null;
  }

  confirmDeleteAction() {
    if (!this.confirmDelete) return;
    this.customerService.delete(this.confirmDelete).subscribe({
      next: () => {
        this.toast.success('Customer deleted successfully!');
        this.confirmDelete = null;
        this.loadCustomers();
      },
      error: () => {
        this.toast.error('Failed to delete customer');
        this.confirmDelete = null;
      }
    });
  }
}
