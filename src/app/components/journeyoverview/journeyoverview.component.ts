import { Component, OnInit, Inject } from '@angular/core';
import tt, { LngLat, Map, map } from '@tomtom-international/web-sdk-maps';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { PickupService } from 'src/app/services/pickup.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-journeyoverview',
  templateUrl: './journeyoverview.component.html',
  styleUrls: ['./journeyoverview.component.css'],
})
export class JourneyoverviewComponent implements OnInit {
  travelDuration: any;
  pickup: any;
  routeGeojson: any;
  summaryMap!: Map;
  routeImage: any;
  staticImage: any;
  hostId: any;
  pickupId: any;
  hostName: any;
  userId: any;
  distanceMiles: any;
  durationTotal: any;
  destination: any;
  passengerNumbers: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public pickupService: PickupService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = sessionStorage['userID'];
    this.hostId = this.data.pickup.hostId;
    this.pickupId = this.data.pickup.pickupId;

    console.log('is host overview: ' + this.data.isHost);

    if (!this.data.isHost) {
      this.pickupService
        .getPickupDetails(this.pickupId)
        .subscribe((pickupMiles: any) => {
          console.log(pickupMiles);
          this.distanceMiles = pickupMiles.pickupMiles.milesTravelled;
          this.durationTotal = pickupMiles.pickupMiles.duration;
          this.destination = pickupMiles.pickupMiles.returnAddress;
          this.passengerNumbers = pickupMiles.pickupMiles.passengers.length;

          this.authService.getUserMiles(this.userId).subscribe((data: any) => {
            console.log(data);
            let currentMiles = data.miles;
            console.log(currentMiles);

            if (currentMiles - this.distanceMiles < 0) {
            } else {
              let milesToUpdate = currentMiles - this.distanceMiles;
              console.log(milesToUpdate);

              this.authService
                .updateUserMiles(this.userId, milesToUpdate)
                .subscribe(
                  (data: any) => {
                    this.authService
                      .generateTransaction(
                        this.data.isHost,
                        this.data.pickup.pickupId,
                        this.userId,
                        this.distanceMiles,
                        this.passengerNumbers,
                        this.data.pickup.embarkAddress,
                        this.data.pickup.returnAddress
                      )
                      .subscribe((trans: any) => {
                        console.log(trans)
                      });
                  },
                  (err: any) => {
                    console.log('miles error:' + err);
                  }
                );
            }
          });
        });
    }

    this.pickupService
      .getHostDetails(this.hostId, this.pickupId)
      .subscribe((data: any) => {
        console.log('supposed to be user details: ' + data);
        this.hostName = data.data.firstName;
        this.hostName = this.capitaliseName(this.hostName);
      });
  }

  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
}
