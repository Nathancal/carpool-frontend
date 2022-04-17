import { Component, OnInit, Inject } from '@angular/core';
import { JourneyService } from 'src/app/services/journey.service';
import { interval, map } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JourneyjoinComponent } from '../journeyjoin/journeyjoin.component';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { DynamiccomponentService } from 'src/app/services/dynamiccomponent.service';
import tt, { Map } from '@tomtom-international/web-sdk-maps';
import { MapsService } from 'src/app/services/maps.service';
import { AuthService } from 'src/app/services/auth.service';
import { JourneyoverviewComponent } from '../journeyoverview/journeyoverview.component';

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

  isHost!: boolean;

  ngOnInit(): void {
    this.userId = sessionStorage['userID'];
    this.userForename = sessionStorage['userForename'];

    this.markersList = this.mapService.getMarkersList();

    this.map = this.mapService.getMap();

    if (this.userId == this.data.pickup.hostId) {
      this.isHost = true;
    } else if (this.userId != this.data.pickup.hostId) {
      this.isHost = false;
    }
    this.journeyService.joinJourneySocket(
      this.userId,
      this.userForename,
      this.data.pickup.pickupId
    );

    this.journeyService.getJourneyMessages().subscribe((data: any) => {
      if (!this.response.includes(data.userId)) {
        console.log(data.users);
        this.passengersJoined = data.users;
        console.log(this.passengersJoined);
        this.response.push({ userId: data.userId, forename: data.forename });
        this.numPassengersJoined = this.passengersJoined.length;
      }
    });

    interval(5000).subscribe((time) => {
      this.journeyService
        .hasUserJoined(this.userId, this.data.pickup.pickupId)
        .subscribe((data: any) => {
          console.log(data.users[0]);

          this.userChecked = data.users[0].joined;
        });

      this.journeyService.journeyStartCheck().subscribe((data: any) => {
        console.log(data);
      });
    });

    interval(1000).subscribe((time) => {
      this.journeyService.checkJourneyComplete().subscribe((data: any) => {
        console.log(data);
        if (data.completed === true) {
        }
      });
    });
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

        let popupContent = this.dycomService.injectComponent(
          JourneyoverviewComponent,
          (x) => {
            x.routeGeojson = routeGeojson;
            x.pickup = this.data.pickup;
            x.distanceMiles = this.distanceMiles;
            x.travelDuration = this.travelDuration;
            x.map = this.data.map;
          }
        );

        let popup = new tt.Popup({
          offset: 40,
          maxWidth: '750px',
        }).setDOMContent(popupContent);
        let marker = new tt.Marker({ element: element })
          .setLngLat(returnlatlng)
          .setPopup(popup)
          .addTo(this.map);

        this.markersList.push(marker);
        this.mapService.setMarkersList(this.markersList);



        this.updateUserMiles(this.userId, this.distanceMiles);

        console.log(marker);
      });

    this.dialogRef.close();

  }

  updateUserMiles(userId: any, totalMiles: any) {
    this.authService.getUserMiles(userId).subscribe((data: any) => {
      let currentMiles = data.miles;

      if (this.isHost == true) {
        let milesMultiplier = totalMiles * this.numPassengersJoined;

        let milesToUpdate = currentMiles + milesMultiplier;

        console.log("check miles: " + milesToUpdate);

        this.authService.updateUserMiles(userId, milesToUpdate).subscribe(
          (data: any) => {},
          (err: any) => {}
        );
      } else {
        let milesToUpdate = currentMiles - totalMiles;

        console.log("check miles: " + milesToUpdate);


        this.authService.updateUserMiles(userId, milesToUpdate).subscribe(
          (data: any) => {},
          (err: any) => {}
        );
      }
    });
  }

  goToUser() {
    //TODO
  }
}
