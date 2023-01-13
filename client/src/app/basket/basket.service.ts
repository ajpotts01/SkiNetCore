import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  private basketSource: BehaviorSubject<IBasket> = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable(); // can't explicitly define type

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get(`${environment.API_URL_BASE}/basket?id=${id}`)
                    .pipe(
                      map((basket: IBasket) => {
                        this.basketSource.next(basket);
                      })
                    );
  }

  setBasket(basket: IBasket) {
    return this.http.post(`${environment.API_URL_BASE}/basket`, basket)
                    .subscribe({
                      next: (response: IBasket) => { this.basketSource.next(response); },
                      error: error => { console.log(error) }
                    });
  }

  getCurrentBasketValue() {
    return this.basketSource.value
  }

  addItemToBasket(item: IProduct, quantity: number = 1) {
    const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
    const basket: IBasket = this.getCurrentBasketValue() ?? this.createBasket();

    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);

    this.setBasket(basket);
  }

  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.id === itemToAdd.id)

    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }

    return items;
  }

  private createBasket(): IBasket {
    const basket: IBasket = new Basket();
    localStorage.setItem('basket_id', basket.id);

    return basket;
  }

  private mapProductToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      productType: item.productType
    };
  }
}
