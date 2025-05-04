import { Component, EventEmitter, Output, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() product?: Product;
  @Output() created  = new EventEmitter<Product>();
  @Output() updated  = new EventEmitter<Product>();
  @Output() close    = new EventEmitter<void>();

  productForm: FormGroup;
  categories: string[] = [];

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name:        ['', Validators.required],
      category:    ['', Validators.required],
      price:       ['', [Validators.required, Validators.min(0.01)]],
      imageUrl:    ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.productForm.patchValue(this.product);
    }
  }

  private loadCategories(): void {
    this.productService.getCategories()
      .subscribe(list => this.categories = list);
  }

  submit(): void {
    if (this.productForm.invalid) return;
    const formVal: Product = this.productForm.value as Product;

    if (this.product) {
      // EDIT
      this.productService
        .updateProduct(this.product.id!, formVal)
        .subscribe(prod => {
          this.updated.emit(prod);
          this.close.emit();
          this.productForm.reset();
          this.loadCategories();
        });
    } else {
      // CREATE
      this.productService
        .createProduct(formVal)
        .subscribe(prod => {
          this.created.emit(prod);
          this.close.emit();
          this.productForm.reset();
          this.loadCategories();
        });
    }
  }

  onCancel(): void {
    this.close.emit();
  }
}
