import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductFormComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  showForm = false;

  selectedProduct?: Product;
  showEdit = false;

  constructor(
    private productService: ProductService,
    public  authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  openForm(): void {
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
  }

  onProductCreated(newProduct: Product): void {
    this.products.push(newProduct);
    this.closeForm();
  }

  openEdit(p: Product) {
    this.selectedProduct = p;
    this.showEdit = true;
  }
  closeEdit() {
    this.showEdit = false;
    this.selectedProduct = undefined;
  }

  onProductUpdated(updated: Product): void {
    const idx = this.products.findIndex(p => p.id === updated.id);
    if (idx > -1) {
      this.products[idx] = updated;
    }
  }

}
