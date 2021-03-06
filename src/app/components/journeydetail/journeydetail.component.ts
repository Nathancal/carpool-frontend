import { Component, OnInit, Inject } from '@angular/core';
import { JourneyService } from 'src/app/services/journey.service';
import { interval, map } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JourneyjoinComponent } from '../journeyjoin/journeyjoin.component';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { DynamiccomponentService } from 'src/app/services/dynamiccomponent.service';
import tt, { AnySourceData, Map } from '@tomtom-international/web-sdk-maps';
import { MapsService } from 'src/app/services/maps.service';
import { AuthService } from 'src/app/services/auth.service';
import { JourneyoverviewComponent } from '../journeyoverview/journeyoverview.component';
import { PickupService } from 'src/app/services/pickup.service';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-journeydetail',
  templateUrl: './journeydetail.component.html',
  styleUrls: ['./journeydetail.component.css'],
})
export class JourneydetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public journeyService: JourneyService,
    public pickupService: PickupService,
    public notifierService: NotifierService,
    public authService: AuthService,
    public mapService: MapsService,
    public dycomService: DynamiccomponentService,
    private dialogRef: MatDialogRef<JourneydetailComponent>
  ) {
    dialogRef.disableClose = true;
  }

  ping: any;
  pickupId: any;
  userId: any;
  userForename: any;
  userChecked: boolean = false;
  response: any = [];
  numPassengersJoined: any;
  passengersJoined: any = [];
  distanceMiles!: number;
  milesDecimalLimit: any;
  travelDuration: any;
  map!: tt.Map;
  markersList!: tt.Marker[];
  completedMarker!: tt.Marker;
  userJoined: boolean = false;
  isComplete: boolean = false;
  modalOpen: boolean = false;
  error: any;

  interval: any;

  isHost!: boolean;

  ngOnInit(): void {
    this.userId = sessionStorage['userID'];
    this.userForename = sessionStorage['userForename'];

    this.markersList = this.mapService.getMarkersList();

    this.map = this.mapService.getMap();

    console.log(this.data.pickup.hostId);
    console.log(this.userId);

    if (this.userId == this.data.pickup.hostId) {
      this.isHost = true;
      this.journeyService.joinJourneyHttp(
        this.userId,
        this.userForename,
        this.pickupId
      );
    } else if (this.userId != this.data.pickup.hostId) {
      this.isHost = false;

      interval(5000).subscribe((time) => {
        this.journeyService.checkJourneyComplete().subscribe((data: any) => {
          console.log(data);
          console.log('check journey completed.');
          if (data.completed === true) {
            console.log('data completed true, update miles?');
            this.updateUserMiles(this.userId, this.distanceMiles);
          }
        });
      });
    }

    console.log('isHost? ' + this.isHost);
    let messageJoin = {
      forename: this.userForename,
      pickupId: this.data.pickup.pickupId,
      userId: this.userId,
    };
    this.journeyService.joinJourneySocket(messageJoin);

    this.journeyService.getJourneyMessages().subscribe((data: any) => {
      console.log(data);
      if (!this.response.includes(data.userId)) {
        console.log(data.users);
        this.passengersJoined = data.users;
        console.log(this.passengersJoined);
        this.response = data.users;
        this.numPassengersJoined = this.response.length;
        console.log(this.response);
      }
    });

    if (!this.userJoined) {
      if (!this.modalOpen) {
        let intervalCheck = interval(5000).subscribe((time) => {
          console.log('userJoined' + this.userJoined);
          this.journeyService
            .hasUserJoined(this.userId, this.data.pickup.pickupId)
            .subscribe((data: any) => {
              console.log(data.isComplete);
              this.isComplete = data.isComplete;
              if (!this.isComplete) {
                this.userJoined = true;
                this.userChecked = data.user.joined;
              }

              if (this.isComplete) {
                this.modalOpen = true;
                const configDialog = new MatDialogConfig();

                configDialog.id = 'journeyoverviewcontainer';
                configDialog.height = '600px';
                configDialog.width = '100%';
                configDialog.panelClass = 'journeyoverviewcontainer';
                configDialog.data = {
                  pickup: this.data.pickup,
                  userId: this.userId,
                  forename: this.userForename,
                  isHost: this.isHost,
                  travelDuration: this.travelDuration,
                  numPassengers: this.numPassengersJoined,
                };
                intervalCheck.unsubscribe();
                this.notifierService.showNotification("Journey Successfully completed!", "Thanks!", 4000);
                this.dialogRef.close();
                const modal = this.dialog.open(
                  JourneyoverviewComponent,
                  configDialog
                );

              }
            });
        });
      }
    }
  }

  joinJourney() {
    let userId = sessionStorage['userID'];

    const configDialog = new MatDialogConfig();

    configDialog.id = 'scanqrcodemodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.data.pickup,
      userId: this.userId,
      forename: this.userForename,
      isHost: this.isHost,
    };
    const modal = this.dialog.open(JourneyjoinComponent, configDialog);
  }

  scanPassengerModal() {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'scanqrcodemodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.data.pickup,
      userId: this.userId,
      forename: this.userForename,
      isHost: this.isHost,
    };
    const modal = this.dialog.open(JourneyjoinComponent, configDialog);
  }

  autoCompleteJourney() {
    ttserv
      .calculateRoute({
        key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
        traffic: false,
        locations:
          [
            this.data.pickup.embarkLocation.coordinates[1],
            this.data.pickup.embarkLocation.coordinates[0],
          ] +
          ':' +
          [
            this.data.pickup.returnLocation.coordinates[1],
            this.data.pickup.returnLocation.coordinates[0],
          ],
      })
      .then((res) => {
        console.log('route calculated');
        let routeGeojson = res.toGeoJson();
        //Converts the meters to miles
        this.distanceMiles =
          routeGeojson.features[0].properties.summary.lengthInMeters *
          0.00062137;

        this.milesDecimalLimit = this.distanceMiles.toFixed(3);
        this.distanceMiles = parseFloat(this.milesDecimalLimit);

        this.travelDuration =
          routeGeojson.features[0].properties.summary.travelTimeInSeconds;

        let returnlatlng = {
          lat: this.data.pickup.returnLocation.coordinates[0],
          lng: this.data.pickup.returnLocation.coordinates[1],
        };
        console.log(returnlatlng);
        console.log(this.distanceMiles);

        let embarklatlng = {
          lng: this.data.pickup.embarkLocation.coordinates[1],
          lat: this.data.pickup.embarkLocation.coordinates[0],
        };

        console.log(this.markersList);
        for (let i = this.markersList.length - 1; i >= 0; i--) {
          let marker = new tt.Marker();
          marker = this.markersList[i];

          console.log(marker.getLngLat());
          let markerLatLng = {
            lng: marker.getLngLat().lng,
            lat: marker.getLngLat().lat,
          };
          if (JSON.stringify(markerLatLng) === JSON.stringify(embarklatlng)) {
            console.log('true');
            marker.remove();
            this.markersList.splice(i, 1);
          }
        }

        this.mapService.setMarkersList(this.markersList);

        this.map.setCenter(returnlatlng);
        console.log('GOT HERE!');
        let element = document.createElement('div');
        element.className = 'journey-complete-marker';

        this.pickupService
          .completePickup(
            this.userId,
            this.travelDuration,
            this.distanceMiles,
            this.data.pickup.pickupId
          )
          .subscribe((res: any) => {
            console.log(res);

            console.log('GETS to just before miles update.');

            this.updateUserMiles(this.userId, this.distanceMiles);
            this.authService
              .generateTransaction(
                this.isHost,
                this.data.pickup.pickupId,
                this.userId,
                this.distanceMiles,
                this.numPassengersJoined,
                this.data.pickup.embarkAddress,
                this.data.pickup.returnAddress
              )
              .subscribe((data: any) => {
                console.log(data);
              });

            const configDialog = new MatDialogConfig();

            configDialog.id = 'journeyoverviewcontainer';
            configDialog.height = '600px';
            configDialog.width = '100%';
            configDialog.panelClass = 'journeyoverviewcontainer';
            configDialog.data = {
              pickup: this.data.pickup,
              userId: this.userId,
              forename: this.userForename,
              isHost: this.isHost,
              distanceMiles: this.distanceMiles,
              travelDuration: this.travelDuration,
            };
            this.notifierService.showNotification("Journey Successfully completed!", "Thanks!", 4000);

            this.dialogRef.close();
            const modal = this.dialog.open(
              JourneyoverviewComponent,
              configDialog
            );
          });
      });
  }

  updateUserMiles(userId: any, totalMiles: any) {
    this.authService.getUserMiles(userId).subscribe((data: any) => {
      let currentMiles = data.miles;

      if (this.isHost == true) {
        let milesMultiplier = totalMiles * this.response.length;

        console.log(milesMultiplier);

        let milesToUpdate = currentMiles + milesMultiplier;


        this.authService.updateUserMiles(userId, milesToUpdate).subscribe(
          (data: any) => {
            console.log('user miles update ' + data);
          },
          (err: any) => {
            console.log('miles error:' + err);
          }
        );
      } else {
        let milesToUpdate = currentMiles - totalMiles;


        this.authService.updateUserMiles(userId, milesToUpdate).subscribe(
          (data: any) => {
            console.log('user miles update ' + data);
          },
          (err: any) => {
            this.error = err;
            console.log('error' + this.error);
          }
        );
      }
    });
  }

  goToUser() {
    //TODO
  }
}
