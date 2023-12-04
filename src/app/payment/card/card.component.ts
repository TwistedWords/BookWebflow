import { Component, EventEmitter, OnDestroy, OnInit, Output, } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartDbService } from 'src/app/services/cart-db.service';
import { ShipmentPriceService } from 'src/app/services/shipment-price.service';
import { voucherCodes } from 'src/app/data/vouchers-data';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})



export class CardComponent implements OnInit, OnDestroy {

  @Output() previous = new EventEmitter<void>();

  deliveryPrice = 0;
  deliveryType = '';
  cartItems: any[] = [];
  sum: number = 0;
  displayedColumns: string[] = ['Title', 'Quantity', 'Price'];
  tableItems: { position: number, title: string, quantity: string, price: number }[] = [];
  mergedRows: any[] = [];

  voucher: string = "";

  private cartSubscription!: Subscription;
  private deliveryDetailsSubscription!: Subscription;
  deliveryDetails: any;

  constructor(private cartDB: CartDbService, private deliveryService: ShipmentPriceService) { }

  ngOnInit(): void {

    this.cartItems = this.cartDB.getCart();

    this.cartSubscription = this.cartDB.getCartItemsObservable().subscribe((updatedCartItems) => {
      this.cartItems = updatedCartItems;
      this.updateTableItems();
    });

    this.deliveryDetailsSubscription = this.deliveryService.deliveryDetailsObservable.subscribe((details) => {
      this.deliveryDetails = details;

      if( this.deliveryDetails) {
        
        this.deliveryType = details.deliveryType;

        if( details.deliveryPrice === '$5.99' || details.deliveryPrice === '$9.99') 
        {
          let originalString = details.deliveryPrice;
          let stringWithoutFirstCharacter = originalString.substring(1);
          this.deliveryPrice = parseFloat(stringWithoutFirstCharacter);
        } else {
          this.deliveryPrice = 0;
        }
        
      }

      this.updateTableItems(); 
    });

  }



  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }

  private updateTableItems(): void {
    this.tableItems = [];
    this.sum = 0;

    this.cartItems.forEach((element, index) => {
      let obj = {
        position: (index + 1),
        title: element.title,
        quantity: element.quantity,
        price: element.price,
      }

      if (obj.price > 1) {
        obj.price = obj.quantity * obj.price;
      }

      this.sum += obj.price;
      this.tableItems.push(obj);
    });
    this.sum += this.deliveryPrice;
  }

  private getDeliveryPriceAsFloat(): number {
    const priceString = this.deliveryDetails.deliveryPrice;

    if (priceString.toLowerCase() === 'free') {
      return 0;
    }

    const numericPart = parseFloat(priceString.substring(1));

    if (!isNaN(numericPart)) {
      return numericPart;
    } else {
      return 0;
    }
  }

  previousStep(): void {
    this.previous.emit();
  }


}
