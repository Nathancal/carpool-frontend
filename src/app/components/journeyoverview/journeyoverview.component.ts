import { Component, OnInit } from '@angular/core';
import tt, { LngLat, Map, map } from '@tomtom-international/web-sdk-maps';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';
import { PickupService } from 'src/app/services/pickup.service';

@Component({
  selector: 'app-journeyoverview',
  templateUrl: './journeyoverview.component.html',
  styleUrls: ['./journeyoverview.component.css']
})
export class JourneyoverviewComponent implements OnInit {


  distanceMiles: any;
  travelDuration: any;
  pickup: any;
  routeGeojson: any;
  summaryMap!: Map;
  routeImage: any;
  staticImage: any;
  hostId: any;
  pickupId: any;
  hostName: any;


  constructor(public pickupService: PickupService) { }

  ngOnInit(): void {

    this.hostId = this.pickup.hostId
    this.pickupId = this.pickup.pickupId

    this.pickupService.getHostDetails(this.hostId, this.pickupId).subscribe((data:any)=>{
      this.hostName = data.data.firstName;
    })


    ttserv.copyrights({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
    });

    this.summaryMap = tt.map({
      key: 'A4rtXA0FZlbxK8wWx8oANU6rAY53zVGA',
      container: 'summaryMap',
      center: [-5.9301, 54.5973],
      zoom: 20,
    });
    this.summaryMap.addLayer({
      id: 'completedRoute',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.routeGeojson,
      },
      paint: {
        'line-color': '#ff1744',
        'line-width': 4,
      }});
  }


  capitaliseName(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

}
