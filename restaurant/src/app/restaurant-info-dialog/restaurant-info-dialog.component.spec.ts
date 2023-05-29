import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantInfoDialogComponent } from './restaurant-info-dialog.component';

describe('RestaurantInfoDialogComponent', () => {
  let component: RestaurantInfoDialogComponent;
  let fixture: ComponentFixture<RestaurantInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestaurantInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
