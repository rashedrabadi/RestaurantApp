import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';
import { GeneralService } from '../services/general/general.service';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../services/dialog/dialog.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterViewInit {
  public restaurantData: any;
  public menuType: any;
  public menu: any;
  isLoading = false;
  language: string;
  designType: any;
  view1: boolean = false;
  view2: boolean = false;
  view3: boolean = false;
  innerWidth: number;
  restaurantImage: any;

  constructor(public resturantService: RestaurantService, private dialogService: DialogService, public generalService: GeneralService, public translate: TranslateService) { }
  @Input() selectedBranch: boolean;
  ngOnInit(): void {
    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
      this.translate.use(lang);
    });
    this.innerWidth = window.innerWidth;
    this.generalService.getHeading().subscribe((header: any) => {
      this.isLoading = true;
      if (!!header) {
        this.restaurantData = this.resturantService.getRestaurantData().subscribe((result: any) => {
          this.isLoading = true;
          if (!!result) {
            this.restaurantImage=result.imageCover;
            for (let i = 0; i < result.menus.length; i++) {
              if (result.menus[i].name == header) {
                this.menu = result.menus[i].items;
              }
            }
            this.isLoading = false;
          }
        });
      }
    });

  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }
  changeView(view: number) {
    switch (view) {
      case 1: {
        this.view1 = true;
        this.view2 = false;
        this.view3 = false;
        break;
      }
      case 2: {
        this.view1 = false;
        this.view2 = true;
        this.view3 = false;
        break;
      }
      case 3: {
        this.view1 = false;
        this.view2 = false;
        this.view3 = true;
        break;
      }
    }
  }
  openDialog(item: any) {
    this.dialogService.pickupDialog(item);

  }
  ngAfterViewInit() {
    this.restaurantData = this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res && this.selectedBranch) {
        this.designType = res.designType;
        switch (this.designType) {
          case 1: {
            document.getElementById('view-1-button').click();
            this.view1 = true;
            this.view2 = false;
            this.view3 = false;
            break;
          }
          case 2: {
            document.getElementById('view-2-button').click();
            this.view1 = false;
            this.view2 = true;
            this.view3 = false;
            break;
          }
          case 3: {
            document.getElementById('view-3-button').click();
            this.view1 = false;
            this.view2 = false;
            this.view3 = true;
            break;
          }
        }
        this.isLoading = false;
      }
    });
  }
}
