import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  customerId: number | null = null;
  loading = false;
  error = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      phoneNumber: ['', Validators.pattern(/^[0-9+\-\s()]*$/)],
      deliveryAddressLine1: [''],
      deliveryAddressLine2: [''],
      postalCode: [''],
      standardDiscountPercentage: [0, [Validators.min(0), Validators.max(100)]],
      isOnCreditHold: [false],
      paymentDays: [0, Validators.min(0)]
    });
  }

  ngOnInit() {
    this.customerId = this.route.snapshot.params['id'];
    if (this.customerId) {
      this.isEdit = true;
      this.customerService.getById(this.customerId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  //isFieldInvalid(field: string) {
    //const control = this.form.get(field);
    //return control && control.invalid && (control.dirty || this.submitted);
  //}

  //isFieldValid(field: string) {
    //const control = this.form.get(field);
    //return control && control.valid && control.dirty;
  //}

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.toast.error('Please fix the errors before submitting');
      return;
    }
    this.loading = true;
    const data = this.form.value;

    if (this.isEdit && this.customerId) {
      this.customerService.update(this.customerId, { ...data, customerID: this.customerId }).subscribe({
        next: () => {
          this.toast.success('Customer updated successfully!');
          setTimeout(() => this.router.navigate(['/customers']), 1000);
        },
        error: () => {
          this.toast.error('Failed to update customer');
          this.loading = false;
        }
      });
    } else {
      this.customerService.create(data).subscribe({
        next: () => {
          this.toast.success('Customer created successfully!');
          setTimeout(() => this.router.navigate(['/customers']), 1000);
        },
        error: () => {
          this.toast.error('Failed to create customer');
          this.loading = false;
        }
      });
    }
  }
}
