import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { cart, priceSummary } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };
  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.orderSummaryDetails();
  }

  removeToCart(cartId: undefined | number) {
    cartId &&
      this.cartData &&
      this.product.removeToCart(cartId).subscribe((result) => {
        this.orderSummaryDetails();
      });
  }

  orderSummaryDetails() {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      let price = 0;
      result.forEach((item) => {
        if (item.quantity) {
          price = price + +item.price * +item.quantity;
        }
      });
      this.priceSummary.price = price;
      this.priceSummary.discount = +(price / 10).toFixed(0);
      this.priceSummary.tax = +((price * 8) / 100).toFixed(0);
      this.priceSummary.delivery = 60;
      this.priceSummary.total = +(
        price +
        (price * 8) / 100 +
        60 -
        price / 10
      ).toFixed(0);

      if (!this.cartData.length) {
        this.router.navigate(['/']);
      }
    });
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }
}
