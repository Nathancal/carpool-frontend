import { Component, OnInit } from '@angular/core';
import tt, { Map, map } from '@tomtom-international/web-sdk-maps';
import { services as ttserv } from '@tomtom-international/web-sdk-services/';


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
  map!: Map;

  constructor() { }

  ngOnInit(): void {
    this.map.addLayer({
      id: 'completed-route',
      type: 'line',
      source: {
        type: 'geojson',
        data: this.routeGeojson,
      },
      paint: {
        'line-color': '#5efc82',
        'line-width': 6,
      },
    });
  }


}
