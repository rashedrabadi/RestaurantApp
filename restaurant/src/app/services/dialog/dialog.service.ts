import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { BranchDialogComponent } from 'src/app/branch-dialog/branch-dialog.component';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DialogData } from 'src/app/models/dialog-data.model';
import { RestaurantInfoDialogComponent } from 'src/app/restaurant-info-dialog/restaurant-info-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }
  pickupDialog(data: any): Observable<boolean> {
    return this.dialog.open(DialogComponent, {
      data,
      width: '770px',
      disableClose: true
    }).afterClosed();
  }
  restuarantDialog(data: any): Observable<any> {
    return this.dialog.open(RestaurantInfoDialogComponent, {
      data,
      width: '770px',
      disableClose: true
    }).afterClosed();
  }
  branchDialog(data: any): Observable<any> {
    return this.dialog.open(BranchDialogComponent, {
      data,
      width: '770px',
      disableClose: true
    }).afterClosed();
  }
  confirmDialog(data: any): Observable<boolean> {
    return this.dialog.open(ConfirmDialogComponent, {
      data,
      width: '550px',
      disableClose: true
    }).afterClosed();
  }
}
