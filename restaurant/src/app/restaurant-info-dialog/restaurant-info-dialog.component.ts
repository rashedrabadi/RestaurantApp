import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogData } from '../models/dialog-data.model';
import { GeneralService } from '../services/general/general.service';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-restaurant-info-dialog',
  templateUrl: './restaurant-info-dialog.component.html',
  styleUrls: ['./restaurant-info-dialog.component.scss']
})
export class RestaurantInfoDialogComponent implements OnInit {
  language: string;
  restaurantData: any;
  isLoading: boolean;
  restaurantInfo: any;
  weekdays: any[] = [];
  location: any[] = [sessionStorage.getItem('LAT'), sessionStorage.getItem('LONG')];
  canBeDelivered: boolean = false;
  center: google.maps.LatLngLiteral;
  zoom = 14;
  vertices: google.maps.LatLngLiteral[] = [];
  markerPosition: google.maps.LatLngLiteral;
  markers: any[] = [];
  deliveryPrice: number;
  orderCondition: any = {};
  colors: any = {};
  dragged = false;
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private generalService: GeneralService, public translate: TranslateService, public resturantService: RestaurantService) { }
  ngOnInit(): void {
    this.restaurantData = this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res) {
        this.colors.colorPrimary = res.colorPrimary;
        this.colors.colorSecondary = res.colorSecondary;
        this.colors.colorTertiary = res.colorTertiary;
        this.restaurantInfo = res;
        this.isLoading = false;

      }
    });
    this.generalService.getLang().subscribe(lang => {
      this.language = lang;
      this.translate.use(lang);
    });
    this.weekdays = this.data.workingHours.sort((a, b) => a.dayOfWeek - b.dayOfWeek);
    this.canBeDelivered = this.canDeliver(this.location, this.data.pointsLatLng);
    this.isLoading = true;
    if (!!this.data.pointsLatLng) {
      this.markers = [
        {
          position: { lat: parseInt(this.location[0]), lng: parseInt(this.location[1]) },
          visible: true,
          opacity: 1,

          title: 'You',
          options: {
            draggable: true,
            icon: '../assets/images/person-icon.png'
          }
        },
        {
          position: { lat: this.data.latitude, lng: this.data.longitude },
          visible: true,
          opacity: 1,

          title: this.data.name,
          options: {
            draggable: false,
            icon: '../assets/images/res-icon.png'
          }
        }
      ]
      for (let i = 0; i < this.data.pointsLatLng.length; i++) {
        this.vertices[i] = { lat: this.data.pointsLatLng[i].latitude, lng: this.data.pointsLatLng[i].longitude }
      }
      this.markerPosition =
        this.center = { lat: this.data.latitude, lng: this.data.longitude }
      this.isLoading = false;
    }

  }
  drag(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markers[0].position = event.latLng.toJSON();
      this.location[0] = this.markers[0].position.lat;
      this.location[1] = this.markers[0].position.lng;
      this.canBeDelivered = this.canDeliver(this.location, this.data.pointsLatLng);
      this.requiredSet(this.orderCondition);
    }
  }

  onChoice(choice: any) {
    if (choice === true) {

      const pickedBranchData = {
        restaurantBrancheId: this.data.id,
        userDeviceToken: 'not returned from DB',
        name: this.data.name,
        phoneNumber: this.data.phoneNumber,
        instruction: 'not retruned from DB',
        tableNumber: 'not returned from DB',
        total: 0,
        delivery: this.deliveryPrice,
        receiveMethod: 'unknown',
        paymentStatus: 'unknown',
        paymentType: 'not implemented yet',
        latitude: this.location[0],
        longitude: this.location[1],
        branchPicked: true,
        orderCondition:this.orderCondition
      }
      this.generalService.setBranchChoice(pickedBranchData);
    }
    else if (choice === false) {
      const pickedBranchData = {
        branchPicked: false
      }
      this.generalService.setBranchChoice(pickedBranchData);
    }
  }
  distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    }
    else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515 * 1.609344;
      return dist;
    }
  }
  requiredSet(choice: any) {
    if (choice.value === 'pickup') {
      this.orderCondition.value = 'pickup';
      this.deliveryPrice = 0;
    }
    else if (choice.value === 'delivery') {
      this.orderCondition.value = 'delivery';
      this.deliveryPrice = (this.data.minCost +
        (this.distance(this.location[0], this.location[1], this.data.latitude, this.data.longitude) * this.data.costPerKm)).toFixed(2);
    }
    else if (choice.value === 'dineIn') {
      this.orderCondition.value = 'dineIn';
      this.deliveryPrice = 0;
    }
    else {
      this.deliveryPrice = 0;
    }
  }
  canDeliver(point: any[], polygon: any[]) {
    const n = polygon.length;
    let isIn = false;
    const x = point[0];
    const y = point[1];
    let x1, x2, y1, y2;

    x1 = polygon[n - 1].latitude;
    y1 = polygon[n - 1].longitude;

    for (let i = 0; i < n; ++i) {
      x2 = polygon[i].latitude;
      y2 = polygon[i].longitude;

      if (y < y1 !== y < y2 && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
        isIn = true;
      }
      else {
        isIn = false;
      }
      x1 = x2;
      y1 = y2;
    }

    return isIn;
  }
}
