import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent implements OnInit, OnChanges {
  @Input() isEdit = false;
  @Input() order: any = null;
  @Input() customerId: number | null = null; // ← passed from parent
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  saving = false;
  form: any = {
    orderDate: '',
    expectedDeliveryDate: '',
    customerPurchaseOrderNumber: '',
    comments: '',
    deliveryInstructions: '',
    isUndersupplyBackordered: false
  };

  constructor(
    private orderService: OrderService,
    private toast: ToastService
  ) {}

  ngOnInit()    { this.initForm(); }
  ngOnChanges() { this.initForm(); }

  initForm() {
    if (this.isEdit && this.order) {
      this.form = {
        orderDate:                    this.order.orderDate?.substring(0, 10) ?? '',
        expectedDeliveryDate:         this.order.expectedDeliveryDate?.substring(0, 10) ?? '',
        customerPurchaseOrderNumber:  this.order.customerPurchaseOrderNumber ?? '',
        comments:                     this.order.comments ?? '',
        deliveryInstructions:         this.order.deliveryInstructions ?? '',
        isUndersupplyBackordered:     this.order.isUndersupplyBackordered ?? false
      };
    } else {
      this.form = {
        orderDate:                   new Date().toISOString().substring(0, 10),
        expectedDeliveryDate:        '',
        customerPurchaseOrderNumber: '',
        comments:                    '',
        deliveryInstructions:        '',
        isUndersupplyBackordered:    false
      };
    }
  }

  submit() {
    if (!this.form.orderDate || !this.form.expectedDeliveryDate || !this.form.customerPurchaseOrderNumber) {
      this.toast.error('Please fill in all required fields.');
      return;
    }

    this.saving = true;

    const payload = {
      orderID: this.isEdit ? this.order.orderID : 0,
      customerID: "832",
      customerName: '',
      orderDate: new Date(this.form.orderDate).toISOString(),
      expectedDeliveryDate: new Date(this.form.expectedDeliveryDate).toISOString(),
      customerPurchaseOrderNumber: this.form.customerPurchaseOrderNumber?.substring(0, 100) ?? '',
      comments: this.form.comments?.substring(0, 100) ?? '',
      deliveryInstructions: this.form.deliveryInstructions?.substring(0, 100) ?? '',
      isUndersupplyBackordered: this.form.isUndersupplyBackordered ?? false,
      pickingCompletedWhen: this.isEdit ? this.order.pickingCompletedWhen ?? null : null,
      status: 'En attente'
    };

    console.log('Sending payload:', payload); // remove after testing

    const request$ = this.isEdit
      ? this.orderService.update(this.order.orderID, payload)
      : this.orderService.create(payload);

    request$.subscribe({
      next:  (result) => { this.saving = false; this.saved.emit(result); },
      error: (err) => {
        console.error('Error response:', err.error); // remove after testing
        this.toast.error('Failed to save order.');
        this.saving = false;
      }
    });
  }

  cancel() { this.cancelled.emit(); }
}
