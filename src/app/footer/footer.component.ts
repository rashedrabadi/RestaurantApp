import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from '../services/general/general.service';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  colors: any={};
  language: any;
  isLoading: boolean = false;
  constructor(public translate: TranslateService, public generalService: GeneralService, public resturantService: RestaurantService) { }
  ngOnInit(): void {
    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
      this.translate.use(lang);
    });
    this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res) {
        this.colors.colorPrimary = res.colorPrimary;
        this.colors.colorSecondary = res.colorSecondary;
        this.colors.colorTertiary = res.colorTertiary;
       
      }
      this.isLoading = false;
    });
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
