import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Brand } from '../shared/models/brand';
import { Product } from '../shared/models/product';
import { ProductType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shop-params';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  // Decorators
  @ViewChild('search', { static: false }) searchTerms: ElementRef
  
  // Data
  products: Product[];
  brands: Brand[];
  productTypes: ProductType[];

  // Params/pagination stuff
  shopParams: ShopParams = new ShopParams();
  totalCount: number;
  math = Math;

  // Sorting
  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc'},
    { name: 'Price: High to Low', value: 'priceDesc' }
  ];

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
    this.shopService.getProducts(this.shopParams).subscribe({
      next: (response) => { 
        this.products = response.data; console.log('Shop load - products: success');
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.totalCount = response.count;
      },
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
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    
    this.getProducts();
  }

  onPageChanged(event: any) {
    // Prevent multiple event cascade from count changing
    if (this.shopParams.pageNumber !== event) {
      this.shopParams.pageNumber = event;
      this.getProducts();
    }
  }

  onSearch() {
    this.shopParams.searchTerms = this.searchTerms.nativeElement.value;
    this.shopParams.pageNumber = 1;

    this.getProducts();
  }

  onReset() {
    this.searchTerms.nativeElement.value = '';
    this.shopParams = new ShopParams();

    this.getProducts();
  }

}
