import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CustomerService } from '../../core/services/customer.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: any[] = [];
  filtered: any[] = [];
  loading = true;
  searchTerm = '';
  filterStatus = 'all';
  showNewForm = false;
  editingOrder: any = null;
  cancellingId: number | null = null;
  confirmCancelOrder: any = null; // stores the order to cancel
  customerId: number | null = null;
  customerName = '';

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.resolveCustomerThenLoad();
  }

  resolveCustomerThenLoad() {
    this.loading = true;
    const userName = this.authService.getUsername();

    this.customerService.getAll().subscribe({
      next: (customers) => {
        const match = customers.find(c =>
          c.customerName?.toLowerCase() === userName?.toLowerCase()
        );
        if (!match) {
          this.toast.error('No customer account found for your profile.');
          this.loading = false;
          return;
        }
        this.customerId   = match.customerID;
        this.customerName = match.customerName;
        this.loadOrders();
      },
      error: () => {
        this.toast.error('Failed to identify customer.');
        this.loading = false;
      }
    });
  }

  loadOrders() {
    if (!this.customerId) return;
    this.orderService.getByCustomer(this.customerId).subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.toast.error('Failed to load orders.');
        this.loading = false;
      }
    });
  }

  applyFilter() {
    let result = this.orders;
    if (this.filterStatus !== 'all') {
      result = result.filter(o => o.status === this.filterStatus);
    }
    const term = this.searchTerm.toLowerCase();
    if (term) {
      result = result.filter(o =>
        o.orderID.toString().includes(term) ||
        o.customerPurchaseOrderNumber?.toLowerCase().includes(term)
      );
    }
    this.filtered = result;
  }

  search()                  { this.applyFilter(); }
  setFilter(status: string) { this.filterStatus = status; this.applyFilter(); }

  get totalCount()     { return this.orders.length; }
  get pendingCount()   { return this.orders.filter(o => o.status === 'En attente').length; }
  get deliveredCount() { return this.orders.filter(o => o.status === 'Livrée').length; }

  openNew()        { this.showNewForm = true;  this.editingOrder = null; }
  closeNew()       { this.showNewForm = false; }
  openEdit(o: any) { this.editingOrder = { ...o }; this.showNewForm = false; }
  closeEdit()      { this.editingOrder = null; }

  // Opens the confirm dialog
  askCancel(order: any) {
    this.confirmCancelOrder = order;
  }

  // Closes the dialog without doing anything
  cancelDialog() {
    this.confirmCancelOrder = null;
  }

  // Actually deletes after confirmation
  confirmCancelAction() {
    if (!this.confirmCancelOrder) return;
    const order = this.confirmCancelOrder;
    this.cancellingId = order.orderID;
    this.confirmCancelOrder = null;

    this.orderService.delete(order.orderID).subscribe({
      next: () => {
        this.toast.success('Order cancelled successfully.');
        this.orders = this.orders.filter(o => o.orderID !== order.orderID);
        this.applyFilter();
        this.cancellingId = null;
      },
      error: () => {
        this.toast.error('Failed to cancel order.');
        this.cancellingId = null;
      }
    });
  }

  onOrderCreated(newOrder: any) {
    this.orders.unshift(newOrder);
    this.applyFilter();
    this.showNewForm = false;
    this.toast.success('Order created successfully.');
  }

  onOrderUpdated(updatedOrder: any) {
    this.orders = this.orders.map(o =>
      o.orderID === updatedOrder.orderID ? updatedOrder : o
    );
    this.applyFilter();
    this.editingOrder = null;
    this.toast.success('Order updated successfully.');
  }
}
