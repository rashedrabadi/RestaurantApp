import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { RestaurantService } from "./app/services/restaurant-service/restaurant.service";
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(public resturantService: RestaurantService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = environment.AUTH_TOKEN;
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
