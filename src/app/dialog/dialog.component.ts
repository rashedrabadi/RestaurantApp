import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../models/dialog-data.model';
import { GeneralService } from '../services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  language: string;
  prevPrice: number = 0;
  totalMealPrice: number = 0;
  basePrice: number = 0;
  mealPrice: number = 0;
  delivaryPrice: number = 0;
  fixedPrice: number = 0;
  quantity = 1;
  pickedOptionalItems: any[] = [];
  totalOptionalItems: any[] = [];
  pickedRequiredItem: any;
  totalRequiredItems: any[] = [];
  branchData: any;
  isLoading = false;
  colors: any={};
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public generalService: GeneralService, public translate: TranslateService, public resturantService: RestaurantService) { }

  ngOnInit(): void {
    this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res) {
        this.colors.colorPrimary = res.colorPrimary;
        this.colors.colorSecondary = res.colorSecondary;
        this.colors.colorTertiary = res.colorTertiary;
      }
      this.isLoading = false;
    });
    this.generalService.getBranchChoice().subscribe((branchData: any) => {
      this.isLoading = true;
      if (!!branchData) {
        this.branchData = branchData;
        this.basePrice = this.data.price;
        this.delivaryPrice = parseFloat((parseFloat(this.branchData.delivery)).toFixed(2));
        this.fixedPrice = parseFloat((this.data.price).toFixed(2));
        this.isLoading = false;
      }
    });
    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
      this.translate.use(lang);
    });
    this.totalMealPrice = this.fixedPrice;
  }
  onChoice(choice: any) {
    if (choice == true) {
      const updatedData = {
        "id": this.data.id,
        "name": this.data.name,
        "description": this.data.description,
        "total": this.totalMealPrice,
        "basePrice": this.basePrice,
        "extraSections": {
          "required": this.totalRequiredItems,
          "optional": this.totalOptionalItems
        },
        "quantity":this.quantity
      }
      this.generalService.setDialogChoice(updatedData);
    }
  }
  optionalSet(option: any) {
    let selectedParentOptional;
    for (let i = 0; i < this.data.extraSections.optional.length; i++) {
      for (let j = 0; j < this.data.extraSections.optional[i].extraItems.length; j++) {
        if (this.data.extraSections.optional[i].extraItems[j].id === option.source.value && option.checked === true) {
          this.totalMealPrice = this.totalMealPrice + this.data.extraSections.optional[i].extraItems[j].price;
          this.basePrice = this.basePrice + this.data.extraSections.optional[i].extraItems[j].price;
          selectedParentOptional = { id: this.data.extraSections.optional[i].id, name: this.data.extraSections.optional[i].name };
          this.pickedOptionalItems.push(this.data.extraSections.optional[i].extraItems[j]);
        }
        else if (this.data.extraSections.optional[i].extraItems[j].id === option.source.value && option.checked === false) {
          this.totalMealPrice = this.totalMealPrice - this.data.extraSections.optional[i].extraItems[j].price;
          this.basePrice = this.basePrice - this.data.extraSections.optional[i].extraItems[j].price
          selectedParentOptional = { id: this.data.extraSections.optional[i].id, name: this.data.extraSections.optional[i].name };
          const index = this.pickedOptionalItems.indexOf(this.data.extraSections.optional[i].extraItems[j]);
          this.pickedOptionalItems.splice(index, 1);
        }
      }
    }
    if (this.totalOptionalItems.length > 0) {
      for (let k = 0; k < this.totalOptionalItems.length; k++) {
        if (this.totalOptionalItems[k].id === selectedParentOptional.id) {
          this.totalOptionalItems[k].extraItems = this.pickedOptionalItems;
        }
      }

      if (this.totalOptionalItems.filter((item) => item.id === selectedParentOptional.id).length === 0) {
        this.totalOptionalItems.push(
          {
            id: selectedParentOptional.id,
            name: selectedParentOptional.name,
            extraItems: this.pickedOptionalItems,
          }
        );
      }
    }
    else if (this.totalOptionalItems.length === 0 && option.checked === true) {
      this.totalOptionalItems.push({
        id: selectedParentOptional.id,
        name: selectedParentOptional.name,
        extraItems: this.pickedOptionalItems,
      }
      );
    }
  }
  requiredSet(option: any) {
    let selectedParentRequired;
    for (let i = 0; i < this.data.extraSections.required.length; i++) {
      for (let j = 0; j < this.data.extraSections.required[i].extraItems.length; j++) {
        if (this.data.extraSections.required[i].extraItems[j].id === option.source.value) {
          this.totalMealPrice = this.totalMealPrice + this.data.extraSections.required[i].extraItems[j].price - this.prevPrice;
          this.basePrice = this.basePrice + this.data.extraSections.required[i].extraItems[j].price - this.prevPrice;
          this.prevPrice = this.data.extraSections.required[i].extraItems[j].price;
          this.pickedRequiredItem = this.data.extraSections.required[i].extraItems[j];
          selectedParentRequired = { id: this.data.extraSections.required[i].id, name: this.data.extraSections.required[i].name };
        }
      }
    }

    if (this.totalRequiredItems.length > 0) {
      for (let k = 0; k < this.totalRequiredItems.length; k++) {
        if (this.totalRequiredItems[k].id === selectedParentRequired.id) {
          this.totalRequiredItems[k].extraItems = this.pickedRequiredItem;
        }
      }

      if (this.totalRequiredItems.filter((item) => item.id === selectedParentRequired.id).length === 0) {
        this.totalRequiredItems.push(
          {
            id: selectedParentRequired.id,
            name: selectedParentRequired.name,
            extraItems: this.pickedRequiredItem
          }
        );
      }
    }
    else if (this.totalRequiredItems.length === 0) {
      this.totalRequiredItems.push({
        id: selectedParentRequired.id,
        name: selectedParentRequired.name,
        extraItems: this.pickedRequiredItem,
      }
      );
    }
  }
  increment() {
    this.mealPrice = this.basePrice;
    this.totalMealPrice += this.mealPrice;
    this.quantity++;
  }
  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
      this.mealPrice = this.basePrice;
      this.totalMealPrice -= this.mealPrice;
    }

  }
}



