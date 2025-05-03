import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router }      from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { Product }        from '../../core/models/product.model';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.productForm = this.fb.group({
      name:        ['', Validators.required],
      category:    ['', Validators.required],
      price:       [0, [Validators.required, Validators.min(0.01)]],
      imageUrl:    ['', Validators.required],
      description: ['', Validators.required]
    });

    this.productService.getProductById(this.productId).subscribe({
      next: prod => {
        this.productForm.patchValue(prod);
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossibile caricare il prodotto';
        this.loading = false;
      }
    });
  }

  save(): void {
    if (this.productForm.invalid) return;
    const updated: Product = { id: this.productId, ...this.productForm.value };
    this.productService.updateProduct(this.productId, updated).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.error = 'Errore durante l’aggiornamento'
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
