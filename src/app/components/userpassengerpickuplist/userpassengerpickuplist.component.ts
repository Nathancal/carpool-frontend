import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';
import { PickupService } from 'src/app/services/pickup.service';
import tt from '@tomtom-international/web-sdk-maps';
import { NotifierService } from 'src/app/services/notifier.service';

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
    public notifierService: NotifierService,
    private dialogRef: MatDialogRef<UserpassengerpickuplistComponent>
  ) {}

  userId: any;

  ngOnInit(): void {

    this.userId = sessionStorage["userID"];
  }

  goToPickup(pickup: any) {
    let lnglat = new tt.LngLat(
      pickup.embarkLocation.coordinates[1],
      pickup.embarkLocation.coordinates[0]
    );


    this.mapService.getMap().setCenter(lnglat).setZoom(11);
    this.dialogRef.close();
  }

  exitPickup(pickupId: any, userId: any){

    this.pickupService.exitPickup(pickupId, userId).subscribe((res:any)=>{
      this.notifierService.showNotification("you have succesfully left this pickup", "ok",4000);
    },(err:any)=>{
      this.notifierService.showNotification("you were unable to leave this pickup","ok", 4000);
    })

  }
}
