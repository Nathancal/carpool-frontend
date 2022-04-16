import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PickupService } from 'src/app/services/pickup.service';
import tt, { Map, map } from '@tomtom-international/web-sdk-maps';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JourneydetailComponent } from '../journeydetail/journeydetail.component';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pickupoverview',
  templateUrl: './pickupoverview.component.html',
  styleUrls: ['./pickupoverview.component.css'],
})
export class PickupoverviewComponent implements OnInit, OnDestroy {
  constructor(
    public pickupService: PickupService,
    private dialog: MatDialog
  ) {}

  latlng: any;
  pickup: any;
  isPassenger!: boolean;
  isLoading!: boolean;
  ifPassengerDetails: any;
  userInfo: any;
  userCreated: any;
  map!: Map;
  geojson: any;
  routeShown!: boolean;
  distanceMiles: any;

  ngOnInit(): void {
    this.checkUserIsPassenger();
    this.loadPassengerInfo();
    console.log(this.pickup);
  }

  ngOnDestroy(): void {
    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
    }
  }

  joinPickup(pickupId: any) {
    console.log('button clicked');

    const userId = sessionStorage['userID'];
    this.pickupService.joinPickup(pickupId, userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  exitPickup(pickupId: any) {
    const userId = sessionStorage['userID'];
    this.pickupService.exitPickup(pickupId, userId).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  checkUserIsPassenger() {
    let userId = sessionStorage['userID'];
    this.pickupService
      .checkUserIsPassenger(this.pickup.pickupId, userId)
      .subscribe(
        (res: any) => {
          this.isPassenger = res.isPassenger;
          console.log(res);
          console.log('is user passenger' + this.isPassenger);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  showRoute(pickup: any) {
    this.routeShown = !this.routeShown;

    if (this.routeShown) {
      if (this.map.getLayer('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }
      let route = ttserv
        .calculateRoute({
          key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
          traffic: false,
          locations:
            [
              pickup.embarkLocation.coordinates[1],
              pickup.embarkLocation.coordinates[0],
            ] +
            ':' +
            [
              pickup.returnLocation.coordinates[1],
              pickup.returnLocation.coordinates[0],
            ],
        })
        .then((res) => {
          console.log('route calculated');
          let routeGeojson = res.toGeoJson();
          console.log(
            routeGeojson.features[0].properties.summary.lengthInMeters *
              0.00062137
          );
          this.map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: routeGeojson,
            },
            paint: {
              'line-color': '#ff1744',
              'line-width': 6,
            },
          });
          console.log(routeGeojson);
        });
    } else if (!this.routeShown) {
      if (this.map.getLayer('route')) {
        this.map.removeLayer('route');
        this.map.removeSource('route');
      }
    }
  }

  loadPassengerInfo() {
    this.pickup.passengers.forEach((passenger: any) => {
      this.pickupService
        .getPassengerDetails(passenger.passengerId)
        .subscribe((res: any) => {
          passenger.passengerDetails = res.data[0];
          console.log(passenger.passengerDetails);
        });
    });
  }

  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  journeyDetailsModal() {
    console.log(this.pickup);

    console.log(this.pickup.pickupId);

    const configDialog = new MatDialogConfig();

    configDialog.id = 'journeydetailsmodal';
    configDialog.height = '600px';
    configDialog.width = '100%';
    configDialog.panelClass = 'journey-details-modal-container';
    configDialog.data = {
      pickup: this.pickup,
      userInfo: this.userInfo,
      map: this.map,
    };
    const modal = this.dialog.open(JourneydetailComponent, configDialog);
  }
}
