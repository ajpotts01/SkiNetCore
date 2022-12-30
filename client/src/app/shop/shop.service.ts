import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shop-params';

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
  private readonly API_QUERY_KEY_PAGENUMBER: string = 'pageIndex';
  private readonly API_QUERY_KEY_PAGESIZE: string = 'pageSize';
  private readonly API_QUERY_KEY_BRAND_ID: string = 'brandId';
  private readonly API_QUERY_KEY_TYPE_ID: string = 'typeId';
  private readonly API_QUERY_KEY_SEARCH: string = 'search';
  private readonly API_QUERY_KEY_SORT: string = 'sort';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    //params = params.append(this.API_QUERY_KEY_PAGESIZE, this.API_QUERY_DEFAULT_PAGESIZE.toString());

    // "Always on" params first
    params = params.append(this.API_QUERY_KEY_SORT, shopParams.sort);
    params = params.append(this.API_QUERY_KEY_PAGENUMBER, shopParams.pageNumber.toString());
    params = params.append(this.API_QUERY_KEY_PAGESIZE, shopParams.pageSize.toString());


    if (shopParams.brandId && shopParams.brandId !== 0) {
      params = params.append(this.API_QUERY_KEY_BRAND_ID, shopParams.brandId.toString());
    }

    if (shopParams.typeId && shopParams.typeId !== 0) {
      params = params.append(this.API_QUERY_KEY_TYPE_ID, shopParams.typeId.toString());
    }

    if (shopParams.searchTerms) {
      params = params.append(this.API_QUERY_KEY_SEARCH, shopParams.searchTerms);
    }

    // e.g. api/products?pageSize=50
    return this.http.get<IPagination>(`${this.API_URL_BASE}/${this.API_ENDPOINT_PRODUCTS}`, { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProduct(id: number) {
    return this.http.get<IProduct>(`${this.API_URL_BASE}/${this.API_ENDPOINT_PRODUCTS}/${id}`);
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
