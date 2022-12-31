import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/product-type';
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
    return this.http.get<IPagination>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}`, { observe: 'response', params })
      .pipe(
        map(response => {
          return response.body;
        })
      );
  }

  getProduct(id: number) {
    return this.http.get<IProduct>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${id}`);
  }

  getProductTypes() {
    // e.g. api/products/types
    return this.http.get<IProductType[]>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${environment.API_ENDPOINT_PRODUCTS_TYPES}`)
  }

  getBrands() {
    // e.g. api/products/brands
    return this.http.get<IBrand[]>(`${environment.API_URL_BASE}/${environment.API_ENDPOINT_PRODUCTS}/${environment.API_ENDPOINT_PRODUCTS_BRANDS}`);
  }
}
