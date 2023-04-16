import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product;

  constructor(private shopService: ShopService, 
              private activatedRoute: ActivatedRoute, 
              private bcService: BreadcrumbService) { 
                this.bcService.set('@productDetails', ' ');
              }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    this.shopService.getProduct(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
      next: product => { 
        console.log('Shop - product details - load succeeded'); 
        this.product = product; 
        this.bcService.set('@productDetails', product.name);
      },
      error: error => { console.log('Shop - product details - load product failed'); console.log(error); }
    });
  }

}
