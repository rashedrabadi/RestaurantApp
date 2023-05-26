import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GeneralService } from '../general/general.service';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  public restaurantData = new BehaviorSubject(null);
  language: string;
  constructor(private http: HttpClient, private router: Router) { }

  getRestaurant(lang:string) {
    const reqBody = {
      "applicationId": environment.APPLICATION_ID
    }
    if (lang === 'en') {
      return this.http.post<{
      }>(environment.API_BASE_EN, reqBody).subscribe((res: any) => {
        this.setRestaurantData(res.result[0]);
      });
    }
    else if (lang == 'ar') {
      return this.http.post<{
      }>(environment.API_BASE_AR, reqBody).subscribe((res: any) => {
        this.setRestaurantData(res.result[0]);
      });
    }
    else {
      return alert('error getting data from backend');
    }

  }
  setRestaurantData(restaurant: any) {
    return this.restaurantData.next(restaurant);
  }
  getRestaurantData() {
    return this.restaurantData.asObservable();
  }
}
