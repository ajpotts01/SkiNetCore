import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './models/pagination';
import { IProduct } from './models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'SkiNet';
  products: IProduct[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const API_ENDPOINT_ADDRESS: string = 'https://localhost:5001/api/products?pageSize=50';

    // Course material used deprecated subscribe - now using one Observable object.
    this.http.get(API_ENDPOINT_ADDRESS).subscribe({
      next: (response: IPagination) => { this.products = response.data; console.log('Success') },
      error: (error) => { console.log('Error'); console.log(error) }
    });

    // this.http.get(API_ENDPOINT_ADDRESS).subscribe((response: IPagination) => {
    //   this.products = response.data;
    // }, error => {
    //   console.log(error);
    // });
  }  
}
