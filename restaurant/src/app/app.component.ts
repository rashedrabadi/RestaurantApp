import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from './services/general/general.service';
import { RestaurantService } from './services/restaurant-service/restaurant.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Restaurant';
  lat: any;
  lng: any;
  map: any;

  constructor(
    private router: Router,
    public translate: TranslateService,
    public generalService: GeneralService, public resturantService: RestaurantService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
  }
  ngOnInit() {
    if (sessionStorage.getItem('language') !== null) {
      this.generalService.setLang(sessionStorage.getItem('language'));
      this.resturantService.getRestaurant(sessionStorage.getItem('language'));
    }
    else {
      this.generalService.setLang('en');
      this.resturantService.getRestaurant('en');
    }

    this.resturantService.getRestaurantData().subscribe((res: any) => {
      if (!!res) {
        this.generalService.setHeading(res.menus[0].name);
      }
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.ShowLocation(position, this.map);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  private ShowLocation(position: any, map: any): void {
    this.lng = +position.coords.longitude;
    this.lat = +position.coords.latitude;
    sessionStorage.setItem('LAT', position.coords.latitude);
    sessionStorage.setItem('LONG', position.coords.longitude);
  }
  ngOnDestroy(): void {
  }
}
