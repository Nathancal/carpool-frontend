import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { HttpClient } from '@angular/common/http';
import tt from '@tomtom-international/web-sdk-maps';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PickupdetailsComponent } from '../pickupdetails/pickupdetails.component';

@Component({
  selector: 'app-interactivemap',
  templateUrl: './interactivemap.component.html',
  styleUrls: ['./interactivemap.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class InteractivemapComponent implements OnInit {
  title = 'test-app';
  userData!: User[];
  map!: tt.Map;
  marker: any;

  constructor(private httpclient: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.map = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'map',
      center: [-5.9301, 54.5973],
      zoom: 12,
    });

    this.map.addControl(new tt.NavigationControl(), 'bottom-right');

    this.map.on('click', (e) => {
      console.log(e.lngLat);
      this.PickupDetailsModal();
      this.dialog.afterAllClosed.subscribe((res) =>{
        this.createPickupMarker(e.lngLat);
      })
    });
  }

  createPickupMarker(latlng: any) {
    let element = document.createElement('div');
    element.id = 'pickup-marker';
    let marker = new tt.Marker({ element: element })
      .setLngLat(latlng)
      .addTo(this.map);
  }

  PickupDetailsModal() {
    const configDialog = new MatDialogConfig();

    configDialog.id = 'pickupdetailsmodal';
    configDialog.height = "400px";
    configDialog.width = "90%";
    configDialog.panelClass = "pickup-modal-container";

    const modal = this.dialog.open(PickupdetailsComponent, configDialog);
  }
}
