import { Component, OnInit, Inject } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MapsService } from 'src/app/services/maps.service';
import tt from '@tomtom-international/web-sdk-maps';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
})
export class UserprofileComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public pickupService: PickupService,
    public authService: AuthService,
    private dialogRef: MatDialogRef<UserprofileComponent>,
    public mapService: MapsService
  ) {}

  userPickupList: any;
  isUser!: boolean;
  userId: any;
  userInfo: any;
  userReviews!: any[];
  isLoading!: boolean;

  ngOnInit(): void {
    this.isLoading = true;
    this.userId = sessionStorage['userID'];

    this.userReviews = this.data.userInfo.reviews;

    this.userReviews.forEach((review: any) => {
      this.authService
        .getUserInfo(review.userPostedId)
        .subscribe((res: any) => {
          review.postedName = res.data.firstName + ' ' + res.data.lastName;
        });
    });

    console.log(this.userReviews);

    this.userPickupList = this.data.userPickupList;
    this.userInfo = this.data.userInfo;

    this.isLoading = false;
  }

  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  goToPickup(pickup: any) {

    let lnglat = new tt.LngLat(pickup.embarkLocation.coordinates[1], pickup.embarkLocation.coordinates[0])
    this.mapService.getMap().setCenter(lnglat)
    this.dialogRef.close();
  }
}
