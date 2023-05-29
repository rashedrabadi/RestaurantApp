import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralService } from '../services/general/general.service';
import { DialogData } from '../models/dialog-data.model';
import { RestaurantService } from '../services/restaurant-service/restaurant.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  colors: any = {};
  isLoading: boolean;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private generalService: GeneralService, public resturantService: RestaurantService) { }

  ngOnInit(): void {
    this.resturantService.getRestaurantData().subscribe((res: any) => {
      this.isLoading = true;
      if (!!res) {
        this.colors.colorPrimary = res.colorPrimary;
        this.colors.colorSecondary = res.colorSecondary;
        this.colors.colorTertiary = res.colorTertiary;
        this.isLoading = false;

      }
    });
  }
  onChoice(choice: boolean) {
    this.generalService.setConfirmChoice(choice);
  }
}
