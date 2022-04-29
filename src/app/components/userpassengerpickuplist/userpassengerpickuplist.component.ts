import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';
import { PickupService } from 'src/app/services/pickup.service';
import tt from '@tomtom-international/web-sdk-maps';

@Component({
  selector: 'app-userpassengerpickuplist',
  templateUrl: './userpassengerpickuplist.component.html',
  styleUrls: ['./userpassengerpickuplist.component.css'],
})
export class UserpassengerpickuplistComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public mapService: MapsService,
    public pickupService: PickupService,
    private dialogRef: MatDialogRef<UserpassengerpickuplistComponent>
  ) {}

  ngOnInit(): void {}

  goToPickup(pickup: any) {
    let lnglat = new tt.LngLat(
      pickup.embarkLocation.coordinates[1],
      pickup.embarkLocation.coordinates[0]
    );


    this.mapService.getMap().setCenter(lnglat);
    this.dialogRef.close();
  }
}
