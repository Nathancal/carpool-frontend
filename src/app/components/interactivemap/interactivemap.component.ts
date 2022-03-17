import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import tt, {
  Popup,
  TomTomAttributionControl,
} from '@tomtom-international/web-sdk-maps';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PickupdetailsComponent } from '../pickupdetails/pickupdetails.component';
import { PickupService } from 'src/app/services/pickup.service';
import { PickupoverviewComponent } from '../pickupoverview/pickupoverview.component';
import { DynamiccomponentService } from 'src/app/services/dynamiccomponent.service';
import { SearchbarComponent } from '../searchbar/searchbar.component';

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
  embarkAddress: any;
  embarkLat: any;
  embarkLng: any;
  routeGeojson: any;

  @ViewChild(SearchbarComponent) searchBar!: SearchbarComponent;

  constructor(
    private dialog: MatDialog,
    public pickupService: PickupService,
    public dycomService: DynamiccomponentService
  ) {}

  ngOnInit(): void {
    let geolocateControl = new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    ttserv.copyrights({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
    });

    this.map = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'map',
      center: [-5.9301, 54.5973],
      zoom: 16,
    });

    this.map.addControl(geolocateControl, 'bottom-right');
    this.map.addControl(new tt.NavigationControl(), 'bottom-right');

    this.map.once('click', (e) => {
      console.log(e.lngLat);
      this.getAvailablePickups(e.lngLat);
      this.getUserPickups();
    });

    this.map.on('click', (e) => {
      console.log('search bar results = ' + this.searchBar.positionOfResult);
      //This ensures that when the search is found it doesnt keep recentering the map on the search criteria every click.
      if (this.searchBar.positionOfResult != undefined) {
        this.map.setCenter(this.searchBar.positionOfResult);
      }

      console.log(e.lngLat);
      let centerValue = this.map.getCenter();
      //Reduces the amounts of calls to the backend when user clicks on map if available
      //pickups are already displayed.
      if (
        centerValue.distanceTo(e.lngLat) > 500 &&
        this.searchBar.positionOfResult == undefined
      ) {
        this.map.setCenter(e.lngLat);
        this.getUserPickups();
        this.getAvailablePickups(e.lngLat);
      }
    });

    this.map.on('touchstart', (e) => {
      //This ensures that when the search is found it doesnt keep recentering the map on the search criteria every click.
      if (this.searchBar.positionOfResult != undefined) {
        this.map.setCenter(this.searchBar.positionOfResult);
      }
      const timeStart = new Date();
      this.map.on('touchend', () => {
        const timeEnd = new Date();
        let milliseconds =
          Math.abs(timeEnd.getMilliseconds() - timeStart.getMilliseconds()) /
          100;
        if (milliseconds > 10) {
          this.PickupDetailsModal(e);
        }
        console.log(milliseconds.valueOf());
      });
    });

    this.map.on('dblclick', (e) => {
      this.PickupDetailsModal(e);
      let centerValue = this.map.getCenter();
      //Reduces the amounts of calls to the backend when user clicks on map if available
      //pickups are already displayed.
      if (centerValue.distanceTo(e.lngLat) > 500) {
        this.getAvailablePickups(e.lngLat);
      }
    });
  }

  getUserPickups() {
    this.pickupService
      .getUserPickups(sessionStorage['userID'])
      .subscribe((res: any) => {
        this.userHostData = res.data;
        this.userHostData.forEach((pickup: any) => {
          let latlng = {
            lat: pickup.embarkLocation.coordinates[0],
            lng: pickup.embarkLocation.coordinates[1],
          };

          this.createPickupMarker(latlng, pickup);
        });
        console.log(res.data);
      });
  }

  getAvailablePickups(latlng: any) {
    this.pickupService
      .getPickupsInArea(latlng.lat, latlng.lng)
      .subscribe((res: any) => {
        console.log(res);
        this.availablePickups = res.data;

        this.availablePickups.forEach((pickup: any) => {
          let latlng = {
            lat: pickup.embarkLocation.coordinates[0],
            lng: pickup.embarkLocation.coordinates[1],
          };

          this.createPickupMarker(latlng, pickup);
        });
      });
  }

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
          }).setDOMContent(popupContent);
          let marker = new tt.Marker({ element: element })
            .setLngLat(latlng)
            .setPopup(popup)
            .addTo(this.map);
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
          }).setDOMContent(popupContent);
          let marker = new tt.Marker({ element: element })
            .setLngLat(latlng)
            .setPopup(popup)
            .addTo(this.map);
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
    };

    const modal = this.dialog.open(PickupoverviewComponent, configDialog);

    modal.afterClosed().subscribe((res: any) => {});
  }
}
