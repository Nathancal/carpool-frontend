import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { User } from 'src/app/interfaces/user';
import tt, {
  TomTomAttributionControl,
} from '@tomtom-international/web-sdk-maps';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PickupdetailsComponent } from '../pickupdetails/pickupdetails.component';
import { PickupService } from 'src/app/services/pickup.service';

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
  availablePickups: any;
  map!: tt.Map;
  longPress = false;
  marker: any;
  currLat: any;
  currLng: any;
  startLat: any;
  startLng: any;
  center = [];

  constructor(private dialog: MatDialog, public pickupService: PickupService) {}
  @ViewChild('popupJoin') popupJoin!: ElementRef;

  ngOnInit(): void {
    let geolocateControl = new tt.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    this.map = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'map',
      center: [-5.9301, 54.5973],
      zoom: 12,
    });

    this.map.addControl(geolocateControl, 'bottom-right');
    this.map.addControl(new tt.NavigationControl(), 'bottom-right');

    this.map.once('click', (e) => {
      console.log(e.lngLat);
      this.getAvailablePickups(e.lngLat);
      this.getUserPickups();
    });

    this.map.on('click', (e) => {
      console.log(e.lngLat);
      let centerValue = this.map.getCenter();
      this.map.setCenter(e.lngLat);
      //Reduces the amounts of calls to the backend when user clicks on map if available
      //pickups are already displayed.
      if (centerValue.distanceTo(e.lngLat) > 500) {
        this.getUserPickups();
        this.getAvailablePickups(e.lngLat);
      }
    });

    this.map.on('dblclick', (e) => {
      this.PickupDetailsModal(e);
      let centerValue = this.map.getCenter();
      this.map.setCenter(e.lngLat);
      //Reduces the amounts of calls to the backend when user clicks on map if available
      //pickups are already displayed.
      if (centerValue.distanceTo(e.lngLat) > 500) {
        this.getAvailablePickups(e.lngLat);
      }
    });

    this.map.on('touchstart', (e) => {
      e.preventDefault();
      this.longPress = true;
      setTimeout((e: any) => {
        this.PickupDetailsModal(e);
        let centerValue = this.map.getCenter();
        this.map.setCenter(e.lngLat);
        //Reduces the amounts of calls to the backend when user clicks on map if available
        //pickups are already displayed.
        if (centerValue.distanceTo(e.lngLat) > 500) {
          this.getAvailablePickups(e.lngLat);
        }
      }, 1000);
    });

    this.map.on('touchend', (e) => {
      this.longPress = false;
    });
  }

  getUserPickups() {
    this.pickupService
      .getUserPickups(sessionStorage['userID'])
      .subscribe((res: any) => {
        this.userHostData = res.data;
        this.userHostData.forEach((pickup: any) => {
          let latlng = {
            lat: pickup.location.coordinates[0],
            lng: pickup.location.coordinates[1],
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

        if (!this.availablePickups.hostId == sessionStorage['userID']) {
          this.availablePickups.forEach((pickup: any) => {
            let latlng = {
              lat: pickup.location.coordinates[0],
              lng: pickup.location.coordinates[1],
            };

            this.createPickupMarker(latlng, pickup);
          });
        }
      });
  }

  createPickupMarker(latlng: any, pickup: any) {
    //Prevents the same map marker being added multiple times to the same location
    //This stops images being duplicated in place.
    let element = document.createElement('div');
    if (pickup.hostId == sessionStorage['userID']) {
      element.id = 'user-pickup-marker';
      let popupElement = document.createElement('div');
      let popupElementTitleContainer = document.createElement('div');
      popupElementTitleContainer.className = 'popup-title-container';
      popupElement.append(popupElementTitleContainer);

      let popupElementTitle = document.createElement('h3');
      popupElementTitle.innerText = 'Your Pickup';
      popupElementTitle.className = 'popup-title';
      popupElementTitleContainer.append(popupElementTitle);

      let popup = new tt.Popup({
        offset: 40,
        className: 'popup-container',
      }).setDOMContent(popupElement);
      let marker = new tt.Marker({ element: element })
        .setLngLat(latlng)
        .setPopup(popup)
        .addTo(this.map);
    } else {
      element.id = 'available-pickup-marker';
      let popup = new tt.Popup().setDOMContent(this.popupJoin.nativeElement);
      let marker = new tt.Marker({ element: element })
        .setLngLat(latlng)
        .setPopup(popup)
        .addTo(this.map);
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
      pickup: {},
    };

    const modal = this.dialog.open(PickupdetailsComponent, configDialog);

    modal.afterClosed().subscribe((res: any) => {
      console.log(res);
      if (res.createSuccessful == true) {
        this.createPickupMarker(e.lngLat, res.pickup);
      }
    });
  }
}
