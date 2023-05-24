import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ROUTE_URLS } from '../app.routes.names';
import { GeneralService } from '../services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';
import { DialogService } from '../services/dialog/dialog.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: MatSidenav;
  opened: boolean;
  public ROUTE_URLS = ROUTE_URLS;
  isEnglish: boolean = true;
  language: any;
  isLoading: boolean = false;
  restaurantData: any;
  menuHeadings: any[] = [];
  showFiller: boolean = false;
  test = false;
  branches: any[] = [];
  selectedBranch: boolean = false;
  openNow: boolean = true;
  branchData: any;
  selectedItems: any[] = [];
  quantity: any;
  totalMealPrice: number;
  basePrice: any;
  mealPrice: any;
  colors: any = {};
  delivary: any;
  constructor(public translate: TranslateService, public generalService: GeneralService, public resturantService: RestaurantService, private dialogService: DialogService) {
  }

  ngOnInit(): void {

    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
    });
    this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res) {
        this.colors.colorPrimary = res.colorPrimary;
        this.colors.colorSecondary = res.colorSecondary;
        this.colors.colorTertiary = res.colorTertiary;

        this.restaurantData = res;
        for (let i = 0; i < res.menus.length; i++) {
          this.menuHeadings[i] = res.menus[i].name;
        }
        for (let i = 0; i < res.restaurantBranches.length; i++) {
          this.branches[i] = {
            disableOrdering: res.restaurantBranches[i].disableOrdering,
            id: res.restaurantBranches[i].id,
            index: res.restaurantBranches[i].index,
            latitude: res.restaurantBranches[i].latitude,
            longitude: res.restaurantBranches[i].longitude,
            name: res.restaurantBranches[i].name,
            nameTranslations: res.restaurantBranches[i].nameTranslations,
            phoneNumber: res.restaurantBranches[i].phoneNumber,
            pointsLatLng: res.restaurantBranches[i].pointsLatLng,
            userName: res.restaurantBranches[i].userName,
            workingHours: res.restaurantBranches[i].workingHours,
            isOpenNow: this.isOpen(res.restaurantBranches[i].workingHours),
            delivery: res.delivery,
            dineIn: res.dineIn,
            pickup: res.pickup,
            minCost: res.minCost,
            costPerKm: res.costPerKm,
            description: res.description,
          }

        }
        this.isLoading = false;

      }
    });
    this.generalService.getBranchChoice().subscribe((branchData: any) => {
      if (!!branchData) {
        this.selectedBranch = branchData.branchPicked;
        if (this.selectedBranch === true) {
          this.branchData = branchData;
          this.branchData.items = this.selectedItems;
          this.branchData.total = 0;
          for (let i = 0; i < this.selectedItems.length; i++) {
            this.branchData.total = parseFloat((this.branchData.total + this.selectedItems[i].total).toFixed(2));
          }
        }
      }
      this.delivary = parseFloat(parseFloat(this.branchData.delivery).toFixed(2));
      this.branchData.total+=this.delivary;
    });
    this.generalService.getDialogChoice().subscribe((res) => {
      if (!!res) {
        this.selectedItems.push(res);
      }
      this.branchData.items = this.selectedItems;
      this.branchData.total = 0;
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.selectedItems[i].total = this.selectedItems[i].basePrice;
      }
      for (let j = 0; j < this.selectedItems.length; j++) {
        this.branchData.total = parseFloat((this.branchData.total + this.selectedItems[j].total).toFixed(2));
      }
      this.branchData.total = this.branchData.total + this.delivary;
      
    });
   
    this.selectBranch(this.branches);
  }
  confirmOrder(){
    console.log('this.branchData',this.branchData);
  }
  openBranch(branch: any) {
    this.dialogService.restuarantDialog(branch);

  }
  selectBranch(selectedBranch: any[]) {
    this.dialogService.branchDialog(selectedBranch);
  }
  reselectBranch() {
    this.selectedBranch = false;
    this.branchData = null;
  }
  isOpen(branchTime: any[]) {
    const DATE = new Date();
    let opensAt;
    let closesAt;
    let currentDate = DATE.getDay();
    let currentTime = ((DATE.getHours() * 3600) + (DATE.getMinutes() * 60) + (DATE.getSeconds()));
    let isOpen: boolean = false;
    if (currentDate < 5) {
      currentDate += 2;
    }
    else if (currentDate === 6) {
      currentDate = 1;
    }
    for (let i = 0; i < branchTime.length; i++) {
      if (branchTime[i].dayOfWeek === currentDate) {
        opensAt = branchTime[i].opensAt.split(':');
        closesAt = branchTime[i].closesAt.split(':');
        opensAt = opensAt.map((x) => {
          return parseInt(x);
        });

        opensAt = ((opensAt[0] * 3600) + (opensAt[1] * 60) + (opensAt[2]));
        closesAt = closesAt.map((x) => {
          return parseInt(x);
        });
        closesAt = ((closesAt[0] * 3600) + (closesAt[1] * 60) + (closesAt[2]));
        if (opensAt < closesAt) {
          if (currentTime > opensAt && currentTime < closesAt && branchTime[i].dayIsOpen) {
            isOpen = true;
          }
          else {
            isOpen = false;
          }
        }
        else if (opensAt > closesAt) {
          if (currentTime > closesAt && currentTime < opensAt || !branchTime[i].dayIsOpen) {
            isOpen = false;
          }
          else {
            isOpen = true;
          }
        }
      }
    }
    return isOpen;
  }
  onPick(item: any) {
    this.generalService.setHeading(item);
  }
  onChangeLanguage(): void {

    if (!this.isEnglish) {
      this.isEnglish = true;
      sessionStorage.setItem('language', 'en');
      this.generalService.setLang(sessionStorage.getItem('language'));
      this.language = 'en';
      this.translate.use('en');
      this.resturantService.getRestaurant(sessionStorage.getItem('language'));
    }
    else if (this.isEnglish) {
      this.isEnglish = false;
      sessionStorage.setItem('language', 'ar');
      this.generalService.setLang(sessionStorage.getItem('language'));
      this.language = 'ar';
      this.translate.use('ar');
      this.resturantService.getRestaurant(sessionStorage.getItem('language'));
    }
  }
  clickHandler() {
    this.sidenav.close();
  }
  increment(item: any) {
    this.mealPrice = item.basePrice;
    item.total += this.mealPrice;
    this.branchData.total += this.mealPrice;
    this.branchData.total = parseFloat((this.branchData.total).toFixed(2));
    item.quantity++;
  }
  decrement(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.mealPrice = item.basePrice;
      item.total -= this.mealPrice;
      this.branchData.total -= this.mealPrice;
      this.branchData.total = parseFloat((this.branchData.total).toFixed(2));
    }
    else {
      if (this.language === 'en') {
        this.dialogService.confirmDialog({
          title: 'Remove Item?',
          message: 'Are you sure you want to remove this item?',
          confirmText: 'Yes',
          cancelText: 'No'
        });
      }
      else if (this.language === 'ar') {
        this.dialogService.confirmDialog({
          title: 'حذف الطلب؟',
          message: 'هل أنت متأكد أنك تريد حذف هذا الطلب؟',
          confirmText: 'نعم',
          cancelText: 'لا'
        });
      }
      this.generalService.getConfirmChoice().subscribe(choice => {
        if (!!choice) {
          if (choice === true) {
            for (let i = 0; i < this.selectedItems.length; i++) {
              if (this.selectedItems[i] === item) {
                this.branchData.total-=this.selectedItems[i].total;
                this.selectedItems.splice(i, 1);
              }
            }
          }
        }
      });
    }

  }
  ngOnDestroy(): void {
  }
}
