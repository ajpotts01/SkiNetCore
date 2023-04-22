import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../shared/models/brand';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/product';
import { ProductType } from '../shared/models/product-type';
import { ShopParams } from '../shared/models/shop-params';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();

    //params = params.append(environment.API_QUERY_KEY_PAGESIZE, environment.API_QUERY_DEFAULT_PAGESIZE.toString());

    // "Always on" params first
    params = params.append(environment.API_QUERY_KEY_SORT, shopParams.sort);
    params = params.append(environment.API_QUERY_KEY_PAGENUMBER, shopParams.pageNumber.toString());
    params = params.append(environment.API_QUERY_KEY_PAGESIZE, shopParams.pageSize.toString());


    if (shopParams.brandId && shopParams.brandId !== 0) {
      params = params.append(environment.API_QUERY_KEY_BRAND_ID, shopParams.brandId.toString());
    }

    if (shopParams.typeId && shopParams.typeId !== 0) {
      params = params.append(environment.API_QUERY_KEY_TYPE_ID, shopParams.typeId.toString());
    }

    if (shopParams.searchTerms) {
      params = params.append(environment.API_QUERY_KEY_SEARCH, shopParams.searchTerms);
    }

    // e.g. api/products?pageSize=50
    return this.http.get<Pagination>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}`, { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProduct(id: number) {
    return this.http.get<Product>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${id}`);
  }

  getProductTypes() {
    // e.g. api/products/types
    return this.http.get<ProductType[]>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${environment.API_ENDPOINT_PRODUCTS_TYPES}`)
  }

  getBrands() {
    // e.g. api/products/brands
    return this.http.get<Brand[]>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${environment.API_ENDPOINT_PRODUCTS_BRANDS}`);
  }
}
