import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/product-type';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  productTypes: IProductType[];
  selectedBrandId: number;
  selectedTypeId: number;

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getProductTypes();
  }

  // Note: getProducts uses response.data while brands/types don't
  // this is because products is paginated data e.g. IPagination with encapsulated data field
  // The others are just plain arrays
  getProducts() {
    this.shopService.getProducts(this.selectedBrandId, this.selectedTypeId).subscribe({
      next: (response) => { this.products = response.data; console.log('Shop load - products: success') },
      error: (error) => { console.log('Shop load - products: error'); console.log(error) }
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe({
      next: (response) => { this.brands = [{id: 0, name: 'All'}, ...response]; console.log('Shop load - brands: success') },
      error: (error) => { console.log('Shop load - brands: error'); console.log(error) }
    });
  }

  getProductTypes() {
    this.shopService.getProductTypes().subscribe({
      next: (response) => { this.productTypes = [{id: 0, name: 'All'}, ...response]; console.log('Shop load - types: success') },
      error: (error) => { console.log('Shop load - types: error'); console.log(error) }
    })
  }

  onBrandSelected(brandId: number) {
    this.selectedBrandId = brandId;

    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.selectedTypeId = typeId;

    this.getProducts();
  }

}
