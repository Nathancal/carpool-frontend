import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import tt from '@tomtom-international/web-sdk-maps';
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
  map!: tt.Map;
  marker: any;
  currLat: any;
  currLng: any;
  startLat: any;
  startLng: any;
  center = [];

  constructor(private dialog: MatDialog, public pickupService: PickupService) {}


  ngOnInit(): void {


    let geolocateControl = new tt.GeolocateControl({
      positionOptions:{
        enableHighAccuracy:true
      },
      trackUserLocation:true
    })

    this.map = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'map',
      center: [-5.9301, 54.5973],
      zoom: 12,
    });


    this.map.addControl(geolocateControl, 'bottom-right')
    this.map.addControl(new tt.NavigationControl(), 'bottom-right');


    this.pickupService.getUserPickups(sessionStorage["userID"]).subscribe((res:any) =>{
      this.userHostData = res.data;
      this.userHostData.forEach((pickup:any) => {

        let latlng = {
          'lat': pickup.location.coordinates[0],
          'lng': pickup.location.coordinates[1]
        }

        this.createPickupMarker(latlng, pickup)

      });
      console.log(res.data);

    })

    this.map.on('click', (e) => {
      this.getAvailablePickups(e.lngLat)
      this.map.setCenter(e.lngLat);
    });

    this.map.on('mouseover', (e) => {
      this.getAvailablePickups(e.lngLat)
    });

    this.map.on('dblclick', (e) => {
      console.log(e.lngLat);
      this.PickupDetailsModal(e);
      this.map.setCenter(e.lngLat);
    });
  }

  getAvailablePickups(latlng:any){

    this.pickupService.getPickupsInArea(latlng.lat, latlng.lng).subscribe((res)=>{
      console.log(res);
    })

  }

  createPickupMarker(latlng: any, pickup: any) {
    let element = document.createElement('div');
    if(pickup.hostId == sessionStorage["userID"]){
      element.id = 'user-pickup-marker';
    }else{
      element.id = 'available-pickup-marker';
    }

    var popupDiv = window.document.createElement('div');
    popupDiv.innerHTML = pickup.address;
    let popup = new tt.Popup().setDOMContent(popupDiv);
    let marker = new tt.Marker({ element: element })
      .setLngLat(latlng)
      .addTo(this.map).setPopup(popup);
  }

  PickupDetailsModal(e: any) {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'pickupdetailsmodal';
    configDialog.height = "400px";
    configDialog.width = "100%";
    configDialog.panelClass = "pickup-modal-container";
    configDialog.data = {
      lat: e.lngLat.lat,
      lng: e.lngLat.lng,
      createSuccessful: false,
      pickup: {}
    }

    const modal = this.dialog.open(PickupdetailsComponent, configDialog);

    modal.afterClosed().subscribe((res: any) =>{
      console.log(res);
      if(res.createSuccessful == true){
        this.createPickupMarker(e.lngLat, res.pickup);
      }
    })
  }
}
