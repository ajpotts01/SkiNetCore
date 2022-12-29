import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProductType } from '../shared/models/product-type';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly API_URL_BASE: string = 'https://localhost:5001/api';
  private readonly API_ENDPOINT_PRODUCTS: string = 'products';
  private readonly API_ENDPOINT_PRODUCTS_BRANDS: string = 'brands';
  private readonly API_ENDPOINT_PRODUCTS_TYPES: string = 'types';
  private readonly API_QUERY_PAGESIZE_50: string = 'pageSize=50'; // placeholder until params are added

  private readonly API_QUERY_DEFAULT_PAGESIZE: number = 50;
  private readonly API_QUERY_KEY_PAGESIZE: string = 'pageSize';
  private readonly API_QUERY_KEY_BRAND_ID: string = 'brandId';
  private readonly API_QUERY_KEY_TYPE_ID: string = 'typeId';
  private readonly API_QUERY_KEY_SORT: string = 'sort';

  constructor(private http: HttpClient) { }

  getProducts(brandId?: number, typeId?: number, sort?: string) {
    let params = new HttpParams();

    params = params.append(this.API_QUERY_KEY_PAGESIZE, this.API_QUERY_DEFAULT_PAGESIZE.toString());

    if (brandId) {
      params = params.append(this.API_QUERY_KEY_BRAND_ID, brandId.toString());
    }

    if (typeId) {
      params = params.append(this.API_QUERY_KEY_TYPE_ID, typeId.toString());
    }

    if (sort) {
      params = params.append(this.API_QUERY_KEY_SORT, sort);
    }

    // e.g. api/products?pageSize=50
    return this.http.get<IPagination>(`${this.API_URL_BASE}/${this.API_ENDPOINT_PRODUCTS}`, { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProductTypes() {
    // e.g. api/products/types
    return this.http.get<IProductType[]>(`${this.API_URL_BASE}/${this.API_ENDPOINT_PRODUCTS}/${this.API_ENDPOINT_PRODUCTS_TYPES}`)
  }

  getBrands() {
    // e.g. api/products/brands
    return this.http.get<IBrand[]>(`${this.API_URL_BASE}/${this.API_ENDPOINT_PRODUCTS}/${this.API_ENDPOINT_PRODUCTS_BRANDS}`);
  }
}
