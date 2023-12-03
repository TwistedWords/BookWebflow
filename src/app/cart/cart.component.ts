import { Component, OnInit } from '@angular/core';
import { CartServiceService } from '../cart-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  newItem: any;
  sum: number = 0;

  constructor(public cartService: CartServiceService, private router: Router) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItem();


    this.cartItems.forEach(item => {
      this.sum += (item.price * item.quantity);
    })
  }

  onRemove(index: number) {
    for (let i = 0; i < this.cartItems.length; i++) {
      if (this.cartItems[i].bookNr === index) {
        this.cartItems.splice(i, 1);
      }
    }

    this.sum = 0;
    this.cartItems.forEach(item => {
      this.sum += (item.price * item.quantity);
    })


  }

  onQuantityChange(index: number) {
    const itemToUpdate = this.cartItems.find(item => item.bookNr === index);

    if (itemToUpdate) {
      itemToUpdate.quantity = parseInt(itemToUpdate.quantity);

      if(itemToUpdate.quantity < 1) {
          this.onRemove(index);
      }

    }

    this.sum = 0;
    this.cartItems.forEach(item => {
      this.sum += (item.price * item.quantity);
    })

  }

  goToPayment() {
    if (this.cartItems && this.cartItems.length) {
      this.router.navigate(['payment']);
    }

  }


}
