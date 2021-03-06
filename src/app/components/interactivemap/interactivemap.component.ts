import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { interval } from 'rxjs';

import tt, {
  Popup,
  TomTomAttributionControl,
  TTControl,
} from '@tomtom-international/web-sdk-maps';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PickupdetailsComponent } from '../pickupdetails/pickupdetails.component';
import { PickupService } from 'src/app/services/pickup.service';
import { PickupoverviewComponent } from '../pickupoverview/pickupoverview.component';
import { DynamiccomponentService } from 'src/app/services/dynamiccomponent.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';
import { MapsService } from 'src/app/services/maps.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MilestransactionsComponent } from '../milestransactions/milestransactions.component';

@Component({
  selector: 'app-interactivemap',
  templateUrl: './interactivemap.component.html',
  styleUrls: ['./interactivemap.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InteractivemapComponent implements OnInit {
  title = 'test-app';
  userData!: User[];
  userHostData: any;
  private userInfo: any;
  availablePickups: any;
  map!: tt.Map;
  longPress = false;
  marker!: tt.Popup;
  currLat: any;
  currLng: any;
  startLat: any;
  startLng: any;
  center = [];
  selectDestination!: boolean;
  transactionList: any;
  embarkAddress: any;
  embarkLat: any;
  embarkLng: any;
  routeGeojson: any;
  markersList: tt.Marker[] = [];
  markersAndPickup: any = [];
  milesCounter: any;
  isAuthenticated!: string;
  userPassenger!: any[];

  userID: any = sessionStorage['userID'];

  @ViewChild(SearchbarComponent) searchBar!: SearchbarComponent;

  constructor(
    private dialog: MatDialog,
    public pickupService: PickupService,
    public authService: AuthService,
    public dycomService: DynamiccomponentService,
    public mapService: MapsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (sessionStorage['token'] != undefined) {
      this.authService.setAuth(sessionStorage['token']);
    }

    this.getUserMiles();

    let geolocateControl = new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    this.authService.getTransactionsForUser(sessionStorage['userID']).subscribe(
      (res: any) => {
        this.transactionList = res.data;

        console.log(this.transactionList);
      },
      (err: any) => {
        console.log(err);
        this.transactionList = undefined;
      }
    );


    interval(10000).subscribe((time) => {
      this.getUserMiles();
    });

    if (this.authService.isAuth() != true) {
      this.router.navigateByUrl('/');
    }

    ttserv.copyrights({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
    });

    this.map = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'map',
      center: [-5.9301, 54.5973],
      zoom: 11,
    });

    this.mapService.setMap(this.map);

    this.map.addControl(geolocateControl, 'bottom-right');
    this.map.addControl(new tt.NavigationControl(), 'bottom-right');

    this.map.once('click', (e) => {
      let latlng = {
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
      };

      this.pickupService
        .getPickupsInArea(latlng.lat, latlng.lng)
        .subscribe((res: any) => {
          console.log(res);
          this.availablePickups = res.data;
          let latlng = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          };
        });
      console.log(e.lngLat);

      this.map.on('click', (mapEvent) => {
        console.log('GOT TO CLICK!');
        let centerValue = this.map.getCenter();
        let latlngRecenter = {
          lat: mapEvent.lngLat.lat,
          lng: mapEvent.lngLat.lng,
        };

        if (centerValue.distanceTo(mapEvent.lngLat) > 750) {
          console.log("center value changed.")

          let latlng = new tt.LngLat(latlngRecenter.lng, latlngRecenter.lat);
          this.map.setCenter(latlng);
          this.pickupService
            .getPickupsInArea(latlngRecenter.lat, latlngRecenter.lng)
            .subscribe((res: any) => {
              console.log(res);
              this.availablePickups = res.data;
              let latlng = {
                lat: e.lngLat.lat,
                lng: e.lngLat.lng,
              };
            });
        }

        this.availablePickups.forEach((pickup: any) => {
          let pickupLatLng = {
            lat: pickup.embarkLocation.coordinates[0],
            lng: pickup.embarkLocation.coordinates[1],
          };

          let ttlatLng = new tt.LngLat(pickupLatLng.lng, pickupLatLng.lat);
          let element = document.createElement('div');
          let popup: tt.Popup;
          if (pickup.pickupStatus == 'pending') {
            if (pickup.hostId == sessionStorage['userID']) {
              element.id = 'user-pickup-marker';
            } else {
              element.id = 'available-pickup-marker';
            }

            let marker = new tt.Marker(element);
            element.addEventListener('click', (e) => {
              console.log('element clicked here!');
              mapEvent.originalEvent.stopPropagation();
              this.pickupService
                .getHostDetails(pickup.hostId, pickup.pickupId)
                .subscribe((res) => {
                  let userInfo = res;
                  let popupContent = this.dycomService.injectComponent(
                    PickupoverviewComponent,
                    (x) => {
                      x.latlng = pickupLatLng;
                      x.pickup = pickup;
                      x.userInfo = userInfo;
                      x.map = this.map;
                    }
                  );
                  popup = new tt.Popup({
                    offset: 40,
                    className:'popup-class',
                    maxWidth: '90%',
                    closeOnClick: true,
                  }).setDOMContent(popupContent);
                  popup.setLngLat(ttlatLng).addTo(this.map);
                });
            });

            marker.setLngLat(pickupLatLng).addTo(this.map);
          }

          // if (pickup.pickupStatus === 'pending') {
          //   this.createPickupMarker(latlng, pickup);
          // }
        });
        console.log('search bar results = ' + this.searchBar.positionOfResult);
        //This ensures that when the search is found it doesnt keep recentering the map on the search criteria every click.
        if (this.searchBar.positionOfResult != undefined) {
          console.log(
            'search bar results = ' + this.searchBar.positionOfResult[0]
          );

          this.map.setCenter(this.searchBar.positionOfResult);
        }

        console.log(this.markersList);

        console.log(e.lngLat);
        //Reduces the amounts of calls to the backend when user clicks on map if available
        //pickups are already displayed.
      });

      // this.getAvailablePickups(e.lngLat);
      // this.getUserPickups();
    });

    this.mapService.setMap(this.map);

    // this.map.on('touchstart', (e) => {
    //   //This ensures that when the search is found it doesnt keep recentering the map on the search criteria every click.
    //   if (this.searchBar.positionOfResult != undefined) {
    //     this.map.setCenter(this.searchBar.positionOfResult);
    //   }
    //   const timeStart = new Date();
    //   this.map.on('touchend', () => {
    //     const timeEnd = new Date();
    //     let milliseconds =
    //       Math.abs(timeEnd.getMilliseconds() - timeStart.getMilliseconds()) /
    //       100;
    //     if (milliseconds > 10) {
    //       this.PickupDetailsModal(e);
    //     }
    //     console.log(milliseconds.valueOf());
    //   });
    // });

    this.map.on('dblclick', (e) => {
      this.PickupDetailsModal(e);
      let centerValue = this.map.getCenter();
      this.map.removeLayer('route');
      this.map.removeControl('route');
      //Reduces the amounts of calls to the backend when user clicks on map if available
      //pickups are already displayed.
      if (centerValue.distanceTo(e.lngLat) > 750) {
        // this.getAvailablePickups(e.lngLat);
      }
    });
  }

  // getUserPickups() {
  //   this.pickupService
  //     .getUserPickups(sessionStorage['userID'])
  //     .subscribe((res: any) => {
  //       this.userHostData = res.data;
  //       this.userHostData.forEach((pickup: any) => {
  //         let latlng = {
  //           lat: pickup.embarkLocation.coordinates[0],
  //           lng: pickup.embarkLocation.coordinates[1],
  //         };
  //         if (pickup.pickupStatus === 'pending') {
  //           this.createPickupMarker(latlng, pickup);
  //         }
  //       });
  //       console.log(res.data);
  //     });
  // }

  // getAvailablePickups(latlng: any) {
  //   this.pickupService
  //     .getPickupsInArea(latlng.lat, latlng.lng)
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       this.availablePickups = res.data;

  //       this.availablePickups.forEach((pickup: any) => {
  //         let latlng = {
  //           lat: pickup.embarkLocation.coordinates[0],
  //           lng: pickup.embarkLocation.coordinates[1],
  //         };

  //         if (pickup.pickupStatus === 'pending') {
  //           this.createPickupMarker(latlng, pickup);
  //         }
  //       });
  //     });
  // }

  createPickupMarker(latlng: any, pickup: any) {
    //Prevents the same map marker being added multiple times to the same location
    //This stops images being duplicated in place.

    let element = document.createElement('div');
    if (pickup.hostId == sessionStorage['userID']) {
      element.id = 'user-pickup-marker';

      this.pickupService
        .getHostDetails(pickup.hostId, pickup.pickupId)
        .subscribe((res) => {
          this.userInfo = res;

          let popupContent = this.dycomService.injectComponent(
            PickupoverviewComponent,
            (x) => {
              x.latlng = latlng;
              x.pickup = pickup;
              x.userInfo = this.userInfo;
              x.map = this.map;
            }
          );

          let popup = new tt.Popup({
            offset: 40,
            maxWidth: '750px',
            closeOnClick: true,
          }).setDOMContent(popupContent);
          let marker = new tt.Marker({ element: element });

          marker.setLngLat(latlng);
          marker.setPopup(popup);
          marker.addTo(this.map);
        });
    } else {
      element.id = 'available-pickup-marker';
      this.pickupService
        .getHostDetails(pickup.hostId, pickup.pickupId)
        .subscribe((res) => {
          this.userInfo = res;
          console.log(res);
          console.log(this.userInfo);
          let popupContent = this.dycomService.injectComponent(
            PickupoverviewComponent,
            (x) => {
              x.latlng = latlng;
              x.pickup = pickup;
              x.userInfo = this.userInfo;
              x.userCreated = false;
              x.map = this.map;
            }
          );

          let popup = new tt.Popup({
            offset: 40,
            maxWidth: '750px',
            closeOnClick: true,
          }).setDOMContent(popupContent);
          let marker = new tt.Marker({ element: element });

          marker.setLngLat(latlng);
          marker.setPopup(popup);
          marker.addTo(this.map);
        });
    }
  }

  PickupDetailsModal(e: any) {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'pickupdetailsmodal';
    configDialog.height = '400px';
    configDialog.width = '100%';
    configDialog.panelClass = 'pickup-modal-container';
    configDialog.data = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
      createSuccessful: false,
      createCancelled: false,
      embarkAddress: this.embarkAddress,
      embarkLat: this.embarkLat,
      embarkLng: this.embarkLng,
      selectDestination: this.selectDestination,
      pickup: {},
    };
    const modal = this.dialog.open(PickupdetailsComponent, configDialog);

    modal.afterClosed().subscribe((res: any) => {
      console.log(res);

      //Each if determines the state of the app after the dialog is closed
      if (res.createSuccessful == true) {
        this.selectDestination = false;
        let lngLat = {
          lat: this.embarkLat,
          lng: this.embarkLng,
        };
        this.createPickupMarker(lngLat, res.pickup);

        this.embarkAddress = undefined;
        this.embarkLat = undefined;
        this.embarkLng = undefined;
      }
      if (res.selectDestination == true) {
        this.selectDestination = true;
        this.embarkAddress = res.embarkAddress;
        this.embarkLat = res.embarkLat;
        this.embarkLng = res.embarkLng;
      }
      if (res.createCancelled == true) {
        this.selectDestination = res.selectDestination;
        this.embarkAddress = undefined;
        this.embarkLat = undefined;
        this.embarkLng = undefined;
      }
    });
  }

  PickupOverviewModal(e: any) {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'pickupoverviewsmodal';
    configDialog.height = '400px';
    configDialog.width = '100%';
    configDialog.panelClass = 'pickup-modal-container';
    configDialog.data = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
      createSuccessful: false,
      pickup: {},
      markersList: this.markersList,
    };

    const modal = this.dialog.open(PickupoverviewComponent, configDialog);

    modal.afterClosed().subscribe((res: any) => {});
  }

  getUserMiles() {
    this.authService.getUserMiles(this.userID).subscribe((res: any) => {
      this.milesCounter = res.miles.toFixed(0);
    });
  }

  viewTransactions() {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'usertransactionsmodal';
    configDialog.height = '400px';
    configDialog.width = '100%';
    configDialog.panelClass = 'trans-modal-container';
    configDialog.data = {
      transactionList: this.transactionList,
    };

    const modal = this.dialog.open(MilestransactionsComponent, configDialog);
  }
}
